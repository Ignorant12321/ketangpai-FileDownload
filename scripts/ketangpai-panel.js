/**
 * 课堂派资料提取 · 面板脚本
 * ------------------------------------------------------------------
 * 功能：
 *   - 课程详情 / 资料详情页提取附件直链
 *   - 搜索、全选、复制预览链接、顺序下载
 *   - 明暗主题、拖拽、最小化、Toast 提示
 * 逻辑与旧版保持一致，重做了视觉层与信息结构。
 *
 * 使用方法：登录课堂派 → F12 控制台 → 粘贴本文件全部内容 → 回车
 *
 * 图标：Lucide（MIT），via https://icon-sets.iconify.design/lucide/
 */
(async () => {
  const PANEL_ID = "ktp-course-panel";
  const STYLE_ID = "ktp-course-style";

  // 清掉旧面板 / 旧样式 / 残留 toast
  document.getElementById(PANEL_ID)?.remove();
  document.getElementById(STYLE_ID)?.remove();
  document.querySelectorAll(".ktp-toast, .nu-toast").forEach((n) => n.remove());

  /* ------------------------------------------------------------------ */
  /* 图标（Lucide, MIT）                                                  */
  /* ------------------------------------------------------------------ */
  const ICONS = {
    archive:
      '<rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    copy:
      '<rect width="13" height="13" x="9" y="9" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
    download:
      '<path d="M21 15v3a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-3"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
    layers:
      '<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
    external:
      '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    sun:
      '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    minus: '<path d="M5 12h14"/>',
    window:
      '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    inbox:
      '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z"/>',
    refresh:
      '<path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/>',
    shield:
      '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
    alert:
      '<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>',
    checkCircle:
      '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    scan:
      '<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>',
  };

  const icon = (name, size = 14, cls = "") =>
    `<svg class="nu-i${cls ? " " + cls : ""}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${
      ICONS[name] || ""
    }</svg>`;

  /* ------------------------------------------------------------------ */
  /* 样式                                                                */
  /* ------------------------------------------------------------------ */
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
  #ktp-course-panel{
    --paper:#f2efe8;
    --card:#fdfcf9;
    --card-2:#eae6dd;
    --line:#ddd7ca;
    --ink:#17191d;
    --ink-2:#5b5d62;
    --ink-3:#8d8d86;
    --accent:#d2461b;
    --accent-soft:#f8e4dc;
    --ok:#2c7a52;
    --ok-soft:#e4f0e8;
    --err:#bf3a2b;
    --err-soft:#f8e2de;
    --warn:#a06a10;
    --warn-soft:#f6ecd7;
    --radius:18px;
    --sans:"Segoe UI Variable Text","Segoe UI",system-ui,-apple-system,"PingFang SC","Microsoft YaHei",sans-serif;
    --display:"Segoe UI Variable Display","Segoe UI",system-ui,-apple-system,"PingFang SC","Microsoft YaHei",sans-serif;
    --mono:"Cascadia Code","JetBrains Mono","Consolas",ui-monospace,monospace;
    --shadow:0 1px 0 #ffffffb3 inset,0 34px 80px -30px #17191d55,0 10px 26px -16px #17191d3d;
    color-scheme:light;
  }
  #ktp-course-panel.nu-dark{
    --paper:#101215;
    --card:#181b20;
    --card-2:#20242b;
    --line:#2c313a;
    --ink:#eceae4;
    --ink-2:#a6a49c;
    --ink-3:#73736d;
    --accent:#ff6136;
    --accent-soft:#2e1a13;
    --ok:#63bd8c;
    --ok-soft:#15261c;
    --err:#f07d70;
    --err-soft:#2b1917;
    --warn:#e0ab52;
    --warn-soft:#2a2113;
    --shadow:0 1px 0 #ffffff0d inset,0 40px 90px -30px #000000cc,0 12px 30px -18px #00000099;
    color-scheme:dark;
  }

  #ktp-course-panel{
    position:fixed;z-index:2147483647;top:16px;right:16px;
    width:584px;max-width:calc(100vw - 32px);max-height:calc(100vh - 32px);
    display:flex;flex-direction:column;
    background:var(--paper);color:var(--ink);
    border:1px solid var(--line);border-radius:var(--radius);
    box-shadow:var(--shadow);
    font:13px/1.45 var(--sans);
    overflow:hidden;
    -webkit-font-smoothing:antialiased;
    animation:nuIn .3s cubic-bezier(.22,1,.36,1);
  }
  #ktp-course-panel::before{
    content:"";position:absolute;top:0;left:0;right:0;height:2px;z-index:3;pointer-events:none;
    background:linear-gradient(90deg,var(--accent) 0%,color-mix(in srgb,var(--accent) 55%,#e8a13a) 42%,transparent 88%);
  }
  #ktp-course-panel *{box-sizing:border-box}
  #ktp-course-panel [hidden]{display:none!important}
  #ktp-course-panel ::selection{background:var(--accent-soft);color:var(--ink)}
  #ktp-course-panel button:focus-visible,
  #ktp-course-panel input:focus-visible,
  #ktp-course-panel label:focus-visible{outline:2px solid var(--accent);outline-offset:2px}

  /* ---------- 头部 ---------- */
  #ktp-course-panel .nu-hd{
    position:relative;display:flex;align-items:center;gap:12px;
    padding:14px 14px 12px;background:var(--card);
    border-bottom:1px solid var(--line);
    cursor:grab;user-select:none;touch-action:none;
  }
  #ktp-course-panel .nu-hd.dragging{cursor:grabbing}
  #ktp-course-panel .nu-hd::after{
    content:"";position:absolute;inset:0;pointer-events:none;opacity:.5;
    background-image:radial-gradient(color-mix(in srgb,var(--ink) 26%,transparent) 1px,transparent 1px);
    background-size:7px 7px;
    -webkit-mask-image:linear-gradient(100deg,transparent 42%,#000 100%);
    mask-image:linear-gradient(100deg,transparent 42%,#000 100%);
  }
  #ktp-course-panel .nu-hd > *{position:relative;z-index:1}
  #ktp-course-panel .nu-brand{display:flex;align-items:center;gap:11px;min-width:0;flex:1}
  #ktp-course-panel .nu-mark{
    width:36px;height:36px;flex:none;border-radius:11px;display:grid;place-items:center;
    background:var(--accent);color:#fff;
    box-shadow:0 10px 20px -10px color-mix(in srgb,var(--accent) 85%,transparent),
               inset 0 0 0 1px #ffffff2e,inset 0 1px 0 #ffffff4d;
  }
  #ktp-course-panel .nu-brand-txt{min-width:0}
  #ktp-course-panel .nu-eyebrow{
    display:block;margin-bottom:4px;
    font:600 9px/1 var(--mono);letter-spacing:.16em;text-transform:uppercase;
    color:color-mix(in srgb,var(--ink-3) 78%,var(--ink));
    white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  }
  #ktp-course-panel .nu-hd h1{
    margin:0;font:700 14.5px/1.1 var(--display);letter-spacing:.01em;color:var(--ink);
    white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  }
  #ktp-course-panel .nu-hd-r{display:flex;align-items:center;gap:10px;flex:none}
  #ktp-course-panel .nu-stat{
    display:flex;flex-direction:column;align-items:flex-end;line-height:1;
    padding-right:11px;border-right:1px solid var(--line);
  }
  #ktp-course-panel .nu-stat-n{
    font:600 21px/1 Georgia,"Times New Roman","Songti SC",serif;
    letter-spacing:-.03em;font-variant-numeric:tabular-nums;color:var(--ink);
  }
  #ktp-course-panel .nu-stat-l{
    margin-top:4px;font:600 8px/1 var(--mono);letter-spacing:.16em;color:var(--ink-3);
  }
  #ktp-course-panel .nu-hbtns{display:flex;align-items:center;gap:2px}
  #ktp-course-panel .nu-hd-sep{width:1px;height:15px;background:var(--line);margin:0 3px;flex:none}
  #ktp-course-panel .nu-ib{
    width:28px;height:28px;display:grid;place-items:center;
    border:1px solid transparent;border-radius:8px;background:transparent;
    color:var(--ink-2);cursor:pointer;transition:.16s;
  }
  #ktp-course-panel .nu-ib:hover{background:var(--card-2);border-color:var(--line);color:var(--ink)}
  #ktp-course-panel .nu-ib:disabled{
    opacity:.45;cursor:not-allowed;background:transparent;border-color:transparent;color:var(--ink-2);
  }
  #ktp-course-panel .nu-ib.busy .nu-i{animation:nuSpin .9s linear infinite}
  #ktp-course-panel .nu-ib.danger:hover{
    background:var(--err-soft);border-color:color-mix(in srgb,var(--err) 30%,transparent);color:var(--err);
  }

  /* ---------- 搜索 + 提取 ---------- */
  #ktp-course-panel .nu-top{display:flex;gap:8px;padding:12px 14px 8px}
  #ktp-course-panel .nu-search{
    flex:1;min-width:0;display:flex;align-items:center;gap:8px;height:36px;padding:0 9px 0 11px;
    border:1px solid var(--line);border-radius:10px;background:var(--card);color:var(--ink-3);
    transition:.16s;
  }
  #ktp-course-panel .nu-search:hover{border-color:color-mix(in srgb,var(--ink-3) 45%,var(--line))}
  #ktp-course-panel .nu-search:focus-within{
    color:var(--accent);
    border-color:color-mix(in srgb,var(--accent) 55%,var(--line));
    box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 12%,transparent);
  }
  #ktp-course-panel .nu-search input{
    -webkit-appearance:none;appearance:none;flex:1;min-width:0;height:100%;
    border:0;outline:0;background:transparent;padding:0;
    color:var(--ink);font:12.5px/1 var(--sans);
  }
  #ktp-course-panel .nu-search input::placeholder{color:var(--ink-3)}
  #ktp-course-panel .nu-search input::-webkit-search-cancel-button,
  #ktp-course-panel .nu-search input::-webkit-search-decoration{-webkit-appearance:none;display:none}
  #ktp-course-panel .nu-clear{
    flex:none;width:20px;height:20px;display:grid;place-items:center;padding:0;
    border:0;border-radius:5px;background:var(--card-2);color:var(--ink-2);cursor:pointer;transition:.14s;
  }
  #ktp-course-panel .nu-clear:hover{background:var(--err-soft);color:var(--err)}
  #ktp-course-panel .nu-run{
    flex:none;height:36px;padding:0 12px 0 7px;display:inline-flex;align-items:center;gap:8px;
    border:1px solid color-mix(in srgb,var(--accent) 38%,var(--line));
    border-radius:9px;background:var(--card);color:var(--ink);
    font:650 12px/1 var(--sans);letter-spacing:.04em;cursor:pointer;
    transition:background .16s,border-color .16s,color .16s,transform .16s;
  }
  #ktp-course-panel .nu-run .nu-run-ico{
    flex:none;width:22px;height:22px;display:grid;place-items:center;border-radius:5px;
    background:var(--accent-soft);color:var(--accent);
    transition:background .16s,color .16s;
  }
  #ktp-course-panel .nu-run:hover{
    background:color-mix(in srgb,var(--accent) 3%,var(--card));
    border-color:color-mix(in srgb,var(--accent) 55%,var(--line));
  }
  #ktp-course-panel .nu-run:hover .nu-run-ico{background:var(--accent);color:var(--paper)}
  #ktp-course-panel .nu-run:active{transform:translateY(.5px)}
  #ktp-course-panel .nu-run:disabled{
    opacity:.55;cursor:wait;transform:none;background:var(--card);
  }
  #ktp-course-panel .nu-run .nu-i.spin{animation:nuSpin .9s linear infinite}

  /* ---------- 命令条 ---------- */
  #ktp-course-panel .nu-cmd{display:flex;align-items:center;gap:2px;flex-wrap:wrap;padding:0 12px 9px}
  #ktp-course-panel .nu-all{
    display:inline-flex;align-items:center;gap:7px;padding:5px 8px 5px 6px;border-radius:8px;
    font-size:11.5px;color:var(--ink-2);cursor:pointer;user-select:none;transition:.14s;
  }
  #ktp-course-panel .nu-all:hover{background:var(--card-2);color:var(--ink)}
  #ktp-course-panel .nu-check{
    appearance:none;-webkit-appearance:none;flex:none;width:15px;height:15px;margin:0;position:relative;
    border:1.5px solid color-mix(in srgb,var(--ink-3) 75%,transparent);
    border-radius:4.5px;background:var(--card);cursor:pointer;transition:.14s;
  }
  #ktp-course-panel .nu-check:hover{border-color:var(--accent)}
  #ktp-course-panel .nu-check:checked,
  #ktp-course-panel .nu-check:indeterminate{background:var(--accent);border-color:var(--accent)}
  #ktp-course-panel .nu-check:checked::after{
    content:"";position:absolute;left:3.5px;top:1px;width:4px;height:8px;
    border:solid #fff;border-width:0 1.5px 1.5px 0;transform:rotate(42deg);
  }
  #ktp-course-panel .nu-check:indeterminate::after{
    content:"";position:absolute;left:3px;right:3px;top:50%;height:1.5px;
    background:#fff;border-radius:1px;transform:translateY(-50%);
  }
  #ktp-course-panel .nu-vr{width:1px;height:15px;background:var(--line);margin:0 6px}
  #ktp-course-panel .nu-btn{
    display:inline-flex;align-items:center;gap:5px;height:29px;padding:0 10px;
    border:1px solid transparent;border-radius:8px;background:transparent;
    color:var(--ink-2);font:550 12px/1 var(--sans);cursor:pointer;transition:.14s;white-space:nowrap;
  }
  #ktp-course-panel .nu-btn .nu-i{opacity:.75}
  #ktp-course-panel .nu-btn:hover{
    background:var(--card);border-color:var(--line);color:var(--ink);box-shadow:0 1px 2px #0000000f;
  }
  #ktp-course-panel .nu-btn:hover .nu-i{opacity:1}
  #ktp-course-panel .nu-btn:active{transform:translateY(.5px);box-shadow:none}
  #ktp-course-panel .nu-btn:disabled{
    opacity:.4;cursor:not-allowed;background:transparent;border-color:transparent;box-shadow:none;
  }
  #ktp-course-panel .nu-btn-strong{color:var(--ink);border-color:var(--line);background:var(--card)}
  #ktp-course-panel .nu-btn-strong:hover{color:var(--accent);border-color:color-mix(in srgb,var(--accent) 35%,var(--line))}
  #ktp-course-panel .nu-sel{
    margin-left:auto;padding:4px 7px;border-radius:6px;background:var(--card-2);
    font:500 10.5px/1 var(--mono);letter-spacing:.02em;color:var(--ink-3);
    font-variant-numeric:tabular-nums;white-space:nowrap;
  }
  #ktp-course-panel .nu-sel b{color:var(--accent);font-weight:700}

  /* ---------- 状态 / 进度 ---------- */
  #ktp-course-panel .nu-status{
    display:flex;align-items:center;gap:8px;min-height:34px;padding:7px 14px;
    background:var(--card);border-top:1px solid var(--line);border-bottom:1px solid var(--line);
  }
  #ktp-course-panel .nu-st-l{display:flex;align-items:center;gap:8px;min-width:0;flex:1}
  #ktp-course-panel .nu-chip{
    flex:none;display:inline-flex;align-items:center;height:18px;padding:0 7px;border-radius:5px;
    background:var(--accent-soft);color:var(--accent);
    font:600 9.5px/1 var(--mono);letter-spacing:.09em;
  }
  #ktp-course-panel .nu-st-t{
    min-width:0;font-size:12px;color:var(--ink-2);
    white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  }
  #ktp-course-panel .nu-st-t b{color:var(--ink);font-weight:700}
  #ktp-course-panel .nu-sum{
    flex:none;font:500 10.5px/1 var(--mono);color:var(--ink-2);
    font-variant-numeric:tabular-nums;white-space:nowrap;opacity:.85;
  }
  #ktp-course-panel .nu-sum b{font-weight:700}
  #ktp-course-panel .nu-sum b.ok{color:var(--ok)}
  #ktp-course-panel .nu-sum b.bad{color:var(--err)}
  #ktp-course-panel .nu-prog{
    flex:none;height:2px;background:color-mix(in srgb,var(--line) 55%,transparent);overflow:hidden;
  }
  #ktp-course-panel .nu-prog i{
    display:block;height:100%;width:0;border-radius:0 2px 2px 0;
    background:linear-gradient(90deg,var(--accent),color-mix(in srgb,var(--accent) 45%,#eeb14a));
    box-shadow:0 0 10px color-mix(in srgb,var(--accent) 70%,transparent);
    transition:width .35s cubic-bezier(.4,0,.2,1);
  }

  /* ---------- 文件列表 ---------- */
  #ktp-course-panel .nu-list{
    flex:1 1 auto;min-height:96px;max-height:min(46vh,460px);overflow:auto;
    padding:5px 8px 8px;background:var(--paper);overscroll-behavior:contain;
    scrollbar-width:thin;scrollbar-color:color-mix(in srgb,var(--ink-3) 42%,transparent) transparent;
  }
  #ktp-course-panel .nu-list::-webkit-scrollbar{width:8px}
  #ktp-course-panel .nu-list::-webkit-scrollbar-thumb{
    background:color-mix(in srgb,var(--ink-3) 40%,transparent);
    border:2px solid transparent;border-radius:99px;background-clip:padding-box;
  }
  #ktp-course-panel .nu-item{
    position:relative;display:grid;grid-template-columns:16px 24px 38px minmax(0,1fr) auto;
    align-items:center;gap:9px;padding:8px;border-radius:9px;cursor:pointer;
    transition:background .14s,box-shadow .14s;
  }
  #ktp-course-panel .nu-item + .nu-item::before{
    content:"";position:absolute;top:0;left:10px;right:10px;height:1px;
    background:color-mix(in srgb,var(--line) 60%,transparent);pointer-events:none;
  }
  #ktp-course-panel .nu-item:hover{background:var(--card)}
  #ktp-course-panel .nu-item:hover::before,
  #ktp-course-panel .nu-item:hover + .nu-item::before{opacity:0}
  #ktp-course-panel .nu-item.selected{
    background:color-mix(in srgb,var(--accent) 7%,var(--card));
    box-shadow:inset 2px 0 0 var(--accent);
  }
  #ktp-course-panel .nu-item .nu-check{pointer-events:none}
  #ktp-course-panel .nu-num{
    font:500 10px/1 var(--mono);letter-spacing:.02em;text-align:right;
    color:color-mix(in srgb,var(--ink-3) 88%,transparent);font-variant-numeric:tabular-nums;
    transition:color .14s;
  }
  #ktp-course-panel .nu-item.selected .nu-num{color:var(--accent)}
  #ktp-course-panel .nu-ico{
    --c:#6f727a;width:38px;height:38px;flex:none;border-radius:10px;
    display:grid;place-items:center;
    background:color-mix(in srgb,var(--c) 13%,var(--card));
    border:1px solid color-mix(in srgb,var(--c) 30%,transparent);
    color:color-mix(in srgb,var(--c) 90%,var(--ink));
    font:700 9.5px/1 var(--mono);letter-spacing:.04em;
    transition:.14s;
  }
  #ktp-course-panel .nu-ico.ppt{--c:#c2681f}
  #ktp-course-panel .nu-ico.pdf{--c:#cc3c33}
  #ktp-course-panel .nu-ico.doc{--c:#2f6ecb}
  #ktp-course-panel .nu-ico.xls{--c:#2e8a52}
  #ktp-course-panel .nu-ico.zip{--c:#7c5cc4}
  #ktp-course-panel .nu-ico.other{--c:#6f727a}
  #ktp-course-panel .nu-item:hover .nu-ico{transform:translateY(-1px)}
  #ktp-course-panel .nu-meta{min-width:0}
  #ktp-course-panel .nu-name{
    font-size:13px;font-weight:600;letter-spacing:.004em;color:var(--ink);
    white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  }
  #ktp-course-panel .nu-sub{
    display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:3px;
    font-size:10.5px;color:var(--ink-3);
  }
  #ktp-course-panel .nu-size{font-family:var(--mono);letter-spacing:.01em;font-variant-numeric:tabular-nums}
  #ktp-course-panel .nu-ok,
  #ktp-course-panel .nu-bad,
  #ktp-course-panel .nu-warn{
    display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:600;
  }
  #ktp-course-panel .nu-ok{color:var(--ok)}
  #ktp-course-panel .nu-bad{color:var(--err)}
  #ktp-course-panel .nu-warn{color:var(--warn)}
  #ktp-course-panel .nu-ok::before,
  #ktp-course-panel .nu-bad::before,
  #ktp-course-panel .nu-warn::before{
    content:"";width:5px;height:5px;border-radius:50%;background:currentColor;
    box-shadow:0 0 0 2.5px color-mix(in srgb,currentColor 14%,transparent);
  }
  #ktp-course-panel .nu-acts{display:flex;gap:2px;opacity:.72;transition:opacity .14s}
  #ktp-course-panel .nu-item:hover .nu-acts,
  #ktp-course-panel .nu-item.selected .nu-acts,
  #ktp-course-panel .nu-item:focus-within .nu-acts{opacity:1}
  #ktp-course-panel .nu-act{
    width:27px;height:27px;display:grid;place-items:center;
    border:1px solid transparent;border-radius:7px;background:transparent;
    color:var(--ink-2);cursor:pointer;transition:.14s;
  }
  #ktp-course-panel .nu-act:hover{background:var(--card-2);border-color:var(--line);color:var(--ink)}
  #ktp-course-panel .nu-act[data-act="dl"]{
    color:var(--accent);
    background:color-mix(in srgb,var(--accent) 7%,transparent);
    border-color:color-mix(in srgb,var(--accent) 14%,transparent);
  }
  #ktp-course-panel .nu-act[data-act="dl"]:hover{
    background:var(--accent-soft);
    border-color:color-mix(in srgb,var(--accent) 38%,transparent);
    color:var(--accent);
  }
  #ktp-course-panel .nu-act[data-act="dl"]:disabled{
    background:transparent;border-color:transparent;color:var(--ink-2);
  }
  #ktp-course-panel .nu-act:disabled{opacity:.22;cursor:not-allowed;background:transparent;border-color:transparent}
  #ktp-course-panel .nu-act.ok{color:var(--ok);background:var(--ok-soft);border-color:color-mix(in srgb,var(--ok) 28%,transparent)}
  #ktp-course-panel .nu-act.busy{opacity:.5;pointer-events:none}
  #ktp-course-panel .nu-act .nu-i.spin{animation:nuSpin .9s linear infinite}
  #ktp-course-panel .nu-empty{
    display:flex;flex-direction:column;align-items:center;justify-content:center;gap:9px;
    padding:44px 24px;text-align:center;color:var(--ink-3);
  }
  #ktp-course-panel .nu-empty .nu-i{opacity:.45}
  #ktp-course-panel .nu-empty b{font-size:12px;color:var(--ink-2);font-weight:600;letter-spacing:.01em}
  #ktp-course-panel .nu-empty span{font-size:11px;line-height:1.6;max-width:280px}

  /* ---------- 底栏 ---------- */
  #ktp-course-panel .nu-ft{
    display:flex;align-items:center;justify-content:space-between;gap:10px;
    padding:9px 14px;background:var(--card);border-top:1px solid var(--line);
    font:500 10.5px/1 var(--mono);letter-spacing:.02em;color:var(--ink-3);
  }
  #ktp-course-panel .nu-ft-l{display:inline-flex;align-items:center;gap:5px;min-width:0}
  #ktp-course-panel .nu-ft-l .nu-i{opacity:.65;flex:none}
  #ktp-course-panel .nu-ft-r{display:inline-flex;align-items:center;gap:10px;flex:none}
  #ktp-course-panel .nu-ft-hint{color:var(--ink-3)}
  #ktp-course-panel .nu-ver{
    flex:none;padding:3px 6px;border:1px solid var(--line);border-radius:4px;
    font-size:8.5px;letter-spacing:.14em;
  }

  /* ---------- 最小化 ---------- */
  #ktp-course-panel.min{width:auto;min-width:0}
  #ktp-course-panel.min .nu-top,
  #ktp-course-panel.min .nu-cmd,
  #ktp-course-panel.min .nu-status,
  #ktp-course-panel.min .nu-prog,
  #ktp-course-panel.min .nu-list,
  #ktp-course-panel.min .nu-ft{display:none}
  #ktp-course-panel.min .nu-hd{padding-right:10px;border-bottom:0}
  #ktp-course-panel.min .nu-eyebrow{margin-bottom:3px}

  /* ---------- Toast ---------- */
  .nu-toast{
    --t-bg:#fdfcf9;--t-ink:#17191d;--t-line:#dcd6c9;--t-muted:#6b6c70;
    --t-accent:#d2461b;--t-ok:#2c7a52;--t-err:#bf3a2b;
    position:fixed;left:0;top:0;z-index:2147483647;
    display:flex;align-items:center;gap:9px;max-width:min(90vw,520px);
    padding:9px 14px 9px 9px;border:1px solid var(--t-line);border-radius:10px;
    background:var(--t-bg);color:var(--t-ink);
    font:12.5px/1.4 var(--sans,-apple-system,sans-serif);
    box-shadow:0 18px 40px -18px #000000a6,0 4px 12px -6px #00000040;
    animation:nuToast .24s cubic-bezier(.22,1,.36,1);
    pointer-events:none;
  }
  .nu-toast.nu-dark{
    --t-bg:#1b1e24;--t-ink:#eceae4;--t-line:#333842;--t-muted:#a6a49c;
    --t-accent:#ff6136;--t-ok:#63bd8c;--t-err:#f07d70;
  }
  .nu-toast .nu-toast-i{
    flex:none;width:26px;height:26px;display:grid;place-items:center;border-radius:7px;
    background:color-mix(in srgb,var(--t-accent) 12%,transparent);color:var(--t-accent);
  }
  .nu-toast.ok .nu-toast-i{background:color-mix(in srgb,var(--t-ok) 13%,transparent);color:var(--t-ok)}
  .nu-toast.err .nu-toast-i{background:color-mix(in srgb,var(--t-err) 13%,transparent);color:var(--t-err)}
  .nu-toast .nu-toast-txt{min-width:0;overflow:hidden;text-overflow:ellipsis}

  @keyframes nuIn{from{opacity:0;transform:translateY(-8px) scale(.986)}to{opacity:1;transform:none}}
  @keyframes nuToast{from{transform:translateY(8px)}to{transform:none}}
  @keyframes nuSpin{to{transform:rotate(360deg)}}

  @media (max-width:600px){
    #ktp-course-panel{top:8px;right:8px;width:calc(100vw - 16px);max-height:calc(100vh - 16px)}
    #ktp-course-panel .nu-num{display:none}
    #ktp-course-panel .nu-item{grid-template-columns:16px 38px minmax(0,1fr) auto;gap:8px}
    #ktp-course-panel .nu-stat{display:none}
    #ktp-course-panel .nu-sel{margin-left:0}
  }
  @media (max-width:460px){
    #ktp-course-panel .nu-ft-hint{display:none}
    #ktp-course-panel .nu-btn{padding:0 8px}
  }
  @media (prefers-reduced-motion:reduce){
    #ktp-course-panel,
    #ktp-course-panel *,
    .nu-toast{animation:none!important;transition:none!important}
  }
  `;
  document.head.appendChild(style);

  /* ------------------------------------------------------------------ */
  /* 结构                                                                */
  /* ------------------------------------------------------------------ */
  const root = document.createElement("div");
  root.id = PANEL_ID;

  const prefersDark =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem("ktp-theme");
  } catch {}
  const dark = savedTheme ? savedTheme === "dark" : prefersDark;
  if (dark) root.classList.add("nu-dark");

  root.innerHTML = `
    <header class="nu-hd" id="ktpDrag">
      <div class="nu-brand">
        <div class="nu-mark">${icon("archive", 17)}</div>
        <div class="nu-brand-txt">
          <span class="nu-eyebrow">Ketangpai · Archive</span>
          <h1>课堂派资料提取</h1>
        </div>
      </div>
      <div class="nu-hd-r">
        <div class="nu-stat" title="已提取的文件数">
          <span class="nu-stat-n" id="ktpCount">0</span>
          <span class="nu-stat-l">FILES</span>
        </div>
        <div class="nu-hbtns">
          <button class="nu-ib" id="ktpRefresh" type="button" title="重新提取（刷新直链）" aria-label="重新提取">${icon(
            "refresh",
            15
          )}</button>
          <button class="nu-ib" id="ktpTheme" type="button" title="切换明暗主题" aria-label="切换明暗主题">${icon(
            "moon",
            15
          )}</button>
          <span class="nu-hd-sep" aria-hidden="true"></span>
          <button class="nu-ib" id="ktpMin" type="button" title="最小化" aria-label="最小化面板" aria-expanded="true">${icon(
            "minus",
            15
          )}</button>
          <button class="nu-ib danger" id="ktpClose" type="button" title="关闭" aria-label="关闭面板">${icon(
            "x",
            15
          )}</button>
        </div>
      </div>
    </header>

    <div class="nu-top">
      <div class="nu-search">
        ${icon("search", 14)}
        <input id="ktpSearch" type="search" placeholder="搜索文件名…" aria-label="搜索文件名" autocomplete="off" spellcheck="false" />
        <button class="nu-clear" id="ktpClear" type="button" title="清空搜索" aria-label="清空搜索" hidden>${icon(
          "x",
          12
        )}</button>
      </div>
      <button class="nu-run" id="ktpRun" type="button" title="提取 / 重新提取（刷新直链）">
        <span class="nu-run-ico">${icon("scan", 14)}</span>
        <span>提取</span>
      </button>
    </div>

    <div class="nu-cmd">
      <label class="nu-all">
        <input type="checkbox" class="nu-check" id="ktpSelAll" aria-label="全选当前列表" />
        <span>全选</span>
      </label>
      <span class="nu-vr"></span>
      <button class="nu-btn" id="ktpCopySel" type="button" title="复制选中项的预览页链接">
        ${icon("copy", 13)}<span>复制</span>
      </button>
      <button class="nu-btn" id="ktpDlSel" type="button" title="下载选中的原始文件">
        ${icon("download", 13)}<span>下载</span>
      </button>
      <button class="nu-btn nu-btn-strong" id="ktpDlAll" type="button" title="顺序下载全部文件">
        ${icon("layers", 13)}<span>全部</span>
      </button>
      <span class="nu-sel" id="ktpSelNote">已选 <b>0</b></span>
    </div>

    <div class="nu-status">
      <div class="nu-st-l">
        <span class="nu-chip" id="ktpBadgeMode" hidden></span>
        <span class="nu-st-t" id="ktpStatus" role="status" aria-live="polite">就绪，点击「提取」开始</span>
      </div>
      <span class="nu-sum" id="ktpSum"></span>
    </div>
    <div class="nu-prog"><i id="ktpProg"></i></div>

    <div class="nu-list" id="ktpList"></div>

    <footer class="nu-ft">
      <span class="nu-ft-l">${icon("shield", 11)}本地提取 · 数据不出浏览器</span>
      <span class="nu-ft-r">
        <span class="nu-ft-hint">点击行选中</span>
        <span class="nu-ver">V4</span>
      </span>
    </footer>
  `;
  document.body.appendChild(root);

  /* ------------------------------------------------------------------ */
  /* 基础工具                                                            */
  /* ------------------------------------------------------------------ */
  const $ = (id) => document.getElementById(id);

  function escapeHtml(s) {
    return String(s ?? "").replace(
      /[&<>"']/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  }

  const emptyState = (title, sub) => `
    <div class="nu-empty">
      ${icon("inbox", 26)}
      <b>${escapeHtml(title)}</b>
      <span>${escapeHtml(sub)}</span>
    </div>`;

  let toastTimer = null;
  function placeToast(t) {
    if (!root.isConnected) return;
    const r = root.getBoundingClientRect();
    const minimized = root.classList.contains("min");
    const footer = root.querySelector(".nu-ft");
    const footerH = minimized || !footer ? 0 : footer.offsetHeight;
    t.style.maxWidth =
      Math.max(200, Math.min(minimized ? window.innerWidth - 24 : r.width - 24, 520)) + "px";
    const w = t.offsetWidth;
    const h = t.offsetHeight;
    let left = r.left + (r.width - w) / 2;
    left = Math.max(8, Math.min(window.innerWidth - w - 8, left));
    let top = minimized ? r.bottom + 8 : r.bottom - footerH - 8 - h;
    top = Math.max(8, Math.min(window.innerHeight - h - 8, top));
    t.style.left = left + "px";
    t.style.top = top + "px";
  }
  const toast = (msg, type = "") => {
    document.querySelectorAll(".nu-toast").forEach((t) => t.remove());
    const t = document.createElement("div");
    t.className = "nu-toast " + type + (root.classList.contains("nu-dark") ? " nu-dark" : "");
    t.setAttribute("role", "status");
    t.innerHTML = `
      <span class="nu-toast-i">${icon(type === "err" ? "alert" : type === "ok" ? "checkCircle" : "archive", 14)}</span>
      <span class="nu-toast-txt">${escapeHtml(msg)}</span>`;
    document.body.appendChild(t);
    placeToast(t);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.remove(), 2600);
  };
  window.addEventListener("resize", () => {
    document.querySelectorAll(".nu-toast").forEach(placeToast);
  });

  function syncThemeBtn() {
    const isDark = root.classList.contains("nu-dark");
    const btn = $("ktpTheme");
    btn.innerHTML = icon(isDark ? "sun" : "moon", 15);
    btn.title = isDark ? "切换到浅色" : "切换到深色";
    btn.setAttribute("aria-label", btn.title);
  }
  syncThemeBtn();

  function syncMinBtn() {
    const min = root.classList.contains("min");
    const btn = $("ktpMin");
    btn.innerHTML = icon(min ? "window" : "minus", 15);
    btn.title = min ? "展开面板" : "最小化";
    btn.setAttribute("aria-label", min ? "展开面板" : "最小化面板");
    btn.setAttribute("aria-expanded", String(!min));
  }
  syncMinBtn();

  $("ktpClose").onclick = () => {
    root.remove();
    style.remove();
    document.querySelectorAll(".nu-toast").forEach((t) => t.remove());
  };
  $("ktpMin").onclick = () => {
    root.classList.toggle("min");
    syncMinBtn();
  };
  $("ktpTheme").onclick = () => {
    const isDark = !root.classList.contains("nu-dark");
    root.classList.toggle("nu-dark", isDark);
    try {
      localStorage.setItem("ktp-theme", isDark ? "dark" : "light");
    } catch {}
    syncThemeBtn();
    toast(isDark ? "已切换为深色" : "已切换为浅色");
  };

  // 拖拽（鼠标 / 触摸）
  (function enableDrag() {
    const hd = root.querySelector(".nu-hd");
    let start = null;
    hd.addEventListener("pointerdown", (e) => {
      if (e.button !== 0 || e.target.closest("button, input, label, a")) return;
      const r = root.getBoundingClientRect();
      start = { x: e.clientX, y: e.clientY, left: r.left, top: r.top };
      root.style.right = "auto";
      root.style.left = r.left + "px";
      root.style.top = r.top + "px";
      hd.classList.add("dragging");
      try {
        hd.setPointerCapture(e.pointerId);
      } catch {}
      e.preventDefault();
    });
    hd.addEventListener("pointermove", (e) => {
      if (!start) return;
      const left = Math.max(
        0,
        Math.min(window.innerWidth - 80, start.left + e.clientX - start.x)
      );
      const top = Math.max(
        0,
        Math.min(window.innerHeight - 40, start.top + e.clientY - start.y)
      );
      root.style.left = left + "px";
      root.style.top = top + "px";
    });
    const end = (e) => {
      if (!start) return;
      start = null;
      hd.classList.remove("dragging");
      try {
        hd.releasePointerCapture(e.pointerId);
      } catch {}
    };
    hd.addEventListener("pointerup", end);
    hd.addEventListener("pointercancel", end);
  })();

  /* ------------------------------------------------------------------ */
  /* 数据与渲染                                                          */
  /* ------------------------------------------------------------------ */
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

  function updateSelUI() {
    $("ktpSelNote").innerHTML = `已选 <b>${selected.size}</b>`;
    $("ktpCopySel").title = selected.size
      ? `复制选中的 ${selected.size} 个预览页链接`
      : "请先选择文件";
    $("ktpDlSel").title = selected.size
      ? `下载选中的 ${selected.size} 个原始文件`
      : "请先选择文件";

    const q = ($("ktpSearch").value || "").trim().toLowerCase();
    const visible = DATA.map((r, i) => ({ r, i })).filter(
      ({ r }) => !q || String(r.name || "").toLowerCase().includes(q)
    );
    const selAll = $("ktpSelAll");
    selAll.checked = visible.length > 0 && visible.every(({ i }) => selected.has(i));
    selAll.indeterminate = !selAll.checked && visible.some(({ i }) => selected.has(i));
    $("ktpCopySel").disabled = selected.size === 0;
    $("ktpDlSel").disabled = selected.size === 0;
  }

  function render(filter = "") {
    const list = $("ktpList");
    const q = String(filter || "").trim().toLowerCase();
    const rows = DATA.map((r, i) => ({ r, i })).filter(
      ({ r }) => !q || String(r.name || "").toLowerCase().includes(q)
    );

    $("ktpCount").textContent = String(DATA.length);
    const okN = DATA.filter((r) => fileUrl(r)).length;
    $("ktpSum").innerHTML = DATA.length
      ? `成功 <b class="ok">${okN}</b> · 失败 <b class="bad">${DATA.length - okN}</b>`
      : "";

    if (!rows.length) {
      list.innerHTML = DATA.length
        ? emptyState("没有匹配的文件", "换个关键词试试，或清空搜索框。")
        : emptyState("还没有提取内容", "点击右上角「提取」，拉取当前页面的课程资料。");
      updateSelUI();
      return;
    }

    list.innerHTML = rows
      .map(({ r, i }) => {
        const [cls, label] = extIcon(r.name);
        const hasFile = !!fileUrl(r);
        const hasPrev = !!previewUrl(r);
        const checked = selected.has(i);
        const status = hasFile
          ? `<span class="nu-ok">可下载</span>`
          : `<span class="nu-bad">${escapeHtml(r.error || "无法提取直链")}</span>`;
        const warn =
          hasFile && r.missing && r.missing.length
            ? `<span class="nu-warn" title="直链缺少 ${escapeHtml(
                r.missing.join(", ")
              )}">链接不完整</span>`
            : "";
        return `
        <div class="nu-item${checked ? " selected" : ""}" data-i="${i}">
          <input class="nu-check" type="checkbox" data-act="select" tabindex="-1" ${
            checked ? "checked" : ""
          } aria-label="选择文件" />
          <span class="nu-num">${String(i + 1).padStart(2, "0")}</span>
          <span class="nu-ico ${cls}" aria-hidden="true">${label}</span>
          <div class="nu-meta">
            <div class="nu-name" title="${escapeHtml(r.name)}">${escapeHtml(r.name || "-")}</div>
            <div class="nu-sub">
              ${r.size ? `<span class="nu-size">${escapeHtml(r.size)}</span>` : ""}
              ${status}${warn}
            </div>
          </div>
          <div class="nu-acts">
            <button class="nu-act" type="button" data-act="copy" title="复制预览页链接" aria-label="复制预览页链接" ${
              hasPrev ? "" : "disabled"
            }>${icon("copy", 13)}</button>
            <button class="nu-act" type="button" data-act="open" title="新标签打开预览页" aria-label="新标签打开预览页" ${
              hasPrev ? "" : "disabled"
            }>${icon("external", 13)}</button>
            <button class="nu-act" type="button" data-act="dl" title="下载原始文件" aria-label="下载原始文件" ${
              hasFile ? "" : "disabled"
            }>${icon("download", 13)}</button>
          </div>
        </div>`;
      })
      .join("");

    updateSelUI();
  }

  /* ------------------------------------------------------------------ */
  /* 复制 / 下载                                                         */
  /* ------------------------------------------------------------------ */
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.cssText = "position:fixed;opacity:0;left:-9999px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
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
    let okN = 0,
      failN = 0;

    for (let i = 0; i < list.length; i++) {
      const r = list[i];
      $("ktpStatus").innerHTML = `批量下载 <b>${i + 1}/${list.length}</b> · ${escapeHtml(
        r.name
      )}`;
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
    setTimeout(() => {
      $("ktpProg").style.width = "0%";
    }, 900);
  }

  /* ------------------------------------------------------------------ */
  /* 列表交互                                                            */
  /* ------------------------------------------------------------------ */
  $("ktpList").addEventListener("click", async (e) => {
    const item = e.target.closest(".nu-item");
    if (!item) return;
    const idx = Number(item.dataset.i);
    const r = DATA[idx];
    if (!r) return;

    const actBtn = e.target.closest(".nu-act");
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
        const original = actBtn.innerHTML;
        actBtn.classList.add("busy");
        actBtn.innerHTML = icon("refresh", 13, "spin");
        try {
          const size = await downloadFile(r);
          toast(`已保存 ${r.name}（${(size / 1048576).toFixed(2)} MB）`, "ok");
          actBtn.classList.add("ok");
          actBtn.innerHTML = original;
          setTimeout(() => actBtn.classList.remove("ok"), 900);
        } catch (err) {
          toast("下载失败: " + (err.message || err), "err");
          actBtn.innerHTML = original;
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
      const match = !q || String(r.name || "").toLowerCase().includes(q);
      if (!match) return;
      if (e.target.checked) selected.add(i);
      else selected.delete(i);
    });
    render($("ktpSearch").value);
  };

  $("ktpCopySel").onclick = () => copyLines([...selected]);
  $("ktpDlSel").onclick = () => batchDownload([...selected]);
  $("ktpDlAll").onclick = () => batchDownload(DATA.map((_, i) => i));

  $("ktpSearch").addEventListener("input", (e) => {
    $("ktpClear").hidden = !e.target.value;
    render(e.target.value);
  });
  $("ktpSearch").addEventListener("keydown", (e) => {
    if (e.key === "Escape" && e.target.value) {
      e.target.value = "";
      $("ktpClear").hidden = true;
      render("");
    }
  });
  $("ktpClear").onclick = () => {
    $("ktpSearch").value = "";
    $("ktpClear").hidden = true;
    render("");
    $("ktpSearch").focus();
  };

  /* ------------------------------------------------------------------ */
  /* 直链提取逻辑（与原脚本一致）                                         */
  /* ------------------------------------------------------------------ */
  function extractFurl(containerUrl) {
    if (!containerUrl) return null;
    const raw = String(containerUrl)
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
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
    return v;
  }

  function toPublicOss(furl) {
    try {
      const u = new URL(furl);
      u.hostname = u.hostname.replace(/-internal(?=\.)/, "");
      u.protocol = "https:";
      return u.href;
    } catch {
      return furl;
    }
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
        try {
          resolve(JSON.parse(x.responseText));
        } catch {
          reject(new Error("响应解析失败"));
        }
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
    } catch {
      return null;
    }
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
      const data = await xhrJson(
        "https://openapiv5.ketangpai.com//FutureV2/Courseware/query",
        token,
        { courseid, id, type, courserole, reqtimestamp: Date.now() }
      );
      if (!data) throw new Error("空响应");
      if (data.status !== 1) throw new Error(data.message || "接口异常 code=" + data.code);
      const item = data.data || {};
      const title = item.title || item.name || "";
      const atts = Array.isArray(item.attachment)
        ? item.attachment
        : item.attachment
        ? [item.attachment]
        : [];
      if (!atts.length)
        return [
          {
            title,
            name: title,
            size: "",
            rurl: null,
            playurl: null,
            oss: null,
            error: "无附件",
            resource: item.id,
          },
        ];
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
    let page = 1,
      pageTotal = 1;
    do {
      const data = await xhrJson(
        "https://openapiv5.ketangpai.com//FutureV2/CourseMeans/getCourseContent",
        token,
        {
          courseid,
          contenttype,
          dirid: 0,
          lessonlink: [],
          sort: [],
          page,
          limit: 50,
          desc: 3,
          courserole,
          vtr_type: "",
          reqtimestamp: Date.now(),
        }
      );
      if (!data) throw new Error("空响应");
      if (data.status !== 1) throw new Error(data.message || "接口异常 code=" + data.code);
      const d = data.data || {};
      pageTotal = d.pageTotal || 1;
      all.push(...(d.list || []));
      $("ktpStatus").textContent = `列表 ${page}/${pageTotal} 页 · ${all.length} 条`;
      page++;
    } while (page <= pageTotal);

    const jobs = [];
    for (const item of all) {
      const title = item.title || item.name || "";
      const atts = Array.isArray(item.attachment)
        ? item.attachment
        : item.attachment
        ? [item.attachment]
        : [];
      if (!atts.length) {
        jobs.push({
          title,
          name: title,
          size: "",
          rurl: null,
          playurl: null,
          oss: null,
          error: "无附件",
          resource: item.id,
        });
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

  /* ------------------------------------------------------------------ */
  /* 提取                                                                */
  /* ------------------------------------------------------------------ */
  let running = false;
  async function run() {
    if (running) return;
    const hashQuery = location.hash.includes("?")
      ? location.hash.slice(location.hash.indexOf("?") + 1)
      : "";
    const params = new URLSearchParams(hashQuery || location.search);
    const courseid = params.get("courseid");
    const token = getToken();
    const mode = pageMode(params);

    if (mode === "none" || !courseid) {
      $("ktpStatus").textContent = "请先打开课程详情或资料详情页";
      return toast("请在课程详情或资料详情页运行", "err");
    }
    if (!token) {
      $("ktpStatus").textContent = "未登录，请先登录课堂派";
      return toast("未登录，请先登录", "err");
    }

    running = true;
    const modeLabel = mode === "resource" ? "当前资料" : "课程全部";
    const runBtn = $("ktpRun");
    const refreshBtn = $("ktpRefresh");
    runBtn.disabled = true;
    refreshBtn.disabled = true;
    refreshBtn.classList.add("busy");
    runBtn.innerHTML = `<span class="nu-run-ico">${icon("refresh", 13, "spin")}</span><span>提取中</span>`;
    $("ktpStatus").textContent = mode === "resource" ? "拉取当前资料…" : "拉取课程内容…";
    $("ktpProg").style.width = "5%";

    const badge = $("ktpBadgeMode");
    badge.hidden = false;
    badge.textContent = modeLabel;

    selected.clear();
    DATA = [];
    render();

    try {
      const jobs = await fetchJobs(mode, params, token);

      let done = 0;
      for (const job of jobs) {
        $("ktpStatus").textContent = `解析 ${done + 1}/${jobs.length} · ${job.name}`;
        $("ktpProg").style.width = jobs.length
          ? Math.round((done / jobs.length) * 100) + "%"
          : "50%";

        let furl = extractFurl(job.playurl);
        if (!furl && job.rurl) {
          furl = await pluginAppToFurl(job.rurl);
          await sleep(120);
        }

        if (furl) {
          const oss = toPublicOss(furl);
          const missing = ["OSSAccessKeyId", "Expires", "Signature"].filter((k) => {
            try {
              return !new URL(oss).searchParams.has(k);
            } catch {
              return true;
            }
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
        $("ktpProg").style.width = jobs.length
          ? Math.round((done / jobs.length) * 100) + "%"
          : "100%";
      }

      const ok = DATA.filter((r) => r.oss).length;
      $("ktpProg").style.width = "100%";
      $("ktpStatus").innerHTML = `${modeLabel} · 提取完成`;
      window.__ketangpaiCourseLinks = DATA;
      toast(
        `提取完成（${modeLabel}）：${ok}/${DATA.length}`,
        ok === DATA.length ? "ok" : "err"
      );
    } catch (e) {
      $("ktpStatus").textContent = "失败: " + (e.message || e);
      toast("提取失败: " + (e.message || e), "err");
    } finally {
      running = false;
      runBtn.disabled = false;
      refreshBtn.disabled = false;
      refreshBtn.classList.remove("busy");
      runBtn.innerHTML = `<span class="nu-run-ico">${icon("scan", 14)}</span><span>提取</span>`;
      setTimeout(() => {
        $("ktpProg").style.width = "0%";
      }, 800);
    }
  }

  $("ktpRun").onclick = run;
  $("ktpRefresh").onclick = run;
  render();
  run();
})();
