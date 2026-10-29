/* 다퍼줌 공통 동작 (index · find)
 * - 신청 저장: ssgadmin 영업관리 > 다퍼줌 시트 (reservations_dapeojum), 접수번호 DPZ0001 … (DB가 발급)
 * - 신청서 항목을 바꾸면 privacy.html '수집하는 항목'과 ssgadmin src/lib/dapeojum.ts 도 같이 고칠 것
 * - 상품 찾기에서 고른 상품은 snapshot.pick 으로 같이 저장 → 영업관리 다퍼줌 신청 카드에 표시
 */
(function () {
  'use strict';
  var SB_URL = 'https://ebggtghzqtxfylbhqfoh.supabase.co';
  var SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZ2d0Z2h6cXR4ZnlsYmhxZm9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNDk4MzgsImV4cCI6MjA5NjgyNTgzOH0.bPqIVbrnh2I9pi9rBQzQNOXQcG8v5WbBauZynkED_-Q';
  var TABLE = 'reservations_dapeojum';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var store = {
    get: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  };
  function won(n) { return Number(n).toLocaleString('ko-KR') + '원'; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  /* 통신사 마크 (2026-10-29 사장님: 이름 글자는 빼고 로고 마크만)
     - 로고 크기는 --k(칸마다 CSS에서 정함) × --sr(가로세로 비율의 제곱근)로 맞춤 → 넓은 로고·네모 로고가 비슷한 크기로 보임
     - 로고 파일이 없는 곳(지금은 SKT·소호)은 이름 글자 */
  function logoImg(c, alt) {
    return '<img class="clogo" src="assets/emoji/s/' + c.logo.f + '.webp?v=20261029" width="' + c.logo.w + '" height="' + c.logo.h + '" alt="' + (alt === false ? '' : esc(c.name)) + '" style="--sr:' + (Math.sqrt(c.logo.w / c.logo.h) * (c.logo.s || 1)).toFixed(3) + '" decoding="async">';
  }
  // withLabel: 통신사 칸·버튼에서는 로고 밑에 짧은 이름(label)을 붙임 (2026-10-29 사장님: 'U+ SKT KT 이렇게')
  function carrierMark(c, alt, withLabel) {
    var lab = withLabel ? '<span class="clab">' + (c.label || esc(c.name)) + '</span>' : '';
    if (c.pkgs) { // 소호: 안에 든 통신사 로고 두 개를 작게 나란히 + '소호' 글자
      var all = (window.DPZ_PLANS && window.DPZ_PLANS.carriers) || [];
      var marks = c.pkgs.map(function (p) { var o = all.filter(function (x) { return x.id === p.of; })[0]; return o && o.logo ? logoImg(o, false) : ''; }).join('');
      return '<span class="cpair" aria-hidden="true">' + marks + '</span>' + (lab || '<span class="cname">' + (c.tile || esc(c.name)) + '</span>');
    }
    if (!c.logo) return '<span class="cname">' + (c.tile || esc(c.name)) + '</span>'; // 로고 없으면 이름 글자만 (밑에 같은 이름을 또 붙이지 않음)
    return logoImg(c, withLabel ? false : alt) + lab;
  }

  /* ---------- 광고 유입 정보 (이 탭에서 페이지를 옮겨도 유지) ---------- */
  var UTM = {};
  try {
    var q = new URLSearchParams(location.search), got = {}, has = false;
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (k) { var v = q.get(k); if (v) { got[k] = v; has = true; } });
    if (has) { UTM = got; store.set('dpz_utm', JSON.stringify(got)); }
    else { UTM = JSON.parse(store.get('dpz_utm') || '{}') || {}; }
    var fbclid = q.get('fbclid');
    if (fbclid) { store.set('dpz_fbclid', fbclid); store.set('dpz_fbclid_ts', String(Date.now())); }
    if (!store.get('dpz_landing')) store.set('dpz_landing', (location.pathname + location.search).slice(0, 300));
  } catch (e) { UTM = {}; }
  // 시트 채널값: 유닥 시트와 같은 규칙 (utm 없으면 메타 광고 랜딩 기준 '메타')
  function pageChannel() {
    var s = String(UTM.utm_source || '').toLowerCase();
    if (!s || /^(fb|facebook|ig|instagram|meta|an|msg|messenger|audience_network)$/.test(s)) return '메타';
    if (s.indexOf('naver') > -1) return '네이버';
    if (/^(x|twitter|threads|kakao|youtube|tiktok|blog|band|sns)$/.test(s)) return 'SNS';
    if (/(seg|sms|lms|mms)/.test(s)) return '세그';
    return '기타';
  }
  function metaIds() {
    try {
      var ck = function (n) { var m = document.cookie.match(new RegExp('(?:^|;\\s*)' + n + '=([^;]*)')); return m ? decodeURIComponent(m[1]) : null; };
      var fbc = ck('_fbc'), fbp = ck('_fbp');
      if (!fbc) { var id = store.get('dpz_fbclid'); if (id) fbc = 'fb.1.' + (store.get('dpz_fbclid_ts') || Date.now()) + '.' + id; }
      return { meta_fbc: fbc || null, meta_fbp: fbp || null, meta_ua: (navigator.userAgent || '').slice(0, 400) || null, meta_page_url: (location.origin + location.pathname + location.search).slice(0, 500) };
    } catch (e) { return {}; }
  }
  function track(ev) { try { if (window.fbq) window.fbq('track', ev); if (window.gtag) window.gtag('event', ev); } catch (e) {} }

  /* ---------- 맨 위 띠 · 머리 ---------- */
  var topbar = $('#topbar');
  if (topbar) {
    if (store.get('dpz_topbar_off')) topbar.hidden = true;
    var tx = $('.x', topbar);
    if (tx) tx.addEventListener('click', function () { topbar.hidden = true; store.set('dpz_topbar_off', '1'); });
  }
  var hd = $('.hd');
  if (hd) window.addEventListener('scroll', function () { hd.classList.toggle('scrolled', window.scrollY > 4); }, { passive: true });

  /* ---------- 폰 하단 고정 버튼 ---------- */
  var sticky = $('#sticky'), stickyAfter = $('[data-sticky-after]'), pastHero = !stickyAfter;
  function syncSticky() {
    if (!sticky) return;
    var show = pastHero && !document.body.classList.contains('lock');
    sticky.classList.toggle('show', show);
    document.documentElement.style.setProperty('--sticky-pad', show ? '76px' : '0px');
  }
  if (sticky && stickyAfter && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { es.forEach(function (e) { pastHero = !e.isIntersecting && e.boundingClientRect.top < 0; }); syncSticky(); }).observe(stickyAfter);
  }
  syncSticky();

  /* ---------- 상담 신청 창 ---------- */
  var FORM_HTML =
    '<div class="modal" id="formModal" role="dialog" aria-modal="true" aria-labelledby="fmTitle">' +
    '<div class="sheet" id="sheet">' +
    '<div class="sheet-hd"><h2 id="fmTitle">1분 상담 신청</h2><button class="sheet-x" type="button" data-close aria-label="닫기"><svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
    '<div class="sheet-bd">' +
    '<div class="fm-intro"><p class="fm-lead">남겨주신 연락처로 담당자가 연락드려요. 상담 신청은 가입이 아니에요.</p>' +
    '<div class="picked" id="picked" hidden><small>선택한 상품</small><b id="pickedTxt"></b><button type="button" id="pickedClear">지우기</button></div></div>' +
    '<form class="fm" id="form" novalidate>' +
    '<div class="f" data-f="name"><label for="fName">이름 <span class="req" aria-hidden="true">*</span></label>' +
    '<input class="in" id="fName" name="name" type="text" autocomplete="name" maxlength="20" placeholder="이름을 입력해 주세요" required>' +
    '<p class="err" aria-live="polite">이름을 입력해 주세요.</p></div>' +
    '<div class="f" data-f="phone"><label for="fPhone">연락처 <span class="req" aria-hidden="true">*</span></label>' +
    '<input class="in" id="fPhone" name="phone" type="tel" inputmode="numeric" autocomplete="tel" maxlength="13" placeholder="010-0000-0000" required>' +
    '<p class="err" aria-live="polite">010으로 시작하는 휴대폰 번호 11자리를 입력해 주세요.</p></div>' +
    '<div class="f" data-f="product" role="radiogroup" aria-labelledby="lProduct"><span class="lab" id="lProduct">관심 상품 <span class="req" aria-hidden="true">*</span></span>' +
    '<div class="seg"><label><input type="radio" name="product" value="인터넷"><span>인터넷</span></label><label><input type="radio" name="product" value="인터넷+TV"><span>인터넷 + TV</span></label><label><input type="radio" name="product" value="상담 후 결정"><span>상담 후 결정</span></label></div>' +
    '<p class="err" aria-live="polite">관심 상품을 골라 주세요.</p></div>' +
    '<div class="f" data-f="isp" role="radiogroup" aria-labelledby="lIsp"><span class="lab" id="lIsp">지금 쓰는 인터넷 <span class="req" aria-hidden="true">*</span></span>' +
    '<div class="seg"><label><input type="radio" name="isp" value="KT"><span>KT</span></label><label><input type="radio" name="isp" value="LG U+"><span>LG U+</span></label><label><input type="radio" name="isp" value="SK브로드밴드"><span>SK브로드밴드</span></label>' +
    '<label><input type="radio" name="isp" value="그 외 통신사"><span>그 외 통신사</span></label><label><input type="radio" name="isp" value="모르겠어요"><span>모르겠어요</span></label><label><input type="radio" name="isp" value="신규 가입"><span>신규 가입</span></label></div>' +
    '<p class="err" aria-live="polite">지금 쓰는 인터넷을 골라 주세요. 처음 설치하시면 \'신규 가입\'을 눌러 주세요.</p></div>' +
    '<div class="f" role="radiogroup" aria-labelledby="lSpeed"><span class="lab" id="lSpeed">희망 속도 <span class="opt">(선택)</span></span>' +
    '<div class="seg"><label><input type="radio" name="speed" value="100M"><span>100M</span></label><label><input type="radio" name="speed" value="200M"><span>200M</span></label><label><input type="radio" name="speed" value="500M"><span>500M</span></label>' +
    '<label><input type="radio" name="speed" value="1G"><span>1G</span></label><label><input type="radio" name="speed" value="상담 후 결정"><span>잘 모르겠어요</span></label></div></div>' +
    '<label class="chk"><input type="checkbox" id="fBundle"><span><b>휴대폰 결합 할인도 같이 상담받을게요</b><small>가족 휴대폰과 묶어서 할인받을 수 있는지 같이 알아봐 드려요</small></span></label>' +
    '<div class="f"><label for="fArea">설치 지역 <span class="opt">(선택)</span></label><input class="in" id="fArea" type="text" maxlength="40" placeholder="예: 구리시 인창동"></div>' +
    '<div class="f" role="radiogroup" aria-labelledby="lTime"><span class="lab" id="lTime">통화 편한 시간 <span class="opt">(선택)</span></span>' +
    '<div class="seg c4"><label><input type="radio" name="time" value="언제든"><span>언제든</span></label><label><input type="radio" name="time" value="오전"><span>오전</span></label><label><input type="radio" name="time" value="오후"><span>오후</span></label><label><input type="radio" name="time" value="저녁"><span>저녁</span></label></div></div>' +
    '<div class="f"><label for="fMemo">전달사항 <span class="opt">(선택)</span></label><textarea class="in" id="fMemo" rows="3" maxlength="500" placeholder="궁금한 점이나 요청사항을 적어 주세요"></textarea></div>' +
    '<div class="agree"><div class="f" data-f="agree"><label class="chk"><input type="checkbox" id="fAgree"><span><b>개인정보 수집·이용에 동의해요 <span class="req">(필수)</span></b></span></label>' +
    '<p class="err" aria-live="polite">상담 신청을 하시려면 개인정보 수집·이용에 동의해 주세요.</p></div>' +
    '<details><summary>동의 내용 보기</summary><div>다퍼줌은 상담 신청 접수와 상담 안내를 위해 아래와 같이 개인정보를 수집·이용합니다.<br><br>' +
    '· 항목: 이름, 연락처, 관심 상품, 지금 쓰는 인터넷, 희망 속도·설치 지역·통화 편한 시간·선택한 상품·전달사항(고르거나 입력한 경우)<br>' +
    '· 목적: 상담 신청 접수, 상담 연락, 가입·설치 안내<br>· 보유 기간: 수집일로부터 6개월<br><br>' +
    '동의하지 않으실 수 있으며, 동의하지 않으면 상담 신청을 할 수 없습니다. <a href="privacy" target="_blank" rel="noopener">개인정보처리방침 전체 보기</a></div></details></div>' +
    '<p class="form-msg" id="formMsg" role="alert"></p>' +
    '<button class="submit" id="submitBtn" type="submit"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 12.5l5 5 10-11"/></svg><span>상담 신청하기</span></button>' +
    '</form>' +
    '<div class="done" id="done" aria-live="polite"><div class="ok"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 12.5l5 5 10-11"/></svg></div>' +
    '<h3 tabindex="-1" id="doneTitle">상담 신청이 접수됐어요</h3>' +
    '<div class="num" id="doneNum" hidden><small>접수번호</small><b id="doneNo"></b><button type="button" id="copyNo">접수번호 복사</button></div>' +
    '<p id="doneText">담당자가 남겨주신 연락처로 연락드려요.</p><p class="soft">상담 신청은 가입이 아니에요. 편하게 상담받아 보세요.</p>' +
    '<button class="btn btn-k close" type="button" data-close>닫기</button></div>' +
    '</div></div></div>';

  document.body.insertAdjacentHTML('beforeend', FORM_HTML);
  var modal = $('#formModal'), sheet = $('#sheet'), form = $('#form'), phone = $('#fPhone'), btn = $('#submitBtn'), msg = $('#formMsg');
  var lastTrigger = null, pick = null, topic = '';

  function checkRadio(name, value) { $$('input[name="' + name + '"]', form).forEach(function (r) { r.checked = (r.value === value); }); }
  function radio(n) { var r = $('input[name="' + n + '"]:checked', form); return r ? r.value : null; }
  function pickText(p) {
    if (!p) return '';
    if (!p.speed && !p.combo) return p.carrier; // 소호처럼 속도·조합 없이 상품만 고른 경우
    var t = p.carrier + ' · 인터넷 ' + (p.speed || '');
    if (p.combo === 'tv') t += ' + TV' + (p.tvName ? ' ' + p.tvName + (p.ch ? '(' + p.ch + '채널)' : '') : '');
    return t;
  }
  function setPick(p) {
    pick = p || null;
    $('#pickedTxt').textContent = pickText(pick);
    $('#picked').hidden = !pick;
  }
  $('#pickedClear').addEventListener('click', function () { setPick(null); });

  function openForm(opt) {
    opt = opt || {};
    lastTrigger = document.activeElement;
    if (opt.pick !== undefined) setPick(opt.pick);
    if (opt.topic !== undefined) topic = opt.topic || '';
    if (opt.pick) {
      if (opt.pick.combo) checkRadio('product', opt.pick.combo === 'tv' ? '인터넷+TV' : '인터넷'); // 소호는 손님이 직접 고름
      if (opt.pick.speed) checkRadio('speed', opt.pick.speed);
    }
    if (opt.product) checkRadio('product', opt.product);
    if (opt.isp) checkRadio('isp', opt.isp);
    if (opt.bundle) $('#fBundle').checked = true;
    ['product', 'isp'].forEach(function (k) { if (radio(k)) setBad(k, false); });
    modal.classList.add('open');
    document.body.classList.add('lock');
    syncSticky();
    sheet.scrollTop = 0;
    if (!sheet.classList.contains('is-done')) setTimeout(function () { var n = $('#fName'); if (n && !n.value) n.focus({ preventScroll: true }); }, 60);
  }
  function closeForm() {
    modal.classList.remove('open');
    document.body.classList.remove('lock');
    syncSticky();
    if (lastTrigger && lastTrigger.focus) lastTrigger.focus({ preventScroll: true });
  }
  modal.addEventListener('click', function (e) { if (e.target === modal || e.target.closest('[data-close]')) closeForm(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal.classList.contains('open')) closeForm(); });
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-open-form]');
    if (!t) return;
    e.preventDefault();
    openForm({ topic: t.getAttribute('data-topic') || undefined, product: t.getAttribute('data-product') || undefined });
  });

  phone.addEventListener('input', function () {
    var d = phone.value.replace(/\D/g, '').slice(0, 11), out = d;
    if (d.length > 3 && d.length <= 7) out = d.slice(0, 3) + '-' + d.slice(3);
    else if (d.length > 7) out = d.slice(0, 3) + '-' + d.slice(3, 7) + '-' + d.slice(7);
    phone.value = out;
    setBad('phone', false);
  });
  function setBad(k, on) { var f = $('[data-f="' + k + '"]', form); if (f) f.classList.toggle('bad', !!on); }
  $('#fName').addEventListener('input', function () { setBad('name', false); });
  $$('input[name="product"],input[name="isp"]', form).forEach(function (r) { r.addEventListener('change', function () { setBad(r.name, false); }); });
  $('#fAgree').addEventListener('change', function () { setBad('agree', false); });
  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    var b = new Uint8Array(16); crypto.getRandomValues(b); b[6] = (b[6] & 15) | 64; b[8] = (b[8] & 63) | 128;
    var h = Array.prototype.map.call(b, function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
    return h.slice(0, 8) + '-' + h.slice(8, 12) + '-' + h.slice(12, 16) + '-' + h.slice(16, 20) + '-' + h.slice(20);
  }
  function headers(extra) { var h = { 'Content-Type': 'application/json', apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY }; for (var k in extra) h[k] = extra[k]; return h; }

  var sending = false;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (sending) return;
    msg.classList.remove('show');
    var name = $('#fName').value.trim(), ph = phone.value.trim();
    var product = radio('product'), isp = radio('isp'), speed = radio('speed'), time = radio('time');
    var bundle = $('#fBundle').checked, area = $('#fArea').value.trim(), memo = $('#fMemo').value.trim();
    var bad = [];
    if (name.length < 2) bad.push('name');
    if (!/^010-\d{4}-\d{4}$/.test(ph)) bad.push('phone');
    if (!product) bad.push('product');
    if (!isp) bad.push('isp');
    if (!$('#fAgree').checked) bad.push('agree');
    ['name', 'phone', 'product', 'isp', 'agree'].forEach(function (k) { setBad(k, bad.indexOf(k) > -1); });
    if (bad.length) {
      var first = $('[data-f="' + bad[0] + '"]', form);
      first.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      var inp = first.querySelector('input'); if (inp) setTimeout(function () { inp.focus({ preventScroll: true }); }, 300);
      return;
    }
    sending = true; btn.disabled = true; btn.querySelector('span').textContent = '신청하는 중…';
    var id = uuid(), mi = metaIds();
    var p = pick; // 상품 찾기에서 고른 상품 (신청서에서 관심 상품을 바꿔도 고른 내용은 그대로 남김 — 직원이 둘 다 봄)
    var homeTv = null;
    if (product === '인터넷+TV') homeTv = (p && p.combo === 'tv' && p.tvName) ? (p.carrier + ' ' + p.tvName + (p.ch ? ' ' + p.ch + '채널' : '')) : 'TV 함께 상담';
    var body = {
      id: id, name: name, phone: ph, carrier: isp, channel: pageChannel(), utm_campaign: UTM.utm_campaign || null,
      device_interest: product, home_internet: speed || null, home_tv: homeTv,
      customer_address: area || null, memo: memo || null, status: '신규',
      meta_fbc: mi.meta_fbc || null, meta_fbp: mi.meta_fbp || null, meta_ua: mi.meta_ua || null, meta_page_url: mi.meta_page_url || null,
      snapshot: {
        v: 2, source: 'dapeojum', product: product, speed: speed || null, current_isp: isp,
        mobile_bundle: bundle ? '휴대폰 결합 할인 같이 상담' : null, region: area || null, contact_time: time || null, topic: topic || null, // topic = 신청서를 연 버튼 위치 (첫 화면 배너·직접 선택·맞춤 추천 등)
        pick: p ? { carrier_id: p.carrierId, carrier: p.carrier, combo: p.combo, speed: p.speed || null, tv_name: p.tvName || null, channels: p.ch || null,
          price_base: p.base || null, price_bundle: p.bundle || null, via: p.via || null } : null,
        utm: UTM, landing: store.get('dpz_landing'), page_url: location.href.slice(0, 500), submitted_at: new Date().toISOString()
      }
    };
    fetch(SB_URL + '/rest/v1/' + TABLE, { method: 'POST', headers: headers({ Prefer: 'return=minimal' }), body: JSON.stringify(body) })
      .then(function (res) {
        if (!res.ok) return res.text().then(function (t) { throw new Error(t || res.status); });
        track('Lead');
        showDone(ph);
        // 접수번호 받기 (못 받아도 접수는 된 상태)
        return fetch(SB_URL + '/rest/v1/rpc/get_reservation_no', { method: 'POST', headers: headers({}), body: JSON.stringify({ p_id: id }) })
          .then(function (r) { return r.ok ? r.json() : null; })
          .then(function (no) { if (no) { $('#doneNo').textContent = String(no); $('#doneNum').hidden = false; } })
          .catch(function () {});
      })
      .catch(function (err) {
        console.error('신청 저장 실패', err);
        msg.textContent = '신청이 저장되지 않았어요. 인터넷 연결을 확인하고 한 번 더 눌러 주세요.';
        msg.classList.add('show');
        sending = false; btn.disabled = false; btn.querySelector('span').textContent = '상담 신청하기';
      });
  });
  function showDone(ph) {
    sheet.classList.add('is-done');
    $('#fmTitle').textContent = '상담 신청 완료';
    var dt = $('#doneText'); dt.textContent = '';
    var nb = document.createElement('b'); nb.className = 'nw'; nb.textContent = '010-****-' + ph.slice(-4) + '로';
    dt.appendChild(nb); dt.appendChild(document.createTextNode(' 담당자가 연락드려요.'));
    sheet.scrollTop = 0;
    setTimeout(function () { $('#doneTitle').focus({ preventScroll: true }); }, 200);
  }
  $('#copyNo').addEventListener('click', function () {
    var t = $('#doneNo').textContent, b = this;
    var ok = function () { b.textContent = '복사했어요'; setTimeout(function () { b.textContent = '접수번호 복사'; }, 1800); };
    function fallback() { var ta = document.createElement('textarea'); ta.value = t; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); ok(); } catch (e) {} document.body.removeChild(ta); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(ok, fallback); else fallback();
  });

  window.DPZ = { openForm: openForm, won: won, esc: esc, carrierMark: carrierMark, store: store, reduce: reduce, $: $, $$: $$ };
})();
