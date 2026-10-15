/* =========================================================
   유플러스 다이렉트 스토어 — 공용 화면 코드
   · galaxy_z8.html  : 고객 화면 (STORE_CFG.mode = 'view')
   · apple.html      : 관리자 화면 (STORE_CFG.mode = 'edit') — 같은 화면을 그대로 띄우고 눌러서 수정
   · 데이터: 파이어베이스 /store  (애플에서 '적용' 누르면 갤럭시에 바로 반영)
   · 이미지: 깃허브 assets/store/<폴더>/<파일>
   ========================================================= */
(function(){
'use strict';
var CFG = window.STORE_CFG || {};
var EDIT = CFG.mode === 'edit';
var DB = 'https://udak-c6832-default-rtdb.firebaseio.com';
var IMG = '/assets/store/';
var GH = 'https://api.github.com/repos/sihwan5183-del/udak/contents/assets/store/';
var FOLDERS = ['hero','model','card','promo','gift'];

var MARKUP = "<!-- 스크롤 시 나타나는 상단바 (쿠팡이츠 방식) -->\n<header class=\"topbar\" id=\"topbar\">\n  <button class=\"lbl\" data-open=\"store\"><svg class=\"ico\" viewBox=\"0 0 24 24\"><path d=\"M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z\"/><circle cx=\"12\" cy=\"9.5\" r=\"2.5\"/></svg>매장찾기<svg class=\"ico chev\" viewBox=\"0 0 24 24\" style=\"width:18px;height:18px\"><path d=\"m6 9 6 6 6-6\"/></svg></button>\n  <button data-go=\"search\"><svg class=\"ico\" viewBox=\"0 0 24 24\"><circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"m20 20-3.5-3.5\"/></svg></button>\n  <button style=\"position:relative;display:flex\" data-open=\"noti\"><svg class=\"ico\" viewBox=\"0 0 24 24\"><path d=\"M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8\"/><path d=\"M10.3 21a1.9 1.9 0 0 0 3.4 0\"/></svg><i class=\"dot-new\"></i></button>\n</header>\n<div class=\"app\" id=\"app\">\n<!-- ===================== 홈 ===================== -->\n<main class=\"view on\" id=\"v-home\">\n  <!-- 1. 히어로 -->\n  <section class=\"hero\" id=\"hero\">\n    <div class=\"hero-top\">\n      <div class=\"brand\" id=\"brand\" data-edit=\"brand\"></div>\n      <div class=\"hero-r\">\n        <div class=\"uplus-logo\">U<sup>+</sup></div>\n        <div class=\"hero-icons\">\n          <button data-go=\"search\" aria-label=\"검색\"><svg class=\"ico\" viewBox=\"0 0 24 24\"><circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"m20 20-3.5-3.5\"/></svg></button>\n          <button data-open=\"noti\" aria-label=\"알림\"><svg class=\"ico\" viewBox=\"0 0 24 24\"><path d=\"M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8\"/><path d=\"M10.3 21a1.9 1.9 0 0 0 3.4 0\"/></svg><i class=\"dot-new\"></i></button>\n        </div>\n      </div>\n    </div>\n    <div class=\"hero-track\" id=\"heroTrack\"></div>\n    <div class=\"dots\" id=\"heroDots\"></div>\n  </section>\n  <!-- 2. 매장찾기 -->\n  <button class=\"locbar\" data-open=\"store\">\n    <svg class=\"ico\" viewBox=\"0 0 24 24\"><path d=\"M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z\"/><circle cx=\"12\" cy=\"9.5\" r=\"2.5\"/></svg>\n    <span class=\"lbl\">매장찾기 <svg class=\"ico chev\" viewBox=\"0 0 24 24\" style=\"width:18px;height:18px\"><path d=\"m6 9 6 6 6-6\"/></svg></span>\n    <svg class=\"ico\" viewBox=\"0 0 24 24\" style=\"width:18px;height:18px;color:#9aa0a8\"><path d=\"m9 6 6 6-6 6\"/></svg>\n  </button>\n  <!-- 3. 검색 -->\n  <label class=\"search\" data-go=\"search\">\n    <svg class=\"ico\" viewBox=\"0 0 24 24\"><circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"m20 20-3.5-3.5\"/></svg>\n    <input type=\"text\" placeholder=\"어떤 휴대폰을 찾고 계세요?\" readonly tabindex=\"-1\">\n  </label>\n  <!-- 4. 모델 원형 아이콘 -->\n  <nav class=\"models\" id=\"models\"></nav>\n  <!-- 5. 퀵메뉴 -->\n  <nav class=\"quick hscroll\" id=\"quick\"></nav>\n  <!-- 6. 신뢰 스트립 -->\n  <div class=\"trust hscroll\" id=\"trust\"></div>\n  <!-- 7. 프로모 배너 -->\n  <a class=\"promo\" id=\"promo\" data-edit=\"promo\"></a>\n  <!-- 8. 많이 찾아요 -->\n  <section class=\"sec\" id=\"popSec\">\n    <div id=\"popHead\"></div>\n    <div class=\"popgrid\" id=\"popgrid\"></div>\n  </section>\n  <div class=\"divider\" style=\"margin-top:16px\"></div>\n  <!-- ===== 여기부터 쿠팡이츠 모티브 섹션 ===== -->\n  <!-- 9-1. 최근 본 모델 (본 게 없으면 숨김) -->\n  <section class=\"sec\" id=\"recentSec\" hidden>\n    <div id=\"recentHead\"></div>\n    <div class=\"hcards hscroll\" id=\"recent\"></div>\n  </section>\n  <!-- 9-2. 기기값 0원 모아보기 -->\n  <section class=\"sec zero-sec\" id=\"zeroSec\">\n    <div id=\"zeroHead\"></div>\n    <div class=\"hcards hscroll\" id=\"zero\"></div>\n  </section>\n  <section class=\"sec\" id=\"wearSec\">\n    <div id=\"wearHead\"></div>\n    <div class=\"hcards hscroll\" id=\"wear\"></div>\n  </section>\n  <div class=\"divider\"></div>\n  <!-- 10-1. 한정 사은품 -->\n  <section class=\"sec\" id=\"giftSec\">\n    <div id=\"giftHead\"></div>\n    <div class=\"dcards hscroll\" id=\"gifts\"></div>\n  </section>\n  <!-- 10-2. 우리 동네 인기 모델 -->\n  <section class=\"sec\" id=\"rankSec\">\n    <div id=\"rankHead\"></div>\n    <div class=\"dcards hscroll\" id=\"rank\"></div>\n  </section>\n  <div class=\"divider\" style=\"margin-top:16px\"></div>\n  <!-- 11. 골라보는 휴대폰 -->\n  <section class=\"sec ucat-wrap\" id=\"pickSec\" style=\"padding-bottom:0\">\n    <div id=\"pickHead\"></div>\n    <nav class=\"models hscroll\" id=\"pickCircles\" style=\"display:flex;gap:4px;padding:0 10px 6px\"></nav>\n    <div class=\"filters\">\n      <button class=\"chk on\" data-toggle=\"mnp\"><i></i>번호이동 가격</button>\n      <button class=\"fbtn\">추천순 <svg class=\"ico\" viewBox=\"0 0 24 24\" style=\"width:14px;height:14px\"><path d=\"m6 9 6 6 6-6\"/></svg></button>\n      <button class=\"fbtn\">필터 <svg class=\"ico\" viewBox=\"0 0 24 24\" style=\"width:14px;height:14px\"><path d=\"M4 6h16M7 12h10M10 18h4\"/></svg></button>\n    </div>\n    <div class=\"adlabel\">추천 리스트</div>\n    <div id=\"bigList\"></div>\n  </section>\n  <footer class=\"foot\" id=\"foot\" data-edit=\"foot\"></footer>\n</main>\n<!-- ===================== 카테고리 (쿠팡이츠 '한식' 화면) ===================== -->\n<main class=\"view\" id=\"v-cat\">\n  <div class=\"subhead\"><button data-back><svg class=\"ico\" viewBox=\"0 0 24 24\"><path d=\"M19 12H5M11 18l-6-6 6-6\"/></svg></button><h1 id=\"catTitle\">전체</h1><button data-go=\"search\"><svg class=\"ico\" viewBox=\"0 0 24 24\"><circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"m20 20-3.5-3.5\"/></svg></button></div>\n  <div class=\"sticky-tabs\"><nav class=\"ctabs hscroll\" id=\"catTabs\"></nav></div>\n  <nav class=\"hscroll\" id=\"catCircles\" style=\"display:flex;gap:4px;padding:14px 10px 6px\"></nav>\n  <div class=\"filters\">\n    <button class=\"chk on\" data-toggle=\"mnp\"><i></i>번호이동 가격</button>\n    <button class=\"fbtn\">추천순 <svg class=\"ico\" viewBox=\"0 0 24 24\" style=\"width:14px;height:14px\"><path d=\"m6 9 6 6 6-6\"/></svg></button>\n    <button class=\"fbtn\">필터 <svg class=\"ico\" viewBox=\"0 0 24 24\" style=\"width:14px;height:14px\"><path d=\"M4 6h16M7 12h10M10 18h4\"/></svg></button>\n  </div>\n  <div class=\"adlabel\">추천 리스트</div>\n  <div id=\"catList\"></div>\n</main>\n<!-- ===================== 검색 ===================== -->\n<main class=\"view\" id=\"v-search\">\n  <div class=\"subhead\" style=\"gap:4px;justify-content:flex-start\"><button data-back><svg class=\"ico\" viewBox=\"0 0 24 24\"><path d=\"M19 12H5M11 18l-6-6 6-6\"/></svg></button>\n    <label class=\"search\" style=\"margin:0;flex:1;height:40px\"><svg class=\"ico\" viewBox=\"0 0 24 24\" style=\"width:18px;height:18px\"><circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"m20 20-3.5-3.5\"/></svg><input id=\"q\" type=\"search\" autocomplete=\"off\" placeholder=\"모델명을 입력하세요 (예: 폴드, 아이폰)\"></label></div>\n  <div class=\"results\" id=\"results\"></div>\n</main>\n<!-- ===================== 찜한 모델 ===================== -->\n<main class=\"view\" id=\"v-wish\">\n  <div class=\"subhead\"><span style=\"width:40px\"></span><h1>찜한 모델</h1><span style=\"width:40px\"></span></div>\n  <div id=\"wishList\"></div>\n</main>\n<!-- ===================== 모델 상세 (다음 단계) ===================== -->\n<main class=\"view\" id=\"v-model\">\n  <div class=\"subhead\"><button data-back><svg class=\"ico\" viewBox=\"0 0 24 24\"><path d=\"M19 12H5M11 18l-6-6 6-6\"/></svg></button><h1 id=\"mdTitle\"></h1><span style=\"width:40px\"></span></div>\n  <div id=\"mdBody\" style=\"padding:0 16px 20px\"></div>\n</main>\n</div><!-- /app -->\n<!-- 하단 탭바 -->\n<nav class=\"tabbar\" id=\"tabbar\">\n  <a href=\"#/\" data-tab=\"home\"><svg class=\"ico\" viewBox=\"0 0 24 24\"><path d=\"M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z\"/></svg>홈</a>\n  <a href=\"#/search\" data-tab=\"search\"><svg class=\"ico\" viewBox=\"0 0 24 24\"><circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"m20 20-3.5-3.5\"/></svg>검색</a>\n  <a href=\"#/wish\" data-tab=\"wish\"><svg class=\"ico\" viewBox=\"0 0 24 24\"><path d=\"M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z\"/></svg>찜</a>\n  <a href=\"javascript:void 0\" data-open=\"consult\" data-tab=\"consult\"><svg class=\"ico\" viewBox=\"0 0 24 24\"><rect x=\"5\" y=\"4\" width=\"14\" height=\"17\" rx=\"2\"/><path d=\"M9 4h6v3H9zM9 12l2 2 4-4\"/></svg>상담신청</a>\n  <a href=\"javascript:void 0\" data-open=\"store\" data-tab=\"store\"><svg class=\"ico\" viewBox=\"0 0 24 24\"><path d=\"M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z\"/><circle cx=\"12\" cy=\"9.5\" r=\"2.5\"/></svg>매장</a>\n</nav>\n<div class=\"dim\" id=\"dim\"></div>\n<div class=\"sheet\" id=\"sheet\"><div class=\"grab\"></div><div id=\"sheetBody\"></div></div>";

/* ---------------- 기본 데이터 (파이어베이스가 비어 있을 때) ---------------- */
var DEFAULT = {
  v:1,
  brand:{small:'유플러스 공식파트너사', big:'유플러스 다이렉트'},
  hero:[
    {k:'U+ 최초의 온라인 대리점', t:'아이폰 18프로 / 프로맥스', s:'불필요한 가입 없이 온라인으로 간편하게.', img:'hero/hero-01.jpg', go:'#/model/iphone18pro'},
    {k:'번호이동 특가', t:'갤럭시 폴드 8 / 플립 8', s:'보이는 가격 그대로, 정직하게.', img:'hero/hero-02.jpg', go:'#/model/fold8'},
    {k:'갤럭시 S26 시리즈', t:'S26 · S26+ · S26 울트라', s:'제휴카드·부가서비스 의무가입 없이.', img:'hero/hero-03.jpg', go:'#/model/s26ultra'}
  ],
  models:[
    {id:'iphone18pro',    nm:'아이폰 18프로',     cat:['iphone','zero'], ds:'프로가 하는 프로의 선택',      tags:['기기값 0원','최대 지원금']},
    {id:'iphone18promax', nm:'아이폰 18프로맥스', cat:['iphone','zero'], ds:'더 커진 프로의 등장',          tags:['기기값 0원','최대 지원금']},
    {id:'s26',            nm:'갤럭시 S26',        cat:['galaxy'],        ds:'새로운 AI, 새로운 일상',       tags:['기기값 할인','사은품 증정']},
    {id:'s26plus',        nm:'갤럭시 S26+',       cat:['galaxy'],        ds:'더 커진 화면, 더 강한 성능',   tags:['기기값 할인','사은품 증정']},
    {id:'s26ultra',       nm:'갤럭시 S26 울트라', cat:['galaxy'],        ds:'AI 카메라의 새로운 기준',      tags:['기기값 할인','사은품 증정']},
    {id:'iphone17',       nm:'아이폰17',          cat:['iphone','zero'], ds:'새로운 컬러, 더 특별하게',     tags:['기기값 0원','최대 지원금']},
    {id:'flip8',          nm:'플립 8',            cat:['fold'],          ds:'한 손에 들어오는 혁신',        tags:['기기값 할인','사은품 증정']},
    {id:'fold8ultra',     nm:'폴드 8 울트라',     cat:['fold'],          ds:'가장 강력한 폴더블 경험',      tags:['기기값 할인','사은품 증정']},
    {id:'fold8',          nm:'폴드 8',            cat:['fold'],          ds:'더 넓은 세상, 더 많은 가능성', tags:['기기값 할인','사은품 증정']},
    // 워치·태블릿: opts = 사이즈별 [이름, 출고가, 이통사 지원금] → 구매가 = 출고가 - 지원금
    {id:'watchultra2', nm:'갤럭시 워치 울트라2', cat:['watch'], ds:'티타늄으로 완성한 아웃도어 워치', tags:['이통사 지원금','스마트기기'], opts:[{nm:'기본',out:969100,sub:450000}]},
    {id:'watch9',      nm:'갤럭시 워치9',       cat:['watch'], ds:'매일 함께하는 건강 파트너',       tags:['이통사 지원금','스마트기기'], opts:[{nm:'44mm',out:569800,sub:164000},{nm:'40mm',out:529100,sub:164000}]},
    {id:'watchse3',    nm:'애플워치 SE3',       cat:['watch'], ds:'아이폰과 가장 잘 어울리는 워치',   tags:['이통사 지원금','스마트기기'], opts:[{nm:'40mm',out:429000,sub:287500},{nm:'44mm',out:473000,sub:287500}]},
    {id:'taba11plus',  nm:'갤럭시 탭 A11+',     cat:['tablet'],ds:'넉넉한 화면, 가벼운 태블릿',        tags:['상담 시 안내','스마트기기']}
  ],
  quick:[
    {nm:'유닥 멤버십 가입', ic:'user',    c:'#FF3D8B', bg:'#FFF2F7', b:'#FADCE8', go:'sec:gifts'},
    {nm:'인기 모델',       ic:'star',    c:'#3B82F6', bg:'#F2F6FF', b:'#DCE6FB', go:'#/cat/all'},
    {nm:'기기값 0원',      ic:'phone',   c:'#8B5CF6', bg:'#F6F2FF', b:'#E6DCFB', go:'#/cat/zero'},
    {nm:'지원금 혜택',     ic:'gift',    c:'#22B573', bg:'#F0FBF5', b:'#D3F0E1', go:'#/cat/zero'},
    {nm:'구매 가이드',     ic:'book',    c:'#FF8A1F', bg:'#FFF6EE', b:'#FBE4CF', go:'guide'},
    {nm:'QNA',             ic:'headset', c:'#FF2D78', bg:'#FFF2F7', b:'#FADCE8', go:'contact'},
    {nm:'요금제별 혜택',   ic:'won',     c:'#2563EB', bg:'#F2F6FF', b:'#DCE6FB', go:'sec:wear'},
    {nm:'매장 방문하기',   ic:'pin',     c:'#F43F5E', bg:'#FFF2F4', b:'#FADDE2', go:'store'}
  ],
  trust:[
    {b:'5분 상담',              s:'빠른 상담 가능',       ic:'headset'},
    {b:'당일 택배 발송',        s:'지금 주문하고 빠르게', ic:'truck'},
    {b:'제휴카드 의무가입 X',   s:'원하는 요금제로만',    ic:'cardx'},
    {b:'부가서비스 의무가입 X', s:'불필요한 가입 없이',   ic:'docx'}
  ],
  promo:{tag:'가장 인기있는 선택', t:'아이폰 18프로 / 프로맥스', s:'더 강력해진 성능, 지금 가장 핫한 아이폰.', img:'promo/promo-01.jpg', go:'#/model/iphone18pro'},
  gifts:[
    {nm:'그립톡',          sm:'유닥 멤버십 회원', pr:'멤버십 증정', img:'gift/gift-griptok.jpg'},
    {nm:'휴대폰 케이스',   sm:'유닥 멤버십 회원', pr:'멤버십 증정', img:'gift/gift-case.jpg'},
    {nm:'강화유리 필름',   sm:'유닥 멤버십 회원', pr:'멤버십 증정', img:'gift/gift-film.jpg'}
  ],
  rank:['iphone18pro','fold8','s26ultra','iphone17','flip8'],
  sec:{
    pop:{t:'지금, 이런 모델도 많이 찾아요!'},
    recent:{t:'최근 본 모델'},
    zero:{t:'기기값 0원 모아보기', s:'제휴카드·부가서비스 가입 없이'},
    gifts:{t:'유플러스 다이렉트 멤버십 사은품'},
    rank:{t:'이번 주 인기 모델 TOP'},
    pick:{t:'골라보는 휴대폰'},
    wear:{t:'유플러스 다이렉트 요금제별 혜택', s:'요금제에 따라 워치 · 태블릿을 더 가볍게'}
  },
  priceNote:'기기값 기준 금액이며 요금제·할인 방식(공시지원금/선택약정)에 따라 달라질 수 있습니다. 정확한 금액은 상담 시 안내드립니다.',
  stores:[],
  storeNote:'예약 후 방문하시면 당일 개통·수령이 가능합니다.',
  tel:'1660-1412',
  kakao:'http://pf.kakao.com/_HxfVxcn/chat',
  foot:'유플러스 공식파트너사 ㈜신세계정보통신\n고객센터 1660-1412'
};
var GR='#3A3A3C', CR='#F7F4EC';
var IP18=[{nm:'글레이셔',hex:'#A1AFC1',img:'model/iphone18pro-glacier.webp'},{nm:'실버',hex:'#C0C0C0',img:'model/iphone18pro-silver.webp'},
          {nm:'버건디',hex:'#47282E',img:'model/iphone18pro-burgundy.webp'},{nm:'블랙',hex:'#111111',img:'model/iphone18pro-black.webp'}];
var DEFCOLORS = {
  iphone18pro:IP18,
  iphone18promax:[IP18[2],IP18[0],IP18[1],IP18[3]],   // 프로맥스는 버건디가 대표 (18프로 글레이셔와 안 겹치게)
  fold8:[{nm:'라벤더',hex:'#C9BFE0',img:'model/fold8-lavender.webp'},{nm:'그라파이트',hex:GR,img:'model/fold8-graphite.webp'},{nm:'크림',hex:CR,img:'model/fold8-cream.webp'}],
  // S26 시리즈·아이폰17·폴드8울트라: LG U+ 공식 이미지 (대표색은 서로 안 겹치게 첫 번째에 둠)
  s26:[{nm:'스카이블루',hex:'#C8D8E8',img:'https://www.lguplus.com/static/pc-contents/images/prdv/20260714-053811-921-HRmWdqif.png'},{nm:'바이올렛',hex:'#6B4FA8',img:'https://www.lguplus.com/static/pc-contents/images/prdv/20260714-053740-479-pQIAKww6.png'},{nm:'블랙',hex:'#1A1A1A',img:'https://www.lguplus.com/static/pc-contents/images/prdv/20260714-053848-434-c2GOQtgl.png'},{nm:'화이트',hex:'#F5F5F5',img:'https://www.lguplus.com/static/pc-contents/images/prdv/20260714-053715-066-M3q1xetd.png'}],
  s26plus:[{nm:'바이올렛',hex:'#6B4FA8',img:'https://www.lguplus.com/static/pc-contents/images/prdv/20260714-053740-479-pQIAKww6.png'},{nm:'스카이블루',hex:'#C8D8E8',img:'https://www.lguplus.com/static/pc-contents/images/prdv/20260714-053811-921-HRmWdqif.png'},{nm:'블랙',hex:'#1A1A1A',img:'https://www.lguplus.com/static/pc-contents/images/prdv/20260714-053848-434-c2GOQtgl.png'},{nm:'화이트',hex:'#F5F5F5',img:'https://www.lguplus.com/static/pc-contents/images/prdv/20260714-053715-066-M3q1xetd.png'}],
  s26ultra:[{nm:'블랙',hex:'#1A1A1A',img:'https://www.lguplus.com/static/pc-contents/images/prdv/20260714-055230-854-OPWqhUD2.png'},{nm:'스카이블루',hex:'#C8D8E8',img:'https://www.lguplus.com/static/pc-contents/images/prdv/20260714-055159-340-oK8P4qi3.png'},{nm:'바이올렛',hex:'#6B4FA8',img:'https://www.lguplus.com/static/pc-contents/images/prdv/20260714-055133-722-P9m6ErGa.png'},{nm:'화이트',hex:'#F5F5F5',img:'https://www.lguplus.com/static/pc-contents/images/prdv/20260714-055021-729-uk7T5QtE.png'}],
  iphone17:[{nm:'세이지',hex:'#9DB58A',img:'https://www.lguplus.com/static/pc-contents/images/prdv/20250910-074542-146-u4riuhtS.png'},{nm:'라벤더',hex:'#D4C5E8',img:'https://www.lguplus.com/static/pc-contents/images/prdv/20250910-074335-364-N6axlQJi.png'},{nm:'미스트 블루',hex:'#8FA3B8',img:'https://www.lguplus.com/static/pc-contents/images/prdv/20250910-074609-703-udSVN8tU.png'},{nm:'블랙',hex:'#1A1A1A',img:'https://www.lguplus.com/static/pc-contents/images/prdv/20250910-074658-400-339e48Ub.png'},{nm:'화이트',hex:'#F5F5F5',img:'https://www.lguplus.com/static/pc-contents/images/prdv/20250910-074635-624-heCQGueI.png'}],
  watchultra2:[{nm:'티타늄 실버',hex:'#C9C9C7',img:'https://www.lguplus.com/static/pc-contents/images/prdv/20260730-100757-105-s4pfDDQm.png'},{nm:'티타늄 그레이',hex:'#6B6E70',img:'https://www.lguplus.com/static/pc-contents/images/prdv/20260730-100814-359-AI00mavL.png'}],
  watch9:[{nm:'그라파이트',hex:'#3A3A3C',img:'https://www.lguplus.com/static/pc-contents/images/prdv/20260730-100914-697-6wrbN7a3.png'},{nm:'크림',hex:'#F2EDE3',img:'https://www.lguplus.com/static/pc-contents/images/prdv/20260730-100933-342-dXgligws.png'}],
  watchse3:[{nm:'미드나이트',hex:'#232A35',img:'https://www.lguplus.com/static/pc-contents/images/prdv/20250924-024025-748-JQRwZZ8s.png'},{nm:'스타라이트',hex:'#E9E3D6',img:'https://www.lguplus.com/static/pc-contents/images/prdv/20250924-024253-142-X6foS0eQ.png'}],
  taba11plus:[{nm:'기본',hex:'#8A8F98',img:'https://www.lguplus.com/static/pc-contents/images/prdv/20251127-040323-387-In3ubFxO.png'}],
  fold8ultra:[{nm:'바이올렛 쉐도우',hex:'#5C4E77',img:'https://www.lguplus.com/static/pc-contents/images/prdv/20260723-040628-100-q8B7Lw9c.png'},{nm:'그라파이트',hex:'#3A3A3C',img:'https://www.lguplus.com/static/pc-contents/images/prdv/20260723-040656-778-ob3Y60Ad.png'},{nm:'크림',hex:'#F7F4EC',img:'https://www.lguplus.com/static/pc-contents/images/prdv/20260723-040643-727-3rHd0IUe.png'}],
  flip8:[{nm:'핑크',hex:'#F2C6D6',img:'model/flip8-pink.webp'},{nm:'그라파이트',hex:GR,img:'model/flip8-graphite.webp'},{nm:'크림',hex:CR,img:'model/flip8-cream.webp'}]
};
var CAT_TABS = [{k:'all',nm:'전체'},{k:'iphone',nm:'아이폰'},{k:'galaxy',nm:'갤럭시 S'},{k:'fold',nm:'폴더블'},{k:'zero',nm:'기기값 0원'},{k:'watch',nm:'워치'},{k:'tablet',nm:'태블릿'}];
var GO_OPTIONS = [['sec:gifts','멤버십 사은품 구역으로'],['sec:wear','요금제별 혜택 구역으로'],['consult','상담 신청서 열기'],['contact','전화·카톡 문의'],['guide','구매 가이드'],['store','매장찾기'],['#/cat/all','전체 모델'],['#/cat/iphone','아이폰 모아보기'],['#/cat/galaxy','갤럭시 S 모아보기'],['#/cat/fold','폴더블 모아보기'],['#/cat/zero','기기값 0원 모아보기']];

var QI = { // 퀵메뉴 아이콘
  user:'<circle cx="12" cy="8" r="3.5"/><path d="M5 20c1-4 4-6 7-6s6 2 7 6"/>',
  star:'<path d="m12 4 2.3 4.8 5.2.7-3.8 3.6.9 5.2L12 15.9l-4.6 2.4.9-5.2-3.8-3.6 5.2-.7z"/>',
  phone:'<rect x="7" y="3.5" width="10" height="17" rx="2"/><path d="M11 17.5h2"/>',
  gift:'<rect x="4" y="9" width="16" height="11" rx="1.5"/><path d="M12 9v11M4 13h16M12 9c-2-4-6-3-5 0M12 9c2-4 6-3 5 0"/>',
  book:'<path d="M4 5.5C6 4.5 9 4.5 12 6.5c3-2 6-2 8-1V19c-2-1-5-1-8 1-3-2-6-2-8-1z"/><path d="M12 6.5V20"/>',
  headset:'<path d="M5 13a7 7 0 1 1 14 0"/><rect x="4" y="13" width="3.5" height="5" rx="1.5"/><rect x="16.5" y="13" width="3.5" height="5" rx="1.5"/>',
  won:'<path d="M5 7l3 10 4-8 4 8 3-10M4 11h16M4 14h16"/>',
  pin:'<path d="M12 20s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10z"/><circle cx="12" cy="10" r="2.2"/>'
};
var TI = { // 신뢰 스트립 아이콘
  headset:'<path d="M5 13a7 7 0 1 1 14 0"/><rect x="3.5" y="13" width="4" height="6" rx="1.5"/><rect x="16.5" y="13" width="4" height="6" rx="1.5"/><path d="M19 19c0 1.5-2 2.5-5 2.5"/>',
  truck:'<path d="M3 6h11v10H3zM14 9h4l3 3.5V16h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
  cardx:'<rect x="3" y="5.5" width="16" height="11" rx="2"/><path d="M3 9.5h16"/><circle cx="18.5" cy="17.5" r="3.6"/><path d="m17 16 3 3m0-3-3 3"/>',
  docx:'<path d="M6 3.5h8l4 4V20H6z"/><path d="M14 3.5v4h4M9 11h6M9 14h3"/><circle cx="18.5" cy="18" r="3.6"/><path d="m17 16.5 3 3m0-3-3 3"/>'
};
var CHEV='<svg viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg>';
var CHEV_I='<svg class="ico" viewBox="0 0 24 24" style="width:15px;height:15px"><path d="m9 6 6 6-6 6"/></svg>';
var HEART='<svg viewBox="0 0 24 24"><path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/></svg>';

/* ---------------- 도우미 ---------------- */
function $(s,el){return (el||document).querySelector(s)}
function $$(s,el){return Array.prototype.slice.call((el||document).querySelectorAll(s))}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function clone(o){return JSON.parse(JSON.stringify(o))}
function arr(x){ if(!x) return []; if(Array.isArray(x)) return x.filter(function(v){return v!=null}); return Object.keys(x).sort(function(a,b){return a-b}).map(function(k){return x[k]}).filter(function(v){return v!=null}); }
function num(v){ if(v===0) return 0; v=String(v==null?'':v).replace(/[^\d]/g,''); return v===''?null:+v; }
function won(n){ return Number(n).toLocaleString('ko-KR')+'원'; }
var store={get:function(k,d){try{var v=localStorage.getItem('ud_'+k);return v?JSON.parse(v):d}catch(e){return d}},
           set:function(k,v){try{localStorage.setItem('ud_'+k,JSON.stringify(v))}catch(e){}}};
function imgSrc(p){ if(!p) return ''; return /^(https?:)?\//.test(p) ? p : IMG+p; }
// 이미지 — 파일이 없으면: 관리자 화면은 '들어갈 파일명', 고객 화면은 은은한 빈 칸
function im(path, cls, eager, label){
  if(!path) return '<div class="'+(EDIT?'ph':'ph-soft')+' '+(cls||'')+'">'+esc(EDIT?'(사진 없음)':(label||''))+'</div>';
  var fit=/(^|\/)model\//.test(path)||/\.(png|webp)(\?|$)/i.test(path);
  return '<img class="'+(cls||'')+(fit?' fit':'')+'" src="'+esc(imgSrc(path))+'" alt="'+esc(label||'')+'" '+(eager?'':'loading="lazy" ')+'decoding="async" data-ph="'+esc(path)+'" data-lb="'+esc(label||'')+'" onerror="__stPh(this)">';
}
window.__stPh=function(el){
  var src=el.getAttribute('src')||'', tried=+(el.getAttribute('data-try')||0);
  if(/\.jpg$/i.test(el.getAttribute('data-ph')||'') && tried<2){
    el.setAttribute('data-try',tried+1);
    el.src=src.replace(/\.(jpg|png)$/i, tried===0?'.png':'.webp'); return;
  }
  var d=document.createElement('div');
  d.className=(EDIT?'ph ':'ph-soft ')+el.className;
  d.textContent=EDIT?el.getAttribute('data-ph'):(el.getAttribute('data-lb')||'');
  if(el.parentNode) el.parentNode.replaceChild(d,el);
};

/* ---------------- 상태 ---------------- */
var S = normalize(null);
var MNP = true;        // '번호이동 가격' 체크
var lastStamp = 0;

function normalize(d){
  var o = clone(DEFAULT);
  if(d && typeof d==='object'){
    Object.keys(d).forEach(function(k){ o[k]=d[k]; });
  }
  ['hero','models','quick','trust','gifts','rank','stores','removed'].forEach(function(k){ o[k]=arr(o[k]); });
  if(d && d.models){ var have={}; o.models.forEach(function(m){ if(m) have[m.id]=1; });
    DEFAULT.models.forEach(function(m){ if(!have[m.id] && o.removed.indexOf(m.id)<0) o.models.push(clone(m)); }); }
  o.models.forEach(function(m){ m.cat=arr(m.cat); m.tags=arr(m.tags); m.cards=arr(m.cards); m.colors=arr(m.colors); m.opts=arr(m.opts); m.price=m.price||{}; });
  o.sec=o.sec||{}; Object.keys(DEFAULT.sec).forEach(function(k){ o.sec[k]=o.sec[k]||clone(DEFAULT.sec[k]); });
  o.brand=o.brand||clone(DEFAULT.brand); o.promo=o.promo||clone(DEFAULT.promo);
  return o;
}
function vis(list){ return EDIT ? list : list.filter(function(x){return x && !x.hidden}); }
function models(){ return vis(S.models); }
function isWear(m){ return m.cat.indexOf('watch')>-1 || m.cat.indexOf('tablet')>-1; }
function phones(){ return models().filter(function(m){return !isWear(m)}); }
function wears(){ return models().filter(isWear); }
function byId(id){ for(var i=0;i<S.models.length;i++) if(S.models[i].id===id) return S.models[i]; return null; }
function colorsOf(m){ var c=arr(m.colors).filter(function(x){return x&&x.nm}); return c.length?c:(DEFCOLORS[m.id]||[]); }
function mImg(m){ var c=colorsOf(m); return m.img || (c[0]&&c[0].img) || ('model/'+m.id+'.jpg'); }
function mCard(m,i){ var c=colorsOf(m); return (m.cards&&m.cards[i]) || (c[i]&&c[i].img) || (i>0&&c[0]&&c[0].img) || ('card/'+m.id+'-'+(i+1)+'.jpg'); }
function hidCls(x){ return x&&x.hidden?' is-hidden':''; }
function secOn(k){ return EDIT || !(S.sec[k]&&S.sec[k].off); }

/* 가격: 번호이동/기기변경 중 지금 보는 가격 */
var OPT={};   // 상세에서 고른 사이즈 (모델별)
function optsOf(m){ return arr(m.opts).filter(function(o){return o&&o.nm}); }
function priceOf(m, oi){
  var os=optsOf(m);
  if(os.length){
    var o = oi!=null ? os[oi] : (OPT[m.id]!=null ? os[OPT[m.id]] : null);
    if(!o){ o=os.reduce(function(a,b){ var va=num(a.out)-(num(a.sub)||0), vb=num(b.out)-(num(b.sub)||0); return vb<va?b:a; }); }
    var out=num(o.out), sub=num(o.sub);
    return {kind:'sub', opt:o, out:out, sub:sub, v:(out!=null?out-(sub||0):null), from:os.length>1 && oi==null && OPT[m.id]==null};
  }
  if(isWear(m)){ var wp=m.price||{}, wo=num(wp.out), ws=num(wp.sub); return {kind:'sub', out:wo, sub:ws, v:(wo!=null?wo-(ws||0):null)}; }
  var p=m.price||{}, mnp=num(p.mnp), chg=num(p.chg);
  var v = MNP ? (mnp!=null?mnp:chg) : (chg!=null?chg:mnp);
  return {out:num(p.out), mnp:mnp, chg:chg, v:v};
}
function priceLine(m){
  var p=priceOf(m);
  if(p.v==null) return '<div class="pr" style="font-size:14px">'+esc(m.tags[0]||'상담 시 안내')+'</div>';
  return '<div class="pr price-row">'+(p.v===0?'0원':won(p.v))+(p.from?'<span style="font-size:12px;color:var(--sub);font-weight:600">~</span>':'')+(p.out&&p.out>p.v?'<s>'+won(p.out)+'</s>':'')+'</div>';
}
function badgeOf(m){
  if(m.soldout) return '일시품절';
  var p=priceOf(m);
  if(p.v===0) return '기기값 0원';
  if(p.v!=null && p.out && p.out>p.v){ var pct=Math.round((p.out-p.v)/p.out*100); if(pct>0) return pct+'% 할인'; }
  return m.tags[0]||'';
}
function stripOf(m){
  if(m.soldout) return '일시품절 · 입고 알림 상담 가능';
  if(m.strip) return m.strip;
  var pp=priceOf(m); if(pp.kind==='sub') return pp.sub?('이통사 지원금 '+won(pp.sub)+' 할인'):'스마트기기 상담 가능';
  return '번호이동 시 '+(m.tags[0]||'')+(m.tags[1]?' + '+m.tags[1]:'');
}

/* ---------------- 렌더 ---------------- */
var heroTimer=null, heroIdx=0;
function renderHero(){
  var b=S.brand;
  $('#brand').innerHTML='<small>'+esc(b.small)+'</small><b>'+esc(b.big)+'</b>';
  var list=vis(S.hero);
  $('#heroTrack').innerHTML = list.map(function(h,i){
    var k=esc(h.k||'').replace(/^U\+/, '<em>U<sup style="font-size:.6em">+</sup></em>');
    var real=S.hero.indexOf(h);
    return '<a class="slide'+(h.full?' full':'')+hidCls(h)+'" data-go="'+esc(h.go||'')+'" data-edit="hero:'+real+'">'+
      '<div class="slide-txt"><div class="k">'+k+'</div><div class="t">'+esc(h.t)+'</div><div class="s">'+esc(h.s)+'</div></div>'+
      im(h.img,'slide-img',i===0,'')+'</a>';
  }).join('');
  $('#heroDots').innerHTML = list.length>1 ? list.map(function(_,i){return '<i'+(i?'':' class="on"')+'></i>'}).join('') : '';
  heroIdx=0; heroGo(0); heroAuto();
}
function heroGo(n){
  var list=$$('#heroTrack .slide'); if(!list.length) return;
  heroIdx=(n+list.length)%list.length;
  $('#heroTrack').style.transform='translateX('+(-heroIdx*100)+'%)';
  $$('#heroDots i').forEach(function(d,i){d.classList.toggle('on',i===heroIdx)});
}
function heroAuto(){ clearInterval(heroTimer); heroTimer=setInterval(function(){ if(!(EDIT&&editing)) heroGo(heroIdx+1); },4000); }
function bindHeroSwipe(){
  var track=$('#heroTrack'), sx=null, dx=0, moved=false;
  track.addEventListener('touchstart',function(e){sx=e.touches[0].clientX;dx=0;moved=false;clearInterval(heroTimer)},{passive:true});
  track.addEventListener('touchmove',function(e){if(sx===null)return;dx=e.touches[0].clientX-sx;if(Math.abs(dx)>8)moved=true;
    track.style.transition='none';track.style.transform='translateX(calc('+(-heroIdx*100)+'% + '+dx+'px))'},{passive:true});
  track.addEventListener('touchend',function(){track.style.transition='';if(Math.abs(dx)>45)heroGo(heroIdx+(dx<0?1:-1));else heroGo(heroIdx);sx=null;heroAuto()});
  track.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
}

function circle(m,eager){
  return '<a class="m'+(m.soldout?' soldout':'')+hidCls(m)+'" href="#/model/'+esc(m.id)+'" data-edit="model:'+esc(m.id)+'"><div class="cir">'+im(mImg(m),'',eager,m.nm)+'</div><span>'+esc(m.nm)+'</span></a>';
}
function renderModels(){
  var list=phones();
  $('#models').innerHTML=list.slice(0,5).map(function(m){return circle(m,true)}).join('')+'<div class="row2">'+list.slice(5).map(function(m){return circle(m,true)}).join('')+'</div>';
}
function renderQuick(){
  $('#quick').innerHTML=vis(S.quick).map(function(q){
    var i=S.quick.indexOf(q);
    return '<a class="'+hidCls(q).trim()+'" data-go="'+esc(q.go||'')+'" data-edit="quick:'+i+'" style="--qc:'+esc(q.c)+';--qbg:'+esc(q.bg)+';--qb:'+esc(q.b)+'"><span class="qi"><svg viewBox="0 0 24 24">'+(QI[q.ic]||QI.star)+'</svg></span><span>'+esc(q.nm)+'</span></a>';
  }).join('');
}
function renderTrust(){
  $('#trust').innerHTML=vis(S.trust).map(function(t){
    var i=S.trust.indexOf(t);
    return '<div class="it'+hidCls(t)+'" data-edit="trust:'+i+'"><svg viewBox="0 0 24 24">'+(TI[t.ic]||TI.headset)+'</svg><div><b>'+esc(t.b)+'</b><small>'+esc(t.s)+'</small></div></div>';
  }).join('');
}
function renderPromo(){
  var p=S.promo, el=$('#promo');
  el.hidden = !EDIT && !!p.hidden;
  el.className='promo'+(p.full?' full':'')+hidCls(p);
  el.setAttribute('data-go',p.go||'');
  el.innerHTML='<div class="pt"><span class="tag">'+esc(p.tag)+'</span><h3>'+esc(p.t)+'</h3><p>'+esc(p.s)+'</p><span class="btn">자세히 보기 '+
    '<svg class="ico" viewBox="0 0 24 24" style="width:14px;height:14px"><path d="m9 6 6 6-6 6"/></svg></span></div>'+im(p.img,'pimg','','');
}
function secHead(k, more){
  var s=S.sec[k]||{};
  return '<div class="sec-h" data-edit="sec:'+k+'"><div>'+(s.s?'<div style="font-size:12.5px;color:var(--sub)">'+esc(s.s)+'</div>':'')+'<h2>'+esc(s.t)+(EDIT&&s.off?' <small style="color:#DC2626;font-size:12px">(숨김)</small>':'')+'</h2></div>'+
    (more?'<a class="more" href="'+more+'">전체보기 '+CHEV_I+'</a>':'')+'</div>';
}
function renderPop(){
  $('#popSec').hidden=!secOn('pop');
  $('#popHead').innerHTML=secHead('pop','#/cat/all');
  $('#popgrid').innerHTML=phones().map(function(m){
    return '<a class="pc'+(m.soldout?' soldout':'')+hidCls(m)+'" href="#/model/'+esc(m.id)+'" data-edit="model:'+esc(m.id)+'"><div class="thumb" style="position:relative">'+im(mImg(m),'','',m.nm)+(m.soldout?'<span class="so-tag" style="font-size:11px">품절</span>':'')+'</div><div class="info">'+
      '<div class="nm">'+esc(m.nm)+CHEV+'</div><div class="ds">'+esc(m.ds)+'</div>'+
      '<div class="pills">'+m.tags.map(function(t){return '<span class="pill">'+esc(t)+'</span>'}).join('')+'</div></div></a>';
  }).join('');
}
function hcard(m,opt){
  opt=opt||{};
  var badge=opt.badge||badgeOf(m);
  return '<a class="hc'+(m.soldout?' soldout':'')+hidCls(m)+'" href="#/model/'+esc(m.id)+'" data-edit="model:'+esc(m.id)+'"><div class="im">'+(badge?'<span class="badge'+(opt.dark||m.soldout?' dark':'')+'">'+esc(badge)+'</span>':'')+
    im(mImg(m),'','',m.nm)+'</div><div class="strip">'+esc(stripOf(m))+'</div>'+
    '<div class="bd"><div class="t">'+esc(m.nm)+'</div>'+priceLine(m)+'<div class="mt">제휴카드·부가서비스 X · 당일발송</div></div></a>';
}
function renderZero(){
  $('#zeroSec').hidden=!secOn('zero');
  $('#zeroHead').innerHTML=secHead('zero','#/cat/zero');
  $('#zero').innerHTML=phones().filter(function(m){return m.cat.indexOf('zero')>-1}).map(function(m){return hcard(m)}).join('');
}
function renderRecent(){
  var ids=store.get('recent',[]).filter(function(id){var m=byId(id);return m&&(EDIT||!m.hidden)});
  $('#recentSec').hidden=!ids.length || !secOn('recent');
  $('#recentHead').innerHTML=secHead('recent');
  $('#recent').innerHTML=ids.map(function(id){return hcard(byId(id),{badge:'최근 본',dark:true})}).join('');
}
function renderWear(){
  var list=wears();
  $('#wearSec').hidden=!secOn('wear') || !list.length;
  $('#wearHead').innerHTML=secHead('wear','#/cat/watch');
  $('#wear').innerHTML=list.map(function(m){return hcard(m)}).join('');
}
function renderGifts(){
  $('#giftSec').hidden=!secOn('gifts');
  $('#giftHead').innerHTML=secHead('gifts');
  $('#gifts').innerHTML=vis(S.gifts).map(function(g){
    var i=S.gifts.indexOf(g);
    return '<a class="dc'+hidCls(g)+'" data-go="'+esc(g.go||'consult')+'" data-edit="gift:'+i+'">'+im(g.img,'','',g.nm)+'<div class="ov"><div class="sm">'+esc(g.sm)+'</div><div class="tt">'+esc(g.nm)+'</div><div class="pr">'+esc(g.pr||'')+'</div></div></a>';
  }).join('');
}
function renderRank(){
  $('#rankSec').hidden=!secOn('rank');
  $('#rankHead').innerHTML=secHead('rank','#/cat/all');
  $('#rank').innerHTML=S.rank.map(byId).filter(function(m){return m&&(EDIT||!m.hidden)}).map(function(m,i){
    return '<a class="dc'+(m.soldout?' soldout':'')+hidCls(m)+'" href="#/model/'+esc(m.id)+'" data-edit="sec:rank"><span class="rk">'+(i+1)+'위</span>'+im(mImg(m),'','',m.nm)+
      (m.soldout?'<span class="so-tag" style="z-index:1">일시품절</span>':'')+'<div class="ov"><div class="sm">'+esc(m.ds)+'</div><div class="tt">'+esc(m.nm)+'</div><div class="pr">'+esc(badgeOf(m))+'</div></div></a>';
  }).join('');
}
function bigcard(m){
  var wish=store.get('wish',[]).indexOf(m.id)>-1, p=priceOf(m), meta=[];
  if(p.kind==='sub'){ if(p.out!=null) meta.push('출고가 <b>'+won(p.out)+'</b>'); if(p.sub) meta.push('지원금 <b>-'+won(p.sub)+'</b>'); if(p.v!=null) meta.push('구매가 <b>'+won(p.v)+(p.from?'~':'')+'</b>'); }
  else if(p.out!=null) meta.push('출고가 <b>'+won(p.out)+'</b>');
  if(p.mnp!=null) meta.push('번호이동 <b>'+(p.mnp===0?'0원':won(p.mnp))+'</b>');
  if(p.chg!=null) meta.push('기기변경 <b>'+(p.chg===0?'0원':won(p.chg))+'</b>');
  return '<a class="big'+(m.soldout?' soldout':'')+hidCls(m)+'" href="#/model/'+esc(m.id)+'" data-edit="model:'+esc(m.id)+'"><div class="media">'+im(mCard(m,0),'main','',m.nm)+
    '<div class="side">'+im(mCard(m,1),'','',m.nm)+im(mCard(m,2),'','',m.nm)+'</div>'+
    (m.soldout?'<span class="so-tag" style="font-size:18px">일시품절</span>':'')+
    '<button class="heart'+(wish?' on':'')+'" data-wish="'+esc(m.id)+'" aria-label="찜">'+HEART+'</button>'+
    '<div class="strip">'+esc(stripOf(m))+'</div></div>'+
    '<div class="row1"><h3 class="ucard-name">'+esc(m.nm)+'</h3><span class="bdg">'+(m.soldout?'일시품절':'당일발송')+'</span><span class="eta">'+esc(badgeOf(m))+'</span></div>'+
    '<div class="meta">'+(meta.length?meta.join(' · '):'가격은 상담 시 안내드립니다')+'</div>'+
    '<div class="chips"><span class="chip">제휴카드 X</span><span class="chip">부가서비스 X</span><span class="chip gray">5분 상담</span></div>'+
    '<div class="stamp">'+(m.soldout?'입고 알림 상담 신청 가능':'온라인 상담 신청 시 사은품 증정')+'</div></a>';
}
function smallCircles(list){
  return list.map(function(m){return '<a class="m'+(m.soldout?' soldout':'')+hidCls(m)+'" style="flex:0 0 76px;display:flex;flex-direction:column;align-items:center;gap:6px" href="#/model/'+esc(m.id)+'" data-edit="model:'+esc(m.id)+'"><div class="cir">'+im(mImg(m),'','',m.nm)+'</div><span>'+esc(m.nm)+'</span></a>'}).join('');
}
function renderPick(){
  $('#pickSec').hidden=!secOn('pick');
  $('#pickHead').innerHTML=secHead('pick');
  $('#pickCircles').innerHTML=smallCircles(phones());
  $('#bigList').innerHTML=phones().map(bigcard).join('');
}
function renderFoot(){
  $('#foot').innerHTML=esc(S.foot).replace(/\n/g,'<br>');
}
function syncMnp(){ $$('[data-toggle="mnp"]').forEach(function(x){x.classList.toggle('on',MNP)}); }
function renderHome(){
  renderHero(); renderModels(); renderQuick(); renderTrust(); renderPromo(); renderPop(); renderRecent();
  renderZero(); renderWear(); renderGifts(); renderRank(); renderPick(); renderFoot(); syncMnp();
}

/* 카테고리 */
function renderCat(k){
  var tab=CAT_TABS.filter(function(t){return t.k===k})[0]||CAT_TABS[0];
  $('#catTitle').textContent=tab.nm;
  $('#catTabs').innerHTML=CAT_TABS.map(function(t){return '<button class="'+(t.k===tab.k?'on':'')+'" data-cat="'+t.k+'">'+t.nm+'</button>'}).join('');
  var list=models().filter(function(m){return tab.k==='all'||m.cat.indexOf(tab.k)>-1});
  $('#catCircles').innerHTML=smallCircles(list);
  $('#catList').innerHTML=list.map(bigcard).join('') || '<div class="empty">해당 모델이 없습니다</div>';
  syncMnp();
  var on=$('#catTabs .on'); if(on&&on.scrollIntoView) on.scrollIntoView({inline:'center',block:'nearest'});
}
/* 검색 */
function renderSearch(q){
  q=(q||'').replace(/\s/g,'').toLowerCase();
  var alias={'아이폰':'iphone','갤럭시':'galaxy','폴드':'fold','플립':'flip','울트라':'ultra','프맥':'promax','프로맥스':'promax'};
  var list=models().filter(function(m){
    if(!q) return true;
    var key=(m.nm+m.id).replace(/\s/g,'').toLowerCase(), qq=q;
    Object.keys(alias).forEach(function(a){qq=qq.split(a).join(alias[a])});
    return key.indexOf(q)>-1 || m.id.indexOf(qq)>-1;
  });
  $('#results').innerHTML=list.length? list.map(function(m){
    return '<a class="r" href="#/model/'+esc(m.id)+'"><div class="thumb">'+im(mImg(m),'','',m.nm)+'</div><div style="flex:1"><div style="font-weight:800;font-size:15px">'+esc(m.nm)+'</div><div style="font-size:12.5px;color:var(--mute);margin-top:2px">'+esc(m.ds)+'</div></div>'+
      '<span class="pill">'+esc(badgeOf(m))+'</span></a>'}).join('') : '<div class="empty">찾는 모델이 없어요.<br>상담 신청 시 원하시는 모델로 안내해 드려요.</div>';
}
/* 찜 */
function renderWish(){
  var ids=store.get('wish',[]).filter(function(id){var m=byId(id);return m&&(EDIT||!m.hidden)});
  $('#wishList').innerHTML=ids.length?'<div style="padding-top:14px">'+ids.map(function(id){return bigcard(byId(id))}).join('')+'</div>':'<div class="empty">찜한 모델이 없어요.<br>마음에 드는 모델의 ♥ 를 눌러보세요.</div>';
}
/* 모델 상세 */
function renderModel(id, keepRecent){
  var m=byId(id); if(!m||(m.hidden&&!EDIT)){location.hash='#/';return}
  if(!keepRecent){ var r=store.get('recent',[]).filter(function(x){return x!==id}); r.unshift(id); store.set('recent',r.slice(0,10)); }
  var p=priceOf(m, optsOf(m).length?(OPT[m.id]||0):null), rows='';
  if(p.kind==='sub'){
    rows+='<div class="r"><span>출고가</span><b>'+(p.out!=null?won(p.out):'상담 시 안내')+'</b></div>';
    rows+='<div class="r"><span>이통사 지원금</span><b style="color:var(--pink)">'+(p.sub?'-'+won(p.sub):'-')+'</b></div>';
    rows+='<div class="r hi"><span>구매가</span><b>'+(p.v!=null?won(p.v):'상담 시 안내')+'</b></div>';
  } else {
  rows+='<div class="r"><span>출고가</span><b>'+(p.out!=null?won(p.out):'상담 시 안내')+'</b></div>';
  rows+='<div class="r hi"><span>번호이동 구매가</span><b>'+(p.mnp!=null?(p.mnp===0?'0원':won(p.mnp)):'상담 시 안내')+'</b></div>';
  rows+='<div class="r hi"><span>기기변경 구매가</span><b>'+(p.chg!=null?(p.chg===0?'0원':won(p.chg)):'상담 시 안내')+'</b></div>';
  }
  $('#mdTitle').textContent=m.nm;
  var pc=colorsOf(m).filter(function(c){return c.nm===PICK[m.id]})[0];
  $('#mdBody').innerHTML='<div class="ucard" data-edit="model:'+esc(m.id)+'"><div class="md-img" id="mdImg">'+im((pc&&pc.img)||mImg(m),'',true,m.nm)+(m.soldout?'<span class="so-tag" style="font-size:22px">일시품절</span>':'')+'</div>'+
    '<h2 class="md-h ucard-name">'+esc(m.nm)+'</h2><p style="color:var(--sub);margin-top:4px">'+esc(m.ds)+'</p>'+
    '<div class="pills" style="margin-top:10px">'+m.tags.map(function(t){return '<span class="pill">'+esc(t)+'</span>'}).join('')+'</div>'+
    colorPicker(m)+optPicker(m)+
    (m.soldout?'<div class="so-notice">현재 일시품절입니다. 상담 신청해 주시면 입고 즉시 안내드립니다.</div>':'')+
    '<div class="ptable" id="ucatPrice">'+rows+'<div class="note">'+esc(S.priceNote)+'</div></div>'+
    '<div class="md-chips"><span class="chip">제휴카드 의무가입 X</span><span class="chip">부가서비스 의무가입 X</span><span class="chip gray">당일 택배 발송</span><span class="chip gray">5분 상담</span></div>'+
    '<button class="cta ucard-cta" data-open="consult" data-model="'+esc(m.id)+'" data-color="'+esc(PICK[m.id]||'')+'" data-opt="'+esc(optsOf(m).length?optsOf(m)[OPT[m.id]||0].nm:'')+'">'+(m.soldout?'입고 알림 상담 신청하기':'온라인 상담 신청하기')+'</button></div>';
}

var PICK={};   // 상세에서 고른 컬러 (모델별)
function optPicker(m){
  var os=optsOf(m); if(os.length<2) return '';
  var cur=OPT[m.id]||0;
  return '<div class="cpick"><div class="cpick-l">사이즈</div><div class="cpick-row">'+os.map(function(o,i){
    return '<button type="button" class="opt'+(i===cur?' on':'')+'" data-opt-pick="'+i+'" data-model="'+esc(m.id)+'">'+esc(o.nm)+'</button>';
  }).join('')+'</div></div>';
}
function colorPicker(m){
  var cs=colorsOf(m); if(cs.length<2) return '';
  var cur=PICK[m.id]||cs[0].nm;
  return '<div class="cpick"><div class="cpick-l">컬러 <b id="cpickName">'+esc(cur)+'</b></div><div class="cpick-row">'+cs.map(function(c){
    return '<button type="button" class="sw'+(c.nm===cur?' on':'')+'" data-color-pick="'+esc(c.nm)+'" data-model="'+esc(m.id)+'" aria-label="'+esc(c.nm)+'" style="--c:'+esc(c.hex||'#ddd')+'"></button>';
  }).join('')+'</div></div>';
}

/* ---------------- 라우터 ---------------- */
var homeScroll=0;
function route(){
  var h=location.hash.replace(/^#\/?/,'').split('/'), v=h[0]||'home';
  var prev=$('.view.on'); if(prev&&prev.id==='v-home') homeScroll=window.scrollY;
  $$('.view').forEach(function(x){x.classList.remove('on')});
  var tab='home';
  if(v==='cat'){renderCat(h[1]||'all');$('#v-cat').classList.add('on')}
  else if(v==='model'){renderModel(decodeURIComponent(h[1]||''));$('#v-model').classList.add('on')}
  else if(v==='search'){$('#v-search').classList.add('on');tab='search';renderSearch($('#q').value);setTimeout(function(){try{$('#q').focus()}catch(e){}},50)}
  else if(v==='wish'){renderWish();$('#v-wish').classList.add('on');tab='wish'}
  else {
    $('#v-home').classList.add('on');renderRecent();renderPick();
    requestAnimationFrame(function(){window.scrollTo(0,homeScroll)});onScroll();
    setTab('home'); return;
  }
  window.scrollTo(0,0); $('#topbar').classList.remove('show'); setTab(tab);
}
function setTab(t){ $$('.tabbar a').forEach(function(a){a.classList.toggle('on',a.getAttribute('data-tab')===t)}); }
// 데이터가 바뀌었을 때 지금 보고 있는 화면을 스크롤 유지한 채 다시 그림
function refresh(){
  var y=window.scrollY;
  renderHome();
  var h=location.hash.replace(/^#\/?/,'').split('/'), v=h[0]||'home';
  if(v==='cat') renderCat(h[1]||'all');
  else if(v==='model') renderModel(decodeURIComponent(h[1]||''),true);
  else if(v==='search') renderSearch($('#q').value);
  else if(v==='wish') renderWish();
  window.scrollTo(0,y);
}
function onScroll(){
  var home=$('#v-home').classList.contains('on'), h=$('#hero').offsetHeight;
  $('#topbar').classList.toggle('show',home && window.scrollY>h+40);
}

/* ---------------- 바텀시트 ---------------- */
function openSheet(html){ $('#sheetBody').innerHTML=html; $('#dim').classList.add('show'); $('#sheet').classList.add('show'); $('#sheet').scrollTop=0; }
function closeSheet(){ $('#dim').classList.remove('show'); $('#sheet').classList.remove('show'); }
window.__stClose=closeSheet;

function sheetContact(){
  return '<h3>무엇이든 물어보세요</h3><div class="contact-btns"><a href="tel:'+esc(S.tel)+'">📞 전화 상담</a><a class="kakao" href="'+esc(S.kakao)+'" target="_blank" rel="noopener">💬 카톡 문의</a></div>'+
    '<div class="todo" style="margin-top:12px">고객센터 '+esc(S.tel)+'<br>상담 신청서를 남겨주시면 순서대로 연락드립니다.</div>'+
    '<button class="cta" data-open="consult">온라인 상담 신청하기</button>';
}
function sheetGuide(){
  return '<h3>구매 가이드</h3><ol class="steps">'+
    '<li><b>온라인 상담 신청</b><br><span style="color:var(--sub);font-size:13px">원하는 모델을 고르고 신청서를 남겨주세요.</span></li>'+
    '<li><b>상담 연락</b><br><span style="color:var(--sub);font-size:13px">요금제·할인 방식·최종 금액을 안내드립니다.</span></li>'+
    '<li><b>조건 확인 후 결정</b><br><span style="color:var(--sub);font-size:13px">고객님이 동의하실 때만 구매가 진행됩니다.</span></li>'+
    '<li><b>당일 택배 발송 또는 매장 방문</b><br><span style="color:var(--sub);font-size:13px">택배로 받거나 매장에서 바로 개통·수령하세요.</span></li>'+
    '</ol><button class="cta" data-open="consult">온라인 상담 신청하기</button>';
}
function sheetStore(){
  var list=S.stores.filter(function(s){return s&&s.nm});
  return '<h3>매장찾기</h3>'+(list.length?'<div>'+list.map(function(s){
      return '<div class="store-li"><b>'+esc(s.nm)+'</b><div>'+esc(s.addr||'')+'</div>'+(s.tel?'<div><a href="tel:'+esc(s.tel)+'" style="color:var(--pink);font-weight:700">'+esc(s.tel)+'</a></div>':'')+'</div>';
    }).join('')+'</div>':'<div class="todo">가까운 매장은 상담 시 안내드립니다.</div>')+
    (S.storeNote?'<div class="todo" style="margin-top:10px">'+esc(S.storeNote)+'</div>':'')+
    '<button class="cta" data-open="consult">방문 예약 상담 신청하기</button>';
}

/* ---------------- 상담 신청서 (기존 갤럭시 신청서와 같은 저장 방식) ---------------- */
var SB_URL='https://ebggtghzqtxfylbhqfoh.supabase.co/rest/v1/reservations_udak';
var SB_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZ2d0Z2h6cXR4ZnlsYmhxZm9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNDk4MzgsImV4cCI6MjA5NjgyNTgzOH0.bPqIVbrnh2I9pi9rBQzQNOXQcG8v5WbBauZynkED_-Q';
function colorOpts(m, sel){
  var cs=m?colorsOf(m):[]; if(cs.length<2) return '';
  return '<option value="">상담 시 결정</option>'+cs.map(function(c){return '<option'+(c.nm===sel?' selected':'')+'>'+esc(c.nm)+'</option>'}).join('');
}
function optOpts(m, sel){
  var os=m?optsOf(m):[]; if(os.length<2) return '';
  return os.map(function(o){return '<option'+(o.nm===sel?' selected':'')+'>'+esc(o.nm)+'</option>'}).join('');
}
function sheetConsult(modelId, colorNm, optNm){
  var opts=models().filter(function(m){return !m.hidden}).map(function(m){
    return '<option value="'+esc(m.nm)+'" data-id="'+esc(m.id)+'"'+(m.id===modelId?' selected':'')+'>'+esc(m.nm)+(m.soldout?' (일시품절 · 입고 알림)':'')+'</option>';
  }).join('');
  return '<section id="consultForm"><h3>온라인 상담 신청</h3>'+
    '<div class="ff"><label>이름 <span class="req">*</span></label><input type="text" id="mUserName" placeholder="이름을 입력해 주세요" autocomplete="name"></div>'+
    '<div class="ff"><label>연락처 <span class="req">*</span></label><div class="phone3"><input type="text" id="mPhone1" value="010" readonly tabindex="-1"><span>-</span><input type="tel" id="mPhone2" maxlength="4" inputmode="numeric" placeholder="0000"><span>-</span><input type="tel" id="mPhone3" maxlength="4" inputmode="numeric" placeholder="0000"></div></div>'+
    '<div class="ff"><label>생년월일 <span class="req">*</span></label><input type="text" id="mUserBirth" inputmode="numeric" maxlength="8" placeholder="예: 940101"></div>'+
    '<div class="ff"><label>현재 통신사 <span class="req">*</span></label><select id="mCarrierSel"><option value="" selected disabled>통신사를 선택해 주세요</option><option>SKT</option><option>KT</option><option>LG U+</option><option>알뜰폰</option></select></div>'+
    '<div class="ff"><label>관심 기기 <span class="req">*</span></label><select id="mDeviceSelect"><option value=""'+(modelId?'':' selected')+' disabled>기기를 선택해 주세요</option>'+opts+'<option value="상담 후 결정">상담 후 결정할게요</option></select></div>'+
    '<div class="ff" id="mOptWrap"'+(optOpts(byId(modelId))?'':' hidden')+'><label>사이즈</label><select id="mOptSel">'+optOpts(byId(modelId),optNm)+'</select></div>'+
    '<div class="ff" id="mColorWrap"'+(colorOpts(byId(modelId))?'':' hidden')+'><label>희망 컬러</label><select id="mColorSel">'+colorOpts(byId(modelId),colorNm)+'</select></div>'+
    '<div class="ff"><label>전달사항</label><textarea id="mUserNote" rows="3" maxlength="500" placeholder="요청사항을 적어주세요"></textarea></div>'+
    '<label class="agree"><input type="checkbox" id="mPrivacyCheck"> 개인정보 수집 및 이용 동의 (필수)<button type="button" data-privacy>자세히</button></label>'+
    '<div class="privacy-txt" id="privacyTxt">유플러스 다이렉트(이하 "회사")는 온라인 상담 신청 접수 및 상담 안내를 위해 아래와 같이 개인정보를 수집·이용합니다.<br><br>'+
    '· 항목: 이름, 전화번호, 생년월일, 희망기종, 현재 통신사<br>· 목적: 온라인 상담 신청 접수, 상담 연락 및 구매·개통 안내<br>· 보유 기간: 수집일로부터 6개월<br><br>'+
    '동의를 거부할 권리가 있으며, 거부 시 온라인 상담 신청이 제한될 수 있습니다. 수집된 개인정보는 제3자에게 제공되지 않으며, 보유 기간 종료 후 즉시 파기됩니다.</div>'+
    '<button type="button" class="cta" id="mSubmitBtn"><span class="rf-submit-label">온라인 상담 신청하기</span></button></section>';
}
function birth8(b){ b=String(b||'').replace(/\D/g,''); if(b.length===6){ var yy=+b.slice(0,2), cy=new Date().getFullYear()%100; b=(yy<=cy?'20':'19')+b; } return b; }
function submitConsult(){
  if(EDIT){ alert('관리자 화면에서는 신청이 저장되지 않습니다.'); return; }
  var name=$('#mUserName').value.trim();
  var phone='010'+$('#mPhone2').value.replace(/\D/g,'')+$('#mPhone3').value.replace(/\D/g,'');
  var birth=birth8($('#mUserBirth').value);
  var carrier=$('#mCarrierSel').value, device=$('#mDeviceSelect').value, memo=$('#mUserNote').value.trim();
  if(!name){ alert('이름을 입력해주세요.'); return; }
  if(phone.length!==11){ alert('010으로 시작하는 11자리 전화번호를 입력해주세요.'); return; }
  if(window.udakBlocked && window.udakBlocked(phone)){ alert('현재 해당 번호로는 신청이 제한되어 있습니다.\n문의사항은 고객센터로 연락해주세요.'); return; }
  var t=new Date(), bY=+birth.slice(0,4), bM=+birth.slice(4,6), bD=+birth.slice(6,8);
  if(birth.length!==8||bY<1900||bY>t.getFullYear()||bM<1||bM>12||bD<1||bD>31){ alert('생년월일을 정확히 입력해주세요. (예: 940101)'); return; }
  var age=t.getFullYear()-bY; if(t.getMonth()+1<bM||(t.getMonth()+1===bM&&t.getDate()<bD)) age--;
  if(age<19){ alert('미성년자 고객님 안내\n\n미성년자 고객님은 개통 시 본인 신분증 확인과\n법정대리인 동의가 필수입니다.\n보호자와 함께 신청해 주세요.'); return; }
  if(!carrier){ alert('현재 통신사를 선택해주세요.'); return; }
  if(!device){ alert('관심 기기를 선택해주세요.'); return; }
  if(!$('#mPrivacyCheck').checked){ alert('개인정보 수집 및 이용에 동의해주세요.'); return; }
  var btn=$('#mSubmitBtn'); if(btn.disabled) return; btn.disabled=true; btn.firstChild.textContent='신청 중...';
  var reset=function(){ btn.disabled=false; btn.firstChild.textContent='온라인 상담 신청하기'; };
  var phoneF=phone.slice(0,3)+'-'+phone.slice(3,7)+'-'+phone.slice(7);
  var body={name:name, phone:phoneF, carrier:carrier, channel:window.PAGE_CHANNEL||'메타', utm_campaign:window.PAGE_UTM_CAMPAIGN||null,
    device_interest:device, capacity:($('#mOptSel')&&!$('#mOptWrap').hidden&&$('#mOptSel').value)||null, product_color:($('#mColorSel')&&$('#mColorSel').value)||null, birth_date:birth, memo:memo||null, status:'신규'};
  if(typeof window.udakMetaIds==='function'){ var mi=window.udakMetaIds(); Object.keys(mi).forEach(function(k){ body[k]=mi[k]; }); }
  fetch(SB_URL,{method:'POST',headers:{'Content-Type':'application/json','apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY,'Prefer':'return=minimal'},body:JSON.stringify(body)})
  .then(function(res){
    if(res.ok){ if(typeof window.fbq!=='undefined') window.fbq('track','Lead'); reset(); closeSheet(); showTicket(); }
    else { reset(); res.text().then(function(x){ console.error('Supabase:',x); alert('신청 오류가 발생했습니다. 다시 시도해주세요.'); }); }
  }).catch(function(e){ console.error(e); reset(); alert('네트워크 오류가 발생했습니다. 다시 시도해주세요.'); });
}
function showTicket(){ $('#ticket').classList.add('on'); document.body.style.overflow='hidden'; }
function closeTicket(){ $('#ticket').classList.remove('on'); document.body.style.overflow=''; }

function act(go, el){
  if(!go) return;
  if(go.charAt(0)==='#'){ location.hash=go; return; }
  if(go.indexOf('sec:')===0){ var id={gifts:'giftSec',wear:'wearSec',zero:'zeroSec',rank:'rankSec',pick:'pickSec',pop:'popSec'}[go.slice(4)];
    var goSec=function(){ var el=id&&document.getElementById(id); if(el) window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-60,behavior:'smooth'}); };
    if(!$('#v-home').classList.contains('on')){ location.hash='#/'; setTimeout(goSec,120); } else goSec(); return; }
  if(go==='consult') openSheet(sheetConsult(el&&el.getAttribute('data-model'), el&&el.getAttribute('data-color'), el&&el.getAttribute('data-opt')));
  else if(go==='contact') openSheet(sheetContact());
  else if(go==='guide') openSheet(sheetGuide());
  else if(go==='store') openSheet(sheetStore());
  else if(/^https?:\/\//.test(go)) location.href=go;
}

/* ---------------- 이벤트 ---------------- */
var editing = EDIT; // 관리자: 편집 켜짐(누르면 수정) / 꺼짐(고객처럼 둘러보기)
document.addEventListener('click',function(e){
  if(EDIT && editing && window.__stEditClick && window.__stEditClick(e)) return;
  var t=e.target;
  if(t.closest('#mSubmitBtn')){ e.preventDefault(); submitConsult(); return; }
  if(t.closest('[data-privacy]')){ e.preventDefault(); $('#privacyTxt').classList.toggle('on'); return; }
  if(t.closest('#ticket') && (t.closest('.x') || t.id==='ticket')){ closeTicket(); return; }
  var op=t.closest('[data-opt-pick]');
  if(op){ e.preventDefault(); e.stopPropagation(); OPT[op.getAttribute('data-model')]=+op.getAttribute('data-opt-pick'); renderModel(op.getAttribute('data-model'),true); return; }
  var cp=t.closest('[data-color-pick]');
  if(cp){ e.preventDefault(); e.stopPropagation(); var mm=byId(cp.getAttribute('data-model')), nm=cp.getAttribute('data-color-pick'), cc=colorsOf(mm).filter(function(c){return c.nm===nm})[0];
    PICK[mm.id]=nm; $$('[data-color-pick]').forEach(function(b){b.classList.toggle('on',b===cp)}); $('#cpickName').textContent=nm;
    if(cc&&cc.img) $('#mdImg').innerHTML=im(cc.img,'',true,mm.nm)+(mm.soldout?'<span class="so-tag" style="font-size:22px">일시품절</span>':'');
    var cb=$('.ucard-cta'); if(cb) cb.setAttribute('data-color',nm); return; }
  var w=t.closest('[data-wish]');
  if(w){e.preventDefault();e.stopPropagation();var id=w.getAttribute('data-wish'),l=store.get('wish',[]),i=l.indexOf(id);
    if(i>-1)l.splice(i,1);else l.unshift(id);store.set('wish',l);
    $$('[data-wish="'+id+'"]').forEach(function(b){b.classList.toggle('on',i<0)}); if($('#v-wish').classList.contains('on'))renderWish(); return}
  var o=t.closest('[data-open]'); if(o){e.preventDefault();act(o.getAttribute('data-open'),o);return}
  var g=t.closest('[data-go]'); if(g){e.preventDefault();act(g.getAttribute('data-go'),g);return}
  var c=t.closest('[data-cat]'); if(c){location.hash='#/cat/'+c.getAttribute('data-cat');return}
  var tg=t.closest('[data-toggle]'); if(tg){ MNP=!MNP; refresh(); return; }
  if(t.closest('[data-back]')){e.preventDefault();history.length>1?history.back():location.hash='#/';return}
});
document.addEventListener('input',function(e){
  var id=e.target.id;
  if(id==='mPhone2'||id==='mPhone3'){ e.target.value=e.target.value.replace(/\D/g,'').slice(0,4); if(id==='mPhone2'&&e.target.value.length===4){ var n=$('#mPhone3'); if(n) n.focus(); } }
  else if(id==='mUserBirth'){ e.target.value=e.target.value.replace(/\D/g,'').slice(0,8); }
  else if(id==='mUserName'){ e.target.value=e.target.value.replace(/[0-9]/g,''); }
  else if(id==='q'){ renderSearch(e.target.value); }
});
document.addEventListener('change',function(e){
  if(e.target.id!=='mDeviceSelect') return;
  var o=e.target.selectedOptions&&e.target.selectedOptions[0], m=o&&byId(o.getAttribute('data-id')), h=colorOpts(m);
  $('#mColorSel').innerHTML=h; $('#mColorWrap').hidden=!h;
  var oh=optOpts(m); $('#mOptSel').innerHTML=oh; $('#mOptWrap').hidden=!oh;
});

/* ---------------- 데이터 불러오기 + 실시간 반영 ---------------- */
function apply(d){
  if(d && d.updatedAt && d.updatedAt===lastStamp) return;
  lastStamp=(d&&d.updatedAt)||0;
  S=normalize(d);
  refresh();
}
function load(){
  return fetch(DB+'/store.json',{cache:'no-store'}).then(function(r){return r.ok?r.json():null}).then(function(d){ apply(d); return d; }).catch(function(){ return null; });
}
function live(){
  if(!window.EventSource) return;
  try{
    var es=new EventSource(DB+'/store.json');
    var on=function(ev){ try{ var x=JSON.parse(ev.data); if(x && x.path==='/'){ apply(x.data); } else { load(); } }catch(e){} };
    es.addEventListener('put',on); es.addEventListener('patch',on);
  }catch(e){}
}

/* 관리자 화면에서 쓰는 내부 함수 묶음 */
window.STORE = {
  get S(){ return S; }, set S(v){ S=v; },
  DB:DB, GH:GH, IMG:IMG, FOLDERS:FOLDERS, DEFAULT:DEFAULT, CAT_TABS:CAT_TABS, GO_OPTIONS:GO_OPTIONS, QI:QI, TI:TI,
  esc:esc, clone:clone, num:num, won:won, imgSrc:imgSrc, im:im, byId:byId, colorsOf:colorsOf, optsOf:optsOf, DEFCOLORS:DEFCOLORS, mImg:mImg, mCard:mCard, normalize:normalize,
  refresh:refresh, openSheet:openSheet, closeSheet:closeSheet, load:load, apply:apply,
  setEditing:function(v){ editing=v; document.body.classList.toggle('editing',v); },
  isEditing:function(){ return editing; },
  setStamp:function(v){ lastStamp=v; }
};

/* 시작 */
var ROOT=document.getElementById('storeRoot')||document.body;
ROOT.insertAdjacentHTML('afterbegin', MARKUP);
document.body.insertAdjacentHTML('beforeend','<div class="ticket" id="ticket"><div class="tw"><img src="/assets/ticket-complete-blue.webp" alt="상담 신청이 정상적으로 접수되었습니다"><button class="x" aria-label="닫기"></button></div></div>');
$('#dim').addEventListener('click',closeSheet);
window.addEventListener('scroll',onScroll,{passive:true});
window.addEventListener('hashchange',route);
bindHeroSwipe();
renderHome();
route();
if(EDIT) document.body.classList.add('edit','editing');
load().then(function(){ if(!EDIT) live(); if(window.__stReady) window.__stReady(); });
})();
