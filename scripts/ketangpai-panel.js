(async () => {
  document.getElementById("ktp-course-panel")?.remove();
  document.getElementById("ktp-course-style")?.remove();

  const style = document.createElement("style");
  style.id = "ktp-course-style";
  style.textContent = `
  #ktp-course-panel{
    --ktp-bg:#f4f6fa; --ktp-surface:#ffffff; --ktp-surface-2:#eef2f8; --ktp-border:#d5deeb;
    --ktp-text:#0f172a; --ktp-muted:#5b6b84; --ktp-dim:#8494ab;
    --ktp-accent:#2563eb; --ktp-accent-2:#0284c7; --ktp-ok:#16a34a; --ktp-err:#dc2626;
    --ktp-warn:#d97706; --ktp-shadow:0 20px 50px #0f172a22;
    --ktp-radius:14px; --ktp-font:"Segoe UI",system-ui,-apple-system,"Microsoft YaHei",sans-serif;
    --ktp-mono:"Cascadia Code","Consolas",ui-monospace,monospace;
    color-scheme:light;
  }
  #ktp-course-panel.ktp-dark{
    --ktp-bg:#0b1018; --ktp-surface:#111826; --ktp-surface-2:#161f30; --ktp-border:#243047;
    --ktp-text:#e8eef8; --ktp-muted:#8b9bb4; --ktp-dim:#5c6b84;
    --ktp-accent:#3b82f6; --ktp-accent-2:#38bdf8; --ktp-ok:#22c55e; --ktp-err:#ef4444;
    --ktp-warn:#f59e0b; --ktp-shadow:0 24px 64px #0009;
    color-scheme:dark;
  }
  #ktp-course-panel{
    position:fixed;z-index:2147483647;top:14px;right:14px;width:560px;max-width:calc(100vw - 28px);
    max-height:calc(100vh - 28px);display:flex;flex-direction:column;
    background:var(--ktp-bg);color:var(--ktp-text);
    border:1px solid var(--ktp-border);border-radius:var(--ktp-radius);box-shadow:var(--ktp-shadow);
    font:13px/1.45 var(--ktp-font);overflow:hidden;
  }
  #ktp-course-panel *{box-sizing:border-box}
  #ktp-course-panel .ktp-hd{
    display:flex;align-items:center;gap:10px;padding:12px 14px;
    background:var(--ktp-surface);border-bottom:1px solid var(--ktp-border);
    cursor:move;user-select:none;position:relative;color:var(--ktp-text);
  }
  #ktp-course-panel .ktp-logo{
    width:32px;height:32px;border-radius:10px;display:grid;place-items:center;font-size:15px;
    background:linear-gradient(135deg,var(--ktp-accent),var(--ktp-accent-2));
    box-shadow:0 4px 14px color-mix(in srgb,var(--ktp-accent) 45%,transparent);
    flex-shrink:0;
  }
  #ktp-course-panel .ktp-title{font-weight:700;font-size:13.5px;flex:1;letter-spacing:.02em;min-width:0}
  #ktp-course-panel .ktp-title small{
    display:block;font-weight:500;font-size:10px;color:var(--ktp-dim);
    letter-spacing:.08em;margin-top:2px;font-family:var(--ktp-mono);
  }
  #ktp-course-panel .ktp-badge{
    font-size:11px;padding:3px 9px;border-radius:999px;font-weight:600;
    background:color-mix(in srgb,var(--ktp-accent-2) 14%,transparent);
    color:var(--ktp-accent-2);border:1px solid color-mix(in srgb,var(--ktp-accent-2) 35%,transparent);
    font-family:var(--ktp-mono);
  }
  #ktp-course-panel .ktp-hbtns{display:flex;gap:4px;align-items:center}
  #ktp-course-panel .ktp-x{
    width:28px;height:28px;border:1px solid transparent;border-radius:8px;
    background:transparent;color:var(--ktp-muted);
    cursor:pointer;font-size:14px;line-height:1;display:grid;place-items:center;transition:.15s;
  }
  #ktp-course-panel .ktp-x:hover{background:color-mix(in srgb,var(--ktp-err) 12%,transparent);color:var(--ktp-err);border-color:color-mix(in srgb,var(--ktp-err) 30%,transparent)}
  #ktp-course-panel .ktp-tools{display:flex;gap:6px;padding:10px 12px;border-bottom:1px solid var(--ktp-border);align-items:center;flex-wrap:wrap}
  #ktp-course-panel .ktp-search{
    flex:1;min-width:100px;border:1px solid var(--ktp-border);background:var(--ktp-surface);color:var(--ktp-text);
    border-radius:9px;padding:7px 11px;font-size:12px;outline:none;transition:.15s;font-family:inherit;
  }
  #ktp-course-panel .ktp-search:focus{border-color:var(--ktp-accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--ktp-accent) 22%,transparent)}
  #ktp-course-panel .ktp-search::placeholder{color:var(--ktp-dim)}
  #ktp-course-panel .ktp-btn{
    border:1px solid var(--ktp-border);background:var(--ktp-surface-2);color:var(--ktp-text);
    border-radius:9px;padding:7px 11px;font-size:12px;cursor:pointer;transition:.15s;font-weight:500;
    display:inline-flex;align-items:center;gap:5px;font-family:inherit;
  }
  #ktp-course-panel .ktp-btn:hover{border-color:var(--ktp-accent);color:var(--ktp-accent);transform:translateY(-1px)}
  #ktp-course-panel .ktp-btn:active{transform:none}
  #ktp-course-panel .ktp-btn:disabled{opacity:.45;cursor:not-allowed;transform:none}
  #ktp-course-panel .ktp-btn.primary{
    background:linear-gradient(135deg,var(--ktp-accent),color-mix(in srgb,var(--ktp-accent) 60%,var(--ktp-accent-2)));
    border-color:transparent;color:#fff;box-shadow:0 4px 14px color-mix(in srgb,var(--ktp-accent) 40%,transparent);
    font-weight:600;
  }
  #ktp-course-panel .ktp-btn.primary:hover{filter:brightness(1.08);color:#fff}
  #ktp-course-panel .ktp-row{
    display:flex;gap:6px;padding:8px 12px;border-bottom:1px solid color-mix(in srgb,var(--ktp-border) 70%,transparent);
    align-items:center;flex-wrap:wrap;background:var(--ktp-surface);
  }
  #ktp-course-panel .ktp-check{
    display:inline-flex;align-items:center;gap:7px;font-size:12px;color:var(--ktp-muted);
    cursor:pointer;user-select:none;
  }
  #ktp-course-panel .ktp-check input{
    width:15px;height:15px;accent-color:var(--ktp-accent);cursor:pointer;margin:0;
  }
  #ktp-course-panel .ktp-selnote{font-size:11px;color:var(--ktp-dim);margin-left:auto;font-family:var(--ktp-mono)}
  #ktp-course-panel .ktp-prog{height:3px;background:var(--ktp-surface-2);overflow:hidden;margin:0}
  #ktp-course-panel .ktp-prog i{
    display:block;height:100%;width:0;background:linear-gradient(90deg,var(--ktp-accent),var(--ktp-accent-2));
    transition:width .3s;box-shadow:0 0 8px color-mix(in srgb,var(--ktp-accent-2) 60%,transparent);
  }
  #ktp-course-panel .ktp-status{
    padding:9px 14px;font-size:12px;color:var(--ktp-muted);border-bottom:1px solid var(--ktp-border);
    display:flex;justify-content:space-between;gap:8px;align-items:center;background:var(--ktp-surface);
  }
  #ktp-course-panel .ktp-status b{color:var(--ktp-accent-2);font-weight:700}
  #ktp-course-panel .ktp-list{
    overflow:auto;padding:8px;flex:1;min-height:80px;max-height:48vh;
    scrollbar-width:thin;scrollbar-color:var(--ktp-border) transparent;
  }
  #ktp-course-panel .ktp-list::-webkit-scrollbar{width:6px}
  #ktp-course-panel .ktp-list::-webkit-scrollbar-thumb{background:var(--ktp-border);border-radius:99px}
  #ktp-course-panel .ktp-empty{
    padding:36px 12px;text-align:center;color:var(--ktp-dim);font-size:12px;
    border:1px dashed var(--ktp-border);border-radius:12px;background:var(--ktp-surface);
  }
  #ktp-course-panel .ktp-item{
    display:grid;grid-template-columns:auto 36px 1fr auto;gap:10px;align-items:center;
    padding:9px 10px;border-radius:11px;border:1px solid transparent;transition:.15s;margin-bottom:4px;
    background:var(--ktp-surface);cursor:pointer;
  }
  #ktp-course-panel .ktp-item:hover{background:var(--ktp-surface-2);border-color:var(--ktp-border)}
  #ktp-course-panel .ktp-item.selected{
    border-color:color-mix(in srgb,var(--ktp-accent) 50%,transparent);
    background:color-mix(in srgb,var(--ktp-accent) 8%,var(--ktp-surface));
    box-shadow:0 0 0 1px color-mix(in srgb,var(--ktp-accent) 25%,transparent);
  }
  #ktp-course-panel .ktp-item input[type=checkbox]{
    width:15px;height:15px;accent-color:var(--ktp-accent);cursor:pointer;margin:0;pointer-events:none;
  }
  #ktp-course-panel .ktp-icon{
    width:36px;height:36px;border-radius:9px;display:grid;place-items:center;
    font-size:9.5px;font-weight:800;letter-spacing:.03em;color:#fff;position:relative;
    box-shadow:inset 0 1px 0 #ffffff22, 0 3px 8px #0003;
    font-family:var(--ktp-mono);
  }
  #ktp-course-panel .ktp-icon.ppt{background:linear-gradient(145deg,#ea580c,#c2410c)}
  #ktp-course-panel .ktp-icon.pdf{background:linear-gradient(145deg,#ef4444,#b91c1c)}
  #ktp-course-panel .ktp-icon.doc{background:linear-gradient(145deg,#3b82f6,#1d4ed8)}
  #ktp-course-panel .ktp-icon.xls{background:linear-gradient(145deg,#22c55e,#15803d)}
  #ktp-course-panel .ktp-icon.zip{background:linear-gradient(145deg,#a78bfa,#7c3aed)}
  #ktp-course-panel .ktp-icon.other{background:linear-gradient(145deg,#64748b,#475569)}
  #ktp-course-panel .ktp-meta{min-width:0}
  #ktp-course-panel .ktp-name{
    font-size:12.5px;font-weight:600;color:var(--ktp-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  }
  #ktp-course-panel .ktp-sub{
    font-size:11px;color:var(--ktp-dim);margin-top:3px;display:flex;gap:7px;flex-wrap:wrap;align-items:center;
  }
  #ktp-course-panel .ktp-sub .ok{
    color:var(--ktp-ok);background:color-mix(in srgb,var(--ktp-ok) 12%,transparent);
    padding:1px 6px;border-radius:99px;font-weight:600;
  }
  #ktp-course-panel .ktp-sub .err{
    color:var(--ktp-err);background:color-mix(in srgb,var(--ktp-err) 12%,transparent);
    padding:1px 6px;border-radius:99px;
  }
  #ktp-course-panel .ktp-sub .dl{color:var(--ktp-warn);font-family:var(--ktp-mono)}
  #ktp-course-panel .ktp-acts{display:flex;gap:4px}
  #ktp-course-panel .ktp-act{
    width:30px;height:30px;border-radius:8px;border:1px solid var(--ktp-border);
    background:var(--ktp-surface-2);color:var(--ktp-muted);cursor:pointer;font-size:13px;
    display:grid;place-items:center;transition:.15s;
  }
  #ktp-course-panel .ktp-act:hover{color:var(--ktp-accent);border-color:var(--ktp-accent);background:color-mix(in srgb,var(--ktp-accent) 10%,transparent)}
  #ktp-course-panel .ktp-act{cursor:pointer}
  #ktp-course-panel .ktp-act.ok{color:var(--ktp-ok);border-color:color-mix(in srgb,var(--ktp-ok) 55%,transparent);background:color-mix(in srgb,var(--ktp-ok) 12%,transparent)}
  #ktp-course-panel .ktp-act.busy{opacity:.4;pointer-events:none}
  #ktp-course-panel .ktp-ft{
    padding:8px 13px;border-top:1px solid var(--ktp-border);font-size:11px;color:var(--ktp-dim);
    display:flex;justify-content:space-between;gap:8px;align-items:center;background:var(--ktp-surface);
    font-family:var(--ktp-mono);letter-spacing:.02em;
  }
  #ktp-course-panel.min .ktp-tools,#ktp-course-panel.min .ktp-row,#ktp-course-panel.min .ktp-status,
  #ktp-course-panel.min .ktp-list,#ktp-course-panel.min .ktp-ft,#ktp-course-panel.min .ktp-prog{display:none}
  #ktp-course-panel.min{width:auto;min-width:220px}
  #ktp-course-panel .ktp-spin{animation:ktpSpin .7s linear infinite}
  @keyframes ktpSpin{to{transform:rotate(360deg)}}
  .ktp-toast{
    position:fixed;bottom:28px;left:50%;transform:translateX(-50%);z-index:2147483647;
    background:var(--ktp-toast-bg,#0f172af5);color:#e2e8f0;
    border:1px solid #334155;padding:11px 18px;border-radius:11px;
    font:13px/1.4 "Segoe UI",system-ui,sans-serif;box-shadow:0 12px 40px #0008;
    animation:ktpUp .22s ease;display:flex;align-items:center;gap:8px;max-width:90vw;
  }
  .ktp-toast.ok{border-color:#4ade8066;color:#bbf7d0}
  .ktp-toast.err{border-color:#f8717166;color:#fecaca}
  @keyframes ktpUp{from{opacity:0;transform:translate(-50%,10px)}to{opacity:1;transform:translate(-50%,0)}}
  `;
  document.head.appendChild(style);

  const root = document.createElement("div");
  root.id = "ktp-course-panel";

  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const savedTheme = localStorage.getItem("ktp-theme") || (prefersDark ? "dark" : "light");
  if (savedTheme === "dark") root.classList.add("ktp-dark");

  root.innerHTML = `
    <div class="ktp-hd">
      <div class="ktp-logo">📚</div>
      <div class="ktp-title">课堂派资料提取<small>KETANGPAI EXTRACTOR</small></div>
      <span class="ktp-badge" id="ktpCount">0</span>
      <span class="ktp-badge" id="ktpBadgeMode" style="display:none"></span>
      <div class="ktp-hbtns">
        <button class="ktp-x" id="ktpTheme" title="切换明暗主题">◐</button>
        <button class="ktp-x" id="ktpMin" title="最小化">─</button>
        <button class="ktp-x" id="ktpClose" title="关闭">×</button>
      </div>
    </div>
    <div class="ktp-tools">
      <input class="ktp-search" id="ktpSearch" placeholder="搜索文件名…" />
      <button class="ktp-btn primary" id="ktpRun" title="提取 / 重新提取（刷新直链）">⚡ 提取</button>
    </div>
    <div class="ktp-row">
      <label class="ktp-check"><input type="checkbox" id="ktpSelAll" /> 全选</label>
      <button class="ktp-btn" id="ktpCopySel" title="复制选中项的预览页链接">⧉ 复制选中</button>
      <button class="ktp-btn" id="ktpDlSel" title="下载选中原始文件">⬇ 下载选中</button>
      <button class="ktp-btn" id="ktpDlAll" title="顺序下载全部">⬇ 全部下载</button>
      <span class="ktp-selnote" id="ktpSelNote">已选 0</span>
    </div>
    <div class="ktp-prog"><i id="ktpProg"></i></div>
    <div class="ktp-status"><span id="ktpStatus">就绪，点击「提取」开始</span><span id="ktpSum"></span></div>
    <div class="ktp-list" id="ktpList"><div class="ktp-empty">暂无数据</div></div>
    <div class="ktp-ft"><span>点击行可选中 · ⧉/↗→预览页 · ⬇→文件</span><span>v3</span></div>
  `;
  document.body.appendChild(root);

  const $ = (id) => document.getElementById(id);
  const toast = (msg, type = "") => {
    document.querySelectorAll(".ktp-toast").forEach((t) => t.remove());
    const t = document.createElement("div");
    t.className = "ktp-toast " + type;
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2400);
  };

  $("ktpClose").onclick = () => { root.remove(); style.remove(); };
  $("ktpMin").onclick = () => root.classList.toggle("min");
  $("ktpTheme").onclick = () => {
    const dark = !root.classList.contains("ktp-dark");
    root.classList.toggle("ktp-dark", dark);
    localStorage.setItem("ktp-theme", dark ? "dark" : "light");
    toast(dark ? "已切换为深色" : "已切换为浅色");
  };

  (function drag() {
    const hd = root.querySelector(".ktp-hd");
    let sx, sy, ox, oy, dragging = false;
    hd.addEventListener("mousedown", (e) => {
      if (e.target.closest("button")) return;
      dragging = true;
      sx = e.clientX; sy = e.clientY;
      const r = root.getBoundingClientRect();
      ox = r.left; oy = r.top;
      root.style.right = "auto";
      e.preventDefault();
    });
    window.addEventListener("mousemove", (e) => {
      if (!dragging) return;
      root.style.left = Math.max(0, Math.min(window.innerWidth - 80, ox + e.clientX - sx)) + "px";
      root.style.top = Math.max(0, Math.min(window.innerHeight - 40, oy + e.clientY - sy)) + "px";
    });
    window.addEventListener("mouseup", () => (dragging = false));
  })();

  const extIcon = (name) => {
    const e = (String(name || "").split(".").pop() || "").toLowerCase();
    if (["ppt", "pptx", "pps", "ppsx"].includes(e)) return ["ppt", "PPT"];
    if (e === "pdf") return ["pdf", "PDF"];
    if (["doc", "docx", "docm"].includes(e)) return ["doc", "DOC"];
    if (["xls", "xlsx", "csv"].includes(e)) return ["xls", "XLS"];
    if (["zip", "rar", "7z"].includes(e)) return ["zip", "ZIP"];
    return ["other", (e || "FILE").toUpperCase().slice(0, 4)];
  };

  let DATA = [];
  const selected = new Set();

  const previewUrl = (r) => r.rurl || r.pluginUrl || r.playurl || r.oss || "";
  const fileUrl = (r) => r.oss || "";

  function escapeHtml(s) {
    return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function updateSelUI() {
    $("ktpSelNote").textContent = `已选 ${selected.size}/${DATA.length}`;
    const selAll = $("ktpSelAll");
    const visibleOk = DATA.filter((r) => {
      const q = ($("ktpSearch").value || "").trim().toLowerCase();
      return !q || (r.name || "").toLowerCase().includes(q);
    });
    selAll.checked = visibleOk.length > 0 && visibleOk.every((r) => selected.has(DATA.indexOf(r)));
    selAll.indeterminate = !selAll.checked && visibleOk.some((r) => selected.has(DATA.indexOf(r)));
    $("ktpCopySel").disabled = selected.size === 0;
    $("ktpDlSel").disabled = selected.size === 0;
  }

  function render(filter = "") {
    const list = $("ktpList");
    const q = filter.trim().toLowerCase();
    const rows = DATA.filter((r) => !q || (r.name || "").toLowerCase().includes(q));
    $("ktpCount").textContent = String(DATA.length);
    const okN = DATA.filter((r) => fileUrl(r)).length;
    $("ktpSum").innerHTML = `成功 <b>${okN}</b> · 失败 <b>${DATA.length - okN}</b>`;
    if (!rows.length) {
      list.innerHTML = `<div class="ktp-empty">${DATA.length ? "无匹配结果" : "暂无数据"}</div>`;
      updateSelUI();
      return;
    }
    list.innerHTML = rows
      .map((r) => {
        const [cls, label] = extIcon(r.name);
        const idx = DATA.indexOf(r);
        const hasFile = !!fileUrl(r);
        const hasPrev = !!previewUrl(r);
        const checked = selected.has(idx) ? "checked" : "";
        return `
        <div class="ktp-item${selected.has(idx) ? " selected" : ""}" data-i="${idx}">
          <input type="checkbox" data-act="select" ${checked} title="选择" tabindex="-1" />
          <div class="ktp-icon ${cls}">${label}</div>
          <div class="ktp-meta">
            <div class="ktp-name" title="${escapeHtml(r.name)}">${escapeHtml(r.name || "-")}</div>
            <div class="ktp-sub">
              <span>${escapeHtml(r.size || "")}</span>
              ${hasFile ? `<span class="ok">✓ 可下载</span>` : `<span class="err">× ${escapeHtml(r.error || "失败")}</span>`}
            </div>
          </div>
          <div class="ktp-acts">
            <button class="ktp-act" data-act="copy" title="复制预览页链接" ${hasPrev ? "" : "disabled"}>⧉</button>
            <button class="ktp-act" data-act="open" title="新标签打开预览页" ${hasPrev ? "" : "disabled"}>↗</button>
            <button class="ktp-act" data-act="dl" title="下载原始文件" ${hasFile ? "" : "disabled"}>⬇</button>
          </div>
        </div>`;
      })
      .join("");
    updateSelUI();
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.cssText = "position:fixed;opacity:0;left:-9999px";
      document.body.appendChild(ta);
      ta.focus(); ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    }
  }

  function saveBlob(blob, filename) {
    const objUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(objUrl), 60000);
  }

  async function downloadFile(r) {
    const url = fileUrl(r);
    if (!url) throw new Error("无直链");
    const res = await fetch(url);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const blob = await res.blob();
    saveBlob(blob, r.name || "file");
    return blob.size;
  }

  function indicesForBatch(onlySelected) {
    if (onlySelected) return [...selected].sort((a, b) => a - b);
    return DATA.map((_, i) => i);
  }

  async function copyLines(indices) {
    const lines = indices
      .map((i) => DATA[i])
      .filter((r) => r && previewUrl(r))
      .map((r) => `${r.name}\t${previewUrl(r)}`);
    if (!lines.length) return toast("没有可复制的链接", "err");
    const ok = await copyText(lines.join("\n"));
    toast(ok ? `已复制 ${lines.length} 条预览链接` : "复制失败", ok ? "ok" : "err");
  }

  let batchRunning = false;
  async function batchDownload(indices) {
    const list = indices.map((i) => DATA[i]).filter((r) => r && fileUrl(r));
    if (!list.length) return toast("没有可下载的文件", "err");
    if (batchRunning) return;
    if (!confirm(`将顺序下载 ${list.length} 个文件（逐个保存，不会开多标签）。继续？`)) return;
    batchRunning = true;
    $("ktpDlAll").disabled = true;
    $("ktpDlSel").disabled = true;
    let okN = 0, failN = 0;
    for (let i = 0; i < list.length; i++) {
      const r = list[i];
      $("ktpStatus").innerHTML = `批量下载 <b>${i + 1}/${list.length}</b> · ${escapeHtml(r.name)}`;
      $("ktpProg").style.width = Math.round((i / list.length) * 100) + "%";
      try {
        await downloadFile(r);
        okN++;
      } catch (e) {
        failN++;
        console.warn("[ktp]", r.name, e);
      }
      await new Promise((r2) => setTimeout(r2, 650));
    }
    $("ktpProg").style.width = "100%";
    $("ktpStatus").innerHTML = `批量完成 · 成功 <b>${okN}</b> · 失败 <b>${failN}</b>`;
    toast(`批量下载完成：${okN} 成功 / ${failN} 失败`, failN ? "err" : "ok");
    batchRunning = false;
    $("ktpDlAll").disabled = false;
    updateSelUI();
    setTimeout(() => { $("ktpProg").style.width = "0%"; }, 900);
  }

  $("ktpList").addEventListener("click", async (e) => {
    const item = e.target.closest(".ktp-item");
    if (!item) return;
    const idx = Number(item.dataset.i);
    const r = DATA[idx];
    if (!r) return;

    const actBtn = e.target.closest(".ktp-act");
    if (actBtn) {
      if (actBtn.disabled) return;
      const act = actBtn.dataset.act;
      if (act === "copy") {
        const text = previewUrl(r);
        if (!text) return toast("无预览链接", "err");
        const ok = await copyText(text);
        toast(ok ? "已复制：" + (r.name || "") : "复制失败", ok ? "ok" : "err");
        if (ok) {
          actBtn.classList.add("ok");
          setTimeout(() => actBtn.classList.remove("ok"), 900);
        }
      } else if (act === "open") {
        const url = previewUrl(r);
        if (!url) return toast("无预览链接", "err");
        window.open(url, "_blank", "noopener");
        toast("已在新标签打开预览页");
      } else if (act === "dl") {
        if (!fileUrl(r)) return toast("无直链", "err");
        actBtn.classList.add("busy");
        try {
          const size = await downloadFile(r);
          toast(`已保存 ${r.name}（${(size / 1048576).toFixed(2)} MB）`, "ok");
          actBtn.classList.add("ok");
          setTimeout(() => actBtn.classList.remove("ok"), 900);
        } catch (err) {
          toast("下载失败: " + (err.message || err), "err");
        } finally {
          actBtn.classList.remove("busy");
        }
      }
      return;
    }

    const on = !selected.has(idx);
    if (on) selected.add(idx);
    else selected.delete(idx);
    item.classList.toggle("selected", on);
    const box = item.querySelector('input[type="checkbox"]');
    if (box) box.checked = on;
    updateSelUI();
  });

  $("ktpSelAll").onchange = (e) => {
    const q = ($("ktpSearch").value || "").trim().toLowerCase();
    DATA.forEach((r, i) => {
      const match = !q || (r.name || "").toLowerCase().includes(q);
      if (!match) return;
      if (e.target.checked) selected.add(i);
      else selected.delete(i);
    });
    render($("ktpSearch").value);
  };

  $("ktpCopySel").onclick = () => copyLines([...selected]);
  $("ktpDlSel").onclick = () => batchDownload([...selected]);
  $("ktpDlAll").onclick = () => batchDownload(DATA.map((_, i) => i));

  $("ktpSearch").addEventListener("input", (e) => render(e.target.value));

  function extractFurl(containerUrl) {
    if (!containerUrl) return null;
    const raw = String(containerUrl).replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
    const i = raw.indexOf("furl=");
    if (i < 0) return null;
    let v = raw.slice(i + 5);
    const cut = v.search(/["'\s>]/);
    if (cut >= 0) v = v.slice(0, cut);
    if (!/^https?:\/\//i.test(v)) {
      try { v = decodeURIComponent(v); } catch {}
    }
    const m = v.match(/Signature=([^&]+)/);
    if (m) return v.slice(0, m.index + m[0].length);
    return v;
  }

  function toPublicOss(furl) {
    try {
      const u = new URL(furl);
      u.hostname = u.hostname.replace(/-internal(?=\.)/, "");
      u.protocol = "https:";
      return u.href;
    } catch { return furl; }
  }

  function getToken() {
    try {
      const info = JSON.parse(localStorage.getItem("userInfo") || "{}");
      if (info.token) return info.token;
    } catch {}
    const m = document.cookie.match(/(?:^|;\s*)token=([^;]+)/);
    return m ? m[1] : null;
  }

  function xhrJson(url, token, body) {
    return new Promise((resolve, reject) => {
      const x = new XMLHttpRequest();
      x.open("POST", url, true);
      x.setRequestHeader("Content-Type", "application/json");
      x.setRequestHeader("Accept", "application/json, text/plain, */*");
      x.setRequestHeader("token", token);
      x.onload = () => {
        try { resolve(JSON.parse(x.responseText)); }
        catch { reject(new Error("响应解析失败")); }
      };
      x.onerror = () => reject(new Error("网络错误 " + x.status));
      x.send(JSON.stringify(body));
    });
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  async function pluginAppToFurl(pluginUrl) {
    try {
      const res = await fetch(pluginUrl, { credentials: "include" });
      if (!res.ok) return null;
      const html = await res.text();
      const m = html.match(/<frame\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/i);
      if (!m) return null;
      return extractFurl(m[1].replace(/&amp;/g, "&"));
    } catch { return null; }
  }

  function pageMode(params) {
    const route = (location.hash.split("?")[0] || "").toLowerCase();
    if (route.includes("resource_detail") || params.get("id")) return "resource";
    if (route.includes("classdetail") || params.get("courseid")) return "course";
    return "none";
  }

  async function fetchJobs(mode, params, token) {
    const courseid = params.get("courseid");
    const courserole = Number(params.get("courserole") || "0");

    if (mode === "resource") {
      const id = params.get("id");
      const type = params.get("type") || "2";
      $("ktpStatus").textContent = "拉取当前资料…";
      const data = await xhrJson("https://openapiv5.ketangpai.com//FutureV2/Courseware/query", token, {
        courseid, id, type, courserole, reqtimestamp: Date.now(),
      });
      if (!data) throw new Error("空响应");
      if (data.status !== 1) throw new Error(data.message || ("接口异常 code=" + data.code));
      const item = data.data || {};
      const title = item.title || item.name || "";
      const atts = Array.isArray(item.attachment) ? item.attachment : item.attachment ? [item.attachment] : [];
      if (!atts.length) return [{ title, name: title, size: "", rurl: null, playurl: null, oss: null, error: "无附件", resource: item.id }];
      return atts.map((att) => ({
        title,
        name: att.name || title,
        size: att.size || "",
        rurl: att.rurl || null,
        playurl: att.playurl || null,
        resource: item.id,
        fileid: att.fileid || null,
      }));
    }

    const submod = params.get("submodulename") || "2,8";
    const contenttype = submod.split(",").filter(Boolean);
    const all = [];
    let page = 1, pageTotal = 1;
    do {
      const data = await xhrJson("https://openapiv5.ketangpai.com//FutureV2/CourseMeans/getCourseContent", token, {
        courseid, contenttype, dirid: 0, lessonlink: [], sort: [], page, limit: 50, desc: 3,
        courserole, vtr_type: "", reqtimestamp: Date.now(),
      });
      if (!data) throw new Error("空响应");
      if (data.status !== 1) throw new Error(data.message || ("接口异常 code=" + data.code));
      const d = data.data || {};
      pageTotal = d.pageTotal || 1;
      all.push(...(d.list || []));
      $("ktpStatus").textContent = `列表 ${page}/${pageTotal} 页 · ${all.length} 条`;
      page++;
    } while (page <= pageTotal);

    const jobs = [];
    for (const item of all) {
      const title = item.title || item.name || "";
      const atts = Array.isArray(item.attachment) ? item.attachment : item.attachment ? [item.attachment] : [];
      if (!atts.length) {
        jobs.push({ title, name: title, size: "", rurl: null, playurl: null, oss: null, error: "无附件", resource: item.id });
        continue;
      }
      for (const att of atts) {
        jobs.push({
          title,
          name: att.name || title,
          size: att.size || "",
          rurl: att.rurl || null,
          playurl: att.playurl || null,
          resource: item.id,
          fileid: att.fileid || null,
        });
      }
    }
    return jobs;
  }

  let running = false;
  async function run() {
    if (running) return;
    const hashQuery = location.hash.includes("?") ? location.hash.slice(location.hash.indexOf("?") + 1) : "";
    const params = new URLSearchParams(hashQuery || location.search);
    const courseid = params.get("courseid");
    const token = getToken();
    const mode = pageMode(params);

    if (mode === "none" || !courseid) {
      $("ktpStatus").textContent = "失败: 请在课程详情/资料详情页运行";
      return toast("请在课程详情或资料详情页运行", "err");
    }
    if (!token) {
      $("ktpStatus").textContent = "失败: 未登录，请先登录";
      return toast("未登录，请先登录", "err");
    }

    running = true;
    const modeLabel = mode === "resource" ? "当前资料" : "课程全部";
    $("ktpRun").disabled = true;
    $("ktpRun").innerHTML = `<span class="ktp-spin">↻</span> 提取中`;
    $("ktpStatus").textContent = mode === "resource" ? "拉取当前资料…" : "拉取课程内容…";
    $("ktpProg").style.width = "5%";
    const badge = $("ktpBadgeMode");
    badge.style.display = "";
    badge.textContent = modeLabel;
    selected.clear();
    DATA = [];
    render();

    try {
      const jobs = await fetchJobs(mode, params, token);

      let done = 0;
      for (const job of jobs) {
        $("ktpStatus").textContent = `解析 ${done + 1}/${jobs.length} · ${job.name}`;
        $("ktpProg").style.width = jobs.length ? Math.round((done / jobs.length) * 100) + "%" : "50%";
        let furl = extractFurl(job.playurl);
        if (!furl && job.rurl) {
          furl = await pluginAppToFurl(job.rurl);
          await sleep(120);
        }
        if (furl) {
          const oss = toPublicOss(furl);
          const missing = ["OSSAccessKeyId", "Expires", "Signature"].filter((k) => {
            try { return !new URL(oss).searchParams.has(k); } catch { return true; }
          });
          job.oss = oss;
          job.missing = missing.length ? missing : null;
          job.error = null;
        } else {
          job.oss = null;
          job.error = "无法提取直链";
        }
        DATA.push(job);
        done++;
        render($("ktpSearch").value);
        $("ktpProg").style.width = jobs.length ? Math.round((done / jobs.length) * 100) + "%" : "100%";
      }

      const ok = DATA.filter((r) => r.oss).length;
      $("ktpProg").style.width = "100%";
      $("ktpStatus").innerHTML = `${modeLabel} · 成功 <b>${ok}</b> / ${DATA.length}`;
      window.__ketangpaiCourseLinks = DATA;
      toast(`提取完成（${modeLabel}）：${ok}/${DATA.length}`, ok === DATA.length ? "ok" : "err");
    } catch (e) {
      $("ktpStatus").textContent = "失败: " + (e.message || e);
      toast("提取失败: " + (e.message || e), "err");
    } finally {
      running = false;
      $("ktpRun").disabled = false;
      $("ktpRun").textContent = "⚡ 提取";
      setTimeout(() => { $("ktpProg").style.width = "0%"; }, 800);
    }
  }

  $("ktpRun").onclick = run;
  render();
  run();
})();
