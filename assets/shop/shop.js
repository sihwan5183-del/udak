/* =========================================================
   /shop — 올리브영 배치로 바꾼 스토어 (20261022 사장님 실험 페이지 landing.uplusdak.com/shop)
   · 스토어 엔진(store.js)은 그대로 쓰고 '홈 화면 + 위 탭 화면 + 카테고리 + 하단 탭'만 이 파일이 그림
     → 상세·신청서·검색·찜·팝업·가격 계산·신청 저장(유닥 시트)은 /store 와 똑같음
       (신청 경로 표시만 '온라인 상담 신청 · /shop' 처럼 뒤에 /shop 이 붙음 — shop.html 의 srcTag)
   · 20261022 사장님: 카테고리는 대 > 중 > 소 로 갈 수 있게 — 올리브영 배치를 기준으로 통신업에 맞게
       위 탭(올리브영 홈·오특·랭킹·세일·기획전·이벤트·AI픽 자리)
         = 홈 · 특가(이번주 특가 + 기기값 0원 합침) · 인기 모델 · 혜택/이벤트 · AI추천
           (+ 사전예약: 따로 떨어진 탭 — 캠페인 있을 때만 PRE 를 켬)
       하단 '카테고리'(올리브영 카테고리 화면) = 대분류 → 중분류 → 소분류
         휴대폰 → 아이폰·갤럭시 S·폴더블 → 모델 / TV프리 → 모델 / 혜택 → 지원금·특별 혜택·결합할인·멤버십
         / 이용안내 → 구매 가이드·자주 묻는 질문(→ 질문 종류)·매장·전화·카톡·고객 후기
   · 화면 주소: 홈 #/ · 특가 #/t/deal · 인기 모델 #/t/rank · 혜택/이벤트 #/t/event · AI추천 #/t/ai
               카테고리 #/c(/대분류) · 분류 목록 #/t/list/종류(/모델,모델) — 예전 #/t/zero → 특가, #/t/tv → 혜택/이벤트
   · 문구는 관리자(스토어 설정)·스토어에 있는 그대로 (새로 넣은 말: 탭 이름 '특가'·'혜택/이벤트'·'AI추천', 카테고리 이름, AI추천 상황 문구 — 사장님 확인용)
   · 설정(가격표·노출)을 받기 전엔 회색 자리만 — 다른 내용이 잠깐 떴다가 바뀌지 않게
   ========================================================= */
(function(){
'use strict';

var SVG_SEARCH='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>';
var SVG_BELL='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/></svg>';
var SVG_PLUS='<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M5 1.25v7.5M1.25 5h7.5"/></svg>';   // 올리브영 + 크기 8.67
var SVG_CHEV='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
var SVG_HEART='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/></svg>';
var SVG_FORM='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9zM9 12l2 2 4-4"/></svg>';
var SVG_BACK='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
var SVG_R='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>';
var SVG_UP='<svg viewBox="0 0 24 10" aria-hidden="true"><path d="M2 8.5 12 2.5l10 6"/></svg>';
var SVG_SPARK='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0c.4 3.9 2.1 6.6 8 8-5.9 1.4-7.6 4.1-8 8-.4-3.9-2.1-6.6-8-8C5.9 6.6 7.6 3.9 8 0z"/></svg>';

/* 하단 탭 6개 (올리브영: 홈 · 카테고리 · 발견 · 올영매장 · 좋아요 · 마이) — 카테고리는 /shop 카테고리 화면(#/c) */
var TABBAR=
'<nav class="tabbar oy-tab" id="tabbar">'+
  '<a href="#/" data-tab="home"><svg class="ico" viewBox="0 0 24 24"><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z"/></svg>홈</a>'+
  '<a href="#/c" data-tab="cat"><svg class="ico" viewBox="0 0 24 24"><path d="M3.5 5.5h17M3.5 12h17M3.5 18.5h17"/></svg>카테고리</a>'+
  '<a href="#/search" data-tab="search"><svg class="ico" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>검색</a>'+
  '<a href="javascript:void 0" data-open="store" data-tab="store"><svg class="ico" viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>매장</a>'+
  '<a href="#/wish" data-tab="wish"><svg class="ico" viewBox="0 0 24 24"><path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/></svg>찜</a>'+
  '<a href="javascript:void 0" data-open="consult" data-tab="consult"><svg class="ico" viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9zM9 12l2 2 4-4"/></svg>상담신청</a>'+
'</nav>';

var HOME=
'<main class="view on oy" id="v-home">'+
  '<div class="oy-top">'+
    /* 로고줄 — 20261022 사장님: 우리 로고(유플러스 다이렉트 + U+ 상자, 링크 공유 그림과 같은 것) · 아래로 내리면 숨고 올리면 나옴 (올리브영) */
    '<header class="oy-hd">'+
      '<a class="oy-logo" href="#/" data-home aria-label="유플러스 다이렉트 홈"><img src="/assets/shop/logo-shop.png" alt="유플러스 다이렉트" width="159" height="22"></a>'+
      '<div class="oy-hd-r">'+
        '<button type="button" class="oy-ib" data-go="search" aria-label="검색">'+SVG_SEARCH+'</button>'+
        '<button type="button" class="oy-ib" data-open="noti" aria-label="알림">'+SVG_BELL+'<i class="dot-new"></i></button>'+
      '</div>'+
    '</header>'+
    '<nav class="oy-gnb" id="oyGnb" aria-label="메뉴"></nav>'+
    /* 카테고리·분류 목록 화면 윗줄: (뒤로) 제목 · 검색 */
    '<div class="oy-subhd">'+
      '<button type="button" class="oy-ib oy-back" data-back aria-label="뒤로">'+SVG_BACK+'</button>'+
      '<h1 class="oy-subhd-t" id="oySubT"></h1>'+
      '<button type="button" class="oy-ib" data-go="search" aria-label="검색">'+SVG_SEARCH+'</button>'+
    '</div>'+
  '</div>'+
  /* ── 홈 ── */
  '<div class="oy-pane" data-pane="home" id="oyPaneHome">'+
    '<section class="oy-bn" id="hero" aria-label="메인 배너">'+
      '<div class="oy-bn-track" id="oyBn"></div>'+
      '<div class="oy-bn-cnt" id="oyBnCnt" aria-hidden="true"></div>'+
      '<button type="button" class="oy-bn-all" id="oyBnAll" aria-label="배너 전체보기" hidden>'+SVG_PLUS+'</button>'+
    '</section>'+
    '<section class="oy-qm" aria-label="바로가기"><div class="oy-qm-sc"><div class="oy-qm-row" id="models"></div><div class="oy-qm-row" id="quick"></div></div></section>'+
    '<section class="oy-band" id="trust" aria-label="안내 배너"><div class="oy-band-vp"><div class="oy-band-track" id="oyBand"></div></div><div class="oy-dots" id="oyBandDots" aria-hidden="true"></div></section>'+
    '<section class="oy-sec" id="popSec"><div class="oy-sec-h"><h2 id="oyPopT"></h2></div><div class="oy-chips" id="oyPopChips"></div><div class="oy-grid" id="oyPop"></div></section>'+
    '<section class="oy-sec" id="oyDealSec"><div class="oy-sec-h"><h2 id="oyDealT"></h2><span class="oy-sec-d" id="oyDealD"></span></div><div class="oy-big" id="oyDeal"></div></section>'+
    '<section class="oy-sec" id="zeroSec"><div class="oy-sec-h"><h2 id="oyZeroT"></h2></div><div class="oy-grid" id="oyZero"></div></section>'+
  '</div>'+
  /* ── 특가 (올리브영 '오특'): 이번주 특가 → 기기값 0원 → 휴대폰 전체 2열 ── */
  '<div class="oy-pane" data-pane="deal" id="oyTabDeal" hidden>'+
    '<div class="oy-dw" id="oyDlWeek">'+
      '<div class="oy-hl" id="oyDlHl"></div>'+
      '<div class="oy-th"><h2 id="oyDlT"></h2></div>'+
      '<div class="oy-list" id="oyDlList"></div>'+
    '</div>'+
    '<section class="oy-dz" id="oyDlZero" hidden><div class="oy-th"><h2 id="oyDzT"></h2></div><div class="oy-list" id="oyDzList"></div></section>'+
    '<section class="oy-sec"><div class="oy-sec-h oy-dl-h"><h2 id="oyDlGT"></h2><span class="oy-sort-w" id="oyDlSort"></span></div><div class="oy-chips" id="oyDlChips"></div><div class="oy-g2" id="oyDlGrid"></div></section>'+
  '</div>'+
  /* ── 인기 모델 (올리브영 '랭킹') ── */
  '<div class="oy-pane" data-pane="rank" id="oyTabRank" hidden>'+
    '<div class="oy-sub"><b id="oyRkSub"></b></div>'+
    '<div class="oy-chips oy-rk-chips" id="oyRkChips"></div>'+
    '<div class="oy-frow"><span class="oy-frow-l" id="oyRkNote"></span><span class="oy-frow-r" id="oyRkMnp"></span></div>'+
    '<div class="oy-g2" id="oyRkGrid"></div>'+
  '</div>'+
  /* ── 혜택/이벤트 (올리브영 '이벤트'): TV프리 큰 카드 → 혜택 바로가기 알약 → TV프리 대상 안내 ── */
  '<div class="oy-pane" data-pane="event" id="oyTabEvent" hidden>'+
    '<section class="oy-ev" id="oyEvSec" aria-label="혜택"><div class="oy-ev-track" id="oyEv"></div></section>'+
    '<div class="oy-pills" id="oyEvPills"></div>'+
    '<div class="oy-ev-more" id="oyEvMore"></div>'+
  '</div>'+
  /* ── AI추천 (올리브영 'AI픽'): 상황 카드 → 맞는 모델 ── */
  '<div class="oy-pane" data-pane="ai" id="oyTabAi" hidden><div class="oy-aif" id="oyAi"></div></div>'+
  /* ── 분류 목록 (카테고리 중분류 · 바로가기에서 들어옴) ── */
  '<div class="oy-pane" data-pane="list" id="oyTabList" hidden>'+
    '<div class="oy-chips oy-ls-chips" id="oyLsChips"></div>'+
    '<div class="oy-frow oy-ls-row"><span class="oy-frow-l" id="oyLsCnt"></span><span class="oy-sort-w" id="oyLsSort"></span></div>'+
    '<div class="oy-g2" id="oyLsGrid"></div>'+
  '</div>'+
  /* ── 카테고리 (올리브영 카테고리 화면): 왼쪽 대분류 · 오른쪽 중분류 → 소분류 ── */
  '<div class="oy-pane" data-pane="cat" id="oyTabCat" hidden>'+
    '<div class="oy-cp"><nav class="oy-cl" aria-label="대분류"><div class="oy-cl-in" id="oyCl"></div></nav><div class="oy-cr" id="oyCr"></div></div>'+
  '</div>'+
  '<footer class="foot" id="foot"></footer>'+
'</main>';

var A=null;   // 스토어 엔진이 넘겨주는 도구 묶음 (store.js SKIN_API) — 가격 계산·모델·문구는 /store 와 같은 함수
var BD={i:0, n:0, timer:null, t2:null, drag:null, moved:false};                 // 띠배너
var PANE='home', POPCAT='all', DLCAT='all', RKCAT='all', CD=null, bound=false;
// 사전예약 탭 — 20261022 사장님: '사전예약'은 따로 떨어진 카테고리. 캠페인이 있을 때만 on:true + href(캠페인 랜딩 주소)를 넣으면 '홈' 다음에 나옴
var PRE={on:false, nm:'사전예약', href:''};
// 메인 배너 바탕: 올리브영 배너처럼 사진 느낌의 진한 색 + 흰 글자 (아래쪽은 shop.css 에서 어둡게)
var BN_BG=['linear-gradient(160deg,#BCC9EF 0%,#7E92D4 100%)','linear-gradient(160deg,#EFC8DC 0%,#C48BB4 100%)','linear-gradient(160deg,#CEC6F1 0%,#8E81D2 100%)','linear-gradient(160deg,#F3CCD3 0%,#D68C9E 100%)'];
var BC_BG=['linear-gradient(165deg,#7B6BDF 0%,#4B3BAE 100%)','linear-gradient(165deg,#4F87EE 0%,#2350C2 100%)','linear-gradient(165deg,#EC6D99 0%,#BF3A6B 100%)'];
// TV프리 카드: 올리브영 이벤트 카드처럼 진한 바탕 + 흰 글자 (사진은 흰 둥근 칸 안 — TV프리5 사진은 바탕이 흰색)
var EV_BG=['linear-gradient(165deg,#8E9BDD 0%,#5562B3 100%)','linear-gradient(165deg,#B59BDD 0%,#7756B0 100%)','linear-gradient(165deg,#86B4DE 0%,#4B78B3 100%)'];
// AI추천 카드 바탕 (올리브영 AI픽은 사진 — 우리는 진한 색 + 제품 사진, 흰 글자)
var AI_BG=['linear-gradient(172deg,#A9B4E8 0%,#6672C4 100%)','linear-gradient(172deg,#E6B6D0 0%,#B56F9C 100%)','linear-gradient(172deg,#B7AFEA 0%,#7768C4 100%)','linear-gradient(172deg,#A6C6E8 0%,#5B87BE 100%)'];
var BD_BG={ship:'#FFF0F7', truck:'#FFF0F7', headset:'#F0FBF5', cardx:'#F2F6FF', docx:'#F6F2FF'};
var BD_C={headset:'#22B573', cardx:'#2563EB', docx:'#7C3AED', truck:'#E6007E'};
// 퀵메뉴 한 줄 이름 (20261022 사장님이 고른 것): 휴대폰은 '아이폰'·'갤럭시'를 뺀 이름, 바로가기는 이 두 개만 줄임
var QSHORT={'유닥 멤버십 가입':'유닥 멤버십', '다이렉트 특별 혜택':'특별 혜택'};
function shortNm(nm){ return String(nm||'').replace(/^(아이폰|갤럭시)\s+/,''); }
// AI추천 1차 (20261022 사장님: 올리브영 'AI픽' 배치) — 상황 → 지금 파는 모델 (숨김·품절·이미 나온 모델은 건너뛰고 다음 후보)
//   ※ 상황 문구는 임시(사장님 확인 필요). 지금은 정해 둔 순서대로 고르는 방식 — 진짜 AI 연결은 사장님 OK 후
var AI_PICKS=[
  {t:'큰 화면을 원한다면',             ids:['iphone18promax','s26ultra','fold8ultra']},
  {t:'사진을 많이 찍는다면',           ids:['s26ultra','iphone18pro']},
  {t:'접는 폰이 궁금하다면',           ids:['fold8','fold8ultra']},
  {t:'작게 접어서 들고 다니려면',       ids:['flip8']},
  {t:'아이폰을 원한다면',              ids:['iphone18pro','iphone17','iphone18promax']},
  {t:'기기값 부담을 줄이고 싶다면',     cheap:true},
  {t:'U+ 인터넷TV를 이용하고 있다면',   tv:true}
];

function $(s){ return document.querySelector(s); }
function E(s){ return A.esc(s); }
function two(n){ return ('0'+n).slice(-2); }
function hms(t){ return two(Math.floor(t/3600))+':'+two(Math.floor(t%3600/60))+':'+two(t%60); }
function n0(n){ return Number(n).toLocaleString('ko-KR'); }
function homeOn(){ var v=document.getElementById('v-home'); return !!(v && v.classList.contains('on')); }
// 같은 내용이면 다시 그리지 않음 (사진이 깜빡이지 않게)
function put(el, html){ if(!el || el.__h===html) return false; el.innerHTML=html; el.__h=html; return true; }
function sk(w,h,r){ return '<i class="oy-sk" style="width:'+w+';height:'+h+(r?';border-radius:'+r:'')+'"></i>'; }
// 사진: 파일이 없으면 스토어와 같은 순서로 다른 확장자를 찾아봄 (store.js __stPh)
function img(path, cls, eager){
  if(!path) return '';
  return '<img class="'+(cls||'')+'" src="'+E(A.imgSrc(path))+'" alt="" '+(eager?'':'loading="lazy" ')+'decoding="async" data-ph="'+E(path)+'" data-lb="" onerror="__stPh(this)">';
}
function href(go){ go=String(go||''); return go.charAt(0)==='#'?go:'javascript:void 0'; }
// 20261026 관리자(/apple = /shop 거울): 누르면 고치는 칸 표시 — 고객 화면에선 아무것도 안 붙음
function ed(k){ return (A && A.EDIT) ? ' data-edit="'+E(k)+'"' : ''; }
function hc(x){ return (A && A.EDIT) ? A.hidCls(x) : ''; }
function edAt(sel, k){ var el=$(sel); if(el && A && A.EDIT) el.setAttribute('data-edit', k); }
function editingNow(){ return !!(A && A.EDIT && document.body.classList.contains('editing')); }
function modelOf(go){ var id=(String(go||'').match(/^#\/model\/([\w-]+)/)||[])[1]; return id?A.byId(id):null; }
function dealTitle(){ return String((A.S.deal||{}).title||'이번주 특가').replace(/^이번 주 /,'이번주 '); }
function catNm(k){ var t=A.CAT_TABS.filter(function(x){ return x.k===k; })[0]; return t?t.nm:k; }
function catsOf(list){ return A.CAT_TABS.filter(function(t){ return t.k!=='all' && t.k!=='zero' && list.some(function(m){ return m.cat.indexOf(t.k)>-1; }); }); }
function zeroList(){ var L=A.S.lists||{}; return (L.zero&&L.zero.length)?A.pickList('zero'):A.models().filter(function(m){ return m.cat.indexOf('zero')>-1; }); }
function zeroOn(){ return A.secOn('zero') && zeroList().length>0; }
function tvList(){ return A.models().filter(function(m){ return A.isTv(m); }); }
function dealIds(){ var D=A.S.deal||{}; return D.on?A.dealItems().map(function(x){ return x.m.id; }):[]; }
function quickBy(go){ return A.vis(A.S.quick||[]).filter(function(q){ return q.go===go; })[0]||null; }
function qNm(go, def){ var q=quickBy(go); return (q&&q.nm)||def; }
// 혜택/이벤트 알약: 관리자 퀵메뉴의 '다이렉트 특별 혜택 · 지원금 혜택 · 유닥 멤버십 가입 · 구매 가이드 · QNA' (이름·아이콘·색 그대로)
function evPills(){ return ['special','subsidy','soon','guide','qna'].map(quickBy).filter(Boolean); }
// '#/cat/종류(/모델,모델)' (스토어 카테고리 주소 — 관리자 바로가기·배너·팝업 버튼) → /shop 분류 목록 '#/t/list/…'
function catToList(h){ var m=String(h||'').match(/^#\/cat\/([\w-]+)?(?:\/([\w,-]+))?/); return '#/t/list/'+((m&&m[1])||'all')+(m&&m[2]?'/'+m[2]:''); }

/* ---------- 위 탭: 홈 · (사전예약) · 특가 · 인기 모델 · 혜택/이벤트 · AI추천 (내용이 없는 탭은 숨김) ---------- */
function tabs(wait){
  var out=[{k:'home', nm:'홈', href:'#/'}];
  if(wait) return out;
  if(PRE.on && PRE.href) out.push({k:'pre', nm:PRE.nm, href:PRE.href});
  if(dealIds().length || zeroOn()) out.push({k:'deal', nm:'특가', href:'#/t/deal'});
  if(A.phones().length) out.push({k:'rank', nm:qNm('popular','인기 모델'), href:'#/t/rank'});
  if(tvList().length || evPills().length) out.push({k:'event', nm:'혜택/이벤트', href:'#/t/event'});
  if(A.phones().length) out.push({k:'ai', nm:'AI추천', href:'#/t/ai'});
  return out;
}
function paneOfHash(){
  var h=String(location.hash||'');
  if(/^#\/c(\/|$)/.test(h)) return 'cat';
  var m=h.match(/^#\/t\/(deal|rank|event|ai|list|zero|tv)\b/); if(!m) return 'home';
  return {zero:'deal', tv:'event'}[m[1]]||m[1];   // 예전 주소(기기값 0원 · TV프리 탭) → 합쳐진 탭
}
// 지금 보여 줄 화면: 주소 기준 — 설정을 받은 뒤 내용이 없는 탭이면 홈 (받기 전엔 주소대로 회색 자리)
function pickPane(wait){ var p=paneOfHash(); if(p==='cat'||p==='list') return p; if(!wait && !tabs(false).some(function(t){ return t.k===p; })) p='home'; return p; }
function renderGnb(wait){
  var h=tabs(wait).map(function(t){ var on=t.k===PANE; return '<a href="'+E(t.href)+'"'+(t.k==='home'?' data-home':'')+(on?' class="on" aria-current="page"':'')+'>'+E(t.nm)+'</a>'; }).join('');
  if(wait) h+=sk('34px','16px','4px')+sk('68px','16px','4px')+sk('84px','16px','4px')+sk('52px','16px','4px');
  put($('#oyGnb'), h);
}
function showPane(){
  var p=PANE, sub=p==='cat'||p==='list';
  Array.prototype.forEach.call(document.querySelectorAll('#v-home .oy-pane'),function(el){ el.hidden=el.getAttribute('data-pane')!==p; });
  var top=$('.oy-top');
  if(top){ top.classList.toggle('ln', p!=='home'); top.classList.toggle('sub', sub); top.classList.toggle('subc', p==='cat'); if(sub) top.classList.remove('hide'); }   // 탭 화면은 탭 메뉴 아래 줄 (올리브영과 같음)
  var v=$('#v-home'); if(v) v.classList.toggle('oy-catv', p==='cat');   // 카테고리 화면은 맨 아래 정보 숨김
  if(p==='cat') put($('#oySubT'),'카테고리'); else if(p==='list') put($('#oySubT'),E(lsTitle(lsOfHash())));
  tabOn(sub?'cat':'home');
  if(p==='rank' && A && A.RANK==null && !A.prWait()) A.loadRank();
  if(p==='home') carLayout(BN,null);
  if(p==='event') carLayout(EV,null);
}

/* ---------- 넘기는 배너 (메인 배너 · TV프리 카드) — 가운데 1장 + 양옆 살짝 ---------- */
// 자리(d): 0 = 가운데, -1/+1 = 양옆(작게 살짝 보임), 그 밖 = 화면 밖
function Car(o){ return {o:o, i:0, lo:-1, n:0, timer:null, drag:null, moved:false}; }
var BN=Car({track:'#oyBn', cnt:'#oyBnCnt', w:.92, gap:.0144, s:.88, pane:'home'});   // 메인 배너: 화면 폭 92% · 옆 88%
var EV=Car({track:'#oyEv', cnt:null, w:.8067, gap:.0257, s:.849, pane:'event'});      // 혜택/이벤트(TV프리 카드): 화면 폭 80.67% · 옆 85% (올리브영 이벤트 탭)
function carGeo(c){ var t=$(c.o.track), W=t?t.clientWidth:0; return {W:W, w:W*c.o.w, gap:W*c.o.gap, sw:W*c.o.w*c.o.s}; }
function carPos(c,g,d){ if(d===0) return {x:(g.W-g.w)/2, s:1}; var cx=g.W/2+(d>0?1:-1)*(g.w/2+g.gap+g.sw/2+(Math.abs(d)-1)*(g.sw+g.gap)); return {x:cx-g.w/2, s:c.o.s}; }
function carPut(c,el,g,d,anim,dx){
  var p=carPos(c,g,d); el.classList.toggle('nt',!anim); el.classList.add('ok');
  el.style.transform='translate3d('+(p.x+(dx||0)).toFixed(1)+'px,0,0) scale('+p.s+')'; el.__d=d;
  var on=d===0; el.setAttribute('aria-hidden',on?'false':'true'); el.tabIndex=on?0:-1;
}
// dir: +1 다음 · -1 이전 · 0 제자리로(손 뗐을 때) · null 바로 그 자리에 / dx: 손가락으로 끄는 중
function carLayout(c, dir, dx){
  var tr=$(c.o.track); if(!tr) return;
  var sl=tr.querySelectorAll('[data-i]'), n=sl.length, g=carGeo(c); if(!n || !g.W) return;   // 안 보일 땐 다음에
  var v=document.getElementById('v-home'); if(v && v.__W!==g.W){ v.style.setProperty('--W', g.W+'px'); v.__W=g.W; }
  Array.prototype.forEach.call(sl,function(el){
    var i=+el.getAttribute('data-i'), t=((i-c.i-c.lo)%n+n)%n+c.lo, p=el.__d;
    if(dx!=null){ carPut(c,el,g,p==null?t:p,false,dx); return; }
    if(p==null || dir==null){ carPut(c,el,g,t,false); return; }
    if(!dir || t===p || t===p-dir){ carPut(c,el,g,t,true); return; }
    var pv=Math.abs(p)<=1, tv=Math.abs(t)<=1;
    if(!tv){ if(pv && Math.abs(p-dir)>=2) carPut(c,el,g,p-dir,true); else carPut(c,el,g,t,false); return; }   // 화면 밖으로 나감
    carPut(c,el,g,t+dir,false); void el.offsetWidth; carPut(c,el,g,t,true);                                    // 반대쪽에서 들어옴
  });
  var rn=c.rn||n; if(c.o.cnt) put($(c.o.cnt), '<b>'+two(c.i%rn+1)+'</b><i></i><span>'+two(rn)+'</span>');   // rn: 진짜 장 수 (2장을 두 번 붙였을 때)
}
function carGo(c, dir){
  var n=c.n; if(n<2) return;
  c.i=((c.i+dir)%n+n)%n;
  c.lo=n>=3?Math.max(-(n-2),Math.min(-1,c.lo-dir)):Math.max(-1,Math.min(0,c.lo-dir));
  carLayout(c,dir);
}
function carAuto(c){ clearInterval(c.timer); if(A && A.EDIT) return; if(c.n>1) c.timer=setInterval(function(){ if(!document.hidden && !c.drag && homeOn() && PANE===c.o.pane) carGo(c,1); },4000); }
function carSet(c, html, n, rn){ c.rn=rn||n; if(put($(c.o.track),html)){ c.n=n; if(c.i>=n) c.i=0; c.lo=n>=3?-1:0; carLayout(c,null); } carAuto(c); }

/* ---------- 홈: 메인 배너 (스토어 히어로 슬라이드 + 프로모 배너) ---------- */
/* 20261023 사장님: 메인 배너는 사장님이 만든 통이미지(글씨까지 그림 안에 있는 배너)만 — 배너 위 글씨·어두운 그라데이션·바탕색 없이 그림 그대로
   20261026: 코드에 박혀 있던 배너를 관리자 설정(스토어 설정 bn)으로 옮김 → 관리자(/apple)에서 그림·순서·누르면 가는 곳·숨기기
   처음 값(1 유플러스 다이렉트 · 2 통신이 쉬우면 안돼? · 3 폴드 가격도 반으로 접히다)은 store.js DEFAULT.bn · 그림은 assets/store/banner/ */
function bannerList(){
  var S=A.S, out=A.vis(S.hero||[]).map(function(h){
    var m=modelOf(h.go);   // 설명이 비어 있으면 연결된 모델의 소개 문구 (관리자에 있는 그대로)
    return {tag:'', l1:h.k||'', l2:h.t||'', s:h.s||(m&&m.ds)||'', img:h.img||'', go:h.go||''};
  });
  var p=S.promo; if(p && !p.hidden && (p.t||p.img)) out.push({tag:p.tag||'', l1:p.t||'', l2:'', s:p.s||'', img:p.img||'', go:p.go||''});
  var bn=A.vis(S.bn||[]).filter(function(b){ return b && (b.img || A.EDIT); });   // 관리자에선 숨긴 배너·그림 없는 배너도 보임 (흐리게)
  if(bn.length) return bn.map(function(b){ return {full:true, img:b.img||'', nm:b.nm||'', go:b.go||'', ref:S.bn.indexOf(b), hid:!!b.hidden}; });
  return out;
}
function renderBanner(wait){
  if(wait){ clearInterval(BN.timer); BN.n=0; BN.list=[]; put($('#oyBn'),'<span class="oy-sl oy-sl-sk"></span>'); put($('#oyBnCnt'),''); $('#oyBnAll').hidden=true; return; }
  var list=bannerList(), n=list.length, show=n===2?list.concat(list):list;   // 20261022 사장님: 2장이면 양옆이 다 보이게 한 번 더 붙임 (올리브영처럼 좌우 배너)
  BN.list=list;
  carSet(BN, show.map(function(b,j){
    var i=j%n;   // j: 자리 번호 · i: 진짜 배너 번호
    if(b.full) return '<a class="oy-sl full'+(b.hid?' is-hidden':'')+'" href="'+E(href(b.go))+'" data-i="'+j+'" data-go="'+E(b.go)+'"'+ed('bn:'+b.ref)+'>'+
      (b.img?'<img class="oy-sl-full" src="'+E(A.imgSrc(b.img))+'" alt="'+E(b.nm)+'" decoding="async" draggable="false">':'<span class="oy-sl-none">배너 그림 없음 · 눌러서 넣기</span>')+'</a>';   // 20261023 통이미지
    return '<a class="oy-sl" href="'+E(href(b.go))+'" data-i="'+j+'" data-go="'+E(b.go)+'" style="background:'+BN_BG[i%BN_BG.length]+'">'+img(b.img,'oy-sl-im',true)+
      '<span class="oy-sl-t">'+(b.tag?'<span class="oy-sl-tag">'+E(b.tag)+'</span>':'')+
        '<span class="oy-sl-h">'+(b.l1?'<b>'+E(b.l1)+'</b>':'')+(b.l2?'<b class="pk">'+E(b.l2)+'</b>':'')+'</span>'+
        (b.s?'<span class="oy-sl-s">'+E(b.s)+'</span>':'')+'</span></a>';
  }).join(''), show.length, n);
  $('#oyBnAll').hidden=list.length<2;
}
function bnAll(){
  if(!BN.list || !BN.list.length) return;
  A.openSheet('<h3>전체보기</h3><div class="oy-all">'+BN.list.map(function(b,i){
    if(b.full) return '<a class="oy-all-it" href="'+E(href(b.go))+'" data-go="'+E(b.go)+'"'+ed('bn:'+b.ref)+'><span class="oy-all-im full">'+(b.img?'<img src="'+E(A.imgSrc(b.img))+'" alt="" decoding="async">':'')+'</span><span class="oy-all-tx"><b>'+E(b.nm)+'</b></span></a>';   // 20261023 통이미지
    return '<a class="oy-all-it" href="'+E(href(b.go))+'" data-go="'+E(b.go)+'"><span class="oy-all-im" style="background:'+BN_BG[i%BN_BG.length]+'">'+img(b.img,'',true)+'</span>'+
      '<span class="oy-all-tx">'+(b.tag?'<small class="pk">'+E(b.tag)+'</small>':'')+'<b>'+E([b.l1,b.l2].filter(Boolean).join(' '))+'</b>'+(b.s?'<small>'+E(b.s)+'</small>':'')+'</span></a>';
  }).join('')+'</div>');
}

/* ---------- 홈: 퀵메뉴 2줄 (휴대폰 / 바로가기) — 이름 한 줄 ---------- */
function renderQuick(wait){
  if(wait){ var s=''; for(var k=0;k<6;k++) s+='<span class="oy-qi"><span class="oy-qi-ic oy-skb"></span><span class="oy-qi-t">'+sk('36px','11px','4px')+'</span></span>';
    put($('#models'),s); put($('#quick'),s); return; }
  put($('#models'), A.phones().map(function(m,i){
    var so=A.SO(m);
    return '<a class="oy-qi'+hc(m)+'" href="#/model/'+E(m.id)+'"'+ed('model:'+m.id)+'><span class="oy-qi-ic">'+img(A.mImg(m),'oy-qi-im',i<6)+(so?'<i class="oy-so">품절</i>':'')+'</span><span class="oy-qi-t">'+E(shortNm(m.nm))+'</span></a>';
  }).join(''));
  put($('#quick'), A.vis(A.S.quick||[]).map(function(q){
    return '<a class="oy-qi'+hc(q)+'" href="'+E(href(q.go))+'" data-go="'+E(q.go||'')+'"'+ed('quick:'+A.S.quick.indexOf(q))+'><span class="oy-qi-ic"><svg viewBox="0 0 24 24" aria-hidden="true" style="stroke:'+E(q.c||'#131518')+'">'+(A.QI[q.ic]||A.QI.star)+'</svg></span><span class="oy-qi-t">'+E(QSHORT[q.nm]||q.nm)+'</span></a>';
  }).join(''));
}

/* ---------- 홈: 띠배너 (당일 택배 발송 남은 시간 + 관리자 '신뢰' 문구) ---------- */
function bandList(){
  var S=A.S, out=[], shipOn=!!(S.ship && S.ship.on);
  if(shipOn){
    var st=A.shipState();   // 스토어 당일 발송 카드와 같은 문구
    out.push(st.today
      ? {k:'ship', ek:'ship', go:'guide', l1:E('오늘 '+A.cutLabel()+'까지 구매확정'), l2:'당일 택배 발송 · 발송 마감까지 <b class="oy-cd"></b>', im:'/assets/store/ship/truck.webp'}
      : {k:'ship', ek:'ship', go:'guide', l1:'지금 구매확정하시면', l2:'<b>'+E(st.when)+'</b> 택배 발송 · 순차 발송', im:'/assets/store/ship/truck.webp'});
  }
  A.vis(S.trust||[]).forEach(function(t){
    if(t.ic==='truck' && shipOn) return;   // 당일 발송은 위 칸(남은 시간)으로 보여 줌
    out.push({k:t.ic, ek:'trust:'+S.trust.indexOf(t), hid:!!t.hidden, go:t.ic==='headset'?'contact':'guide', l1:E(t.b), l2:E(t.s),
      im:t.ic==='headset'?'/assets/store/ship/ico-call.webp':t.ic==='truck'?'/assets/store/ship/truck.webp':'', svg:A.TI[t.ic]||A.TI.headset});
  });
  return out;
}
function bdOne(b, clone){
  return '<a class="oy-bd oy-bd-'+E(b.k)+(b.hid&&A.EDIT?' is-hidden':'')+'" href="javascript:void 0" data-go="'+E(b.go)+'"'+(b.ek?ed(b.ek):'')+' style="background:'+(BD_BG[b.k]||'#F4F5F7')+'"'+(clone?' data-clone aria-hidden="true" tabindex="-1"':'')+'>'+
    '<span class="oy-bd-tx"><b class="oy-bd-l1">'+b.l1+'</b><span class="oy-bd-l2">'+b.l2+'</span></span>'+
    (b.im?'<img class="oy-bd-im" src="'+b.im+'" alt="" decoding="async">':'<span class="oy-bd-ic" style="color:'+(BD_C[b.k]||'#131518')+'"><svg viewBox="0 0 24 24" aria-hidden="true">'+b.svg+'</svg></span>')+'</a>';
}
function renderBand(wait){
  var tr=$('#oyBand'); clearInterval(BD.timer); clearInterval(CD);
  if(wait){ if(put(tr,'<span class="oy-bd oy-bd-sk"></span>')){ BD.n=0; BD.i=0; bdShow(false); } return; }
  var list=bandList(), n=list.length;
  $('#trust').hidden=!n;
  // 끝에 첫 칸을 하나 더 붙여서 마지막 → 처음으로 넘어갈 때도 같은 방향으로 이어지게
  if(put(tr, list.map(function(b){ return bdOne(b,false); }).join('')+(n>1?bdOne(list[0],true):'')) || BD.n!==n){ BD.n=n; if(BD.i>=n) BD.i=0; bdShow(false); }
  if(tr.querySelector('.oy-cd')){ bdTick(); CD=setInterval(bdTick,1000); }
  if(n>1 && !A.EDIT) BD.timer=setInterval(function(){ if(!document.hidden && !BD.drag && homeOn() && PANE==='home') bdGo(1); },4000);   // 관리자에선 멈춤
}
function bdTick(){
  var els=document.querySelectorAll('#oyBand .oy-cd'); if(!els.length) return;
  var st=A.shipState(); if(!st.today){ clearInterval(CD); renderBand(false); return; }   // 마감이 지나면 '지금 구매확정하시면'으로
  var s=hms(st.left); Array.prototype.forEach.call(els,function(e){ if(e.textContent!==s) e.textContent=s; });
}
function bdShow(anim, dx){
  var tr=$('#oyBand'); if(!tr) return;
  tr.classList.toggle('nt',!anim);
  tr.style.transform='translate3d(calc('+(-BD.i*100)+'% + '+(dx||0)+'px),0,0)';
  var k=BD.n?BD.i%BD.n:0, dw=$('#oyBandDots'), want=BD.n>1?BD.n:0;
  if(dw.children.length!==want){ var ds=''; for(var j=0;j<want;j++) ds+='<i></i>'; dw.innerHTML=ds; }
  Array.prototype.forEach.call(dw.children,function(d,j){ d.classList.toggle('on',j===k); });
  Array.prototype.forEach.call(tr.children,function(el,j){ if(el.hasAttribute('data-clone')) return;
    if(j===k){ el.removeAttribute('aria-hidden'); el.removeAttribute('tabindex'); } else { el.setAttribute('aria-hidden','true'); el.setAttribute('tabindex','-1'); } });
}
function bdGo(dir){
  var n=BD.n, tr=$('#oyBand'); if(n<2 || !tr) return;
  clearTimeout(BD.t2);
  if(dir>0){
    if(BD.i>=n){ BD.i=0; bdShow(false); void tr.offsetWidth; }
    BD.i++; bdShow(true);
    if(BD.i>=n) BD.t2=setTimeout(function(){ BD.i=0; bdShow(false); },470);   // 붙여 둔 첫 칸 → 진짜 첫 칸 (눈에 안 보이게)
  } else {
    if(BD.i<=0){ BD.i=n; bdShow(false); void tr.offsetWidth; }
    BD.i--; bdShow(true);
  }
}

/* ---------- 상품 카드 · 가격 · 태그 (가격은 스토어 카드와 같은 계산) ---------- */
function priceOf(m){ var p=A.priceOf(m); return p.v==null?{ask:A.tagsOf(m)[0]||'상담 시 안내'}:{v:p.v, out:p.out, from:p.from, pct:p.v>0?A.pctOf(p):0}; }
function vHtml(v, from){ return '<span class="oy-v">'+n0(v)+'<small>원</small>'+(from?'<i>~</i>':'')+'</span>'; }
// 태그: 스토어 카드에 있는 말 그대로 (당일발송 · 제휴카드 X · 부가서비스 X / TV프리는 약정 36개월)
function tagsHtml(m, max, noDeal){
  var t=[], so=A.SO(m);
  if(!noDeal && dealIds().indexOf(m.id)>-1) t.push('<i class="r">'+E(dealTitle())+'</i>');   // 이번주 특가 모델 (올리브영 '오특' 빨간 태그 자리)
  t.push(so?'<i>일시품절</i>':'<i class="p">당일발송</i>');
  if(A.isTv(m)) t.push('<i>약정 36개월</i>'); else { t.push('<i>제휴카드 X</i>'); t.push('<i>부가서비스 X</i>'); }
  return '<span class="oy-tags">'+t.slice(0,max||t.length).join('')+'</span>';
}
function iconsHtml(m){
  return '<span class="oy-ics"><button type="button" class="oy-heart'+(A.wished(m.id)?' on':'')+'" data-wish="'+E(m.id)+'" aria-label="찜">'+SVG_HEART+'</button>'+
    '<button type="button" class="oy-form" data-open="consult" data-model="'+E(m.id)+'" aria-label="상담 신청">'+SVG_FORM+'</button></span>';
}
// 홈 3열 카드 (올리브영 홈: 사진 · 이름 2줄 · 할인율 + 가격)
function card(m){
  var so=A.SO(m), p=priceOf(m), pr;
  if(p.ask!=null) pr='<span class="oy-card-pr"><span class="oy-ask">'+E(p.ask)+'</span></span>';
  else { pr='<span class="oy-card-pr">'+(p.pct>0?'<em>'+p.pct+'%</em>':'')+vHtml(p.v,p.from)+'</span>';
    if(p.v===0 && p.out) pr+='<s class="oy-card-s">'+E(A.won(p.out))+'</s>';
    if(A.isTv(m)) pr+='<span class="oy-card-c">약정 36개월</span>'; }
  return '<a class="oy-card'+(so?' so':'')+hc(m)+'" href="#/model/'+E(m.id)+'" data-mid="'+E(m.id)+'"'+ed('model:'+m.id)+'><span class="oy-card-im">'+img(A.mImg(m),'oy-card-img',false)+'<i class="oy-dim"></i>'+(so?'<i class="oy-so">일시품절</i>':'')+'</span>'+
    '<span class="oy-card-nm">'+E(m.nm)+'</span>'+pr+'</a>';
}
// 2열 카드 — 이번주 특가 · 인기 모델 탭 (올리브영 오특·랭킹: 사진(순위) · 이름 2줄 · 원래 가격(줄) · 할인율 + 가격 · 태그 · 찜/신청)
function card2(m, rank){
  var so=A.SO(m), p=priceOf(m), h='';
  if(p.ask!=null) h='<span class="oy-card-pr"><span class="oy-ask">'+E(p.ask)+'</span></span>';
  else h=(p.out&&p.out>p.v?'<s class="oy-card-s">'+E(A.won(p.out))+'</s>':'')+'<span class="oy-card-pr">'+(p.pct>0?'<em>'+p.pct+'%</em>':'')+vHtml(p.v,p.from)+'</span>';
  return '<div class="oy-c2'+(so?' so':'')+hc(m)+'"><a class="oy-c2-a" href="#/model/'+E(m.id)+'" data-mid="'+E(m.id)+'"'+ed('model:'+m.id)+'><span class="oy-c2-im">'+img(A.mImg(m),'oy-card-img',false)+'<i class="oy-dim"></i>'+(rank?'<b class="oy-rk">'+rank+'</b>':'')+(so?'<i class="oy-so">일시품절</i>':'')+'</span>'+
    '<span class="oy-card-nm">'+E(m.nm)+'</span>'+h+tagsHtml(m,3)+'</a>'+iconsHtml(m)+'</div>';   // 태그는 한 줄에 들어가게 3개까지
}
function skCards(n){ var h=''; for(var i=0;i<n;i++) h+='<span class="oy-card"><span class="oy-card-im oy-skb"></span><span class="oy-card-nm">'+sk('80%','12px','4px')+'</span><span class="oy-card-pr">'+sk('64%','14px','4px')+'</span></span>'; return h; }
function skCards2(n){ var h=''; for(var i=0;i<n;i++) h+='<div class="oy-c2"><span class="oy-c2-im oy-skb"></span><span class="oy-card-nm">'+sk('80%','12px','4px')+'</span><span class="oy-card-pr">'+sk('60%','14px','4px')+'</span></div>'; return h; }
function mnpPill(){
  var mnp=!!A.MNP;
  return '<span class="oy-flt" role="group" aria-label="가입 유형"><button type="button" data-mnp="1" class="'+(mnp?'on':'')+'" aria-pressed="'+mnp+'">번호이동</button><i aria-hidden="true"></i><button type="button" data-mnp="0" class="'+(mnp?'':'on')+'" aria-pressed="'+(!mnp)+'">기기변경</button>'+SVG_CHEV+'</span>';
}
function chipsHtml(cats, cur, attr){
  return [{k:'all',nm:'전체'}].concat(cats).map(function(t){ var on=cur===t.k; return '<button type="button" class="oy-chip'+(on?' on':'')+'" '+attr+'="'+E(t.k)+'" aria-pressed="'+on+'">'+E(t.nm)+'</button>'; }).join('');
}
function byCat(list, k){ return k==='all'?list:list.filter(function(m){ return m.cat.indexOf(k)>-1; }); }

/* ---------- 홈: 많이 찾아요 (스토어 '인기' 목록 · 번호이동/기기변경 + 분류 칩 · 3열) ---------- */
function renderPop(wait){
  var sec=$('#popSec');
  if(wait){ sec.hidden=false; put($('#oyPopT'),sk('190px','18px')); put($('#oyPopChips'),sk('150px','32px','16px')+sk('56px','32px','16px')+sk('64px','32px','16px')+sk('72px','32px','16px')); put($('#oyPop'),skCards(6)); return; }
  var list=A.secOn('pop')?A.pickList('pop'):[];
  sec.hidden=!list.length; if(!list.length) return;
  put($('#oyPopT'), E((A.S.sec.pop||{}).t||'')); edAt('#oyPopT','sec:pop');
  var cats=catsOf(list); if(POPCAT!=='all' && !cats.some(function(t){ return t.k===POPCAT; })) POPCAT='all';
  put($('#oyPopChips'), mnpPill()+(cats.length>1?chipsHtml(cats,POPCAT,'data-shop-cat'):''));
  put($('#oyPop'), byCat(list,POPCAT).map(card).join(''));
}

/* ---------- 홈: 이번주 특가 (올리브영 Weekly Special — 큰 카드, 가운데 흰 글자) ---------- */
function renderDeal(wait){
  var sec=$('#oyDealSec'), D=A.S.deal||{};
  if(wait){ sec.hidden=false; put($('#oyDealT'),sk('96px','18px')); put($('#oyDealD'),''); put($('#oyDeal'),'<span class="oy-bc oy-skb"></span>'); return; }
  var it=D.on?A.dealItems():[];
  sec.hidden=!it.length; if(!it.length) return;
  put($('#oyDealT'), E(dealTitle())); edAt('#oyDealT','deal');
  put($('#oyDealD'), E(A.weekRange()));
  put($('#oyDeal'), it.map(function(x,i){
    var m=x.m, so=A.SO(m);
    var pr=x.mnp!=null?'번호이동 <em>'+E(A.wz(x.mnp))+'</em>':'구매가 <em class="ask">상담 시 안내</em>';
    if(x.chg!=null) pr+=' · 기기변경 '+E(A.wz(x.chg));
    return '<a class="oy-bc'+(so?' so':'')+'" href="#/model/'+E(m.id)+'" data-mid="'+E(m.id)+'"'+ed('deal')+' style="background:'+BC_BG[i%BC_BG.length]+'"><span class="oy-bc-im">'+img(A.mImg(m),'oy-bc-img',false)+'</span>'+
      '<b class="oy-bc-t">'+E(m.nm)+'</b><span class="oy-bc-d">'+pr+'</span>'+(so?'<i class="oy-so oy-so-l">일시품절</i>':'')+'</a>';
  }).join(''));
}

/* ---------- 홈: 기기값 0원 모아보기 (스토어 '0원' 목록 · 3열) ---------- */
function renderZero(wait){
  var sec=$('#zeroSec');
  if(wait){ sec.hidden=false; put($('#oyZeroT'),sk('150px','18px')); put($('#oyZero'),skCards(3)); return; }
  var list=A.secOn('zero')?A.pickList('zero'):[];
  sec.hidden=!list.length; if(!list.length) return;
  put($('#oyZeroT'), E((A.S.sec.zero||{}).t||'')); edAt('#oyZeroT','sec:zero');
  put($('#oyZero'), list.map(card).join(''));
}


/* ---------- 탭: 특가 (올리브영 '오특': 가운데 제목 · 이번주 특가 목록 → 기기값 0원 목록 → 휴대폰 전체 2열 + 정렬) ---------- */
// 20261022 사장님: '기기값 0원'과 '이번주 특가'를 한 탭으로 합침 (0원 목록은 관리자 '기기값 0원 모아보기' 그대로)
function liRow(m, prHtml, sub, ek){
  var so=A.SO(m);
  return '<div class="oy-li'+(so?' so':'')+hc(m)+'"><a class="oy-li-a" href="#/model/'+E(m.id)+'" data-mid="'+E(m.id)+'"'+ed(ek||'model:'+m.id)+'><span class="oy-li-im">'+img(A.mImg(m),'oy-card-img',false)+'<i class="oy-dim"></i>'+(so?'<i class="oy-so">일시품절</i>':'')+'</span>'+
    '<span class="oy-li-tx"><span class="oy-li-nm">'+E(m.nm)+'</span>'+prHtml+tagsHtml(m,0,true)+(sub||'')+'</span></a>'+iconsHtml(m)+'</div>';
}
function renderTabDeal(wait){
  if(wait){ $('#oyDlWeek').hidden=false; $('#oyDlZero').hidden=true;
    put($('#oyDlHl'),sk('120px','20px')); put($('#oyDlT'),sk('150px','18px')); put($('#oyDlList'),'<div class="oy-li"><span class="oy-li-im oy-skb"></span><span class="oy-li-tx">'+sk('80%','13px','4px')+'</span></div>');
    put($('#oyDlGT'),sk('150px','18px')); put($('#oyDlSort'),''); put($('#oyDlChips'),''); put($('#oyDlGrid'),skCards2(4)); return; }
  var it=(A.S.deal||{}).on?A.dealItems():[];
  $('#oyDlWeek').hidden=!it.length;
  put($('#oyDlHl'), '<b>'+E(dealTitle())+'</b>'); edAt('#oyDlHl','deal');
  put($('#oyDlT'), E(A.weekRange()));
  put($('#oyDlList'), it.map(function(x){
    var m=x.m, out=A.priceOf(m).out, h;
    if(x.mnp!=null){ var pct=(out&&out>x.mnp&&x.mnp>0)?Math.round((out-x.mnp)/out*100):0;   // 스토어 카드와 같은 할인율 계산 (출고가 대비)
      h='<span class="oy-card-pr">'+(pct>0?'<em>'+pct+'%</em>':'')+'<span class="oy-v">'+(x.mnp===0?'0':n0(x.mnp))+'<small>원</small></span>'+(out&&out>x.mnp?'<s>'+E(A.won(out))+'</s>':'')+'</span>'; }
    else h='<span class="oy-card-pr"><span class="oy-ask">상담 시 안내</span></span>';
    return liRow(m, h, x.mnp!=null?'<span class="oy-li-sub"><span>번호이동 기준</span>'+(x.chg!=null?' · <span>기기변경 '+E(A.wz(x.chg))+'</span>':'')+'</span>':'', 'deal');
  }).join(''));
  // 기기값 0원 (관리자 '기기값 0원 모아보기' 목록 · 제목 그대로)
  var zl=zeroOn()?zeroList():[];
  $('#oyDlZero').hidden=!zl.length;
  put($('#oyDzT'), E((A.S.sec.zero||{}).t||catNm('zero'))); edAt('#oyDzT','sec:zero');
  put($('#oyDzList'), zl.map(function(m){
    var p=priceOf(m), h, st=A.SO(m)?'':A.stripOf(m);
    if(p.ask!=null) h='<span class="oy-card-pr"><span class="oy-ask">'+E(p.ask)+'</span></span>';
    else h='<span class="oy-card-pr">'+(p.pct>0?'<em>'+p.pct+'%</em>':'')+vHtml(p.v,p.from)+(p.out&&p.out>p.v?'<s>'+E(A.won(p.out))+'</s>':'')+'</span>';
    return liRow(m, h, st?'<span class="oy-li-sub"><span>'+E(st)+'</span></span>':'');
  }).join(''));
  // 아래 2열: 스토어 '내게 맞는 휴대폰 찾기'(휴대폰 전체) + 스토어 정렬(추천순·낮은가격순·높은가격순·판매량순)
  var ph=A.phones(), cats=catsOf(ph); if(DLCAT!=='all' && !cats.some(function(t){ return t.k===DLCAT; })) DLCAT='all';
  put($('#oyDlGT'), E((A.S.sec.pick||{}).t||'')); edAt('#oyDlGT','sec:pick');
  put($('#oyDlSort'), sortBtn());
  put($('#oyDlChips'), mnpPill()+(cats.length>1?chipsHtml(cats,DLCAT,'data-dl-cat'):''));
  put($('#oyDlGrid'), A.sortList(byCat(ph,DLCAT)).map(function(m){ return card2(m,0); }).join(''));
}
function sortBtn(){ var sl=(A.SORTS.filter(function(s){ return s[0]===A.SORT; })[0]||A.SORTS[0])[1]; return '<button type="button" class="oy-sort" data-sort-open><span class="sort-lbl">'+E(sl)+'</span>'+SVG_CHEV+'</button>'; }


/* ---------- 탭: 인기 모델 (올리브영 '랭킹': 순위 번호 2열 — 스토어 판매량순(최근 30일 온라인 개통 기준)) ---------- */
function rankList(){
  var R=A.RANK, ph=A.phones(), out=[];
  if(R && Object.keys(R).length){
    out=ph.filter(function(m){ return R[m.id]; }).sort(function(a,b){ return R[b.id].n-R[a.id].n; });
  } else {   // 판매 순위를 못 받으면 관리자 '이번 주 인기 모델 TOP' 순서
    (A.S.rank||[]).forEach(function(id){ var m=A.byId(id); if(m && ph.indexOf(m)>-1 && out.indexOf(m)<0) out.push(m); });
  }
  ph.forEach(function(m){ if(out.indexOf(m)<0) out.push(m); });
  return out;
}
function renderTabRank(wait){
  var loading=wait || A.RANK==null;
  var sorts=A.SORTS.filter(function(s){ return s[0]==='sales'; })[0];
  put($('#oyRkSub'), E(sorts?sorts[1]:''));
  if(loading){ put($('#oyRkChips'),sk('56px','32px','16px')+sk('64px','32px','16px')+sk('72px','32px','16px')); put($('#oyRkNote'),sk('150px','13px','4px')); put($('#oyRkMnp'),''); put($('#oyRkGrid'),skCards2(4)); return; }
  var R=A.RANK, list=rankList(), cats=catsOf(list); if(RKCAT!=='all' && !cats.some(function(t){ return t.k===RKCAT; })) RKCAT='all';
  put($('#oyRkChips'), chipsHtml(cats,RKCAT,'data-rk-cat'));
  put($('#oyRkNote'), E(R && Object.keys(R).length?'최근 30일 온라인 개통 기준':((A.S.sec.rank||{}).t||'')));
  var mnp=!!A.MNP;
  put($('#oyRkMnp'), '<button type="button" data-mnp="1" class="'+(mnp?'on':'')+'" aria-pressed="'+mnp+'">번호이동</button><button type="button" data-mnp="0" class="'+(mnp?'':'on')+'" aria-pressed="'+(!mnp)+'">기기변경</button>');
  put($('#oyRkGrid'), byCat(list,RKCAT).map(function(m,i){ return card2(m,i+1); }).join(''));
}


/* ---------- 탭: 혜택/이벤트 (올리브영 '이벤트': 큰 카드 넘기기 + 바로가기 알약 + 대상 안내) ---------- */
function renderTabEvent(wait){
  if(wait){ clearInterval(EV.timer); EV.n=0; $('#oyEvSec').hidden=false; put($('#oyEv'),'<span class="oy-evc oy-evc-sk"></span>'); put($('#oyEvPills'),''); put($('#oyEvMore'),''); return; }
  var list=tvList(), n=list.length, show=n===2?list.concat(list):list;   // 20261022 사장님: 2장이면 양옆이 다 보이게 한 번 더 붙임 (올리브영처럼 좌우 카드)
  $('#oyEvSec').hidden=!n;
  if(n) carSet(EV, show.map(function(m,i){
    var b=A.badgeOf(m), k=i%n;
    return '<a class="oy-evc'+hc(m)+'" href="#/model/'+E(m.id)+'" data-i="'+i+'"'+ed('model:'+m.id)+' style="background:'+EV_BG[k%EV_BG.length]+'"><span class="oy-evc-fr">'+img(A.mImg(m),'oy-evc-im',true)+'</span>'+(b?'<i class="oy-evc-b">'+E(b)+'</i>':'')+
      '<span class="oy-evc-t"><b>'+E(m.nm)+'</b><span>'+E(A.stripOf(m))+'</span><small><em>'+two(k+1)+'</em><i></i>'+two(n)+'</small></span></a>';
  }).join(''), show.length, n);
  else { clearInterval(EV.timer); put($('#oyEv'),''); }
  put($('#oyEvPills'), evPills().map(function(x){
    return '<a class="oy-pill'+hc(x)+'" href="javascript:void 0" data-go="'+E(x.go)+'"'+ed('quick:'+A.S.quick.indexOf(x))+'><i style="background:'+E(x.bg||'#F4F5F7')+'"><svg viewBox="0 0 24 24" aria-hidden="true" style="stroke:'+E(x.c||'#131518')+'">'+(A.QI[x.ic]||A.QI.star)+'</svg></i>'+E(x.nm)+'</a>';
  }).join(''));
  put($('#oyEvMore'), n?A.tvCondHtml():'');
}

/* ---------- 탭: AI추천 (올리브영 'AI픽': 상황 꼬리표 · 큰 글씨 · 사진 · 아래 흰 상품 카드) ---------- */
function aiList(){
  var used={}, vis=A.models(), out=[];
  var ok=function(m){ return m && vis.indexOf(m)>-1 && !A.SO(m) && !used[m.id]; };
  AI_PICKS.forEach(function(p){
    var m=null;
    if(p.tv) m=tvList().filter(ok)[0]||null;
    else if(p.cheap){   // 지금 가격(번호이동/기기변경 선택 기준)이 가장 낮은 휴대폰 (0원·가격 비공개 제외)
      var c=A.phones().filter(ok).map(function(x){ return {m:x, v:A.priceOf(x).v}; }).filter(function(x){ return x.v!=null && x.v>0; }).sort(function(a,b){ return a.v-b.v; })[0];
      m=c?c.m:null;
    } else m=(p.ids||[]).map(A.byId).filter(ok)[0]||null;
    if(m){ used[m.id]=1; out.push({t:p.t, m:m}); }
  });
  return out;
}
function renderTabAi(wait){
  if(wait){ put($('#oyAi'),'<div class="oy-ai oy-skb"></div>'); return; }
  put($('#oyAi'), aiList().map(function(x,i){
    var m=x.m, p=priceOf(m), pr, st=A.stripOf(m);
    if(p.ask!=null) pr='<span class="oy-card-pr"><span class="oy-ask">'+E(p.ask)+'</span></span>';
    else pr=(p.out&&p.out>p.v?'<s class="oy-card-s">'+E(A.won(p.out))+'</s>':'')+'<span class="oy-card-pr">'+(p.pct>0?'<em>'+p.pct+'%</em>':'')+vHtml(p.v,p.from)+'</span>';
    return '<article class="oy-ai" style="background:'+AI_BG[i%AI_BG.length]+'">'+
      '<span class="oy-ai-tag">'+SVG_SPARK+E(x.t)+'</span>'+
      '<b class="oy-ai-h">'+E(m.ds||m.nm)+'</b>'+(st?'<span class="oy-ai-s">'+E(st)+'</span>':'')+
      '<a class="oy-ai-im" href="#/model/'+E(m.id)+'" tabindex="-1" aria-hidden="true"'+ed('model:'+m.id)+'>'+img(A.mImg(m),'oy-ai-img',i<2)+'</a>'+
      '<div class="oy-ai-p"><i class="oy-ai-hd">'+SVG_UP+'</i>'+
        '<a class="oy-ai-pa" href="#/model/'+E(m.id)+'" data-mid="'+E(m.id)+'"'+ed('model:'+m.id)+'><span class="oy-ai-pim">'+img(A.mImg(m),'oy-card-img',false)+'</span>'+
        '<span class="oy-ai-pt"><b>'+E(m.nm)+'</b>'+pr+'</span></a>'+iconsHtml(m)+'</div>'+
    '</article>';
  }).join(''));
}

/* ---------- 분류 목록 (카테고리 중분류 → 2열 · 정렬) — #/t/list/종류(/모델,모델) ---------- */
function lsOfHash(){ var m=String(location.hash||'').match(/^#\/t\/list\/([\w-]+)(?:\/([\w,-]+))?/); return {k:m?m[1]:'all', ids:m&&m[2]?m[2].split(','):null}; }
function lsModels(L){
  var vis=A.models();
  if(L.ids) return L.ids.map(A.byId).filter(function(m){ return m && vis.indexOf(m)>-1; });
  if(L.k==='all') return A.phones();
  if(L.k==='zero') return zeroList();
  return vis.filter(function(m){ return m.cat.indexOf(L.k)>-1; });
}
function lsTitle(L){ return L.k==='all'?'휴대폰':catNm(L.k); }
function renderList(wait){
  var L=lsOfHash();
  if(wait){ put($('#oyLsChips'),sk('150px','32px','16px')+sk('56px','32px','16px')+sk('64px','32px','16px')); put($('#oyLsCnt'),sk('64px','13px','4px')); put($('#oyLsSort'),''); put($('#oyLsGrid'),skCards2(4)); return; }
  var list=lsModels(L), ph=['all','iphone','galaxy','fold','buddy'].indexOf(L.k)>-1, cats=ph&&!L.ids?catsOf(A.phones()):[];
  var tv=list.length && list.every(function(m){ return A.isTv(m); });   // TV프리는 번호이동/기기변경 구분 없음
  var ch=(tv?'':mnpPill())+(cats.length>1?chipsHtml(cats,L.k,'data-ls-cat'):'');
  $('#oyLsChips').hidden=!ch; put($('#oyLsChips'), ch);
  put($('#oyLsCnt'), '전체 <b>'+list.length+'</b>개');
  put($('#oyLsSort'), list.length>1?sortBtn():'');
  put($('#oyLsGrid'), A.sortList(list).map(function(m){ return card2(m,0); }).join(''));
}

/* ---------- 카테고리 (대분류 → 중분류 → 소분류) — #/c/대분류 ---------- */
function catTree(){
  var T=[], ph=A.phones(), tv=tvList(), wr=A.wears().filter(function(m){ return !A.isTv(m); });
  if(ph.length) T.push({k:'phone', nm:'휴대폰', sub:catsOf(ph).map(function(c){ return {nm:c.nm, href:'#/t/list/'+c.k, ms:byCat(ph,c.k)}; })});
  if(tv.length) T.push({k:'tv', nm:catNm('tvfree'), sub:[{nm:catNm('tvfree'), href:'#/t/list/tvfree', ms:tv}].concat(quickBy('special')?[{nm:qNm('special','다이렉트 특별 혜택'), go:'special'}]:[])});
  if(wr.length) T.push({k:'wear', nm:'워치·태블릿', sub:catsOf(wr).map(function(c){ return {nm:c.nm, href:'#/t/list/'+c.k, ms:byCat(wr,c.k)}; })});   // 지금은 숨김 — 다시 켜면 자동으로 나옴
  var gifts=A.secOn('gifts')?A.vis(A.S.gifts||[]):[], bf=[];
  if(quickBy('subsidy')) bf.push({nm:qNm('subsidy','지원금 혜택'), go:'subsidy'});
  if(tv.length && quickBy('special')) bf.push({nm:qNm('special','다이렉트 특별 혜택'), go:'special'});
  bf.push({nm:'결합할인', go:'soon', soon:1});
  bf.push({nm:QSHORT['유닥 멤버십 가입'], go:'soon', soon:1, items:gifts.map(function(g){ return {nm:g.nm, go:g.go||'soon'}; })});
  T.push({k:'benefit', nm:'혜택', sub:bf});
  var qn=(A.QNA||[]).map(function(c){ return c[0]; });
  T.push({k:'guide', nm:'이용안내', sub:[
    {nm:qNm('guide','구매 가이드'), go:'guide'},
    {nm:'자주 묻는 질문', go:'qna', qcats:qn},
    {nm:qNm('store','매장 방문하기'), go:'store'},
    {nm:'전화·카톡 문의', go:'contact'},
    {nm:'고객 후기', go:'soon', soon:1}
  ]});
  return T;
}
function cmHtml(s){
  var h;
  if(s.href) h='<a class="oy-cm-h" href="'+E(s.href)+'"><b>'+E(s.nm)+'</b><span class="oy-cm-all">전체보기'+SVG_R+'</span></a>';
  else h='<a class="oy-cm-h" href="javascript:void 0" data-go="'+E(s.go)+'"><b>'+E(s.nm)+(s.soon?'<i class="oy-soon">준비중</i>':'')+'</b>'+SVG_R+'</a>';
  var b='';
  if(s.ms) b='<div class="oy-ct">'+s.ms.map(function(m){ var so=A.SO(m);
      return '<a'+(hc(m)?' class="'+hc(m).trim()+'"':'')+' href="#/model/'+E(m.id)+'" data-mid="'+E(m.id)+'"'+ed('model:'+m.id)+'><span class="oy-ct-im">'+img(A.mImg(m),'oy-ct-img',false)+(so?'<i class="oy-so">품절</i>':'')+'</span><span class="oy-ct-t">'+E(shortNm(m.nm))+'</span></a>'; }).join('')+'</div>';
  else if(s.qcats && s.qcats.length) b='<div class="oy-csl">'+s.qcats.map(function(n,i){ return '<a href="javascript:void 0" data-shop-qcat="'+i+'">'+E(n)+'</a>'; }).join('')+'</div>';
  else if(s.items && s.items.length) b='<div class="oy-csl">'+s.items.map(function(x){ return '<a href="javascript:void 0" data-go="'+E(x.go)+'">'+E(x.nm)+'</a>'; }).join('')+'</div>';
  return '<div class="oy-cm">'+h+b+'</div>';
}
function renderCat(wait){
  if(wait){ put($('#oyCl'),'<button type="button" class="on">'+sk('48px','15px','4px')+'</button><button type="button">'+sk('40px','15px','4px')+'</button><button type="button">'+sk('34px','15px','4px')+'</button>'); put($('#oyCr'),'<div class="oy-cm">'+sk('70%','16px','4px')+'</div>'); return; }
  var T=catTree(), want=(String(location.hash||'').match(/^#\/c\/([\w-]+)/)||[])[1], g=T.filter(function(x){ return x.k===want; })[0]||T[0];
  put($('#oyCl'), T.map(function(x){ var on=x===g; return '<button type="button" data-cg="'+E(x.k)+'"'+(on?' class="on" aria-current="true"':'')+'>'+E(x.nm)+'</button>'; }).join(''));
  put($('#oyCr'), g?g.sub.map(cmHtml).join(''):'');
}

/* ---------- 손가락으로 넘기기 · 칩 · 화면 바꾸기 (한 번만 묶음) ---------- */
function swipe(el, st, onMove, onEnd){
  if(!el) return;
  el.addEventListener('touchstart',function(e){ var t=e.touches[0]; st.drag={x:t.clientX, y:t.clientY, dx:0, h:null}; st.moved=false; },{passive:true});
  el.addEventListener('touchmove',function(e){
    var d=st.drag; if(!d) return; var t=e.touches[0], dx=t.clientX-d.x, dy=t.clientY-d.y;
    if(d.h===null && (Math.abs(dx)>6 || Math.abs(dy)>6)) d.h=Math.abs(dx)>Math.abs(dy);
    if(!d.h) return; d.dx=dx; if(Math.abs(dx)>8) st.moved=true; onMove(dx);
  },{passive:true});
  var end=function(){ var d=st.drag; st.drag=null; onEnd(d&&d.h?d.dx:0); };
  el.addEventListener('touchend',end); el.addEventListener('touchcancel',end);
  el.addEventListener('click',function(e){ if(st.moved){ e.preventDefault(); e.stopPropagation(); st.moved=false; } },true);   // 넘기다 손 뗀 건 누른 걸로 안 침
}
function carSwipe(c){ swipe($(c.o.track), c, function(dx){ carLayout(c,null,dx); }, function(dx){ if(dx<=-40) carGo(c,1); else if(dx>=40) carGo(c,-1); else carLayout(c,0); carAuto(c); }); }
function tabOn(k){ Array.prototype.forEach.call(document.querySelectorAll('.tabbar a'),function(a){ a.classList.toggle('on', a.getAttribute('data-tab')===k); }); }
// 로고줄: 아래로 내리면 숨고(탭 메뉴만 남음) 위로 올리면 다시 나옴 — 올리브영과 같음 (카테고리·분류 목록 화면은 그대로)
var HY=0, HACC=0;
function hdScroll(){
  var top=$('.oy-top'); if(!top) return;
  var y=window.scrollY||window.pageYOffset||0, d=y-HY; HY=y;
  if(!homeOn() || top.classList.contains('sub') || y<=48){ HACC=0; top.classList.remove('hide'); return; }
  if((d>0 && HACC<0) || (d<0 && HACC>0)) HACC=0;
  HACC+=d;
  if(HACC>10) top.classList.add('hide'); else if(HACC<-10) top.classList.remove('hide');
}
// 예전 주소 '#/t/zero'(기기값 0원 탭)로 들어오면 특가 탭의 '기기값 0원' 목록으로
function goZero(){ if(!/^#\/t\/zero\b/.test(location.hash)) return; setTimeout(function(){ var el=$('#oyDlZero'); if(el && !el.hidden) window.scrollTo(0, el.getBoundingClientRect().top+window.scrollY-$('#oyGnb').offsetHeight-4); },60); }
function bindOnce(){
  if(bound) return; bound=true;
  carSwipe(BN); carSwipe(EV);
  swipe($('#oyBand'), BD, function(dx){ bdShow(false,dx); }, function(dx){ if(dx<=-40) bdGo(1); else if(dx>=40) bdGo(-1); else bdShow(true); });
  $('#oyBnAll').addEventListener('click',function(e){ e.preventDefault(); bnAll(); });
  window.addEventListener('scroll',hdScroll,{passive:true});
  document.addEventListener('click',function(e){
    var t=e.target; if(!t || !t.closest) return;
    var c=t.closest('[data-shop-cat]'); if(c){ e.preventDefault(); POPCAT=c.getAttribute('data-shop-cat'); renderPop(false); return; }
    c=t.closest('[data-dl-cat]'); if(c){ e.preventDefault(); DLCAT=c.getAttribute('data-dl-cat'); renderTabDeal(false); return; }
    c=t.closest('[data-rk-cat]'); if(c){ e.preventDefault(); RKCAT=c.getAttribute('data-rk-cat'); renderTabRank(false); return; }
    c=t.closest('[data-ls-cat]'); if(c){ e.preventDefault(); location.replace('#/t/list/'+c.getAttribute('data-ls-cat')); return; }   // 분류 목록 칩: 같은 화면에서 종류만 바꿈 (뒤로 가기가 쌓이지 않게)
    c=t.closest('[data-cg]'); if(c){ e.preventDefault(); location.replace('#/c/'+c.getAttribute('data-cg')); return; }             // 카테고리 왼쪽 대분류
    c=t.closest('[data-shop-qcat]'); if(c){   // 이용안내 > 자주 묻는 질문 > 질문 종류 → 그 종류로 펼친 '자주 묻는 질문'
      e.preventDefault(); var qi=c.getAttribute('data-shop-qcat'); A.act('qna');
      setTimeout(function(){ var b=document.querySelector('.qna-cats [data-qcat="'+qi+'"]'); if(b) b.click(); },30); return; }
  });
  document.addEventListener('click',function(e){
    var t=e.target; if(!t || !t.closest) return;
    if(editingNow() && t.closest('[data-edit]')) return;   // 20261026 관리자 편집 중: 고치는 창이 먼저
    var tr=t.closest('#oyBn,#oyEv,#oyBand'); if(tr && (tr.id==='oyBn'?BN:tr.id==='oyEv'?EV:BD).moved) return;   // 넘기다 손 뗀 건 누른 걸로 안 침
    // 스토어 카테고리 주소(#/cat/…: 관리자 바로가기·배너·팝업 버튼) → /shop 분류 목록
    var g=t.closest('a[href^="#/cat/"],[data-go^="#/cat/"]');
    if(g){ e.preventDefault(); e.stopPropagation(); A.closeSheet(); location.hash=catToList(g.getAttribute('data-go')||g.getAttribute('href')); return; }
    // 바로가기 '인기 모델'(popular) → 위 탭 '인기 모델' 화면 (스토어는 판매량순 목록으로 감)
    g=t.closest('#v-home [data-go="popular"]');
    if(g && tabs(false).some(function(x){ return x.k==='rank'; })){ e.preventDefault(); e.stopPropagation(); A.closeSheet(); location.hash='#/t/rank'; return; }
    // 바로가기 '구역으로 이동'(sec:…) — 위에 붙은 탭 메뉴에 제목이 가리지 않게 그만큼 덜 내림 (내려가면 로고줄은 숨음)
    g=t.closest('#v-home [data-go^="sec:"]'); if(!g) return;
    var id={zero:'zeroSec', pop:'popSec'}[g.getAttribute('data-go').slice(4)], el=id && document.getElementById(id); if(!el || el.hidden) return;
    e.preventDefault(); e.stopPropagation();
    if(PANE!=='home'){ location.hash='#/'; return; }
    window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-$('#oyGnb').offsetHeight-4, behavior:'smooth'});
  },true);
  var rt=null; window.addEventListener('resize',function(){ clearTimeout(rt); rt=setTimeout(function(){ carLayout(BN,null); carLayout(EV,null); },120); });
  // 화면 바뀔 때: 위 탭 · 카테고리 · 분류 목록 화면 바꾸기 (스토어가 화면을 바꾼 다음에 맞춤)
  window.addEventListener('hashchange',function(){ requestAnimationFrame(function(){
    if(/^#\/cat\//.test(location.hash)){ location.replace(catToList(location.hash)); return; }   // 스토어 카테고리 주소로 바로 들어온 경우
    if(!homeOn()) return;
    var wait=A.prWait(), p=pickPane(wait);
    if(p==='list') renderList(wait);
    if(p==='cat') renderCat(wait);
    if(p!==PANE){ PANE=p; renderGnb(wait); showPane(); $('.oy-top').classList.remove('hide'); window.scrollTo(0,0); }
    else if(p==='list' || p==='cat'){ showPane(); if(p==='cat') window.scrollTo(0,0); }
    else { carLayout(BN,null); carLayout(EV,null); }
    goZero();
  }); });
}

/* ---------- 스토어 엔진이 홈을 그릴 때마다 부름 (처음 · 설정 받았을 때 · 번호이동/기기변경·정렬 바꿀 때 · 관리자 저장 반영) ---------- */
function render(api){
  A=api; var wait=api.prWait();
  bindOnce();
  if(/^#\/cat\//.test(location.hash)) location.replace(catToList(location.hash));   // 스토어 카테고리 주소로 바로 들어온 경우 → 분류 목록
  PANE=pickPane(wait);
  renderGnb(wait);
  renderBanner(wait); renderQuick(wait); renderBand(wait); renderPop(wait); renderDeal(wait); renderZero(wait);
  renderTabDeal(wait); renderTabRank(wait); renderTabEvent(wait); renderTabAi(wait); renderList(wait); renderCat(wait);
  showPane();
  api.renderFoot();
  goZero();
}

window.STORE_CFG=window.STORE_CFG||{};
window.STORE_CFG.skin={home:HOME, tabbar:TABBAR, render:render};
})();
