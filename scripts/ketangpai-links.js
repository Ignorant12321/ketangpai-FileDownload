(async () => {
  const tag = "[课堂派链接]";
  const log = (...a) => console.log(tag, ...a);
  const warn = (...a) => console.warn(tag, ...a);
  const fail = (...a) => console.error(tag, ...a);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
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
    if (m) return v.slice(0, m.index + m[0].length);
    try {
      const cu = new URL(raw, location.href);
      const sig = cu.searchParams.get("Signature");
      if (sig && !/Signature=/.test(v)) {
        const fu = new URL(v);
        const exp = cu.searchParams.get("Expires");
        if (exp) fu.searchParams.set("Expires", exp);
        const ak = cu.searchParams.get("OSSAccessKeyId");
        if (ak && !fu.searchParams.has("OSSAccessKeyId")) fu.searchParams.set("OSSAccessKeyId", ak);
        fu.searchParams.set("Signature", sig);
        return fu.href;
      }
    } catch {}
    return v;
  }

  async function pluginAppToFurl(pluginUrl) {
    const res = await fetch(pluginUrl, { credentials: "include" });
    if (!res.ok) throw new Error("PluginApp HTTP " + res.status);
    const html = await res.text();
    const m = html.match(/<frame\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/i);
    if (!m) throw new Error("无 frame");
    const furl = extractFurl(decodeEntities(m[1]));
    if (!furl) throw new Error("无 furl");
    return furl;
  }

  function toPublicOss(furl) {
    const u = new URL(furl);
    u.hostname = u.hostname.replace(/-internal(?=\.)/, "");
    u.protocol = "https:";
    return u;
  }

  function fileNameOf(furl) {
    try {
      const p = new URL(furl).pathname;
      return decodeURIComponent(p.split("/").filter(Boolean).pop() || "") || "";
    } catch {
      return "";
    }
  }

  function currentTitle() {
    const t =
      document.querySelector(".preview-dialog .title-name") ||
      document.querySelector("h1") ||
      document.querySelector(".title-name");
    return (t && t.textContent.trim()) || "";
  }

  const FILE_EXT = String.raw`\.(ppt|pptx|pps|ppsx|pdf|doc|docx|xls|xlsx|pptm|zip|rar|7z|png|jpg|jpeg|gif|mp4|avi|mp3|txt|md|csv|json|html?)`;

  function findAttachmentCards() {
    const seen = new Set();
    const out = [];
    const push = (el) => {
      if (!el || seen.has(el)) return;
      seen.add(el);
      out.push(el);
    };

    for (const h of document.querySelectorAll("h3, h4, .file-name, .name, [class*=file-name], [class*=fileName]")) {
      const text = (h.textContent || "").trim();
      if (text.length > 0 && text.length < 80 && new RegExp(FILE_EXT + "$", "i").test(text)) {
        let node = h;
        for (let i = 0; i < 8 && node && node !== document.body; i++) {
          const cs = getComputedStyle(node);
          const interactive =
            node.onclick ||
            node.getAttribute("role") === "button" ||
            node.matches("a,button,[class*=item],[class*=card],[class*=file],[class*=resource]") ||
            cs.cursor === "pointer";
          if (interactive) {
            const t = (node.textContent || "").replace(/\s+/g, " ").trim();
            if (t.length < 120) push(node);
            break;
          }
          node = node.parentElement;
        }
      }
    }

    for (const el of document.querySelectorAll("li,div,section,a,button")) {
      const t = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (t.length < 5 || t.length > 100) continue;
      if (!new RegExp(FILE_EXT, "i").test(t)) continue;
      if (!/\d+(\.\d+)?\s*(B|KB|MB|GB)/i.test(t)) continue;
      if (el.children.length > 8) continue;
      const cs = getComputedStyle(el);
      if (cs.cursor === "pointer" || el.matches("a,button") || el.onclick) push(el);
    }

    out.sort((a, b) => (a.textContent || "").length - (b.textContent || "").length);
    return out;
  }

  function waitForPreviewIframe(timeoutMs = 6000) {
    return new Promise((resolve) => {
      const end = Date.now() + timeoutMs;
      const check = () => {
        const f = document.querySelector("iframe[src*='PluginApp'], iframe[src*='document.ketangpai'], .el-drawer__open iframe");
        if (f && f.src) return resolve(f);
        if (Date.now() >= end) return resolve(null);
        setTimeout(check, 200);
      };
      check();
    });
  }

  async function openPreview() {
    let f = await waitForPreviewIframe(500);
    if (f) return f;

    const cards = findAttachmentCards();
    log("候选附件卡片:", cards.length);
    for (const card of cards.slice(0, 6)) {
      const label = (card.textContent || "").replace(/\s+/g, " ").trim().slice(0, 60);
      log("  尝试点击:", label);
      try {
        card.click();
      } catch (e) {
        warn("  点击异常:", e.message || e);
      }
      f = await waitForPreviewIframe(4000);
      if (f) return f;
      const drawer = document.querySelector(".el-drawer__open, .preview-dialog");
      if (drawer) {
        f = await waitForPreviewIframe(4000);
        if (f) return f;
      }
    }
    return null;
  }

  function switchNext() {
    const btn = document.querySelector(".switch-box .el-icon-arrow-right");
    if (!btn) return false;
    btn.click();
    return true;
  }

  async function waitNewIframe(prevSrc, timeoutMs = 5000) {
    const end = Date.now() + timeoutMs;
    while (Date.now() < end) {
      const f = document.querySelector("iframe[src*='PluginApp']");
      if (f && f.src && f.src !== prevSrc) return f;
      await sleep(200);
    }
    return null;
  }

  log("打开预览…");
  let iframe = await openPreview();
  if (!iframe) {
    fail("未找到预览 iframe。请确认当前是资源详情页，并手动点一下附件后重试。");
    return;
  }

  const results = [];
  const maxFiles = 50;
  let noChange = 0;

  for (let idx = 0; idx < maxFiles; idx++) {
    const pluginUrl = iframe.src;
    const title = currentTitle();
    log(`\n[${idx + 1}] 打开: ${title || "(无标题)"}`);
    log("  PluginApp:", pluginUrl);

    let furl = null;
    let error = null;
    try {
      furl = await pluginAppToFurl(pluginUrl);
    } catch (e) {
      error = e.message || String(e);
    }

    if (furl) {
      const pub = toPublicOss(furl);
      const ossName = fileNameOf(furl);
      const name = title || ossName;
      log("  文件名:", name, ossName && title && ossName !== title ? `(OSS: ${ossName})` : "");
      log("  OSS:", pub.href);
      const missing = ["OSSAccessKeyId", "Expires", "Signature"].filter((k) => !pub.searchParams.has(k));
      if (missing.length) warn("  缺签名参数:", missing.join("、"));
      results.push({ title, name, ossName, pluginUrl, furl, oss: pub.href, error: null });
    } else {
      warn("  提取失败:", error || "未知错误");
      results.push({ title, name: title, pluginUrl, furl: null, oss: null, error: error || "未知" });
    }

    if (!switchNext()) {
      log("无「下一个文件」按钮，结束。");
      break;
    }
    const next = await waitNewIframe(pluginUrl, 4000);
    if (!next) {
      noChange++;
      if (noChange >= 1) {
        log("切换后无新文件（可能只有 1 个），结束。");
        break;
      }
    } else {
      noChange = 0;
      iframe = next;
      await sleep(500);
    }
  }

  const uniq = [];
  const keys = new Set();
  for (const r of results) {
    const k = r.oss || r.pluginUrl;
    if (keys.has(k)) continue;
    keys.add(k);
    uniq.push(r);
  }

  log("\n======== 汇总 (" + uniq.length + ") ========");
  uniq.forEach((r, i) => {
    log(`[${i + 1}] ${r.name || r.title || "?"}`);
    if (r.oss) log("    ", r.oss);
    else log("    预览:", r.pluginUrl, "错误:", r.error);
  });

  const lines = uniq.map((r) => r.oss || r.pluginUrl).filter(Boolean);
  try {
    await navigator.clipboard.writeText(lines.join("\n"));
    log("已复制", lines.length, "条到剪贴板。");
  } catch {
    warn("剪贴板写入失败，请手动复制上方输出。");
  }
  window.__ketangpaiLinks = uniq;
  log("已存 window.__ketangpaiLinks");
})();
