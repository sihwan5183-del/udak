/* 다퍼줌 고객 후기 — 첫 화면 '고객 후기' 칸(아정당 리얼후기 모양) + 후기 화면(review, 아정당 후기 목록 + 미소 '이전 → 가입' 줄)
 * 2026-10-29 사장님과 정한 것
 *  - 실제 고객이 보낸 글·사진만 올림: 직원이 고객 원문을 그대로 붙여넣고, 그 고객이 보낸 사진만 붙이고, 사용 동의 확인 후 게시
 *    (사이트용으로 쓴 글이나 아무 사진을 후기에 붙이는 건 안 함 — 손님이 실제 후기로 믿게 되는 가짜 후기가 됨)
 *  - 사진 없는 글 후기가 기본 → 사진 칸에 다퍼줌 로고 (아정당처럼)
 *  - 사은품을 드리고 받은 후기(incentive)는 본문 첫 부분에 '사은품을 받고 쓴 후기예요' 표시 (공정위 추천·보증 지침)
 * 지금 상태 (2026-10-30 사장님: "엑셀 내가 드래그 할 테니 아정당 식으로 입력되게")
 *  - 저장소 Supabase dapeojum_reviews + 등록 화면 review-admin (ssgadmin 관리자 로그인 → 엑셀·CSV 끌어다 놓기 → 미리보기 → 등록) → ON=true
 *  - 게시(published)된 후기만 불러옴 · 견본은 ?preview=1 일 때만 / 작성일은 아정당처럼 'N일 전 · N개월 전' / 별점이 없는 후기는 별 안 보임
 */
(function () {
  'use strict';
  var D = window.DPZ;
  if (!D) return;
  var $ = D.$, esc = D.esc;
  var ON = true;
  var PARAM = /[?&]preview=1(&|$)/.test(location.search);
  var PREVIEW = !ON || PARAM; // 세팅 중(ON=false)에는 늘 견본
  var TYPES = ['인터넷', '인터넷+TV', '소호']; // 2026-10-29 사장님: 후기 분류는 상품별, '인터넷 옮기기'는 뺌

  /* 레이아웃 확인용 견본 (?preview=1 일 때만) — 실제 후기가 아니라는 걸 글 자체에도 적어 둠 */
  var SAMPLE = [
    { id: 's1', type: '인터넷', title: '후기 제목이 들어가는 자리', body: '고객이 카톡이나 문자로 보내준 후기 글이 이 자리에 그대로 들어가요. 글이 길면 두 줄까지만 보이고, 더보기를 누르면 전체 글이 펼쳐져요. 줄을 바꾼 곳도 고객이 쓴 그대로 보여요.', rating: 5, region: '서울 ○○구', prev: 'KT', product: 'LG U+ 인터넷 500M', photo: true, tags: ['사은품', '설치'], date: '2026-10-28' },
    { id: 's2', type: '인터넷+TV', title: '', body: '사진이 없는 후기는 사진 칸에 다퍼줌 로고가 들어가요. 실제로는 글만 있는 후기가 더 많을 거라 이 모양이 기본이에요.', rating: 5, region: '경기 ○○시', prev: 'LG U+', product: 'SK브로드밴드 인터넷 500M + TV', photo: false, tags: ['요금', '상담'], date: '2026-10-27' },
    { id: 's3', type: '인터넷', incentive: true, title: '사은품을 받고 쓴 후기 예시', body: '사은품을 드리고 받은 후기는 이렇게 본문 첫 부분에 회색 표시가 붙어요.', rating: 5, region: '인천 ○○구', prev: 'SK브로드밴드', product: 'KT 인터넷 1G', photo: false, tags: ['사은품'], date: '2026-10-26' },
    { id: 's4', type: '인터넷', title: '짧은 후기', body: '짧은 후기 예시예요.', rating: 4, region: '경기 ○○시', prev: 'KT', product: 'KT 인터넷 500M', photo: true, tags: ['설치'], date: '2026-10-25' },
    { id: 's5', type: '소호', title: '', body: '가게·사무실 인터넷(소호) 후기는 소호 칸에서 따로 모아 볼 수 있어요. 위의 칸(전체·인터넷·인터넷+TV·소호)은 실제로 후기가 있는 칸만 보여요.', rating: 5, region: '서울 ○○구', prev: '처음 설치', product: 'LG U+ 소호 패키지', photo: false, tags: ['상담'], date: '2026-10-24' },
    { id: 's6', type: '인터넷+TV', title: '긴 후기 예시', body: '글이 긴 후기 예시예요. 고객이 보내준 글이 길어도 목록에서는 두 줄까지만 보여서 화면이 길어지지 않아요.\n줄을 바꿔서 보낸 글은 펼쳤을 때 이렇게 줄이 바뀐 채로 보여요.\n후기 아래 회색 줄에는 이전에 쓰던 통신사와 이번에 가입한 상품이 들어가고, 맨 위에는 후기 종류·지역·별점이 들어가요. 이 내용은 직원이 영업관리에서 고르게 할 예정이에요.', rating: 5, region: '서울 ○○구', prev: 'SKT', product: 'LG U+ 인터넷 500M + TV', photo: true, tags: ['요금', '사은품', '설치'], date: '2026-10-23' },
    { id: 's7', type: '인터넷', title: '', body: '별점은 고객이 준 점수 그대로 보여요. 4점, 3점도 그대로 올려요.', rating: 3, region: '경기 ○○시', prev: 'LG U+', product: 'SK브로드밴드 인터넷 100M', photo: false, tags: ['만족도'], date: '2026-10-22' },
    { id: 's8', type: '인터넷+TV', title: '', body: '첫 화면 후기 칸에는 최근 후기 4개가 카드로 보이고, 후기 더보기를 누르면 이 화면으로 와요.', rating: 5, region: '부산 ○○구', prev: 'KT', product: 'KT 인터넷 500M + TV', photo: false, tags: ['상담'], date: '2026-10-21' }
  ];

  var PERSON = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4.2"/><path d="M3.8 21c.4-4.6 4-7.2 8.2-7.2s7.8 2.6 8.2 7.2z"/></svg>';
  var CAMERA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8.5h3l1.6-2.5h6.8L17 8.5h3v10H4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="12" cy="13.3" r="3.3" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>';
  var EX = PREVIEW ? '<em class="rv-ex">예시</em>' : '';

  function fmtDate(s) { var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s || ''); return m ? m[1].slice(2) + '.' + m[2] + '.' + m[3] : ''; }
  // 아정당처럼 '오늘 · 3일 전 · 2개월 전' (마우스를 올리면 날짜)
  function when(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s || ''); if (!m) return '';
    var t = new Date(), days = Math.floor((Date.UTC(t.getFullYear(), t.getMonth(), t.getDate()) - Date.UTC(+m[1], +m[2] - 1, +m[3])) / 864e5);
    var w = days <= 0 ? '오늘' : days < 30 ? days + '일 전' : days < 365 ? Math.floor(days / 30) + '개월 전' : Math.floor(days / 365) + '년 전';
    return '<time datetime="' + esc(m[0]) + '" title="' + fmtDate(s) + '">' + w + '</time>';
  }
  function stars(n) { n = Math.max(0, Math.min(5, Math.round(+n || 0))); if (!n) return ''; return '<span class="rv-star" aria-label="별점 ' + n + '점">' + '★★★★★'.slice(0, n) + '<span class="off">' + '★★★★★'.slice(n) + '</span></span>'; }
  function fromRow(r) {
    return { id: r.id, type: r.review_type, title: r.title, body: r.body, rating: r.rating, name: r.masked_name, region: r.region,
      prev: r.prev_isp, product: r.new_product, photo: r.photo_url, tags: r.tags || [], incentive: !!r.incentive, date: r.written_at };
  }
  function load(cb) {
    if (PREVIEW) { cb(SAMPLE.map(function (x) { var y = {}; for (var k in x) y[k] = x[k]; y.name = '홍**'; return y; })); return; }
    if (!ON || !D.sb) { cb([]); return; }
    var q = 'select=id,review_type,title,body,rating,masked_name,region,prev_isp,new_product,photo_url,tags,incentive,written_at&published=eq.true&order=written_at.desc&limit=300';
    fetch(D.sb.url + '/rest/v1/dapeojum_reviews?' + q, { headers: { apikey: D.sb.key, Authorization: 'Bearer ' + D.sb.key } })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (rows) { cb((rows || []).map(fromRow).filter(function (x) { return x.body; })); })
      .catch(function () { cb([]); });
  }
  function tabs(list, cur) {
    var have = TYPES.filter(function (t) { return list.some(function (x) { return x.type === t; }); });
    if (have.length < 2) return ''; // 종류가 하나뿐이면 칸을 안 보여 줌
    return ['전체'].concat(have).map(function (t) {
      return '<button type="button" class="rvtab" role="tab" aria-selected="' + (t === cur) + '" data-rvt="' + esc(t) + '">' + esc(t) + '</button>';
    }).join('');
  }
  function pick(list, cur) { return list.filter(function (x) { return cur === '전체' || x.type === cur; }); }

  /* ---------- 첫 화면 '고객 후기' 칸 (아정당 리얼후기: 칸 고르기 + 카드 4개 + 더보기) ---------- */
  var sec = $('#reviews');
  if (sec) load(function (list) {
    if (!list.length) return; // 올라온 후기가 없으면 칸을 숨긴 채로 둠
    sec.hidden = false;
    if (PREVIEW) $('[data-rv-preview]', sec).hidden = false;
    if (PARAM) $('.rvmore', sec).setAttribute('href', 'review?preview=1');
    var cur = '전체', tabsEl = $('#rvTabs', sec), cards = $('#rvCards', sec);
    function card(x) {
      return '<a class="rvc" href="review' + (PARAM ? '?preview=1' : '') + '#rv-' + esc(x.id) + '">' +
        '<span class="q" aria-hidden="true">“</span>' +
        (x.incentive ? '<span class="rv-inc">사은품을 받고 쓴 후기예요</span>' : '') +
        '<p class="t">' + esc(x.body) + '</p>' +
        '<p class="m">' + PERSON + '<span>' + esc(x.name || '') + ' · ' + when(x.date) + '</span>' + EX + '</p></a>';
    }
    function draw() {
      tabsEl.innerHTML = tabs(list, cur); tabsEl.hidden = !tabsEl.innerHTML;
      cards.innerHTML = pick(list, cur).slice(0, 4).map(card).join('');
    }
    tabsEl.addEventListener('click', function (e) { var b = e.target.closest('[data-rvt]'); if (!b) return; cur = b.getAttribute('data-rvt'); draw(); });
    draw();
  });

  /* ---------- 후기 화면 (아정당 후기 목록 + 미소 '이전 → 가입' 줄) ---------- */
  var listEl = $('#rvList');
  if (listEl) load(function (list) {
    var tabsEl = $('#rvTabs'), empty = $('#rvEmpty'), sum = $('#rvSum');
    if (PREVIEW) $('[data-rv-preview]').hidden = false;
    if (!list.length) { empty.hidden = false; return; }
    if (!PREVIEW && sum) { // 실제 후기일 때만: 후기 수와 평균 별점
      var rated = list.filter(function (x) { return +x.rating > 0; });
      var avg = rated.length ? rated.reduce(function (a, x) { return a + (+x.rating); }, 0) / rated.length : 0;
      sum.textContent = '후기 ' + list.length + '개' + (avg ? ' · 평균 별점 ' + avg.toFixed(1) : '');
      sum.hidden = false;
    }
    var cur = '전체';
    function thumb(x) {
      if (PREVIEW && x.photo) return '<span class="rv-th rv-cam">' + CAMERA + '<small>고객이 보낸 사진</small></span>';
      if (x.photo && typeof x.photo === 'string') return '<span class="rv-th"><img class="ph" src="' + esc(x.photo) + '" alt="고객이 보낸 사진" loading="lazy" decoding="async"></span>';
      return '<span class="rv-th"><img class="lg" src="assets/logo-icon.webp" width="452" height="377" alt="" loading="lazy"></span>';
    }
    function item(x) {
      var chg = x.prev || x.product ? '<p class="rv-chg">' + (x.prev ? esc(x.prev) + '<span class="ar" aria-label="에서">→</span>' : '') + esc(x.product || '') + '</p>' : '';
      return '<article class="rv" id="rv-' + esc(x.id) + '">' + thumb(x) +
        '<div class="rv-bd">' +
        '<p class="rv-top"><span class="rv-type">' + esc(x.type || '') + '</span>' + (x.region ? '<span>' + esc(x.region) + '</span>' : '') + stars(x.rating) + EX + '</p>' +
        (x.title ? '<h3 class="rv-tt">' + esc(x.title) + '</h3>' : '') +
        (x.incentive ? '<span class="rv-inc">사은품을 받고 쓴 후기예요</span>' : '') +
        '<p class="rv-tx">' + esc(x.body) + '</p><button type="button" class="rv-more" hidden>더보기</button>' +
        chg +
        '<p class="rv-meta">' + esc(x.name || '') + ' · ' + when(x.date) + '</p>' +
        (x.tags && x.tags.length ? '<p class="rv-tags">' + x.tags.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</p>' : '') +
        '</div></article>';
    }
    function draw() {
      tabsEl.innerHTML = tabs(list, cur); tabsEl.hidden = !tabsEl.innerHTML;
      listEl.innerHTML = pick(list, cur).map(item).join('');
      // 두 줄을 넘는 글만 '더보기'
      Array.prototype.forEach.call(listEl.querySelectorAll('.rv'), function (a) {
        var tx = a.querySelector('.rv-tx'), mb = a.querySelector('.rv-more');
        if (tx.scrollHeight > tx.clientHeight + 2) mb.hidden = false;
      });
    }
    tabsEl.addEventListener('click', function (e) { var b = e.target.closest('[data-rvt]'); if (!b) return; cur = b.getAttribute('data-rvt'); draw(); });
    listEl.addEventListener('click', function (e) {
      var b = e.target.closest('.rv-more'); if (!b) return;
      var a = b.closest('.rv'), on = a.classList.toggle('open');
      b.textContent = on ? '접기' : '더보기';
    });
    draw();
    if (location.hash && location.hash.indexOf('#rv-') === 0) { var t = document.getElementById(location.hash.slice(1)); if (t) { t.classList.add('open', 'hl'); var mb = t.querySelector('.rv-more'); if (mb) mb.textContent = '접기'; setTimeout(function () { t.scrollIntoView({ block: 'center' }); }, 60); } }
  });
})();
