/* ============================================================
   CMK Image Korea — shared chrome + interactions for sub-pages
   Injects header / mobile menu / footer so nav & footer are
   edited in ONE place. Each sub-page sets <body data-page="...">.
   ============================================================ */
(function () {
  var NAV = [
    { key: 'about',     label: 'About',     href: 'about.html' },
    { key: 'corporate', label: 'Corporate', href: 'corporate.html' },
    { key: 'personal',  label: 'Personal',  href: 'personal.html' },
    { key: 'academy',   label: 'Academy',   href: 'academy.html' },
    { key: 'lab',       label: 'Image Lab', href: 'lab.html' },
    { key: 'kbeauty',   label: 'K-Beauty',  href: 'kbeauty.html' },
    { key: 'news',      label: 'News',      href: 'news.html' }
  ];
  var active = document.body.getAttribute('data-page') || '';
  var inEng = /\/eng\//.test(location.pathname);
  var A = inEng ? '../assets/' : 'assets/';
  var page = location.pathname.split('/').pop() || 'index.html';
  var langSwitch = inEng
    ? '<a class="alt" href="../' + page + '">KO</a><span class="sep">/</span><a class="cur" href="' + page + '">EN</a>'
    : '<a class="cur" href="' + page + '">KO</a><span class="sep">/</span><a class="alt" href="eng/' + page + '">EN</a>';
  var langMobile = inEng
    ? '<a href="../' + page + '" class="m-link" style="font-size:16px;opacity:.6;letter-spacing:.08em;">한국어</a>'
    : '<a href="eng/' + page + '" class="m-link" style="font-size:16px;opacity:.6;letter-spacing:.08em;">English</a>';
  var footTag = inEng
    ? 'An image consulting group that designs the image of leaders and institutions into strategy.'
    : '리더와 기관의 이미지를 전략으로 설계하는 이미지 컨설팅 그룹.';
  var footBiz = inEng
    ? 'CMK Image Korea &nbsp;|&nbsp; CEO Cho Mi-kyung &nbsp;|&nbsp; Business Reg. No. 107-91-45820'
    : 'CMK Image Korea &nbsp;|&nbsp; 대표 조미경 &nbsp;|&nbsp; 사업자등록번호 107-91-45820';
  var footAddr = inEng
    ? '215-303, Daeju Fiore 2-danji, 152 Topsil-ro, Giheung-gu, Yongin-si, Gyeonggi-do &nbsp;|&nbsp; Tel 010-7269-8836 &nbsp;|&nbsp; cmkimage@hanmail.net'
    : '경기 용인시 기흥구 탑실로 152, 탑실마을 대주 피오레 2단지 215동 303호 &nbsp;|&nbsp; Tel 010-7269-8836 &nbsp;|&nbsp; cmkimage@hanmail.net';

  var navDesktop = NAV.map(function (n) {
    return '<a href="' + n.href + '" class="navlink' + (n.key === active ? ' active' : '') +
      '" style="color:inherit;text-decoration:none;font-size:14px;font-weight:400;letter-spacing:.02em;">' + n.label + '</a>';
  }).join('');

  var navMobile = NAV.map(function (n) {
    return '<a href="' + n.href + '" class="m-link">' + n.label + '</a>';
  }).join('') +
    '<a href="https://smartstore.naver.com/cmkimage" target="_blank" rel="noopener" class="m-link">SHOP&nbsp;&#8599;</a>' +
    '<a href="index.html#contact" class="m-link">Contact</a>' +
    langMobile;

  var header =
  '<header id="siteHeader" class="scrolled">' +
    '<div style="max-width:1500px;margin:0 auto;padding:0 clamp(20px,5vw,60px);height:88px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:24px;">' +
      '<a href="index.html" style="justify-self:start;display:inline-flex;align-items:center;text-decoration:none;">' +
        '<img src="' + A + 'logo.png" alt="CMK IMAGE KOREA" style="height:52px;width:auto;display:block;">' +
      '</a>' +
      '<nav id="siteNav" style="justify-self:center;display:flex;align-items:center;gap:clamp(16px,2.2vw,36px);">' + navDesktop + '</nav>' +
      '<div style="justify-self:end;display:flex;align-items:center;gap:20px;">' +
        '<span class="langswitch">' + langSwitch + '</span>' +
        '<a href="https://smartstore.naver.com/cmkimage" target="_blank" rel="noopener" class="navshop" style="color:inherit;text-decoration:none;font-size:14px;font-weight:600;letter-spacing:.02em;padding-bottom:2px;border-bottom:1px solid currentColor;">SHOP&nbsp;&#8599;</a>' +
        '<a href="index.html#contact" class="navcontact" style="color:inherit;text-decoration:none;font-size:14px;font-weight:400;letter-spacing:.02em;padding-bottom:2px;border-bottom:1px solid currentColor;">Contact</a>' +
        '<button id="menuToggle" class="menu-toggle" aria-label="메뉴 열기" style="background:none;border:none;color:inherit;padding:4px;cursor:pointer;">' +
          '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></svg>' +
        '</button>' +
      '</div>' +
    '</div>' +
  '</header>' +
  '<div id="mobileMenu" class="mobile-menu" aria-hidden="true">' +
    '<button id="menuClose" class="menu-close" aria-label="메뉴 닫기">' +
      '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>' +
    '</button>' + navMobile +
  '</div>';

  var footer =
  '<footer style="background:#E3E5E9;color:#5F6570;padding:clamp(56px,8vh,88px) clamp(20px,5vw,60px) 40px;">' +
    '<div style="max-width:1500px;margin:0 auto;">' +
      '<div class="grid-foot" style="display:grid;grid-template-columns:1fr auto;gap:40px;padding-bottom:44px;border-bottom:1px solid rgba(42,38,34,.14);align-items:start;">' +
        '<div>' +
          '<div style="margin-bottom:16px;"><img src="' + A + 'logo.png" alt="CMK IMAGE KOREA" style="height:46px;width:auto;display:block;"></div>' +
          '<p style="font-weight:300;font-size:13px;line-height:1.8;max-width:30ch;margin:0;">' + footTag + '</p>' +
        '</div>' +
        '<div>' +
          '<div style="font-size:11px;font-weight:600;letter-spacing:.1em;color:#8A8276;margin-bottom:16px;">FOLLOW</div>' +
          '<div style="display:flex;gap:11px;">' +
            '<a href="https://blog.naver.com/cmkimage" aria-label="Naver Blog" class="social" style="width:42px;height:42px;border-radius:50%;border:1px solid rgba(42,38,34,.26);display:flex;align-items:center;justify-content:center;color:#211C17;text-decoration:none;"><svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true"><path d="M4 4h5.3l5 7.4V4H20v16h-5.3l-5-7.4V20H4z"/></svg></a>' +
            '<a href="https://smartstore.naver.com/cmkimage" target="_blank" rel="noopener" aria-label="Naver Smart Store" class="social" style="width:42px;height:42px;border-radius:50%;border:1px solid rgba(42,38,34,.26);display:flex;align-items:center;justify-content:center;color:#211C17;text-decoration:none;"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.5 8h13l-1 11.5H6.5z"/><path d="M9 8V6.2a3 3 0 0 1 6 0V8"/></svg></a>' +
            '<a href="https://www.instagram.com/cmkimagekorea/" aria-label="Instagram" class="social" style="width:42px;height:42px;border-radius:50%;border:1px solid rgba(42,38,34,.26);display:flex;align-items:center;justify-content:center;color:#211C17;text-decoration:none;"><svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5.2"/><circle cx="12" cy="12" r="4.1"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/></svg></a>' +
            '<a href="https://www.facebook.com/cmk.cho" aria-label="Facebook" class="social" style="width:42px;height:42px;border-radius:50%;border:1px solid rgba(42,38,34,.26);display:flex;align-items:center;justify-content:center;color:#211C17;text-decoration:none;"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M13.4 21v-8h2.4l.4-3h-2.8V8.1c0-.85.28-1.43 1.5-1.43h1.4V4.1c-.68-.09-1.5-.18-2.34-.18-2.32 0-3.9 1.42-3.9 4.02V10H7.7v3h2.4v8z"/></svg></a>' +
            '<a href="https://www.youtube.com/channel/UCSl1lcjrHqWx8_QezQO5BTg" aria-label="YouTube" class="social" style="width:42px;height:42px;border-radius:50%;border:1px solid rgba(42,38,34,.26);display:flex;align-items:center;justify-content:center;color:#211C17;text-decoration:none;"><svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor" aria-hidden="true"><path d="M22.5 7.3c-.25-1-1-1.75-2-2C18.7 4.8 12 4.8 12 4.8s-6.7 0-8.5.5c-1 .25-1.75 1-2 2C1 9.1 1 12 1 12s0 2.9.5 4.7c.25 1 1 1.75 2 2 1.8.5 8.5.5 8.5.5s6.7 0 8.5-.5c1-.25 1.75-1 2-2 .5-1.8.5-4.7.5-4.7s0-2.9-.5-4.7zM9.9 15.2V8.8l5.6 3.2z"/></svg></a>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div style="padding-top:24px;font-size:11.5px;line-height:1.9;color:#8A8276;">' +
        '<div style="margin-bottom:6px;">' + footBiz + '</div>' +
        '<div style="margin-bottom:14px;">' + footAddr + '</div>' +
        '<div>© 2008–2026 CMK IMAGE KOREA. All rights reserved.</div>' +
      '</div>' +
    '</div>' +
  '</footer>';

  // inject
  document.body.insertAdjacentHTML('afterbegin', header);
  var footHost = document.getElementById('site-footer');
  if (footHost) footHost.outerHTML = footer;
  else document.body.insertAdjacentHTML('beforeend', footer);

  // mobile menu
  var mMenu = document.getElementById('mobileMenu');
  var mToggle = document.getElementById('menuToggle');
  var mClose = document.getElementById('menuClose');
  function openM() { mMenu.classList.add('open'); mMenu.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; }
  function closeM() { mMenu.classList.remove('open'); mMenu.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
  if (mToggle) mToggle.addEventListener('click', openM);
  if (mClose) mClose.addEventListener('click', closeM);
  if (mMenu) mMenu.querySelectorAll('.m-link').forEach(function (a) { a.addEventListener('click', closeM); });

  // header stays solid on sub-pages (no dark hero behind it)

  // scroll reveal
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var reveals = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }
})();
