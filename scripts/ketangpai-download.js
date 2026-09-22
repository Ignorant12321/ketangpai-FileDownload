(async () => {
  const tag = "[课堂派下载]";
  const log = (...a) => console.log(tag, ...a);
  const fail = (...a) => console.error(tag, ...a);

  const decodeEntities = (s) =>
    String(s).replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'");

  function extractFurl(containerUrl) {
    if (!containerUrl) return null;
    const raw = decodeEntities(containerUrl);
    const i = raw.indexOf("furl=");
    if (i < 0) return null;
    let v = raw.slice(i + 5);
    const cut = v.search(/["'\s>]/);
    if (cut >= 0) v = v.slice(0, cut);
    if (!/^https?:\/\//i.test(v)) {
      try {
        v = decodeURIComponent(v);
      } catch {}
    }
    const m = v.match(/Signature=([^&]+)/);
    if (m) {
      v = v.slice(0, m.index + m[0].length);
    } else {
      try {
        const cu = new URL(raw, location.href);
        const sig = cu.searchParams.get("Signature");
        if (sig) {
          const fu = new URL(v);
          const exp = cu.searchParams.get("Expires");
          if (exp && !fu.searchParams.has("Expires")) fu.searchParams.set("Expires", exp);
          const ak = cu.searchParams.get("OSSAccessKeyId");
          if (ak && !fu.searchParams.has("OSSAccessKeyId")) fu.searchParams.set("OSSAccessKeyId", ak);
          if (!fu.searchParams.has("Signature")) fu.searchParams.set("Signature", sig);
          v = fu.href;
        }
      } catch {}
    }
    return v;
  }

  async function pluginAppToFurl(pluginUrl) {
    const res = await fetch(pluginUrl);
    if (!res.ok) throw new Error("抓取中转页失败 HTTP " + res.status);
    const html = await res.text();
    const m = html.match(/<frame\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/i);
    if (!m) throw new Error("中转页里没有 frame 地址");
    const furl = extractFurl(decodeEntities(m[1]));
    if (!furl) throw new Error("frame 地址里没有 furl 参数");
    return furl;
  }

  async function findFurl() {
    const here = extractFurl(location.href);
    if (here) return here;

    const els = document.querySelectorAll("frame,iframe");
    for (const el of els) {
      const src = el.getAttribute("src") || el.src;
      if (!src) continue;
      const absolute = (() => {
        try {
          return new URL(src, location.href).href;
        } catch {
          return src;
        }
      })();
      const furl = extractFurl(absolute);
      if (furl) return furl;
      if (/\/PluginApp\//.test(absolute)) return await pluginAppToFurl(absolute);
    }
    return null;
  }

  log("正在解析附件地址…");
  let furl;
  try {
    furl = await findFurl();
  } catch (e) {
    fail("解析失败：", e.message || e);
    fail("请在课堂派附件预览页（含 frame 的 PluginApp 页面）里运行。");
    return;
  }
  if (!furl) {
    fail("未找到附件地址。");
    fail("请在课堂派附件预览页（PluginApp 页面）的控制台里运行本脚本。");
    return;
  }

  const u = new URL(furl);
  const originalHost = u.hostname;
  u.hostname = u.hostname.replace(/-internal(?=\.)/, "");
  u.protocol = "https:";
  const name = decodeURIComponent(u.pathname.split("/").filter(Boolean).pop() || "") || "ketangpai-file";

  log("原始地址：", furl);
  if (u.hostname !== originalHost) log("已将内网端点", originalHost, "→", u.hostname);
  log("下载地址：", u.href);
  log("文件名：", name);

  const missing = ["OSSAccessKeyId", "Expires", "Signature"].filter((k) => !u.searchParams.has(k));
  if (missing.length) {
    fail("下载地址缺少签名参数：" + missing.join("、"));
    fail("无法下载。请换一个新的预览链接重试，并把本段控制台输出发给维护者。");
    return;
  }

  let res;
  try {
    res = await fetch(u.href);
  } catch (e) {
    log("网络/跨域失败（", e.message || e, "），改用浏览器直接下载…");
    const a = document.createElement("a");
    a.href = u.href;
    a.download = name;
    a.target = "_blank";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    return;
  }

  if (!res.ok) {
    const body = await res.text();
    const code = (body.match(/<Code>([^<]+)/) || [])[1] || "";
    const msg = (body.match(/<Message>([^<]+)/) || [])[1] || "";
    fail(`下载失败：HTTP ${res.status}${code ? " / " + code : ""}${msg ? " — " + msg : ""}`);
    if (code === "AccessDenied" || res.status === 403) {
      fail("原因通常是：签名已失效、地址被截断、或该文件权限已变更。");
      fail("请重新打开课堂派预览页（新链接），再运行本脚本；不要手动拼接地址。");
    } else if (res.status === 404) {
      fail("文件不存在，可能链接对应的对象已被删除。");
    }
    return;
  }

  try {
    const blob = await res.blob();
    const objUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objUrl;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(objUrl), 60000);
    log(`下载完成：${name}（${(blob.size / 1048576).toFixed(2)} MB）`);
  } catch (e) {
    fail("保存文件失败：", e.message || e);
  }
})();
