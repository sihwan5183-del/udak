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

var MARKUP = "<!-- 스크롤 시 나타나는 상단바 (쿠팡이츠 방식) -->\n<header class=\"topbar\" id=\"topbar\">\n  <button class=\"lbl\" data-open=\"store\"><svg class=\"ico\" viewBox=\"0 0 24 24\"><path d=\"M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z\"/><circle cx=\"12\" cy=\"9.5\" r=\"2.5\"/></svg>매장찾기<svg class=\"ico chev\" viewBox=\"0 0 24 24\" style=\"width:18px;height:18px\"><path d=\"m6 9 6 6 6-6\"/></svg></button>\n  <button data-go=\"search\"><svg class=\"ico\" viewBox=\"0 0 24 24\"><circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"m20 20-3.5-3.5\"/></svg></button>\n  <button style=\"position:relative;display:flex\" data-open=\"noti\"><svg class=\"ico\" viewBox=\"0 0 24 24\"><path d=\"M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8\"/><path d=\"M10.3 21a1.9 1.9 0 0 0 3.4 0\"/></svg><i class=\"dot-new\"></i></button>\n</header>\n<div class=\"app\" id=\"app\">\n<!-- ===================== 홈 ===================== -->\n<main class=\"view on\" id=\"v-home\">\n  <!-- 1. 히어로 -->\n  <section class=\"hero\" id=\"hero\">\n    <div class=\"hero-top\">\n      <div class=\"brand\" id=\"brand\" data-edit=\"brand\"></div>\n      <div class=\"hero-r\">\n        <div class=\"uplus-logo\">U<sup>+</sup></div>\n        <div class=\"hero-icons\">\n          <button data-go=\"search\" aria-label=\"검색\"><svg class=\"ico\" viewBox=\"0 0 24 24\"><circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"m20 20-3.5-3.5\"/></svg></button>\n          <button data-open=\"noti\" aria-label=\"알림\"><svg class=\"ico\" viewBox=\"0 0 24 24\"><path d=\"M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8\"/><path d=\"M10.3 21a1.9 1.9 0 0 0 3.4 0\"/></svg><i class=\"dot-new\"></i></button>\n        </div>\n      </div>\n    </div>\n    <div class=\"hero-track\" id=\"heroTrack\"></div>\n    <div class=\"dots\" id=\"heroDots\"></div>\n    <div class=\"deal-subs\" id=\"dealSubs\"></div>\n  </section>\n  <!-- 2. 매장찾기 -->\n  <button class=\"locbar\" data-open=\"store\">\n    <svg class=\"ico\" viewBox=\"0 0 24 24\"><path d=\"M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z\"/><circle cx=\"12\" cy=\"9.5\" r=\"2.5\"/></svg>\n    <span class=\"lbl\">매장찾기 <svg class=\"ico chev\" viewBox=\"0 0 24 24\" style=\"width:18px;height:18px\"><path d=\"m6 9 6 6 6-6\"/></svg></span>\n    <svg class=\"ico\" viewBox=\"0 0 24 24\" style=\"width:18px;height:18px;color:#9aa0a8\"><path d=\"m9 6 6 6-6 6\"/></svg>\n  </button>\n  <!-- 3. 검색 -->\n  <label class=\"search\" data-go=\"search\">\n    <svg class=\"ico\" viewBox=\"0 0 24 24\"><circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"m20 20-3.5-3.5\"/></svg>\n    <input type=\"text\" placeholder=\"어떤 휴대폰을 찾고 계세요?\" readonly tabindex=\"-1\">\n  </label>\n  <!-- 4. 모델 원형 아이콘 -->\n  <nav class=\"models\" id=\"models\"></nav>\n  <!-- 5. 퀵메뉴 -->\n  <nav class=\"quick hscroll\" id=\"quick\"></nav>\n  <!-- 6. 신뢰 스트립 -->\n  <div class=\"trust hscroll\" id=\"trust\"></div>\n  <!-- 7. 프로모 배너 -->\n  <a class=\"promo\" id=\"promo\" data-edit=\"promo\"></a>\n  <!-- 8. 많이 찾아요 -->\n  <section class=\"sec\" id=\"popSec\">\n    <div id=\"popHead\"></div>\n    <div class=\"popgrid\" id=\"popgrid\"></div>\n  </section>\n  <div class=\"divider\" style=\"margin-top:16px\"></div>\n  <!-- ===== 여기부터 쿠팡이츠 모티브 섹션 ===== -->\n  <!-- 9-1. 최근 본 모델 (본 게 없으면 숨김) -->\n  <section class=\"sec\" id=\"recentSec\" hidden>\n    <div id=\"recentHead\"></div>\n    <div class=\"hcards hscroll\" id=\"recent\"></div>\n  </section>\n  <!-- 9-2. 기기값 0원 모아보기 -->\n  <section class=\"sec zero-sec\" id=\"zeroSec\">\n    <div id=\"zeroHead\"></div>\n    <div class=\"hcards hscroll\" id=\"zero\"></div>\n  </section>\n  <section class=\"sec\" id=\"wearSec\">\n    <div id=\"wearHead\"></div>\n    <div class=\"hcards hscroll\" id=\"wear\"></div>\n  </section>\n  <div class=\"divider\"></div>\n  <!-- 10-1. 한정 사은품 -->\n  <section class=\"sec\" id=\"giftSec\">\n    <div id=\"giftHead\"></div>\n    <div class=\"dcards hscroll\" id=\"gifts\"></div>\n  </section>\n  <!-- 10-2. 우리 동네 인기 모델 -->\n  <section class=\"sec\" id=\"rankSec\">\n    <div id=\"rankHead\"></div>\n    <div class=\"dcards hscroll\" id=\"rank\"></div>\n  </section>\n  <div class=\"divider\" style=\"margin-top:16px\"></div>\n  <!-- 11. 골라보는 휴대폰 -->\n  <section class=\"sec ucat-wrap\" id=\"pickSec\" style=\"padding-bottom:0\">\n    <div id=\"pickHead\"></div>\n    <nav class=\"models hscroll\" id=\"pickCircles\" style=\"display:flex;gap:4px;padding:0 10px 6px\"></nav>\n    <div class=\"filters\">\n      <div class=\"seg\" data-seg></div><div class=\"maxv-wrap\" data-maxwrap></div>\n      <button class=\"fbtn\" type=\"button\" data-sort-open><span class=\"sort-lbl\">추천순</span> <svg class=\"ico\" viewBox=\"0 0 24 24\" style=\"width:14px;height:14px\"><path d=\"m6 9 6 6 6-6\"/></svg></button>\n      <button class=\"fbtn\">필터 <svg class=\"ico\" viewBox=\"0 0 24 24\" style=\"width:14px;height:14px\"><path d=\"M4 6h16M7 12h10M10 18h4\"/></svg></button>\n    </div>\n    <div class=\"adlabel\">추천 리스트</div>\n    <div id=\"bigList\"></div>\n  </section>\n  <footer class=\"foot\" id=\"foot\" data-edit=\"foot\"></footer>\n</main>\n<!-- ===================== 카테고리 (쿠팡이츠 '한식' 화면) ===================== -->\n<main class=\"view\" id=\"v-cat\">\n  <div class=\"subhead\"><button data-back><svg class=\"ico\" viewBox=\"0 0 24 24\"><path d=\"M19 12H5M11 18l-6-6 6-6\"/></svg></button><h1 id=\"catTitle\">전체</h1><span class=\"sh-r\"><button data-home aria-label=\"홈으로\"><svg class=\"ico\" viewBox=\"0 0 24 24\"><path d=\"M3 10.5 12 3l9 7.5\"/><path d=\"M5 9.5V20h5v-6h4v6h5V9.5\"/></svg></button><button data-go=\"search\"><svg class=\"ico\" viewBox=\"0 0 24 24\"><circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"m20 20-3.5-3.5\"/></svg></button></span></div>\n  <div class=\"sticky-tabs\"><nav class=\"ctabs hscroll\" id=\"catTabs\"></nav></div>\n  <nav class=\"hscroll\" id=\"catCircles\" style=\"display:flex;gap:4px;padding:14px 10px 6px\"></nav>\n  <div class=\"filters\">\n    <div class=\"seg\" data-seg></div><div class=\"maxv-wrap\" data-maxwrap></div>\n    <button class=\"fbtn\" type=\"button\" data-sort-open><span class=\"sort-lbl\">추천순</span> <svg class=\"ico\" viewBox=\"0 0 24 24\" style=\"width:14px;height:14px\"><path d=\"m6 9 6 6 6-6\"/></svg></button>\n    <button class=\"fbtn\">필터 <svg class=\"ico\" viewBox=\"0 0 24 24\" style=\"width:14px;height:14px\"><path d=\"M4 6h16M7 12h10M10 18h4\"/></svg></button>\n  </div>\n  <div class=\"adlabel\">추천 리스트</div>\n  <div id=\"catList\"></div>\n</main>\n<!-- ===================== 검색 ===================== -->\n<main class=\"view\" id=\"v-search\">\n  <div class=\"subhead\" style=\"gap:4px;justify-content:flex-start\"><button data-back><svg class=\"ico\" viewBox=\"0 0 24 24\"><path d=\"M19 12H5M11 18l-6-6 6-6\"/></svg></button>\n    <label class=\"search\" style=\"margin:0;flex:1;height:40px\"><svg class=\"ico\" viewBox=\"0 0 24 24\" style=\"width:18px;height:18px\"><circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"m20 20-3.5-3.5\"/></svg><input id=\"q\" type=\"search\" autocomplete=\"off\" placeholder=\"모델명을 입력하세요 (예: 폴드, 아이폰)\"></label></div>\n  <div class=\"results\" id=\"results\"></div>\n</main>\n<!-- ===================== 찜한 모델 ===================== -->\n<main class=\"view\" id=\"v-wish\">\n  <div class=\"subhead\"><span style=\"width:40px\"></span><h1>찜한 모델</h1><span style=\"width:40px\"></span></div>\n  <div id=\"wishList\"></div>\n</main>\n<!-- ===================== 모델 상세 (다음 단계) ===================== -->\n<main class=\"view\" id=\"v-model\">\n  <div class=\"subhead\"><button data-back><svg class=\"ico\" viewBox=\"0 0 24 24\"><path d=\"M19 12H5M11 18l-6-6 6-6\"/></svg></button><h1 id=\"mdTitle\"></h1><button data-home aria-label=\"홈으로\"><svg class=\"ico\" viewBox=\"0 0 24 24\"><path d=\"M3 10.5 12 3l9 7.5\"/><path d=\"M5 9.5V20h5v-6h4v6h5V9.5\"/></svg></button></div>\n  <div id=\"mdBody\" style=\"padding:0 16px 20px\"></div>\n</main>\n</div><!-- /app -->\n<!-- 하단 탭바 -->\n<nav class=\"tabbar\" id=\"tabbar\">\n  <a href=\"#/\" data-tab=\"home\"><svg class=\"ico\" viewBox=\"0 0 24 24\"><path d=\"M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z\"/></svg>홈</a>\n  <a href=\"#/search\" data-tab=\"search\"><svg class=\"ico\" viewBox=\"0 0 24 24\"><circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"m20 20-3.5-3.5\"/></svg>검색</a>\n  <a href=\"#/wish\" data-tab=\"wish\"><svg class=\"ico\" viewBox=\"0 0 24 24\"><path d=\"M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z\"/></svg>찜</a>\n  <a href=\"javascript:void 0\" data-open=\"consult\" data-tab=\"consult\"><svg class=\"ico\" viewBox=\"0 0 24 24\"><rect x=\"5\" y=\"4\" width=\"14\" height=\"17\" rx=\"2\"/><path d=\"M9 4h6v3H9zM9 12l2 2 4-4\"/></svg>상담신청</a>\n  <a href=\"javascript:void 0\" data-open=\"store\" data-tab=\"store\"><svg class=\"ico\" viewBox=\"0 0 24 24\"><path d=\"M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z\"/><circle cx=\"12\" cy=\"9.5\" r=\"2.5\"/></svg>매장</a>\n</nav>\n<div class=\"dim\" id=\"dim\"></div>\n<div class=\"sheet\" id=\"sheet\"><button type=\"button\" class=\"sheet-x\" aria-label=\"닫기\">×</button><div id=\"sheetBody\"></div></div>";

/* ---------------- 기본 데이터 (파이어베이스가 비어 있을 때) ---------------- */
var DEFAULT = {
  v:1,
  brand:{small:'유플러스 공식파트너사', big:'유플러스 다이렉트'},
  // 맨 위: 이번 주 특가 (켜면 히어로 슬라이드 대신 보임). items 첫 줄이 대표 모델 — '모델|번호이동 최대|기기변경'
  deal:{on:true, title:'이번 주 특가', img:'hero/hero-02.webp', items:'fold8|73만원|47만원\nflip8|60만원|34만원\ns26|68만원|50만원\niphone17|50만원|24만원'},
  hero:[
    {k:'U+ 최초의 온라인 대리점', t:'유플러스 다이렉트', s:'불필요한 가입 없이 온라인으로 간편하게.', img:'hero/hero-01.webp', go:'#/model/iphone18pro'},
    {k:'갤럭시 폴드8 / 플립8', t:'', s:'', sup:'폴드8|73만원|47만원\n플립8|60만원|34만원', img:'hero/hero-02.webp', go:'#/model/fold8'},
    {k:'갤럭시 S26 시리즈', t:'', s:'', sup:'|68만원|50만원', img:'hero/hero-03.webp', go:'#/model/s26ultra'}
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
    // 워치·태블릿·TV프리: 가격은 아래 pricing(가격표)에서 관리
    {id:'watchultra2', nm:'갤럭시 워치 울트라2', cat:['watch'], ds:'티타늄으로 완성한 아웃도어 워치', tags:['이통사 지원금','스마트기기']},
    {id:'watch9',      nm:'갤럭시 워치9',       cat:['watch'], ds:'매일 함께하는 건강 파트너',       tags:['이통사 지원금','스마트기기']},
    {id:'watchse3',    nm:'애플워치 SE3',       cat:['watch'], ds:'아이폰과 가장 잘 어울리는 워치',   tags:['이통사 지원금','스마트기기']},
    {id:'taba11plus',  nm:'갤럭시 탭 A11+',     cat:['tablet'],ds:'넉넉한 화면, 가벼운 태블릿',        tags:['상담 시 안내','스마트기기']},
    {id:'tvfree5',     nm:'U+ tv 프리5',        cat:['tvfree'],ds:'12.4인치 대화면, TV를 내 방 어디서나', tags:['이통사 지원금','스마트기기']},
    {id:'ipada16',     nm:'아이패드 A16',        cat:['tvfree'],ds:'128GB · 가볍게 시작하는 아이패드',   tags:['이통사 지원금','스마트기기']}
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
  priceNote:'',
  stores:[
    {nm:'건대입구역점',addr:'서울시 광진구 능동로 95'},{nm:'군자역점',addr:'서울시 광진구 천호대로 573'},{nm:'신군자점',addr:'서울시 광진구 천호대로 548'},
    {nm:'신자양점',addr:'서울시 광진구 자양번영로 42'},{nm:'성수역점',addr:'서울시 성동구 아차산로 96'},{nm:'용답로데오점',addr:'서울시 성동구 용답동 58-1'},
    {nm:'사가정점',addr:'서울시 중랑구 사가정로52길 5'},{nm:'먹골역점',addr:'서울시 중랑구 동일로 917'},{nm:'장한평역점',addr:'서울시 동대문구 장한로 3'},
    {nm:'수유시장점',addr:'서울시 강북구 미아동 202-11'},{nm:'미아역점',addr:'서울시 강북구 도봉로 187'},{nm:'쌍문세라믹점',addr:'서울시 도봉구 도당로 2'},
    {nm:'쌍문역점',addr:'서울시 도봉구 쌍문동 88-144'},{nm:'암사역점',addr:'서울시 강동구 올림픽로 769'},{nm:'길동역점',addr:'서울시 강동구 양재대로 1465'},
    {nm:'미사역점',addr:'하남시 미사강변동로 70'},{nm:'금광동 E편한세상점',addr:'성남시 중원구 광명로 337'},{nm:'사무실',addr:'구리시 갈매순환로 188'},
    {nm:'리맥스점',addr:'구리시 경춘로 239'},{nm:'퇴계원점',addr:'남양주시 퇴계원읍 퇴계원로 64'},{nm:'해밀점',addr:'남양주시 진접읍 해밀예당3로 57'},
    {nm:'진주아파트점',addr:'남양주시 오남읍 진건오남로 639'},{nm:'장현초교점',addr:'남양주시 진접읍 장현로 83'},{nm:'마석점',addr:'남양주시 화도읍 마석중앙로 65'}
  ],
  biz:{name:'유플러스 다이렉트', ceo:'이승환', addr:'경기도 구리시 갈매동 552-4, 지식산업센터 A동 7층 705호', no:'804-81-00167', email:'udak@daum.net',
       hours:'월~토요일 09:30~20:00'},
  storeNote:'서울·경기 고객님은 예약 후 매장에 방문하시면 당일 개통·수령이 가능합니다.',
  tel:'1660-1412',
  kakao:'http://pf.kakao.com/_HxfVxcn/chat',
  foot:'유플러스 공식파트너사 ㈜신세계정보통신\n고객센터 1660-1412',
  /* 가격표 — 애플 '💰 가격표'에서 관리. 정책(vers)은 적용 시작일(from)부터 자동 적용
     휴대폰: 실구매가 = 출고가 - (공시지원금 + 유플러스 다이렉트 지원금)  또는  출고가 - 유플러스 다이렉트 지원금 (선택약정 25%)
     our 키 = 가입유형_요금제 (mnp=번호이동, chg=기기변경, all=워치·태블릿 공통) */
  pricing:{
    rev:4,        // 데이터 구조 버전 (2: 공시지원금도 번호이동/기기변경 따로, 2TB 제외 · 3: 워치·탭은 요금제 구분 없음)
    show:false,   // 고객 화면에 가격 공개 (가격표에서 켜기)
    // 지원금 구간 (단가표의 '군') — 유플러스 다이렉트 지원금은 구간마다 같음
    plans:{
      phone:[{k:'p115',nm:'115군'},{k:'p85',nm:'85군'}],
      second:[{k:'p1GB',nm:'지원금'}],                                   // 세컨드(워치·태블릿): 요금제 구분 없음
      tvfree:[{k:'p1GB',nm:'1GB 요금제'},{k:'p500MB',nm:'500MB 요금제'}]   // TV프리(TV프리·아이패드)
    },
    // 실제 요금제 — 공시지원금·선택약정(25%)은 요금제마다, grp = 어느 지원금 구간에 속하는지
    tiers:{
      // title = 고객 화면에 보이는 요금제 이름
      phone:[{k:'t85',nm:'85',title:'데이터플랜MAX',fee:85000,grp:'p85'},{k:'t95',nm:'95',title:'플러스플랜 95',fee:95000,grp:'p85'},{k:'t105',nm:'105',title:'플러스플랜 105',fee:105000,grp:'p85'},
             {k:'t115',nm:'115',title:'플러스플랜 115',fee:115000,grp:'p115'},{k:'t130',nm:'130',title:'시그니처 130',fee:130000,grp:'p115'}],
      second:[{k:'t1GB',nm:'기본',grp:'p1GB'}],
      tvfree:[{k:'t1GB',nm:'1GB 요금제',grp:'p1GB'},{k:'t500MB',nm:'500MB 요금제',grp:'p500MB'}]
    },
    base:{phone:'t85', second:'t1GB', tvfree:'t1GB'},   // 홈페이지 카드에 보이는 기준 요금제
    vers:[{id:'v20261003', from:'2026-10-03', memo:'영업기획팀 모바일 단가표 (10/03 ~ 별도 공지 시까지)', rows:[]}]
  }
};
(function(){ // 단가표 → 줄 만들기 [번호이동115, 번호이동85, 기기변경115, 기기변경85]
  var rows=DEFAULT.pricing.vers[0].rows;
  function P(mk,code,cap,model,out,o,so){ rows.push({g:'phone',mk:mk,code:code,cap:cap,model:model,out:out,so:!!so,pub:{},our:{mnp_p115:o[0],mnp_p85:o[1],chg_p115:o[2],chg_p85:o[3]}}); }
  // split = 1GB/500MB 요금제별 지원금이 따로 있는지 (TV프리·아이패드만) — 아니면 첫 칸 하나만 씀
  function W(code,cap,model,out,p1,p2,split){ var pub={}; if(p1!=null) pub.all_t1GB=p1; if(split&&p2!=null) pub.all_t500MB=p2;
    rows.push({g:split?'tvfree':'second',mk:'',code:code,cap:cap,model:model,out:out,so:false,pub:pub,our:{}}); }
  var S1=[680000,650000,420000,350000], S2=[620000,590000,360000,290000];
  P('삼성','SM-S942N','256GB','s26',1254000,S1);
  P('삼성','SM-S947N','256GB','s26plus',1452000,S2);
  P('삼성','SM-S948N','256GB','s26ultra',1797000,S2);
  P('삼성','SM-S937N','256GB','',1353000,[680000,650000,570000,500000]);
  P('삼성','SM-F776N','256GB','flip8',1683000,[600000,570000,340000,270000]);
  P('삼성','SM-F776N','512GB','flip8',null,[750000,720000,490000,420000]);
  P('삼성','SM-F971N','256GB','fold8',2278100,[730000,700000,470000,400000]);
  P('삼성','SM-F971N','512GB','fold8',null,[530000,500000,270000,200000]);
  P('삼성','SM-F976N','256GB','fold8ultra',2577300,[600000,570000,340000,270000]);
  P('삼성','SM-F976N','512GB','fold8ultra',null,[750000,720000,490000,420000]);
  var A18=[440000,410000,190000,160000], A17=[500000,470000,240000,170000];
  [['256GB',1991000],['512GB',2299000],['1TB',2893000]].forEach(function(c){ P('애플','UIP18PR',c[0],'iphone18pro',c[1],A18); });
  [['256GB',2200000],['512GB',2497000],['1TB',3091000]].forEach(function(c){ P('애플','UIP18PM',c[0],'iphone18promax',c[1],A18); });
  P('애플','UIP17','256GB','iphone17',1452000,A17);
  P('애플','UIP17PR','','',null,A17,true);
  P('애플','UIP17PM','','',null,A17,true);
  P('애플','UIPA','','',null,[430000,400000,240000,170000],true);
  W('watchultra2','기본','watchultra2',969100,450000);
  W('watch9','44mm','watch9',569800,164000);
  W('watch9','40mm','watch9',529100,164000);
  W('watchse3','40mm','watchse3',429000,287500);
  W('watchse3','44mm','watchse3',473000,287500);
  W('taba11plus','기본','taba11plus',null);
  W('tvfree5','기본','tvfree5',799700,601700,562100,true);
  W('ipada16','128GB','ipada16',748000,550000,510400,true);
})();
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
  tvfree5:[{nm:'기본',hex:'#3A3A3C',img:'https://i.namu.wiki/i/BeQj_MqtIzsrmIX4_9xVUxo2Ed38qGyNS3jJCKDdMbMmeisoJKoig23xkjR03tMQg2GSXmP6ae0wkKcIA92klzXZsktGeT7YBI_q-v-DoDeCH9qfwD_DnoPD2fAhXnsbUX4LoaEjK2T7gp4MDA7Dgw.webp || model/tvfree5.webp'}],
  ipada16:[{nm:'실버',hex:'#D9DADC',img:'model/ipada16-silver.webp'}],
  taba11plus:[{nm:'기본',hex:'#8A8F98',img:'https://www.lguplus.com/static/pc-contents/images/prdv/20251127-040323-387-In3ubFxO.png'}],
  fold8ultra:[{nm:'바이올렛 쉐도우',hex:'#5C4E77',img:'https://www.lguplus.com/static/pc-contents/images/prdv/20260723-040628-100-q8B7Lw9c.png'},{nm:'그라파이트',hex:'#3A3A3C',img:'https://www.lguplus.com/static/pc-contents/images/prdv/20260723-040656-778-ob3Y60Ad.png'},{nm:'크림',hex:'#F7F4EC',img:'https://www.lguplus.com/static/pc-contents/images/prdv/20260723-040643-727-3rHd0IUe.png'}],
  flip8:[{nm:'핑크',hex:'#F2C6D6',img:'model/flip8-pink.webp'},{nm:'그라파이트',hex:GR,img:'model/flip8-graphite.webp'},{nm:'크림',hex:CR,img:'model/flip8-cream.webp'}]
};
var CAT_TABS = [{k:'all',nm:'전체'},{k:'iphone',nm:'아이폰'},{k:'galaxy',nm:'갤럭시 S'},{k:'fold',nm:'폴더블'},{k:'zero',nm:'기기값 0원'},{k:'watch',nm:'워치'},{k:'tablet',nm:'태블릿'},{k:'tvfree',nm:'TV프리'}];
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
function imgSrc(p){ if(!p) return ''; p=String(p).split('||')[0].trim(); return /^(https?:)?\//.test(p) ? p : IMG+p; }
// 이미지 — 파일이 없으면: 관리자 화면은 '들어갈 파일명', 고객 화면은 은은한 빈 칸
function im(path, cls, eager, label){
  if(!path) return '<div class="'+(EDIT?'ph':'ph-soft')+' '+(cls||'')+'">'+esc(EDIT?'(사진 없음)':(label||''))+'</div>';
  var fit=/(^|\/)model\//.test(path)||/\.(png|webp)(\?|$)/i.test(path);
  return '<img class="'+(cls||'')+(fit?' fit':'')+'" src="'+esc(imgSrc(path))+'" alt="'+esc(label||'')+'" '+(eager?'':'loading="lazy" ')+'decoding="async" data-ph="'+esc(path)+'" data-lb="'+esc(label||'')+'" onerror="__stPh(this)">';
}
window.__stPh=function(el){
  var alts=(el.getAttribute('data-ph')||'').split('||');
  if(alts.length>1){ var rest=alts.slice(1).join('||').trim(); el.setAttribute('data-ph',rest); el.src=imgSrc(rest); return; }
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

var TYPES={phone:[['mnp','번호이동'],['chg','기기변경']], second:[['all','지원금']], tvfree:[['all','지원금']]};
var GROUPS=['phone','second','tvfree'];   // 휴대폰 / 세컨드(워치·태블릿) / TV프리(TV프리·아이패드)
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
  o.models.forEach(function(m){ m.cat=arr(m.cat);
    if((m.id==='tvfree5'||m.id==='ipada16') && m.cat.indexOf('tvfree')<0) m.cat=m.cat.filter(function(c){return c!=='tablet'}).concat(['tvfree']); m.tags=arr(m.tags); m.cards=arr(m.cards); m.colors=arr(m.colors); m.opts=arr(m.opts); m.price=m.price||{}; });
  o.sec=o.sec||{}; Object.keys(DEFAULT.sec).forEach(function(k){ o.sec[k]=o.sec[k]||clone(DEFAULT.sec[k]); });
  // 히어로 사진: 예전 저장값(hero-0N.jpg)은 실제 파일(hero-0N.webp)로
  (o.hero||[]).forEach(function(h){ if(h&&typeof h.img==='string') h.img=h.img.replace(/^hero\/(hero-0[1-3])\.jpg$/,'hero/$1.webp'); });
  o.deal=o.deal||clone(DEFAULT.deal); o.lists=o.lists||{};
  o.applyAdd=!!o.applyAdd;   // 상담 신청 '요금제별 혜택(워치·태블릿·TV프리)' — 기본 숨김
  o.brand=o.brand||clone(DEFAULT.brand); o.biz=o.biz||clone(DEFAULT.biz); o.promo=o.promo||clone(DEFAULT.promo);
  o.pricing=normPricing(o.pricing);
  return o;
}
function vis(list){ return EDIT ? list : list.filter(function(x){return x && !x.hidden}); }
function models(){ return vis(S.models); }
function isWear(m){ return m.cat.indexOf('watch')>-1 || m.cat.indexOf('tablet')>-1 || m.cat.indexOf('tvfree')>-1; }
function isTv(m){ return m.cat.indexOf('tvfree')>-1; }
function kindOf(m){ return isTv(m)?'tvfree':m.cat.indexOf('watch')>-1?'watch':m.cat.indexOf('tablet')>-1?'tablet':'phone'; }
function phones(){ return models().filter(function(m){return !isWear(m)}); }
function wears(){ return models().filter(isWear); }
function byId(id){ for(var i=0;i<S.models.length;i++) if(S.models[i].id===id) return S.models[i]; return null; }
function colorsOf(m){ var c=arr(m.colors).filter(function(x){return x&&x.nm}); return c.length?c:(DEFCOLORS[m.id]||[]); }
function mImg(m){ var c=colorsOf(m); return m.img || (c[0]&&c[0].img) || ('model/'+m.id+'.jpg'); }
function mCard(m,i){ var c=colorsOf(m); return (m.cards&&m.cards[i]) || (c[i]&&c[i].img) || (i>0&&c[0]&&c[0].img) || ('card/'+m.id+'-'+(i+1)+'.jpg'); }
function hidCls(x){ return x&&x.hidden?' is-hidden':''; }
function secOn(k){ return EDIT || !(S.sec[k]&&S.sec[k].off); }

/* ---------------- 가격표 (애플 💰 가격표에서 관리) ---------------- */
function todayKST(){ return new Date(Date.now()+9*3600e3).toISOString().slice(0,10); }
function normPricing(p){
  p=(p&&typeof p==='object')?p:clone(DEFAULT.pricing);
  p.plans=p.plans||{};
  GROUPS.forEach(function(g){ p.plans[g]=arr(p.plans[g]).filter(function(x){return x&&x.k}); if(!p.plans[g].length) p.plans[g]=clone(DEFAULT.pricing.plans[g]); });
  p.vers=arr(p.vers).filter(function(v){return v&&typeof v==='object'}); if(!p.vers.length) p.vers=clone(DEFAULT.pricing.vers);
  p.vers.forEach(function(v){ v.rows=arr(v.rows).filter(Boolean); v.rows.forEach(function(r){ r.pub=r.pub||{}; r.our=r.our||{}; r.g=(r.g==='second'||r.g==='tvfree')?r.g:'phone'; r.model=r.model||''; r.cap=r.cap||''; }); });
  p.tiers=p.tiers||{}; p.base=p.base||{};
  GROUPS.forEach(function(g){
    var fresh=!arr(p.tiers[g]).length, gk=p.plans[g].map(function(x){return x.k});
    p.tiers[g]=arr(p.tiers[g]).filter(function(x){return x&&x.k}); if(fresh) p.tiers[g]=clone(DEFAULT.pricing.tiers[g]);
    p.tiers[g].forEach(function(t){ if(gk.indexOf(t.grp)<0) t.grp=gk[0];
      if(!t.title){ var d=DEFAULT.pricing.tiers[g].filter(function(x){return x.nm===t.nm})[0]; if(d&&d.title) t.title=d.title; } });
    if(!p.tiers[g].some(function(t){return t.k===p.base[g]})) p.base[g]=(p.tiers[g].filter(function(t){return t.k===DEFAULT.pricing.base[g]})[0]||p.tiers[g][0]).k;
    if(fresh) p.vers.forEach(function(v){ v.rows.forEach(function(r){ if(r.g!==g) return;
      p.tiers[g].forEach(function(t){ if(r.pub[t.k]==null && r.pub[t.grp]!=null) r.pub[t.k]=r.pub[t.grp]; });
      gk.forEach(function(k){ delete r.pub[k]; }); }); });
  });
  if((p.rev||0)<2){   // 공시지원금을 번호이동/기기변경 따로 → 예전 값은 양쪽에 복사, 2TB 줄 빼기
    p.vers.forEach(function(v){
      v.rows=v.rows.filter(function(r){ return !/^2\s*TB$/i.test(r.cap||''); });
      v.rows.forEach(function(r){ var types=TYPES[r.g].map(function(t){return t[0]});
        Object.keys(r.pub).forEach(function(k){ if(k.indexOf('_')>-1 && types.indexOf(k.split('_')[0])>-1) return;
          types.forEach(function(t){ if(r.pub[t+'_'+k]==null) r.pub[t+'_'+k]=r.pub[k]; }); delete r.pub[k]; }); });
    });
    p.rev=2;
  }
  if((p.rev||0)<3){   // 워치·탭은 요금제 구분 없이 지원금 하나 — TV프리·아이패드만 1GB/500MB
    p.vers.forEach(function(v){ v.rows.forEach(function(r){ if(r.g==='second' && r.split==null) r.split=(r.model==='tvfree5'||r.model==='ipada16'); }); });
    p.rev=3;
  }
  if((p.rev||0)<4){   // TV프리·아이패드는 'TV프리' 묶음으로, 세컨드(워치·태블릿)는 요금제 구분 없이
    p.vers.forEach(function(v){ v.rows.forEach(function(r){
      if(r.g==='second' && (r.split || r.model==='tvfree5' || r.model==='ipada16')){
        r.g='tvfree'; var np={}; Object.keys(r.pub).forEach(function(k){ var b=k.replace(/^all_/,'').replace(/^p(?=1GB|500MB)/,'t'); if(np['all_'+b]==null) np['all_'+b]=r.pub[k]; }); r.pub=np;
      }
      delete r.split; }); });
    p.plans.second=clone(DEFAULT.pricing.plans.second); p.tiers.second=clone(DEFAULT.pricing.tiers.second); p.base.second='t1GB';
    p.rev=4;
  }
  return p;
}
// 그 날짜에 적용되는 정책 = 시작일이 그 날짜 이전인 것 중 가장 최근
function verAt(day, p){
  p=p||S.pricing; var best=null;
  p.vers.forEach(function(v){ if(v.from && v.from<=day && (!best || v.from>=best.from)) best=v; });
  if(!best) p.vers.forEach(function(v){ if(!best || (v.from||'')<(best.from||'')) best=v; });
  return best;
}
function PV(){ return verAt(todayKST()); }
function plansOf(g){ return (S.pricing.plans[g])||[]; }
function tiersOf(g){ return (S.pricing.tiers[g])||[]; }
function baseTier(g, P){ P=P||S.pricing; var ts=P.tiers[g]||[]; return ts.filter(function(t){return t.k===P.base[g]})[0]||ts[0]||null; }
// 가격표에 이 모델 줄이 있는지 (공개 여부와 상관없이)
function inSheet(m){ var v=PV(); return !!(v&&m&&v.rows.some(function(r){return r.model===m.id})); }
function priceHidden(m){ return !EDIT && !S.pricing.show && inSheet(m); }
function sheetRows(m){ if(!EDIT && !S.pricing.show) return []; var v=PV(); if(!v||!m) return []; return v.rows.filter(function(r){return r.model===m.id}); }
function curType(g){ return g==='phone'?(MNP?'mnp':'chg'):'all'; }
// 한 줄(기기·용량)의 실구매가 — pb: 공시지원금 선택, sel: 선택약정 선택
// tier = 요금제 (공시지원금은 요금제별, 다이렉트 지원금은 요금제가 속한 구간 기준)
function rowCalc(r, type, tier){
  if(!tier) return null; var out=num(r.out); if(out==null) return null;
  var our=num((r.our||{})[type+'_'+tier.grp])||0, pub=num((r.pub||{})[type+'_'+tier.k])||0;
  var sel=Math.max(0,out-our), pb=pub?Math.max(0,out-pub-our):null;
  return {out:out, our:our, pub:pub, sel:sel, pb:pb, v:(pb!=null?Math.min(pb,sel):sel), fee:tier.fee||null};
}
function SO(m){ if(!m) return false; if(m.soldout) return true; var rs=sheetRows(m); return rs.length>0 && rs.every(function(r){return r.so}); }
function wz(n){ return n===0?'0원':won(n); }

/* 가격: 번호이동/기기변경 중 지금 보는 가격 */
var OPT={};   // 상세에서 고른 사이즈·용량 (모델별)
function optsOf(m){
  var rs=sheetRows(m);
  if(rs.length) return rs.map(function(r){ return {nm:r.cap||'기본', row:r}; });
  return arr(m.opts).filter(function(o){return o&&o.nm});
}
function optLabel(m){
  var rs=sheetRows(m);
  if(rs.length) return rs[0].g==='phone'?'용량':(rs.some(function(r){return /mm/i.test(r.cap)})?'사이즈':'옵션');
  return (m&&m.optLabel)||'사이즈';
}
// 카드 가격 기준: 기본은 기준 요금제(85), '최대 혜택 기준으로 보기'를 켜면 115,000원 이상 요금제 중 가장 싼 조건
var MAXV=false; try{ MAXV=sessionStorage.getItem('st_maxv')==='1'; }catch(e){}
function maxBar(){ return '<button type="button" class="maxv'+(MAXV?' on':'')+'" data-maxv><span class="mv-sw"><i></i></span>최대 혜택 기준으로 보기</button>'+
  (MAXV?'<div class="maxv-note">최대 혜택 기준인 <b>월 115,000원 이상 요금제를 6개월 이상 유지</b>하는 조건일 때의 혜택이에요.</div>':''); }
function priceOf(m, oi){
  if(priceHidden(m)) return {kind:'hidden', v:null, out:null};   // 가격 비공개: 예전 가격 대신 '상담 시 안내'
  var rs=sheetRows(m);
  if(rs.length){
    var g=rs[0].g, pk=baseTier(g), type=curType(g), r=null, c=null, ct=null;
    // 카드·목록 가격: 휴대폰은 요금제 중 가장 싸게 살 수 있는 조건(최대 지원) 기준 — 조건은 카드에 함께 표시
    var best=function(x){ if(g!=='phone'||!MAXV) return {c:rowCalc(x,type,pk),t:pk}; var b=null; tiersOf(g).forEach(function(t){ var cx=rowCalc(x,type,t); if(cx&&(!b||cx.v<b.c.v)) b={c:cx,t:t}; }); return b||{c:null,t:pk}; };
    if(oi!=null && rs[oi]){ r=rs[oi]; var b0=best(r); c=b0.c; ct=b0.t; }
    else {
      var anyOn=rs.some(function(x){return !x.so});
      rs.forEach(function(x){ if(x.so&&anyOn) return; var bx=best(x); if(bx.c && (!c || bx.c.v<c.v)){ c=bx.c; ct=bx.t; r=x; } });
      if(!r) r=rs[0];
    }
    var priced=rs.filter(function(x){return num(x.out)!=null}).length;
    return {kind:'sheet', g:g, row:r, tier:ct, out:c?c.out:null, v:c?c.v:null, pub:c?c.pub:0, our:c?c.our:0, sub:c?(c.pub+c.our):0, sel:!!(c&&!(c.pb!=null&&c.pb<=c.sel)), from:(oi==null && priced>1)};
  }
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
// 태그: '기기값 0원' 같은 0원 문구는 지금 보는 가격이 실제로 0원일 때만 노출
function tagsOf(m){
  var t=arr(m&&m.tags); if(!t.length) return t;
  var p=priceOf(m), zero = p.v===0 || (p.kind==='hidden' && m.cat.indexOf('zero')>-1);
  return zero ? t : t.filter(function(x){ return !/(^|[^0-9,])0원|공짜/.test(String(x)); });
}
function priceLine(m){
  var p=priceOf(m);
  if(p.v==null) return '<div class="pr" style="font-size:14px">'+esc(tagsOf(m)[0]||'상담 시 안내')+'</div>';
  return '<div class="pr price-row">'+wz(p.v)+(p.from?'<span style="font-size:12px;color:var(--sub);font-weight:600">~</span>':'')+(p.out&&p.out>p.v?'<s>'+won(p.out)+'</s>':'')+'</div>'+
    (p.g==='phone'&&p.tier?'<div class="pr-c">'+(MNP?'번호이동':'기기변경')+' · '+esc(p.tier.title||tierLabel(p.tier))+' 기준</div>':'');
}
function pctOf(p){ return (p.v!=null && p.out && p.out>p.v) ? Math.round((p.out-p.v)/p.out*100) : 0; }
function badgeOf(m){
  if(SO(m)) return '일시품절';
  var p=priceOf(m);
  if(p.v===0) return '기기값 0원';
  var pct=pctOf(p); if(pct>0) return pct+'% 할인';
  return tagsOf(m)[0]||'';
}
function stripOf(m){
  if(SO(m)) return '일시품절 · 입고 알림 상담 가능';
  if(m.strip && !(/(^|[^0-9,])0원|공짜/.test(m.strip) && priceOf(m).v!==0)) return m.strip;
  var pp=priceOf(m);
  if(pp.kind==='sheet'){
    if(pp.g==='second') return pp.sub?('휴대폰과 함께 구매 시 '+won(pp.sub)+' 할인'):'휴대폰과 함께 구매 시 혜택';
    if(pp.g==='tvfree') return pp.sub?('이통사 지원금 '+won(pp.sub)+' 할인'):'TV프리 상담 가능';
    var lead=(MNP?'번호이동':'기기변경')+' 시 ', tail=tagsOf(m)[1]?' + '+tagsOf(m)[1]:'';
    if(pp.v===0) return lead+'기기값 0원'+tail;
    var pct=pctOf(pp); if(pct>0) return lead+'기기값 '+pct+'% 할인'+tail;
  }
  if(pp.kind==='hidden' && isWear(m)) return '휴대폰과 함께 구매 시 혜택';
  if(pp.kind==='sub') return pp.sub?('이통사 지원금 '+won(pp.sub)+' 할인'):'스마트기기 상담 가능';
  return (MNP?'번호이동':'기기변경')+' 시 '+(tagsOf(m)[0]||'')+(tagsOf(m)[1]?' + '+tagsOf(m)[1]:'');
}
function segBtns(){
  return '<button type="button" data-mnp="1" class="'+(MNP?'on':'')+'">번호이동</button><button type="button" data-mnp="0" class="'+(MNP?'':'on')+'">기기변경</button>';
}
// 상세 화면 가격표: 요금제별로 공시지원금 선택 / 선택약정 선택
function pline(t,sm,v){ return '<div class="r pr2"><span>'+t+(sm?'<small>'+esc(sm)+'</small>':'')+'</span><b>'+wz(v)+'</b></div>'; }
var TIER={};   // 상세에서 고른 요금제 (모델별)
function tierLabel(t){ return t.fee?Number(t.fee).toLocaleString('ko-KR'):t.nm; }
function tierTitle(t){ return t.title?t.title+(t.fee?' (월 '+won(t.fee)+')':''):(t.fee?'월 '+won(t.fee)+' 요금제':t.nm); }
var PLAN_NOTE='요금제는 6개월 후부터 47,000원 요금제 이상으로 자유롭게 변경 가능합니다.';
// 이 줄에서 쓰는 요금제 — 워치·탭처럼 구분 없는 줄은 첫 요금제 칸 하나만
function rowTiers(r){ return tiersOf(r.g); }
function curTier(m, g, r){ var ts=r?rowTiers(r):tiersOf(g); return ts.filter(function(t){return t.k===TIER[m.id]})[0]||(ts.indexOf(baseTier(g))>-1?baseTier(g):ts[0]); }
/* ---------- 상세 계산기: 컬러·용량 → 통신사 → 요금제 → 할인 방식 → 할부 → 예상 월 납부금액 ---------- */
var RATE={24:1.0626,30:1.0781,36:1.0935};   // 할부이자 포함 계수 (휴대폰·워치·태블릿 동일)
var SEL={};                                  // 모델별 고른 조건 {carrier, method, months}
var CARRIERS=['SKT','KT','LG U+','알뜰폰'];
// 원 단위 정리: 1원 자리가 8·9면 10원 올림, 그 밖엔 버림 (아이폰 듀오 랜딩과 같은 규칙)
function won10(n){ n=Math.round(Number(n)||0); var x=((n%10)+10)%10; return x>=8?n+(10-x):n-x; }
function noInterest(r){ return r.model==='tvfree5'; }   // TV프리는 이자 없이 그냥 나누기
function calcState(m, r){
  var g=r.g, s=SEL[m.id]||(SEL[m.id]={});
  var type=g!=='phone'?'all':(s.carrier?(s.carrier==='LG U+'?'chg':'mnp'):(MNP?'mnp':'chg'));
  var t=curTier(m,g,r), c=rowCalc(r,type,t), st={g:g, s:s, t:t, type:type, c:c, split:(g!=='second')};
  if(!c) return st;
  st.method=g!=='phone'?'pub':((s.method==='sel'||!c.pub)?'sel':'pub');
  st.after=(st.method==='pub'&&c.pb!=null)?c.pb:c.sel;
  st.months=s.months==null?24:s.months; st.mm=st.months;   // 기본 24개월 할부 st.noint=noInterest(r);
  st.monthly=st.mm===0?null:won10(st.noint?st.after/st.mm:st.after*RATE[st.mm]/st.mm);
  st.fee=g==='phone'?(t.fee||null):null; st.feeAfter=st.fee&&st.method==='sel'?Math.round(st.fee*0.75):st.fee;
  return st;
}
function typeNm(st){ return st.type==='chg'?'기기변경':st.type==='mnp'?'번호이동':''; }
function calcSummary(st){
  if(!st.c) return '';
  var a=[]; if(st.g==='phone') a.push(st.s.carrier?st.s.carrier+' · '+typeNm(st):typeNm(st)+' 기준');
  if(st.split&&st.t) a.push(tierTitle(st.t));
  if(st.g==='phone') a.push(st.method==='pub'?'공시지원금':'선택약정');
  a.push(st.months===0?'일시납':st.months+'개월 할부');
  return a.join(' · ');
}
function payTxt(st){ if(st.after===0) return '기기값 0원'; return st.months===0?won(st.after)+'<small> 일시납</small>':won(st.monthly)+'<small> / 월</small>'; }
// 금액 한 줄: 왼쪽 이름(+작은 설명은 아랫줄), 오른쪽 금액(줄바꿈 없음, 원래 금액은 아랫줄에 줄긋기)
function crow(label, sub, val, was, cls){
  return '<div class="cr'+(cls?' '+cls:'')+'"><div class="cr-l"><span>'+label+'</span>'+(sub?'<small>'+sub+'</small>':'')+'</div><div class="cr-v"><b>'+val+'</b>'+(was?'<s>'+was+'</s>':'')+'</div></div>';
}
function payHint(st){ if(st.after===0) return '할부금 없이 이용하실 수 있어요'; return st.months===0?'일시납 · 기기값 기준':(st.mm+'개월 할부 · 기기값 기준, '+(st.noint?'이자 없음':'할부이자 포함')); }
function cgrid(label, key, items, cur, m, n, hint){
  return '<div class="cpick"><div class="cpick-l">'+label+'</div><div class="cgrid" style="--n:'+n+'">'+items.map(function(x){
    return '<button type="button" class="cg'+(String(x[0])===String(cur)?' on':'')+(x[2]?' dis':'')+'" data-calc="'+key+'" data-v="'+esc(x[0])+'" data-model="'+esc(m.id)+'"'+(x[2]?' disabled':'')+'>'+esc(x[1])+'</button>';
  }).join('')+'</div>'+(hint?'<div class="cpick-hint">'+hint+'</div>':'')+'</div>';
}
function calcPickers(m, r, st){
  var g=r.g, h='';
  if(g==='phone') h+=cgrid('사용 통신사','carrier',CARRIERS.map(function(c){return [c,c]}),st.s.carrier||'',m,4,
    '');
  var ts=rowTiers(r);
  if(ts.length>1) h+='<div class="cpick"><div class="cpick-l">요금제</div><select class="csel" data-calc-sel="tier" data-model="'+esc(m.id)+'">'+ts.map(function(t){
      return '<option value="'+esc(t.k)+'"'+(st.t&&st.t.k===t.k?' selected':'')+'>'+esc(tierTitle(t))+'</option>'; }).join('')+'</select>'+(g==='phone'?'<div class="cpick-hint">'+PLAN_NOTE+'</div>':'')+'</div>';
  if(g==='phone'&&st.c) h+=cgrid('할인 방식','method',[['pub','공시지원금',!st.c.pub],['sel','선택약정 (요금 25%↓)']],st.method,m,2,
    !st.c.pub?'이 조건은 공시지원금이 없어 선택약정으로 계산돼요':adviceTxt(cmpMethod(st.c,st.fee,st.months),st.method));
  h+=cgrid('할부 개월','months',[['0','일시납'],['24','24개월'],['30','30개월'],['36','36개월']],String(st.months),m,4,'');
  return h;
}
var MSTIP={};   // 상세 계산 박스 ? 설명 열림
function calcBox(m, r, st){
  var out=num(r.out);
  if(!st.c) return crow('출고가','',out!=null?won(out):'상담 시 안내');
  var c=st.c, tn=typeNm(st), mm=st.months, monthly=mm===0?0:(st.monthly||0), fee=st.feeAfter||0, total=monthly+fee;
  var tipB=function(k,t){ return '<button type="button" class="tipb'+(MSTIP[k]?' on':'')+'" data-ms-tip="'+k+'" aria-label="설명 보기">?</button>'+(MSTIP[k]?'<div class="tip-bub">'+t+'</div>':''); };
  var line=function(l,v,cls){ return '<div class="ms-r'+(cls?' '+cls:'')+'"><span>'+l+'</span><b>'+v+'</b></div>'; };
  // 기간별 (85·95 요금제만): 7개월 차부터 월 47,000원 요금제로 바꾸면
  var low=null;
  if(st.g==='phone'&&st.fee&&st.fee<=95000&&st.fee>LOW_FEE) low=monthly+(st.method==='sel'?Math.round(LOW_FEE*0.75):LOW_FEE);
  var h='<div class="ap-sumsec ms-detail"><div class="ms-top'+(low!=null?'':' solo')+'"><div class="ms-main"><span class="ms-l">월 예상 납부금액</span>'+
    '<b class="ms-v">'+(total?won(total)+'<small> / 월</small>':(st.after===0?'0원':won(st.after)+'<small> 일시납</small>'))+'</b>'+
    '<span class="ms-h">'+(mm===0?(fee?'통신 요금 기준 · 기기값은 일시납':'기기값 일시납'):(fee?'기기 할부금 + 통신 요금 ('+mm+'개월 기준)':mm+'개월 할부 · '+(st.noint?'이자 없음':'할부이자 포함')))+'</span>'+
    (mm===0&&st.after>0&&fee?'<span class="ms-h">+ 일시납 '+won(st.after)+'</span>':'')+'</div>';
  if(low!=null) h+='<div class="ms-flow">'+
    '<div class="ms-f"><i class="ic"><svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M4 10h16M9 3v4M15 3v4M9 14h.01M12 14h.01M15 14h.01"/></svg></i><div><span>처음 6개월</span><b>'+won(total)+'<small> / 월</small></b><em>'+esc(st.t.title||tierLabel(st.t))+' 기준</em></div></div>'+
    '<div class="ms-f"><i class="ic"><svg viewBox="0 0 24 24"><path d="M12 5v14M6 13l6 6 6-6"/></svg></i><div><span>7개월 차부터</span><b>'+won(low)+'<small> / 월</small></b><em>월 '+won(LOW_FEE)+' 요금제로 변경 시</em></div></div></div>';
  h+='</div>';
  var mon='';
  if(mm===0) mon+=line('기기값 일시납',wz(st.after)); else mon+=line('기기 할부금 ('+mm+'개월)',st.after===0?'0원':won(monthly));
  if(st.fee) mon+=line('월 통신 요금'+(st.method==='sel'?' <small>25% 할인</small>':''),won(fee));
  mon+=line('월 합계',won(total),'sum');
  var ben=line('출고가',won(c.out));
  if(st.method==='pub'&&c.pub) ben+=line((st.g==='phone'?'공시지원금':'이통사 지원금')+(tn?' ('+tn+')':''),'-'+won(c.pub),'minus');
  if(c.our) ben+=line('추가 지원금 (유플러스 다이렉트)','-'+won(c.our),'minus');
  ben+=line('지원 후 기기값',wz(st.after),'sum');
  h+='<div class="ms-grid">'+
    '<div class="ms-card"><div class="ms-ch"><i class="ic won">₩</i>월 납부 구성'+tipB('mon','기기 할부금은 할부이자(연 5.9%)가 포함된 금액이에요. 통신 요금은 고르신 요금제 기준이에요.')+'</div>'+mon+'</div>'+
    '<div class="ms-card"><div class="ms-ch"><i class="ic"><svg viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13M3 12h18M12 8c-1.5-3-5.5-3.5-5.5-1S9 8 12 8c3 0 7-.5 5.5-2.5S13.5 5 12 8z"/></svg></i>기기 구매 혜택'+tipB('ben','출고가에서 지원금을 빼고 남은 기기값을 할부로 나눠 내요.')+'</div>'+ben+'</div>'+
  '</div></div>';
  return h;
}
/* ---------------- 렌더 ---------------- */
var heroTimer=null, heroIdx=0;
// 이번 주 특가 — 이번 주 월~일 날짜는 자동
function weekRange(){
  var t=new Date(todayKST()+'T00:00:00'), d=(t.getDay()+6)%7, a=new Date(t), b=new Date(t); a.setDate(t.getDate()-d); b.setDate(a.getDate()+6);
  var f=function(x){ return (x.getMonth()+1)+'/'+x.getDate(); }; return f(a)+'(월) ~ '+f(b)+'(일)';
}
// 특가 구매가: 가격표 기준, 요금제 중 가장 싸게 살 수 있는 금액 (번호이동/기기변경 각각)
function dealPrice(m,type){
  var rs=sheetRows(m); if(!rs.length) return null;
  var on=rs.filter(function(r){return !r.so}); if(on.length) rs=on;
  var best=null, g=rs[0].g;
  rs.forEach(function(r){ tiersOf(g).forEach(function(t){ var c=rowCalc(r,type,t); if(c && c.v!=null && (best==null || c.v<best)) best=c.v; }); });
  return best;
}
function dealItems(){
  var D=S.deal||{};
  return String(D.items||'').split('\n').map(function(l){ var r=l.split('|').map(function(x){return x.trim()}); var m=r[0]&&(byId(r[0])||models().filter(function(x){return x.nm.replace(/\s/g,'')===r[0].replace(/\s/g,'')})[0]); return m?{m:m,mnp:dealPrice(m,'mnp'),chg:dealPrice(m,'chg')}:null; }).filter(Boolean);
}
function renderDeal(){
  var D=S.deal, sub=$('#dealSubs'), hero=document.querySelector('.hero');
  if(sub) sub.innerHTML='';
  var it=(D&&D.on)?dealItems():[];
  if(hero) hero.classList.toggle('hero-deal',!!it.length);
  if(!it.length) return false;
  clearInterval(heroTimer);
  $('#heroTrack').style.transform='';
  $('#heroTrack').innerHTML='<div class="deal-box" data-edit="deal"><div class="dl-tag"><b>'+esc(D.title||'이번 주 특가')+'</b><span>'+weekRange()+'</span></div>'+
    '<div class="dl-grid">'+it.map(function(x){
      return '<a class="dl-c" href="#/model/'+esc(x.m.id)+'" data-edit="deal"><div class="dl-c-h"><span class="dl-c-img">'+im(mImg(x.m),'','',x.m.nm)+'</span><b>'+esc(x.m.nm)+'</b></div>'+
        (x.mnp!=null?'<div class="dl-c-m"><small>번호이동</small><em>'+wz(x.mnp)+'</em></div>':'<div class="dl-c-m"><small>구매가</small><em class="ask">상담 시 안내</em></div>')+
        (x.chg!=null?'<div class="dl-c-c">기기변경 '+wz(x.chg)+'</div>':'')+'</a>';
    }).join('')+'</div>'+(it.some(function(x){return x.mnp!=null||x.chg!=null})?'<div class="dl-note">구매 가능 금액 · 월 115,000원 이상 요금제 6개월 유지 기준</div>':'')+'</div>';
  $('#heroDots').innerHTML='';
  return true;
}
// 히어로 지원금 표: '모델|번호이동|기기변경' 한 줄씩 (모델 비우면 한 줄형)
function heroSup(t){
  var rows=String(t||'').split('\n').map(function(l){ return l.split('|').map(function(x){return x.trim()}); }).filter(function(r){ return r.length>=2&&(r[1]||r[2]); });
  if(!rows.length) return '';
  var lab=rows.some(function(r){return r[0]});
  return '<div class="hsup'+(lab?'':' nolab')+'"><div class="hs-r hs-h">'+(lab?'<span></span>':'')+'<span>번호이동 최대</span><span>기기변경</span></div>'+
    rows.map(function(r){ return '<div class="hs-r">'+(lab?'<b class="hs-l">'+esc(r[0])+'</b>':'')+'<b class="hs-m">'+esc(r[1]||'-')+'</b><b>'+esc(r[2]||'-')+'</b></div>'; }).join('')+'</div>';
}
function renderHero(){
  var b=S.brand;
  var tr=b.trust==null?'U+ 최초의 온라인 대리점':b.trust;
  $('#brand').innerHTML='<small>'+esc(b.small)+'</small><b>'+esc(b.big)+'</b>'+(tr?'<span class="brand-trust"><svg viewBox="0 0 24 24"><path d="M12 3 5 6v6c0 4.5 3 7.7 7 9 4-1.3 7-4.5 7-9V6l-7-3z"/><path d="m9 12 2 2 4-4"/></svg>'+esc(tr).replace(/^U\+/,'U<sup>+</sup>')+'</span>':'');
  if(renderDeal()) return;
  var list=vis(S.hero);
  $('#heroTrack').innerHTML = list.map(function(h,i){
    var k=esc(h.k||'').replace(/^U\+/, '<em>U<sup style="font-size:.6em">+</sup></em>');
    var real=S.hero.indexOf(h);
    return '<a class="slide'+(h.full?' full':'')+hidCls(h)+'" data-go="'+esc(h.go||'')+'" data-edit="hero:'+real+'">'+
      '<div class="slide-txt"><div class="k">'+k+'</div>'+(h.t?'<div class="t">'+esc(h.t)+'</div>':'')+(h.s?'<div class="s">'+esc(h.s)+'</div>':'')+heroSup(h.sup)+'</div>'+
      im(h.img,'slide-img',true,'')+'</a>';
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
  return '<a class="m'+(SO(m)?' soldout':'')+hidCls(m)+'" href="#/model/'+esc(m.id)+'" data-edit="model:'+esc(m.id)+'"><div class="cir">'+im(mImg(m),'',eager,m.nm)+'</div><span>'+esc(m.nm)+'</span></a>';
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
// 많이 찾아요 / 기기값 0원 — 관리자가 고른 목록(없으면 자동)
function autoList(k){ return (k==='zero'?phones().filter(isZero):phones()).map(function(m){return m.id}); }
function pickList(k){
  var ids=S.lists&&S.lists[k]; if(!ids||!ids.length) ids=autoList(k);   // '_none' 만 있으면 빈 목록
  var all=models(); return ids.map(function(id){ return all.filter(function(m){return m.id===id})[0]; }).filter(Boolean);
}
function renderPop(){
  $('#popSec').hidden=!secOn('pop')||(!EDIT&&!pickList('pop').length);
  $('#popHead').innerHTML=secHead('pop','#/cat/all');
  if(EDIT&&!pickList('pop').length){ $('#popgrid').innerHTML='<div class="adm-empty" data-edit="sec:pop">비어 있어요 · 고객 화면에서는 이 구역이 숨겨져요 (눌러서 모델 추가)</div>'; return; }
  $('#popgrid').innerHTML=pickList('pop').map(function(m){
    return '<a class="pc'+(SO(m)?' soldout':'')+hidCls(m)+'" href="#/model/'+esc(m.id)+'" data-edit="sec:pop"><div class="thumb" style="position:relative">'+im(mImg(m),'','',m.nm)+(SO(m)?'<span class="so-tag" style="font-size:11px">품절</span>':'')+'</div><div class="info">'+
      '<div class="nm">'+esc(m.nm)+CHEV+'</div><div class="ds">'+esc(m.ds)+'</div>'+
      '<div class="pills">'+tagsOf(m).map(function(t){return '<span class="pill">'+esc(t)+'</span>'}).join('')+'</div></div></a>';
  }).join('');
}
function hcard(m,opt){
  opt=opt||{};
  var badge=opt.badge||badgeOf(m);
  return '<a class="hc'+(SO(m)?' soldout':'')+hidCls(m)+'" href="#/model/'+esc(m.id)+'" data-edit="'+esc(opt.edit||('model:'+m.id))+'"><div class="im">'+(badge?'<span class="badge'+(opt.dark||SO(m)?' dark':'')+'">'+esc(badge)+'</span>':'')+
    im(mImg(m),'','',m.nm)+'</div><div class="strip">'+esc(stripOf(m))+'</div>'+
    '<div class="bd"><div class="t">'+esc(m.nm)+'</div>'+priceLine(m)+'<div class="mt">제휴카드·부가서비스 X · 당일발송</div></div></a>';
}
function isZero(m){ if(m.cat.indexOf('zero')>-1) return true; var p=priceOf(m); return p.kind==='sheet' && p.v===0; }
function renderZero(){
  $('#zeroSec').hidden=!secOn('zero')||(!EDIT&&!pickList('zero').length);
  $('#zeroHead').innerHTML=secHead('zero','#/cat/zero');
  var zl=pickList('zero');
  $('#zero').innerHTML=zl.map(function(m){return hcard(m,{edit:'sec:zero'})}).join('')||(EDIT?'<div class="adm-empty" data-edit="sec:zero">비어 있어요 · 고객 화면에서는 이 구역이 숨겨져요 (눌러서 모델 추가)</div>':'');
}
function renderRecent(){
  var ids=store.get('recent',[]).filter(function(id){var m=byId(id);return m&&(EDIT||!m.hidden)});
  $('#recentSec').hidden=!ids.length || !secOn('recent');
  $('#recentHead').innerHTML=secHead('recent');
  $('#recent').innerHTML=ids.map(function(id){return hcard(byId(id),{badge:'최근 본',dark:true})}).join('');
}
var BUNDLE_NOTE='<div class="bundle-note"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="8" height="15" rx="2"/><rect x="14" y="7" width="7" height="9" rx="2.5"/><path d="M16 5.5h3M16 17.5h3"/></svg><span><b>휴대폰과 함께 구매할 때</b> 받는 혜택이에요<small>휴대폰 + 워치 + 태블릿, 3개 동시 구매도 가능해요</small></span></div>';
// 워치·태블릿·TV프리 이용 가이드 — 유의사항이 아니라 사용 설명서처럼 부드럽게
var GI={ // 아이콘
  cell:'<path d="M5 12.5a10 10 0 0 1 14 0M8 15.5a6 6 0 0 1 8 0"/><circle cx="12" cy="18.5" r="1.3"/>',
  won:'<path d="M4 7h16v10H4z"/><path d="M4 10h16M8 14h3"/>',
  cal:'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 9.5h16M9 3v4M15 3v4"/>',
  tv:'<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M9 20h6M12 17v3"/>'
};
function cellGuide(kind, fee, plan, nm){ return {fee:fee, plan:plan, t:kind+' 이용 가이드', items:[
  {ic:'cell', b:'셀룰러 모델이에요', p:kind+' 전용 회선이 함께 개통되는 셀룰러 모델이에요.'},
  {ic:'won', hl:1, b:'월 이용료 '+won(fee), p:'월 '+won(plan)+' 이상 요금제('+nm+' 이상)를 이용 중이시라면 이용료 없이 휴대폰 요금에 포함돼요.', tag:nm+' 이상 이용 시 이용료 0원'},
  {ic:'cal', b:'24개월 함께하는 상품이에요', p:'24개월 약정으로 더 가벼운 가격에 만나보실 수 있어요.'}]}; }
function tvGuide(kind){ return {t:kind+' 이용 가이드', items:[
  {ic:'tv', b:'U+tv를 보는 태블릿PC예요', p:'유플러스 TV에 가입해 U+tv를 시청할 수 있는 TV 가입형 상품이에요. 별도 휴대폰 회선(셀룰러) 없이 이용하실 수 있어요.'},
  {ic:'won', hl:1, b:'첫 9개월 월 9,350원', p:'10개월 차부터는 월 7,700원 요금제로 바꿔서 더 가볍게 이용하실 수 있어요.', tag:'10개월 차부터 월 7,700원'},
  {ic:'cal', b:'36개월 함께하는 상품이에요', p:'36개월 약정으로 부담 없이 오래 이용하실 수 있어요.'}]}; }
var GUIDE={
  watchultra2:cellGuide('워치',11000,95000,'플러스플랜 95'), watch9:cellGuide('워치',11000,95000,'플러스플랜 95'), watchse3:cellGuide('워치',11000,95000,'플러스플랜 95'),
  taba11plus:cellGuide('태블릿',22000,105000,'플러스플랜 105'),
  tvfree5:tvGuide('TV프리'), ipada16:tvGuide('아이패드')
};
function guideHtml(m){
  var g=GUIDE[m.id]; if(!g) return '';
  return '<div class="guide"><div class="guide-h"><b>'+esc(g.t)+'</b><span>알아두면 더 알뜰하게 쓸 수 있어요</span></div>'+g.items.map(function(x){
    return '<div class="guide-it'+(x.hl?' hl':'')+'"><i><svg viewBox="0 0 24 24">'+GI[x.ic]+'</svg></i><div><b>'+esc(x.b)+'</b><p>'+esc(x.p)+'</p>'+(x.tag?'<span class="guide-tag">'+esc(x.tag)+'</span>':'')+'</div></div>';
  }).join('')+'</div>';
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
    return '<a class="dc'+(SO(m)?' soldout':'')+hidCls(m)+'" href="#/model/'+esc(m.id)+'" data-edit="sec:rank"><span class="rk">'+(i+1)+'위</span>'+im(mImg(m),'','',m.nm)+
      (SO(m)?'<span class="so-tag" style="z-index:1">일시품절</span>':'')+'<div class="ov"><div class="sm">'+esc(m.ds)+'</div><div class="tt">'+esc(m.nm)+'</div><div class="pr">'+esc(badgeOf(m))+'</div></div></a>';
  }).join('');
}
// 카드 가격: 실제 구매가를 크게, 출고가는 줄 긋고 작게 + 월 할부금 (출고가로 사는 것처럼 안 보이게)
function priceBlock(p){
  if(p.v==null) return '';
  var lab=p.kind==='sheet'?(p.g==='second'?'휴대폰과 함께 구매 시':p.g==='tvfree'?'구매가':(MNP?'번호이동 구매가':'기기변경 구매가')):'구매가', pct=pctOf(p);
  var noint=p.row&&noInterest(p.row), mon=p.v>0?won10(noint?p.v/24:p.v*RATE[24]/24):0;   // 카드는 24개월 할부 기준
  return '<div class="bp"><span class="bp-l">'+lab+'</span>'+(pct>0?'<span class="bp-pct">'+pct+'%</span>':'')+'<b class="bp-v">'+wz(p.v)+(p.from?'~':'')+'</b>'+(p.out&&p.out>p.v?'<s class="bp-o">'+won(p.out)+'</s>':'')+'</div>'+
    '<div class="bp-m">'+(p.v===0?'기기값 0원 · 할부금 없음':'월 <b>'+won(mon)+(p.from?'~':'')+'</b> <small>24개월 할부 · '+(noint?'이자 없음':'할부이자 포함')+'</small>')+'</div>'+
    (p.g==='phone'&&p.tier?'<div class="bp-c">'+(MNP?'번호이동':'기기변경')+' · '+esc(p.tier.title||tierLabel(p.tier))+' 6개월 유지 · '+(p.sel?'선택약정':'공시지원금')+' 기준</div>':'');
}
function bigcard(m){
  var wish=store.get('wish',[]).indexOf(m.id)>-1, p=priceOf(m), meta=[], pb=(p.kind==='sheet'||p.kind==='sub')?priceBlock(p):'';
  if(pb){}
  else if(p.out!=null) meta.push('출고가 <b>'+won(p.out)+'</b>');
  if(p.mnp!=null) meta.push('번호이동 <b>'+(p.mnp===0?'0원':won(p.mnp))+'</b>');
  if(p.chg!=null) meta.push('기기변경 <b>'+(p.chg===0?'0원':won(p.chg))+'</b>');
  return '<a class="big'+(SO(m)?' soldout':'')+hidCls(m)+'" href="#/model/'+esc(m.id)+'" data-edit="model:'+esc(m.id)+'"><div class="media">'+im(mCard(m,0),'main','',m.nm)+
    '<div class="side">'+im(mCard(m,1),'','',m.nm)+im(mCard(m,2),'','',m.nm)+'</div>'+
    (SO(m)?'<span class="so-tag" style="font-size:18px">일시품절</span>':'')+
    '<button class="heart'+(wish?' on':'')+'" data-wish="'+esc(m.id)+'" aria-label="찜">'+HEART+'</button>'+
    '<div class="strip">'+esc(stripOf(m))+'</div></div>'+
    '<div class="row1"><h3 class="ucard-name">'+esc(m.nm)+'</h3><span class="bdg">'+(SO(m)?'일시품절':'당일발송')+'</span><span class="eta">'+esc(badgeOf(m))+'</span></div>'+
    (pb||'<div class="meta">'+(meta.length?meta.join(' · '):'가격은 상담 시 안내드립니다')+'</div>')+
    '<div class="chips"><span class="chip">제휴카드 X</span><span class="chip">부가서비스 X</span><span class="chip gray">5분 상담</span></div>'+
    '<div class="stamp">'+(SO(m)?'입고 알림 상담 신청 가능':'구매 시 투명케이스 · 보호필름 · 충전기 제공')+'</div></a>';
}
function smallCircles(list){
  return list.map(function(m){return '<a class="m'+(SO(m)?' soldout':'')+hidCls(m)+'" style="flex:0 0 76px;display:flex;flex-direction:column;align-items:center;gap:6px" href="#/model/'+esc(m.id)+'" data-edit="model:'+esc(m.id)+'"><div class="cir">'+im(mImg(m),'','',m.nm)+'</div><span>'+esc(m.nm)+'</span></a>'}).join('');
}
// 정렬: 추천순(관리자 순서) / 낮은가격순 / 높은가격순 / 판매량순(온라인팀 최근 30일 개통, 휴대폰만 — 세컨드 제외)
var SORT='rec', RANK=null, RANK_LOADING=false;
var SORTS=[['rec','추천순'],['low','낮은가격순'],['high','높은가격순'],['sales','판매량순']];
function sortPrice(m){
  var p=priceOf(m); if(p.v!=null) return p.v; if(p.out!=null) return p.out;
  var v=PV(), outs=v?v.rows.filter(function(r){return r.model===m.id}).map(function(r){return num(r.out)}).filter(function(x){return x!=null}):[];
  return outs.length?Math.min.apply(null,outs):null;
}
function loadRank(){
  if(RANK||RANK_LOADING) return; RANK_LOADING=true;
  fetch(SB_URL.replace(/\/rest\/v1\/.*$/,'/rest/v1/rpc/udak_store_sales_rank'),{method:'POST',headers:{'Content-Type':'application/json','apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY},body:'{}'})
    .then(function(r){return r.ok?r.json():[]}).then(function(rows){ RANK={}; (rows||[]).forEach(function(x,i){ RANK[x.model]={n:x.n,rank:i+1}; }); RANK_LOADING=false; if(SORT==='sales') refresh(); })
    .catch(function(){ RANK={}; RANK_LOADING=false; });
}
function sortList(list){
  var idx={}; list.forEach(function(m,i){ idx[m.id]=i; });
  if(SORT==='rec') return list;
  var key=function(m){
    if(SORT==='sales'){ if(isWear(m)) return 1; var r=RANK&&RANK[m.id]; return r?-r.n:0; }
    var v=sortPrice(m); return v==null?(SORT==='low'?Infinity:-Infinity):(SORT==='low'?v:-v);
  };
  return list.slice().sort(function(a,b){ var sa=SO(a)?1:0, sb=SO(b)?1:0; if(sa!==sb) return sa-sb; var d=key(a)-key(b); return d||idx[a.id]-idx[b.id]; });
}
function sortedCards(list){
  document.querySelectorAll('[data-maxwrap]').forEach(function(w){ w.innerHTML=maxBar(); });
  document.querySelectorAll('.sort-lbl').forEach(function(lb){ lb.textContent=SORTS.filter(function(x){return x[0]===SORT})[0][1]; });
  return sortList(list).map(function(m){
    var h=bigcard(m), r=SORT==='sales'&&!isWear(m)&&RANK&&RANK[m.id];
    return r&&r.rank<=3?h.replace('<div class="media">','<div class="media"><span class="rank-b">온라인 판매 '+r.rank+'위</span>'):h;
  }).join('');
}
function renderPick(){
  $('#pickSec').hidden=!secOn('pick');
  $('#pickHead').innerHTML=secHead('pick');
  $('#pickCircles').innerHTML=smallCircles(phones());
  $('#bigList').innerHTML=sortedCards(phones());
}
function sortPop(b){
  var old=document.querySelector('.sortpop'); if(old){ var same=old.parentNode===b.parentNode; old.remove(); if(same) return; }
  var d=document.createElement('div'); d.className='sortpop';
  d.innerHTML=SORTS.map(function(x){ return '<button type="button" data-sort="'+x[0]+'"'+(x[0]===SORT?' class="on"':'')+'>'+x[1]+(x[0]==='sales'?'<small>최근 30일 온라인 개통 기준</small>':'')+'</button>'; }).join('');
  b.parentNode.style.position='relative'; b.parentNode.appendChild(d);
  d.style.top=(b.offsetTop+b.offsetHeight+6)+'px'; d.style.left=Math.max(8,Math.min(b.offsetLeft,b.parentNode.clientWidth-d.offsetWidth-12))+'px';
}
function renderFoot(){
  var b=S.biz||{}, n=S.stores.filter(function(s){return s&&s.nm}).length;
  $('#foot').innerHTML=

    '<div class="sf">'+
      '<div class="sf-top"><div class="sf-links"><span>이용약관</span><span>개인정보처리방침</span><span>이메일무단수집거부</span></div>'+
        '<div class="sf-cert"><button type="button" class="sf-mark" data-cert aria-label="LG U+ 공식인증대리점 인증마크 보기"><img src="/assets/store/cert-mark-s.webp" alt="LG U+ 공식인증대리점 인증마크" loading="lazy"></button><a href="tel:'+esc(S.tel)+'"><small>대표 전화번호</small><b>'+esc(S.tel)+'</b></a></div></div>'+
      '<div class="sf-info"><p><span>상호명</span> '+esc(/유닥/.test(b.name||'')||!b.name?'유플러스 다이렉트':b.name)+' · <span>대표자</span> '+esc(b.ceo)+'</p><p><span>사업장 주소</span> '+esc(b.addr)+'</p>'+
        '<p><span>사업자등록번호</span> '+esc(b.no)+' · <span>전화번호</span> '+esc(S.tel)+'</p>'+(b.sale?'<p><span>통신판매업 신고번호</span> '+esc(b.sale)+'</p>':'')+'<p><span>이메일</span> '+esc(b.email)+'</p>'+
        '<p class="sf-h">상담시간 : '+esc(b.hours)+'</p></div>'+
      '<div class="sf-bot"><p>Copyright(C) 2025 U+ 다이렉트. All rights reserved.</p><div class="sf-p">'+
        '<a href="'+esc(S.kakao)+'" target="_blank" rel="noopener">Kakao</a><a href="#" data-video="direct">회사 소개</a></div></div>'+
    '</div>';
}
/* 대리점 인증마크 크게 보기 */
function openCert(){
  var o=document.createElement('div'); o.className='vpop cpop';
  o.innerHTML='<div class="cp-in"><button type="button" class="vp-x" aria-label="닫기">×</button><img src="/assets/store/cert-mark.webp" alt="LG U+ 공식인증대리점 인증마크"><p>LG U+ 공식인증대리점</p></div>';
  o.addEventListener('click',function(e){ if(e.target===o||e.target.closest('.vp-x')){ o.remove(); document.body.style.overflow=''; } });
  document.body.appendChild(o); document.body.style.overflow='hidden';
}
/* 소개 영상 팝업 */
var VIDS={direct:{src:'/assets/udak-direct-intro-v2.mp4',poster:'/assets/udak-direct-intro-v2-poster.webp',title:'유플러스 다이렉트란?'}};
function openVideo(k){
  var v=VIDS[k]; if(!v) return;
  var o=document.createElement('div'); o.className='vpop'; o.innerHTML='<div class="vp-in"><button type="button" class="vp-x" aria-label="닫기">×</button><video src="'+v.src+'" poster="'+v.poster+'" controls playsinline autoplay></video></div>';
  o.addEventListener('click',function(e){ if(e.target===o||e.target.closest('.vp-x')){ var vd=o.querySelector('video'); try{vd.pause()}catch(x){} o.remove(); document.body.style.overflow=''; } });
  document.body.appendChild(o); document.body.style.overflow='hidden';
}
function syncMnp(){ $$('[data-seg]').forEach(function(x){ x.innerHTML=segBtns(); }); }
function renderHome(){
  renderHero(); renderModels(); renderQuick(); renderTrust(); renderPromo(); renderPop(); renderRecent();
  renderZero(); renderWear(); renderGifts(); renderRank(); renderPick(); renderFoot(); syncMnp();
}

/* 카테고리 */
function renderCat(k){
  var tab=CAT_TABS.filter(function(t){return t.k===k})[0]||CAT_TABS[0];
  $('#catTitle').textContent=tab.nm;
  $('#catTabs').innerHTML=CAT_TABS.map(function(t){return '<button class="'+(t.k===tab.k?'on':'')+'" data-cat="'+t.k+'">'+t.nm+'</button>'}).join('');
  var list=tab.k==='zero'&&S.lists&&S.lists.zero&&S.lists.zero.length ? pickList('zero')   // 관리자가 고른 '기기값 0원' 목록과 똑같이
    : models().filter(function(m){return tab.k==='all'||m.cat.indexOf(tab.k)>-1||(tab.k==='zero'&&!isWear(m)&&isZero(m))});
  $('#catCircles').innerHTML=smallCircles(list);
  $('#catList').innerHTML=sortedCards(list) || '<div class="empty">해당 모델이 없습니다</div>';
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
  var srs=sheetRows(m), selRow=null, rows='', pickers='';
  if(srs.length && (OPT[m.id]==null || !srs[OPT[m.id]])) OPT[m.id]=Math.max(0, srs.indexOf(priceOf(m).row));
  var p=priceOf(m, optsOf(m).length?(OPT[m.id]||0):null);
  if(p.kind==='sheet'){ selRow=p.row; var cst=calcState(m,p.row); pickers=calcPickers(m,p.row,cst); rows=calcBox(m,p.row,cst); }
  else if(p.kind==='hidden'){ rows='<div class="r hi"><span>가격</span><b>상담 시 안내</b></div>'; }
  else if(p.kind==='sub'){
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
  $('#mdBody').innerHTML='<div class="ucard" data-edit="model:'+esc(m.id)+'"><div class="md-img" id="mdImg">'+im((pc&&pc.img)||mImg(m),'',true,m.nm)+(SO(m)?'<span class="so-tag" style="font-size:22px">일시품절</span>':'')+'</div>'+
    '<h2 class="md-h ucard-name">'+esc(m.nm)+'</h2><p style="color:var(--sub);margin-top:4px">'+esc(m.ds)+'</p>'+
    '<div class="pills" style="margin-top:10px">'+tagsOf(m).map(function(t){return '<span class="pill">'+esc(t)+'</span>'}).join('')+'</div>'+
    colorPicker(m)+optPicker(m)+pickers+
    (SO(m)||(selRow&&selRow.so)?'<div class="so-notice">'+(SO(m)?'현재 일시품절입니다':'선택하신 '+esc(selRow.cap||'옵션')+' 은(는) 일시품절입니다')+'. 상담 신청해 주시면 입고 즉시 안내드립니다.</div>':'')+
    '<div class="ptable" id="ucatPrice">'+rows+''+'</div>'+guideHtml(m)+
    '<div class="md-chips"><span class="chip">제휴카드 의무가입 X</span><span class="chip">부가서비스 의무가입 X</span><span class="chip gray">당일 택배 발송</span><span class="chip gray">5분 상담</span></div>'+
    '<button class="cta ucard-cta" data-open="consult" data-model="'+esc(m.id)+'" data-color="'+esc(PICK[m.id]||'')+'" data-opt="'+esc(optsOf(m).length?optsOf(m)[OPT[m.id]||0].nm:'')+'">'+(SO(m)||(selRow&&selRow.so)?'입고 알림 상담 신청하기':(selRow?'이 조건으로 온라인 상담 신청하기 ›':'온라인 상담 신청하기'))+'</button></div>';
}

var PICK={};   // 상세에서 고른 컬러 (모델별)
function optPicker(m){
  var os=optsOf(m); if(os.length<2) return '';
  var cur=OPT[m.id]||0;
  return '<div class="cpick"><div class="cpick-l">'+esc(optLabel(m))+'</div><div class="cpick-row">'+os.map(function(o,i){
    var so=o.row&&o.row.so;
    return '<button type="button" class="opt'+(i===cur?' on':'')+(so?' so':'')+'" data-opt-pick="'+i+'" data-model="'+esc(m.id)+'">'+esc(o.nm)+(so?' <small>품절</small>':'')+'</button>';
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
  else if(v==='apply'){renderApply(true);$('#v-apply').classList.add('on');tab='consult'}
  else {
    $('#v-home').classList.add('on');renderRecent();renderPick();
    requestAnimationFrame(function(){window.scrollTo(0,homeScroll)});onScroll();
    setTab('home'); document.body.classList.remove('no-sq'); return;
  }
  window.scrollTo(0,0); $('#topbar').classList.remove('show'); setTab(tab);
  document.body.classList.toggle('no-sq', v==='model'||v==='apply');
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
  else if(v==='apply') renderApply(false);
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
function storeItem(s){
  return '<div class="store-li"><div class="sl-r"><b>'+esc(s.nm)+'</b><a class="sl-map" href="https://map.naver.com/p/search/'+encodeURIComponent(s.addr||s.nm)+'" target="_blank" rel="noopener">지도</a></div><div>'+esc(s.addr||'')+'</div>'+
    (s.tel?'<div><a href="tel:'+esc(s.tel)+'" style="color:var(--pink);font-weight:700">'+esc(s.tel)+'</a></div>':'')+'</div>';
}
function sheetStore(){
  var list=S.stores.filter(function(s){return s&&s.nm});
  var seoul=list.filter(function(s){return /^서울/.test(s.addr||'')}), gg=list.filter(function(s){return !/^서울/.test(s.addr||'')});
  return '<h3>매장찾기 <small style="font-size:13px;color:var(--sub);font-weight:600">서울·경기 '+list.length+'곳</small></h3>'+
    (list.length?(seoul.length?'<div class="sl-g">서울</div>'+seoul.map(storeItem).join(''):'')+(gg.length?'<div class="sl-g">경기</div>'+gg.map(storeItem).join(''):'')
      :'<div class="todo">가까운 매장은 상담 시 안내드립니다.</div>')+
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
function pickedCalc(){
  var m=CALCPICK&&byId(CALCPICK); if(!m) return null; var rs=sheetRows(m); if(!rs.length) return null;
  var r=rs[OPT[m.id]||0]||rs[0], st=calcState(m,r); return st.c?{m:m,r:r,st:st}:null;
}
function consultSummary(){
  var cp=pickedCalc(); if(!cp) return '';
  var m=cp.m, cc=colorsOf(m).filter(function(c){return c.nm===PICK[m.id]})[0]||colorsOf(m)[0], sub=[(cc&&cs2(m)?cc.nm:''), cp.r.cap&&cp.r.cap!=='기본'?cp.r.cap:''].filter(Boolean).join(' · ');
  return '<div class="csum"><div class="csum-h">선택한 조건</div><div class="csum-r"><div class="csum-img">'+im((cc&&cc.img)||mImg(m),'',true,m.nm)+'</div><div class="csum-t"><b>'+esc(m.nm)+'</b>'+(sub?'<span>'+esc(sub)+'</span>':'')+'<span>'+esc(calcSummary(cp.st))+'</span></div></div>'+
    '<div class="csum-p"><span>예상 월 납부금액</span><b>'+payTxt(cp.st)+'</b></div><em>'+esc(payHint(cp.st))+'</em></div>';
}
function cs2(m){ return colorsOf(m).length>1; }
// 함께 구매: 휴대폰을 고르면 워치·태블릿을 더 고를 수 있고, 워치·태블릿을 고르면 함께 살 휴대폰이 필요
// 함께 구매 — 휴대폰 / 세컨드(워치·태블릿) / TV프리 를 칸별로 하나씩 고름 (휴대폰 + 워치 + 태블릿 3개 동시 가능)
var BSLOTS=[['watch','워치'],['tablet','태블릿'],['tvfree','TV프리']];
function bundleHtml(m){
  var all=models().filter(function(x){return !x.hidden}), k=m?kindOf(m):'phone', h='';
  var sel=function(id,label,list,req){ return '<div class="bslot"><label>'+label+(req?' <span class="req">*</span>':' <small>(선택)</small>')+'</label><select id="'+id+'" data-bslot="'+label+'">'+
    '<option value=""'+(req?' disabled':'')+' selected>'+(req?'휴대폰을 선택해 주세요':'함께 구매하지 않음')+'</option>'+list.map(function(x){return '<option>'+esc(x.nm)+'</option>'}).join('')+(req?'<option value="상담 후 결정">상담 후 결정할게요</option>':'')+'</select></div>'; };
  if(k==='watch'||k==='tablet') h+=sel('mBundlePhone','함께 구매할 휴대폰',all.filter(function(x){return kindOf(x)==='phone'}),true);
  else if(k==='tvfree') h+=sel('mBundlePhoneOpt','휴대폰',all.filter(function(x){return kindOf(x)==='phone'}),false);
  BSLOTS.forEach(function(b){ if(b[0]===k) return; var list=all.filter(function(x){return kindOf(x)===b[0]}); if(list.length) h+=sel('mBundle_'+b[0],b[1],list,false); });
  if(!h) return '';
  return '<div class="bwrap"><div class="bwrap-h">함께 구매할 기기</div>'+h+'<div class="bnote">'+(k==='watch'||k==='tablet'?'워치·태블릿 혜택은 휴대폰과 함께 구매할 때 적용돼요':'휴대폰 + 워치 + 태블릿, 3개 동시 구매도 가능해요')+'</div></div>';
}
function sheetConsult(modelId, colorNm, optNm){
  var opts=models().filter(function(m){return !m.hidden}).map(function(m){
    return '<option value="'+esc(m.nm)+'" data-id="'+esc(m.id)+'"'+(m.id===modelId?' selected':'')+'>'+esc(m.nm)+(SO(m)?' (일시품절 · 입고 알림)':'')+'</option>';
  }).join('');
  var cp=pickedCalc(), car=cp&&cp.m.id===modelId?(cp.st.s.carrier||''):'';
  return '<section id="consultForm"><h3>온라인 상담 신청</h3>'+(cp&&cp.m.id===modelId?consultSummary():'')+
    '<div class="ff"><label>이름 <span class="req">*</span></label><input type="text" id="mUserName" placeholder="이름을 입력해 주세요" autocomplete="name"></div>'+
    '<div class="ff"><label>연락처 <span class="req">*</span></label><div class="phone3"><input type="text" id="mPhone1" value="010" readonly tabindex="-1"><span>-</span><input type="tel" id="mPhone2" maxlength="4" inputmode="numeric" placeholder="0000"><span>-</span><input type="tel" id="mPhone3" maxlength="4" inputmode="numeric" placeholder="0000"></div></div>'+
    '<div class="ff"><label>생년월일 <span class="req">*</span></label><input type="text" id="mUserBirth" inputmode="numeric" maxlength="8" placeholder="예: 940101"></div>'+
    '<div class="ff"><label>현재 통신사 <span class="req">*</span></label><select id="mCarrierSel"><option value=""'+(car?'':' selected')+' disabled>통신사를 선택해 주세요</option>'+CARRIERS.map(function(c){return '<option'+(c===car?' selected':'')+'>'+c+'</option>'}).join('')+'</select></div>'+
    '<div class="ff"><label>관심 기기 <span class="req">*</span></label><select id="mDeviceSelect"><option value=""'+(modelId?'':' selected')+' disabled>기기를 선택해 주세요</option>'+opts+'<option value="상담 후 결정">상담 후 결정할게요</option></select></div>'+
    '<div class="ff" id="mBundleWrap">'+bundleHtml(byId(modelId))+'</div>'+
    '<div class="ff" id="mOptWrap"'+(optOpts(byId(modelId))?'':' hidden')+'><label id="mOptLbl">'+esc(byId(modelId)?optLabel(byId(modelId)):'사이즈')+'</label><select id="mOptSel">'+optOpts(byId(modelId),optNm)+'</select></div>'+
    '<div class="ff" id="mColorWrap"'+(colorOpts(byId(modelId))?'':' hidden')+'><label>희망 컬러</label><select id="mColorSel">'+colorOpts(byId(modelId),colorNm)+'</select></div>'+
    '<div class="ff"><label>전달사항</label><textarea id="mUserNote" rows="3" maxlength="500" placeholder="요청사항을 적어주세요"></textarea></div>'+
    '<label class="agree"><input type="checkbox" id="mPrivacyCheck"> 개인정보 수집 및 이용 동의 (필수)<button type="button" data-privacy>자세히</button></label>'+
    '<div class="privacy-txt" id="privacyTxt">유플러스 다이렉트(이하 "회사")는 온라인 상담 신청 접수 및 상담 안내를 위해 아래와 같이 개인정보를 수집·이용합니다.<br><br>'+
    '· 항목: 이름, 전화번호, 생년월일, 희망기종, 현재 통신사<br>· 목적: 온라인 상담 신청 접수, 상담 연락 및 구매·개통 안내<br>· 보유 기간: 수집일로부터 6개월<br><br>'+
    '동의를 거부할 권리가 있으며, 거부 시 온라인 상담 신청이 제한될 수 있습니다. 수집된 개인정보는 제3자에게 제공되지 않으며, 보유 기간 종료 후 즉시 파기됩니다.</div>'+
    '<button type="button" class="cta" id="mSubmitBtn"><span class="rf-submit-label">온라인 상담 신청하기</span></button></section>';
}
function birth8(b){ b=String(b||'').replace(/\D/g,''); if(b.length===6){ var yy=+b.slice(0,2), cy=new Date().getFullYear()%100; b=(yy<=cy?'20':'19')+b; } return b; }
var CALCPICK=null;   // 상세 '이 조건으로' 버튼으로 들어온 모델 → 신청서 위 '선택한 조건' + 메모
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
  var bPhone=$('#mBundlePhone'), bList=$$('#mBundleWrap select[data-bslot]').filter(function(x){return x.id!=='mBundlePhone'&&x.value}).map(function(x){return x.getAttribute('data-bslot')+': '+x.value});
  if(bPhone && !bPhone.value){ alert('워치·태블릿 혜택은 휴대폰과 함께 구매할 때 적용돼요.\n함께 구매할 휴대폰을 선택해 주세요.'); return; }
  if(!$('#mPrivacyCheck').checked){ alert('개인정보 수집 및 이용에 동의해주세요.'); return; }
  var btn=$('#mSubmitBtn'); if(btn.disabled) return; btn.disabled=true; btn.firstChild.textContent='신청 중...';
  var reset=function(){ btn.disabled=false; btn.firstChild.textContent='온라인 상담 신청하기'; };
  var phoneF=phone.slice(0,3)+'-'+phone.slice(3,7)+'-'+phone.slice(7);
  var dm=null; $$('#mDeviceSelect option').forEach(function(o){ if(o.selected&&o.getAttribute('data-id')) dm=byId(o.getAttribute('data-id')); });
  var optV=($('#mOptSel')&&!$('#mOptWrap').hidden&&$('#mOptSel').value)||null, capV=optV;
  if(bPhone||bList.length) memo='[함께 구매] '+[bPhone?'휴대폰: '+bPhone.value:''].concat(bList).filter(Boolean).join(' / ')+(memo?' / '+memo:'');
  var cp=pickedCalc(); if(dm && cp && cp.m.id===dm.id) memo='[선택 조건] '+calcSummary(cp.st)+' · 예상 '+(cp.st.months===0?'일시납 '+won(cp.st.after):'월 '+won(cp.st.monthly))+(memo?' / '+memo:'');
  var dRows=dm?sheetRows(dm):[];
  if(dRows.length){ if(!capV && dRows.length===1 && dRows[0].cap && dRows[0].cap!=='기본') capV=dRows[0].cap; if(capV==='기본') capV=null; }
  else if(dm&&dm.optLabel==='요금제'){ if(optV) memo=('[희망 요금제] '+optV+(memo?' / '+memo:'')); capV=dm.capacity||null; }
  var body={name:name, phone:phoneF, carrier:carrier, channel:window.PAGE_CHANNEL||'메타', utm_campaign:window.PAGE_UTM_CAMPAIGN||null,
    device_interest:device, capacity:capV, product_color:($('#mColorSel')&&$('#mColorSel').value)||null, birth_date:birth, memo:memo||null, status:'신규'};
  if(typeof window.udakMetaIds==='function'){ var mi=window.udakMetaIds(); Object.keys(mi).forEach(function(k){ body[k]=mi[k]; }); }
  fetch(SB_URL,{method:'POST',headers:{'Content-Type':'application/json','apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY,'Prefer':'return=minimal'},body:JSON.stringify(body)})
  .then(function(res){
    if(res.ok){ if(typeof window.fbq!=='undefined') window.fbq('track','Lead'); reset(); closeSheet(); showTicket(); }
    else { reset(); res.text().then(function(x){ console.error('Supabase:',x); alert('신청 오류가 발생했습니다. 다시 시도해주세요.'); }); }
  }).catch(function(e){ console.error(e); reset(); alert('네트워크 오류가 발생했습니다. 다시 시도해주세요.'); });
}
function showTicket(){ $('#ticket').classList.add('on'); document.body.style.overflow='hidden'; }
function closeTicket(){ $('#ticket').classList.remove('on'); document.body.style.overflow=''; if(location.hash==='#/apply'){ AP=apInit(); location.hash='#/'; } }

function act(go, el){
  if(!go) return;
  if(go.charAt(0)==='#'){ location.hash=go; return; }
  if(go.indexOf('sec:')===0){ var id={gifts:'giftSec',wear:'wearSec',zero:'zeroSec',rank:'rankSec',pick:'pickSec',pop:'popSec'}[go.slice(4)];
    var goSec=function(){ var el=id&&document.getElementById(id); if(el) window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-60,behavior:'smooth'}); };
    if(!$('#v-home').classList.contains('on')){ location.hash='#/'; setTimeout(goSec,120); } else goSec(); return; }
  if(go==='search'){ closeSheet(); location.hash='#/search'; return; }
  if(go==='consult'){ closeSheet(); openApply(el); }
  else if(go==='contact') openSheet(sheetContact());
  else if(go==='guide') openSheet(sheetGuide());
  else if(go==='store') openSheet(sheetStore());
  else if(/^https?:\/\//.test(go)) location.href=go;
}

/* =========================================================
   온라인 상담 신청 페이지 (#/apply) — 조건을 고르면서 예상 금액을 보고 신청
   규칙
   · 워치: 월 95,000원 이상 요금제에서만 / 아이폰 → 애플워치, 갤럭시 → 갤럭시 워치
   · 태블릿(X236 갤럭시 탭): 월 105,000원 이상 요금제 + 갤럭시 휴대폰일 때만
   · TV프리(TV프리·아이패드): 휴대폰 브랜드와 상관없이, 유플러스 인터넷·TV를 함께 이용할 때 가입 가능
   · 상품 상세에서 '이 조건으로' 누르면 고른 휴대폰·용량·컬러·통신사·요금제·할부가 그대로 들어옴
   ========================================================= */
var AP=null;
function apInit(){ return {phone:'',cap:0,color:'',carrier:'',tier:'',method:'',months:24,watch:'',tablet:'',tv:'',tvTier:'',tvOk:false,pick:false,note:'',open:{}}; }
function brandOf(m){ return (m && (/iphone|ipad|watchse|apple/i.test(m.id) || m.cat.indexOf('iphone')>-1)) ? 'apple' : 'samsung'; }
var AP_SLOTS=[['watch','워치','watch'],['tablet','태블릿','tablet'],['tv','TV프리','tvfree']];
function apPhone(){ return AP.phone && AP.phone!=='later' ? byId(AP.phone) : null; }
function apTier(){ var ts=tiersOf('phone'); return ts.filter(function(t){return t.k===AP.tier})[0] || baseTier('phone'); }
function apNeed(m){ var g=GUIDE[m.id]; return g&&g.fee ? g.plan : (kindOf(m)==='tablet'?105000:95000); }
// 함께 구매할 수 없는 이유 (없으면 '')
function apReason(m){
  var k=kindOf(m), ph=apPhone(), t=apTier(), fee=(t&&t.fee)||0;
  if(k==='tvfree') return '';
  if(k==='tablet' && ph && brandOf(ph)==='apple') return '갤럭시 휴대폰과 함께 구매할 때 선택할 수 있어요';
  if(k==='watch' && ph && brandOf(ph)!==brandOf(m)) return brandOf(ph)==='apple' ? '아이폰은 애플워치와 함께 구매할 수 있어요' : '갤럭시 휴대폰은 갤럭시 워치와 함께 구매할 수 있어요';
  var need=apNeed(m); if(fee<need){ var tt=tiersOf('phone').filter(function(x){return (x.fee||0)>=need})[0]; return '월 '+won(need)+' 이상 요금제'+(tt&&tt.title?'('+tt.title+' 이상)':'')+'에서 선택할 수 있어요'; }
  return '';
}
function apValidate(){
  if(!apAddOn()){ AP.watch=''; AP.tablet=''; AP.tv=''; AP.tvOk=false; }
  var notes=[];
  AP_SLOTS.forEach(function(s){ var m=AP[s[0]]&&byId(AP[s[0]]); if(m && apReason(m)){ notes.push(m.nm+' 선택이 해제됐어요 — '+apReason(m)); AP[s[0]]=''; } });
  AP.note=notes.join('<br>');
}
// 휴대폰 금액
function apPhoneCalc(){
  var m=apPhone(); if(!m) return null; var rs=sheetRows(m); if(!rs.length) return null;
  var r=rs[AP.cap]||rs[0], type=AP.carrier?(AP.carrier==='LG U+'?'chg':'mnp'):'mnp', t=apTier(), c=rowCalc(r,type,t); if(!c) return null;
  var method=(AP.method==='sel'||!c.pub)?'sel':'pub', after=(method==='pub'&&c.pb!=null)?c.pb:c.sel, mm=AP.months;
  return {m:m, r:r, c:c, t:t, type:type, method:method, after:after, mm:mm,
    monthly:mm===0?null:won10(after*RATE[mm]/mm), fee:t.fee||0, feeAfter:t.fee?(method==='sel'?Math.round(t.fee*0.75):t.fee):0};
}
// 함께 구매 금액 (워치·태블릿·TV프리)
function apAddCalc(m){
  var rs=sheetRows(m); if(!rs.length) return null;
  var r=rs.filter(function(x){return !x.so})[0]||rs[0], g=r.g, ts=tiersOf(g), t=g==='tvfree'?(ts.filter(function(x){return x.k===AP.tvTier})[0]||ts[0]):ts[0];
  var c=rowCalc(r,'all',t); if(!c) return null;
  var after=c.pb!=null?c.pb:c.sel, mm=AP.months, noint=noInterest(r);
  return {r:r, t:t, c:c, after:after, monthly:mm===0||after===0?0:won10(noint?after/mm:after*RATE[mm]/mm), noint:noint};
}
function apChips(key, items, cur, n){
  return '<div class="cgrid" style="--n:'+n+'">'+items.map(function(x){
    return '<button type="button" class="cg'+(String(x[0])===String(cur)?' on':'')+(x[2]?' dis':'')+'" data-ap="'+key+'" data-v="'+esc(x[0])+'"'+(x[2]?' disabled':'')+'>'+esc(x[1])+'</button>'; }).join('')+'</div>';
}
function apPhoneHtml(){
  var m=apPhone(), h='<section class="ap-sec"><div class="ap-h"><b>01</b>'+(AP.phone&&!AP.pick?'선택한 휴대폰':'휴대폰')+'</div>';
  if((AP.phone && !AP.pick)){
    var os0=m?optsOf(m):[], cs0=m?colorsOf(m):[], capNm=os0[AP.cap]&&os0[AP.cap].nm!=='기본'?os0[AP.cap].nm:'', colNm=AP.color||(cs0.length===1?cs0[0].nm:(cs0[0]&&cs0[0].nm)||'');
    var pills=[capNm,colNm].filter(Boolean);
    h+='<div class="ap-dev"><div class="ap-dev-img">'+(m?im(apColorImg(m),'',true,m.nm):'')+'</div><div class="ap-dev-t"><b>'+esc(m?m.nm:'상담 후 결정할게요')+'</b>'+
      (m?'<span>'+esc(m.ds||'')+'</span>':'<span>상담하면서 함께 골라 드릴게요</span>')+
      (pills.length&&(os0.length>1||cs0.length>1)?'<button type="button" class="ap-opt" data-ap-act="opts">'+pills.map(esc).join('<i></i>')+'</button>':(pills.length?'<span class="ap-opt">'+pills.map(esc).join('<i></i>')+'</span>':''))+
      '</div><button type="button" class="ap-chg" data-ap-act="change">변경하기 <svg viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg></button></div>';
  } else {
    var list=models().filter(function(x){return !x.hidden&&kindOf(x)==='phone'});
    h+='<label class="ap-search"><svg class="ico" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input type="search" id="mDeviceSearch" placeholder="모델명을 검색하세요 (예: S26, 아이폰)" autocomplete="off"></label>'+
      '<div class="ap-list" id="apList">'+list.map(function(x){
        return '<div class="ap-li" data-nm="'+esc((x.nm+' '+x.id).toLowerCase().replace(/\s/g,''))+'"><div class="ap-li-img">'+im(mImg(x),'','',x.nm)+'</div><b>'+esc(x.nm)+(SO(x)?' <small>일시품절</small>':'')+'</b>'+
          '<button type="button" class="ap-pick'+(x.id===AP.phone?' on':'')+'" data-ap-pick="'+esc(x.id)+'">'+(x.id===AP.phone?'선택됨':'선택하기')+'</button></div>'; }).join('')+
      '<div class="ap-li later" data-nm="상담후결정"><b>상담 후 결정할게요</b><button type="button" class="ap-pick" data-ap-pick="later">선택하기</button></div></div>';
  }
  if(m && !AP.pick && AP.optOpen){
    var os=optsOf(m), cs=colorsOf(m);
    if(os.length>1) h+='<div class="ap-f"><div class="ap-l">'+esc(optLabel(m))+'</div>'+apChips('cap',os.map(function(o,i){return [i,o.nm+(o.row&&o.row.so?' (품절)':'')]}),AP.cap,Math.min(os.length,4))+'</div>';
    if(cs.length>1){ var cur=AP.color||cs[0].nm;
      h+='<div class="ap-f"><div class="ap-l">컬러 <b>'+esc(cur)+'</b></div><div class="cpick-row">'+cs.map(function(c){
        return '<button type="button" class="sw'+(c.nm===cur?' on':'')+'" data-ap="color" data-v="'+esc(c.nm)+'" aria-label="'+esc(c.nm)+'" style="--c:'+esc(c.hex||'#ddd')+'"></button>'; }).join('')+'</div></div>'; }
  }
  return h+'</section>';
}
function apColorImg(m){ var cs=colorsOf(m), c=cs.filter(function(x){return x.nm===AP.color})[0]||cs[0]; return (c&&c.img)||mImg(m); }
function apPlanHtml(){
  var ts=tiersOf('phone'), t=apTier(), pc=apPhoneCalc(), h='<section class="ap-sec"><div class="ap-h"><b>02</b>가입 조건</div>';
  h+='<div class="ap-f ap-row"><div class="ap-l">사용 통신사</div><div class="ap-r">'+apChips('carrier',CARRIERS.map(function(c){return [c,c]}),AP.carrier,4)+'</div>'+
    '</div>';
  h+='<div class="ap-f ap-row"><div class="ap-l">요금제</div><div class="ap-r"><select class="csel" id="mPlanSel">'+ts.map(function(x){ return '<option value="'+esc(x.k)+'"'+(t&&x.k===t.k?' selected':'')+'>'+esc(tierTitle(x))+'</option>'; }).join('')+'</select>'+
    '<div class="cpick-hint">'+PLAN_NOTE+'</div>'+apPerk(t)+'</div></div>';
  h+='<div class="ap-f ap-row"><div class="ap-l">할인 방식</div><div class="ap-r">'+apChips('method',[['pub','공시지원금',pc&&!pc.c.pub],['sel','선택약정 (요금 25%↓)']],pc?pc.method:(AP.method||'pub'),2)+(pc&&adviceTxt(cmpMethod(pc.c,pc.fee,AP.months),pc.method)?'<div class="cpick-hint">'+adviceTxt(cmpMethod(pc.c,pc.fee,AP.months),pc.method)+'</div>':'')+'</div></div>';
  h+='<div class="ap-f ap-row"><div class="ap-l">할부 개월</div><div class="ap-r">'+apChips('months',[['0','일시납'],['24','24개월'],['30','30개월'],['36','36개월']],String(AP.months),4)+'</div></div>';
  return h+'</section>';
}
// 이 요금제로 함께 살 수 있는 것 안내
function apPerk(t){
  if(!apAddOn()) return '';
  var f=(t&&t.fee)||0, w=f>=95000, tb=f>=105000;
  return '<div class="ap-perk"><span class="'+(w?'ok':'')+'">'+(w?'✓':'–')+' 워치 함께 구매</span><span class="'+(tb?'ok':'')+'">'+(tb?'✓':'–')+' 태블릿 함께 구매</span><span class="ok">✓ TV프리</span></div>';
}
function apAddOn(){ return !!S.applyAdd; }
function apAddHtml(){
  if(!apAddOn()) return '';
  var all=models().filter(function(x){return !x.hidden}), h='<section class="ap-sec"><div class="ap-h"><b>03</b>요금제별 혜택 <small>(선택사항)</small></div>'+
    (AP.note?'<div class="ap-note">'+AP.note+'</div>':'');
  AP_SLOTS.forEach(function(s){
    // 지금 조건(요금제·휴대폰 브랜드)으로 고를 수 없는 건 아예 안 보이게
    var list=all.filter(function(x){return kindOf(x)===s[2] && !apReason(x)}); if(!list.length) return;
    h+='<div class="ap-f"><div class="ap-l">'+s[1]+'</div><div class="ap-cards">'+list.map(function(x){
      var on=AP[s[0]]===x.id, ac=apAddCalc(x), g=GUIDE[x.id], open=on||AP.open[x.id];
      var dev=ac?(ac.after===0?'기기값 0원':'기기 월 '+won(ac.monthly)+(AP.months===0?'':' ('+AP.months+'개월)')):'기기값은 상담 시 안내';
      var fee=s[0]==='tv'?'이용료 월 9,350원부터':(g&&g.fee?'회선 이용료 월 '+won(g.fee)+' (요금제 포함)':'');
      return '<div class="ap-card'+(on?' on':'')+'"><button type="button" class="ap-card-main" data-ap="'+s[0]+'" data-v="'+esc(x.id)+'">'+
        '<span class="ap-card-img">'+im(mImg(x),'','',x.nm)+'</span><span class="ap-card-t"><b>'+esc(x.nm)+'</b><i>'+esc(dev)+'</i>'+(fee?'<em>'+esc(fee)+'</em>':'')+'</span><span class="ap-chk"></span></button>'+
        (g?'<button type="button" class="ap-cond" data-ap-cond="'+esc(x.id)+'">'+(open?'이용 조건 접기 ▴':'이용 조건 보기 ▾')+'</button>'+
          (open?'<ul class="ap-cond-list">'+g.items.map(function(it){ return '<li><b>'+esc(it.b)+'</b><span>'+esc(it.p)+'</span></li>'; }).join('')+'</ul>':''):'')+
        '</div>';
    }).join('')+'</div>';
    if(s[0]==='tv' && AP.tv){
      var tm=byId(AP.tv), ts=tiersOf('tvfree');
      if(ts.length>1) h+='<div class="ap-l" style="margin-top:10px">TV프리 요금제</div><select class="csel" id="apTvTier">'+ts.map(function(x){return '<option value="'+esc(x.k)+'"'+(x.k===AP.tvTier?' selected':'')+'>'+esc(x.nm)+'</option>'}).join('')+'</select>';
      h+='<div class="ap-tvnote">TV프리는 <b>유플러스 인터넷·TV와 함께 이용하실 때</b> 가입할 수 있는 상품이에요.</div>'+
        '<label class="agree ap-tvok"><input type="checkbox" id="mTvOk"'+(AP.tvOk?' checked':'')+'> 유플러스 인터넷·TV를 이용 중이거나 함께 가입할게요 <span class="req">(필수)</span></label>';
    }
    h+='</div>';
  });
  return h+'</section>';
}
// 공시지원금 vs 선택약정 — 실제로 내는 돈(기기 할부 전체 + 통신 요금 24개월)으로 비교
var LOW_FEE=47000;
function cmpMethod(c, fee, months){
  if(!c||!c.pub||c.pb==null||!fee) return null;
  var dev=function(a){ return months===0?a:won10(a*RATE[months]/months)*months; };
  var selFee=Math.round(fee*0.75), pub=dev(c.pb)+fee*24, sel=dev(c.sel)+selFee*24;
  return {best:pub<=sel?'pub':'sel', diff:Math.abs(pub-sel), selSave:(fee-selFee)*24};
}
function adviceTxt(cm, cur){
  if(!cm) return '';
  var d=Math.round(cm.diff/1000)*1000;
  if(d<1000) return '<b class="adv">두 방식 금액이 거의 같아요</b>';
  return '<b class="adv">💡 이 조건에선 <em>'+(cm.best==='pub'?'공시지원금':'선택약정')+'</em>이 24개월 기준 약 '+won(d)+' 더 저렴해요'+(cur&&cur!==cm.best?' · 눌러서 바꿔 보세요':'')+'</b>';
}
// 신청 영수증 계산 (화면·신청서 저장 공용)
function apSummary(){
  var pc=apPhoneCalc(), m=apPhone(), recs=[], L='ABCDE', out={recs:recs,total:0,upfront:0,sup:0,selSave:0,tv:false,flow:[],pc:pc};
  var rec=function(kind,nm,sk,mm){ var r={kind:kind,nm:nm,sk:sk,model:mm,dev:[],mon:[],sub:0,up:0,sup:0,after:null,ask:false}; recs.push(r); return r; };
  var row=function(arr,l,a,sub,was,cls,t){ arr.push({l:l,a:a,sub:sub||'',was:was==null?null:was,cls:cls||'',t:t||null}); };
  var dev=function(r,c,pub,pubNm,tn,after){
    row(r.dev,'출고가',c.out);
    if(pub) row(r.dev,pubNm,-pub,tn,null,'minus');
    if(c.our) row(r.dev,'유플러스 다이렉트 지원금',-c.our,tn,null,'minus');
    r.sup=c.out-after; r.after=after;
    row(r.dev,'지원 후 기기값',after,r.sup?'총 '+won(r.sup)+' 지원':'',null,'sum');
  };
  if(pc){
    var r=rec('휴대폰',m.nm,'phone',m), tn=pc.type==='chg'?'기기변경':'번호이동';
    dev(r, pc.c, pc.method==='pub'?pc.c.pub:0, '공시지원금', tn, pc.after);
    if(pc.mm===0){ r.up+=pc.after; row(r.mon,'기기값 일시납',pc.after,'한 번에 결제해요'); }
    else { r.sub+=pc.monthly; row(r.mon,'기기 할부금',pc.monthly,pc.mm+'개월 · 할부이자 포함'); }
    if(pc.fee){
      var sel=pc.method==='sel'; r.sub+=pc.feeAfter; if(sel) out.selSave=(pc.fee-pc.feeAfter)*24;
      row(r.mon,'월 통신 요금',pc.feeAfter,esc(pc.t.title||tierLabel(pc.t))+(sel?' · 선택약정 25% 할인':''),sel?pc.fee:null);
    }
  } else if(m){ var r0=rec('휴대폰',m.nm,'phone',m); r0.ask=true; row(r0.mon,'예상 금액',null,'',null,'','상담 시 안내'); }
  if(apAddOn()) AP_SLOTS.forEach(function(s){
    var x=AP[s[0]]&&byId(AP[s[0]]); if(!x) return; var r=rec(s[1],x.nm,s[0],x), ac=apAddCalc(x);
    if(!ac){ r.ask=true; row(r.dev,'기기값',null,'',null,'','상담 시 안내'); }
    else {
      dev(r, ac.c, ac.c.pb!=null?ac.c.pub:0, '이통사 지원금', '', ac.after);
      if(AP.months===0){ r.up+=ac.after; row(r.mon,'기기값 일시납',ac.after,'한 번에 결제해요'); }
      else { r.sub+=ac.monthly; row(r.mon,'기기 할부금',ac.monthly,ac.after===0?'기기값 0원이라 할부금이 없어요':AP.months+'개월'+(ac.noint?' · 이자 없음':' · 할부이자 포함')); }
    }
    if(s[0]==='tv'){ out.tv=true; r.sub+=9350; row(r.mon,'TV프리 이용료',9350,'첫 9개월 · 10개월 차부터 7,700원'); }
    else { var g=GUIDE[x.id]; if(g&&g.fee){ r.need={plan:g.plan,fee:g.fee}; row(r.mon,'회선 이용료',0,'요금제에 포함',g.fee); r.mon[r.mon.length-1].tip={k:'line_'+s[0], t:won(g.plan)+' 미만 요금제로 바꾸시면 월 '+won(g.fee)+'이 청구돼요'}; } }
  });
  recs.forEach(function(r,i){ r.key=L[i]; out.total+=r.sub; out.upfront+=r.up; out.sup+=r.sup; });
  // 기간별 예상 — 월 85,000·95,000원 요금제 고객만: 6개월 뒤 47,000원 요금제로 내렸을 때
  if(out.total && pc && pc.fee && pc.fee<=95000 && pc.fee>LOW_FEE){
    var low=out.total-pc.feeAfter+(pc.method==='sel'?Math.round(LOW_FEE*0.75):LOW_FEE), exk=[];
    recs.forEach(function(r){ if(r.need&&LOW_FEE<r.need.plan){ low+=r.need.fee; exk.push(r.kind+' 회선 이용료 월 '+won(r.need.fee)); } });
    out.flow.push({l:'처음 6개월',a:out.total,sub:esc(pc.t.title||tierLabel(pc.t))+' 기준'});
    out.flow.push({l:'7개월 차부터',a:low,sub:'월 '+won(LOW_FEE)+' 요금제로 바꾸시면',tip:exk.length?{k:'flow',t:exk.join(', ')+'이 더해진 금액이에요'}:null});
  }
  return out;
}
function apRowHtml(x){
  var v=x.t!=null?x.t:(x.a<0?'-'+won(-x.a):wz(x.a));
  var was=x.was==null?'':(x.l==='회선 이용료'?'월 '+won(x.was):won(x.was));
  var tip=x.tip, on=tip&&AP.tip&&AP.tip[tip.k];
  var lb=x.l+(tip?'<button type="button" class="tipb'+(on?' on':'')+'" data-ap-tip="'+tip.k+'" aria-label="조건 보기">?</button>':'');
  return crow(lb,x.sub,v,was,x.cls)+(on?'<div class="tip-bub">'+tip.t+'</div>':'');
}
function apSumHtml(){
  var S2=apSummary(), recs=S2.recs, A=recs.filter(function(r){return r.sk==='phone'})[0], adds=recs.filter(function(r){return r.sk!=='phone'}), pc=S2.pc;
  var h='<section class="ap-sec ap-sumsec"><div class="ap-h"><b>'+(apAddOn()?'04':'03')+'</b>예상 월 납부금액</div>';
  if(!recs.length||(!S2.total&&!S2.upfront)){ h+='<div class="ap-sub">휴대폰과 조건을 고르시면 예상 금액을 바로 보여드려요.</div>'; return h+'</section>'; }
  AP.tip=AP.tip||{};
  var tipB=function(k,t){ return '<button type="button" class="tipb'+(AP.tip[k]?' on':'')+'" data-ap-tip="'+k+'" aria-label="설명 보기">?</button>'+(AP.tip[k]?'<div class="tip-bub">'+t+'</div>':''); };
  var line=function(l,v,cls){ return '<div class="ms-r'+(cls?' '+cls:'')+'"><span>'+l+'</span><b>'+v+'</b></div>'; };
  // 위: 월 예상 납부금액 + 기간별
  var flow=S2.flow, f1=flow[0], f2=flow[1];
  h+='<div class="ms-top'+(f2?'':' solo')+'"><div class="ms-main"><span class="ms-l">월 예상 납부금액</span><b class="ms-v">'+won(S2.total)+'<small> / 월</small></b>'+
    '<span class="ms-h">'+(pc&&pc.mm===0?'통신 요금 기준 · 기기값은 일시납':'기기 할부금 + 통신 요금 ('+(AP.months||24)+'개월 기준)')+'</span>'+(S2.upfront?'<span class="ms-h">+ 일시납 '+won(S2.upfront)+'</span>':'')+'</div>';
  if(f2) h+='<div class="ms-flow">'+
      '<div class="ms-f"><i class="ic"><svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M4 10h16M9 3v4M15 3v4M9 14h.01M12 14h.01M15 14h.01"/></svg></i><div><span>처음 6개월</span><b>'+won(f1.a)+'<small> / 월</small></b><em>'+f1.sub+'</em></div></div>'+
      '<div class="ms-f"><i class="ic"><svg viewBox="0 0 24 24"><path d="M12 5v14M6 13l6 6 6-6"/></svg></i><div><span>7개월 차부터'+(f2.tip?tipB(f2.tip.k,f2.tip.t):'')+'</span><b>'+won(f2.a)+'<small> / 월</small></b><em>'+f2.sub.replace('바꾸시면','변경 시')+'</em></div></div>'+
    '</div>';
  h+='</div>';
  // 아래 왼쪽: 월 납부 구성
  var mon='';
  if(A&&A.mon.length) A.mon.forEach(function(x){
    if(x.t!=null) mon+=line(esc(x.l),esc(x.t));
    else if(x.l==='기기 할부금') mon+=line('기기 할부금 ('+(AP.months||24)+'개월)',won(x.a));
    else if(x.l==='기기값 일시납') mon+=line('기기값 일시납',won(x.a));
    else mon+=line(esc(x.l)+(x.was?' <small>25% 할인</small>':''),won(x.a));
  });
  adds.forEach(function(r){ r.mon.forEach(function(x){ if(typeof x.a==='number'&&x.a>0&&x.l!=='기기값 일시납') mon+=line(esc(r.kind)+' '+esc(x.l.replace('기기 ','')),won(x.a)); }); });
  mon+=line('월 합계',won(S2.total),'sum');
  // 아래 오른쪽: 기기 구매 혜택
  var ben='';
  if(A&&A.after!=null){
    A.dev.forEach(function(x){
      if(x.l==='출고가') ben+=line('출고가',won(x.a));
      else if(x.cls==='minus') ben+=line((x.l==='유플러스 다이렉트 지원금'?'추가 지원금 (유플러스 다이렉트)':esc(x.l)+(x.sub?' ('+esc(x.sub)+')':'')),'-'+won(-x.a),'minus');
    });
    ben+=line('지원 후 기기값',wz(A.after),'sum');
  } else ben+='<div class="ms-ask">기기값은 상담 시 안내드려요</div>';
  adds.forEach(function(r){ if(r.sup) ben+=line(esc(r.kind)+' 지원금','-'+won(r.sup),'minus'); });
  h+='<div class="ms-grid">'+
    '<div class="ms-card"><div class="ms-ch"><i class="ic won">₩</i>월 납부 구성'+tipB('mon','기기 할부금은 할부이자(연 5.9%)가 포함된 금액이에요. 통신 요금은 고르신 요금제 기준이에요.')+'</div>'+mon+'</div>'+
    '<div class="ms-card"><div class="ms-ch"><i class="ic"><svg viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13M3 12h18M12 8c-1.5-3-5.5-3.5-5.5-1S9 8 12 8c3 0 7-.5 5.5-2.5S13.5 5 12 8z"/></svg></i>기기 구매 혜택'+tipB('ben','출고가에서 지원금을 빼고 남은 기기값을 할부로 나눠 내요.')+'</div>'+ben+'</div>'+
  '</div>';
  return h+'</section>';
}
function apInfoHtml(){
  return '<section class="ap-sec ap-info" id="consultForm"><div class="ap-h"><b>'+(apAddOn()?'05':'04')+'</b>고객 정보</div>'+
    '<div class="ff"><label>이름 <span class="req">*</span></label><input type="text" id="mUserName" placeholder="이름을 입력해 주세요" autocomplete="name"></div>'+
    '<div class="ff"><label>연락처 <span class="req">*</span></label><div class="phone3"><input type="text" id="mPhone1" value="010" readonly tabindex="-1"><span>-</span><input type="tel" id="mPhone2" maxlength="4" inputmode="numeric" placeholder="0000"><span>-</span><input type="tel" id="mPhone3" maxlength="4" inputmode="numeric" placeholder="0000"></div></div>'+
    '<div class="ff"><label>생년월일 <span class="req">*</span></label><input type="text" id="mUserBirth" inputmode="numeric" maxlength="8" placeholder="예: 940101"></div>'+
    '<div class="ff"><label>전달사항</label><textarea id="mUserNote" rows="3" maxlength="500" placeholder="요청사항을 적어주세요 (선택)"></textarea></div>'+
    '<label class="agree"><input type="checkbox" id="mPrivacyCheck"> 개인정보 수집 및 이용 동의 (필수)<button type="button" data-privacy>자세히 보기 ›</button></label>'+
    '<div class="privacy-txt" id="privacyTxt">유플러스 다이렉트(이하 "회사")는 온라인 상담 신청 접수 및 상담 안내를 위해 아래와 같이 개인정보를 수집·이용합니다.<br><br>'+
    '· 항목: 이름, 전화번호, 생년월일, 희망기종, 현재 통신사<br>· 목적: 온라인 상담 신청 접수, 상담 연락 및 구매·개통 안내<br>· 보유 기간: 수집일로부터 6개월<br><br>'+
    '동의를 거부할 권리가 있으며, 거부 시 온라인 상담 신청이 제한될 수 있습니다. 수집된 개인정보는 제3자에게 제공되지 않으며, 보유 기간 종료 후 즉시 파기됩니다.</div>'+
    '<button type="button" class="cta" id="mSubmitBtn"><span class="rf-submit-label">이 조건으로 상담 신청하기</span> <svg class="cta-ar" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg></button></section>';
}
function apBarHtml(){
  var t=apSummary().total;
  return '<div class="ap-bar-t">'+(t?'예상 월 <b>'+won(t)+'</b>':'조건을 골라 주세요')+'</div><button type="button" class="ap-bar-b" data-ap-act="go">신청서 작성</button>';
}
function renderApply(full){
  if(!AP) AP=apInit();
  if(full || !$('#apCond')){
    $('#apBody').innerHTML='<div id="apCond"></div><div id="apSum"></div>'+apInfoHtml();
  }
  $('#apCond').innerHTML=apPhoneHtml()+apPlanHtml()+apAddHtml();
  $('#apSum').innerHTML=apSumHtml();
  $('#apBar').innerHTML=apBarHtml();
  AP.note='';
}
function apRefresh(){ var y=window.scrollY; apValidate(); renderApply(false); window.scrollTo(0,y); }
function openApply(el){
  var id=el&&el.getAttribute&&el.getAttribute('data-model'), m=id&&byId(id);
  AP=apInit();
  if(m){ var k=kindOf(m);
    if(k==='phone'){ AP.phone=m.id; AP.cap=OPT[m.id]||0; AP.color=PICK[m.id]||''; var s=SEL[m.id]||{}; AP.carrier=s.carrier||''; AP.method=s.method||''; if(s.months!=null) AP.months=s.months; AP.tier=TIER[m.id]||''; }
    else if(k==='tvfree'){ AP.tv=m.id; AP.tvTier=TIER[m.id]||''; }
    else AP[k]=m.id;
  }
  apValidate();
  if(location.hash==='#/apply'){ renderApply(true); window.scrollTo(0,0); } else location.hash='#/apply';
}
function apSubmit(){
  if(EDIT){ alert('관리자 화면에서는 신청이 저장되지 않습니다.'); return; }
  var name=$('#mUserName').value.trim(), phone='010'+$('#mPhone2').value.replace(/\D/g,'')+$('#mPhone3').value.replace(/\D/g,''), birth=birth8($('#mUserBirth').value), memo=$('#mUserNote').value.trim();
  if(!AP.phone){ alert('휴대폰을 선택해 주세요.\n(아직 정하지 않으셨다면 "상담 후 결정할게요"를 골라 주세요)'); window.scrollTo({top:0,behavior:'smooth'}); return; }
  if(!AP.carrier){ alert('현재 사용 중인 통신사를 선택해 주세요.'); return; }
  if(AP.tv && !AP.tvOk){ alert('TV프리는 유플러스 인터넷·TV와 함께 이용하실 때 가입할 수 있어요.\n확인 항목에 체크해 주세요.'); return; }
  if(!name){ alert('이름을 입력해주세요.'); return; }
  if(phone.length!==11){ alert('010으로 시작하는 11자리 전화번호를 입력해주세요.'); return; }
  if(window.udakBlocked && window.udakBlocked(phone)){ alert('현재 해당 번호로는 신청이 제한되어 있습니다.\n문의사항은 고객센터로 연락해주세요.'); return; }
  var t=new Date(), bY=+birth.slice(0,4), bM=+birth.slice(4,6), bD=+birth.slice(6,8);
  if(birth.length!==8||bY<1900||bY>t.getFullYear()||bM<1||bM>12||bD<1||bD>31){ alert('생년월일을 정확히 입력해주세요. (예: 940101)'); return; }
  var age=t.getFullYear()-bY; if(t.getMonth()+1<bM||(t.getMonth()+1===bM&&t.getDate()<bD)) age--;
  if(age<19){ alert('미성년자 고객님 안내\n\n미성년자 고객님은 개통 시 본인 신분증 확인과\n법정대리인 동의가 필수입니다.\n보호자와 함께 신청해 주세요.'); return; }
  if(!$('#mPrivacyCheck').checked){ alert('개인정보 수집 및 이용에 동의해주세요.'); return; }
  var m=apPhone(), os=m?optsOf(m):[], cap=os[AP.cap]?os[AP.cap].nm:null, cs=m?colorsOf(m):[], color=AP.color||(cs.length>1?'':(cs[0]&&cs[0].nm))||null;
  if(cap==='기본') cap=null;
  var tt=apTier(), SM=apSummary(), pc=SM.pc, type=AP.carrier==='LG U+'?'기기변경':'번호이동', pv=PV()||{};
  var nums=function(rows){ return rows.filter(function(x){return typeof x.a==='number'}).map(function(x){ return {label:x.l==='지원 후 기기값'?'기기값 원금':x.l, amount:x.a}; }); };
  var item=function(r){ return {key:r.key, kind:r.kind, device:r.nm, subsidy:nums(r.dev), monthly:nums(r.mon), subtotal:r.ask&&!r.sub?null:r.sub, support:r.sup}; };
  var A=SM.recs.filter(function(r){return r.sk==='phone'})[0], addRecs=SM.recs.filter(function(r){return r.sk!=='phone'});
  var tvTierNm=function(){ var ts=tiersOf('tvfree'), tv=ts.filter(function(y){return y.k===AP.tvTier})[0]||ts[0]; return tv?tv.nm:''; };
  var fee=[]; if(pc&&pc.fee){ fee.push({label:tt.title||tierTitle(tt), amount:pc.fee}); if(pc.method==='sel') fee.push({label:'선택약정 할인(25%)', amount:-(pc.fee-pc.feeAfter)}); fee.push({label:'월 통신요금', amount:pc.feeAfter}); }
  var subsidy=A&&A.after!=null?nums(A.dev):[]; if(pc&&pc.mm) subsidy.push({label:'기기값 월 청구 예정액', amount:pc.monthly});
  var benefits=addRecs.map(function(r){ return (r.sk==='tablet'?'탭':r.kind)+': '+r.nm+(r.sk==='tv'?(tvTierNm()?' ('+tvTierNm()+')':'')+' · 인터넷·TV 이용 확인':''); });
  var cm=pc?cmpMethod(pc.c,pc.fee,AP.months):null;
  var snapshot={v:2, source:'온라인 상담 신청', jointype:type, carrier:AP.carrier, device:m?m.nm:'상담 후 결정', storage:cap, color:color,
    plan:tt?{name:tt.title||tierTitle(tt), price:tt.fee||null, group:tt.grp||null}:null,
    discount:pc?(pc.method==='sel'?'선택약정':'공시지원금'):(AP.method==='sel'?'선택약정':'공시지원금'),
    fee:fee, feeNote:null, subsidy:subsidy, subsidyNote:AP.months===0?'일시납':'할부 '+AP.months+'개월 · 연 5.9%',
    benefits:benefits, estimatedMonthly:SM.total||null, installmentMonths:AP.months||null, upfront:SM.upfront||null,
    items:SM.recs.map(item), supportTotal:SM.sup||null, selDiscountTotal:SM.selSave||null,
    flow:SM.flow.map(function(f){ return {label:f.l, amount:f.a, note:f.sub||null}; }),
    advice:cm&&cm.diff>=1000?(cm.best==='pub'?'공시지원금':'선택약정')+' 쪽이 24개월 기준 약 '+won(Math.round(cm.diff/1000)*1000)+' 저렴':null,
    policy:{id:pv.id||null, from:pv.from||null, memo:pv.memo||null}, submittedAt:new Date().toISOString()};
  var tvx=AP.tv&&byId(AP.tv), wx=AP.watch&&byId(AP.watch), tbx=AP.tablet&&byId(AP.tablet);
  var btn=$('#mSubmitBtn'); if(btn.disabled) return; btn.disabled=true; btn.firstChild.textContent='신청 중...';
  var reset=function(){ btn.disabled=false; btn.firstChild.textContent='이 조건으로 상담 신청하기'; };
  var body={name:name, phone:phone.slice(0,3)+'-'+phone.slice(3,7)+'-'+phone.slice(7), carrier:AP.carrier, channel:window.PAGE_CHANNEL||'메타', utm_campaign:window.PAGE_UTM_CAMPAIGN||null,
    device_interest:m?m.nm:'상담 후 결정', capacity:cap, product_color:color, birth_date:birth, memo:memo||null, status:'신규',
    subscription_type:AP.carrier==='LG U+'?'기기변경':'MNP('+AP.carrier+')', rate_plan:tt?(tt.title||tierTitle(tt)):null,
    installment_months:AP.months===0?'일시납':AP.months+'개월', bundle_watch:wx?wx.nm:null, bundle_tablet:tbx?tbx.nm:null, bundle_tablet_type:tbx?'신규':null,
    home_tv:tvx?(tvx.id==='tvfree5'?'프리5':tvx.id==='ipada16'?'아이패드':tvx.nm):null, snapshot:snapshot};
  if(typeof window.udakMetaIds==='function'){ var mi=window.udakMetaIds(); Object.keys(mi).forEach(function(k){ body[k]=mi[k]; }); }
  fetch(SB_URL,{method:'POST',headers:{'Content-Type':'application/json','apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY,'Prefer':'return=minimal'},body:JSON.stringify(body)})
  .then(function(res){
    if(res.ok){ if(typeof window.fbq!=='undefined') window.fbq('track','Lead'); reset(); showTicket(); }
    else { reset(); res.text().then(function(x){ console.error('Supabase:',x); alert('신청 오류가 발생했습니다. 다시 시도해주세요.'); }); }
  }).catch(function(e){ console.error(e); reset(); alert('네트워크 오류가 발생했습니다. 다시 시도해주세요.'); });
}

/* ---------------- 이벤트 ---------------- */
var editing = EDIT; // 관리자: 편집 켜짐(누르면 수정) / 꺼짐(고객처럼 둘러보기)
document.addEventListener('click',function(e){
  if(EDIT && editing && window.__stEditClick && window.__stEditClick(e)) return;
  var t=e.target;
  if(t.closest('.sheet-x')){ e.preventDefault(); closeSheet(); return; }
  if(t.closest('#mSubmitBtn')){ e.preventDefault(); apSubmit(); return; }
  if(t.closest('[data-maxv]')){ e.preventDefault(); MAXV=!MAXV; try{ sessionStorage.setItem('st_maxv',MAXV?'1':'0'); }catch(x){} refresh(); return; }
  var so=t.closest('[data-sort-open]');
  if(so){ e.preventDefault(); sortPop(so); return; }
  var sb=t.closest('[data-sort]');
  if(sb){ e.preventDefault(); SORT=sb.getAttribute('data-sort'); var sp=document.querySelector('.sortpop'); if(sp) sp.remove(); if(SORT==='sales') loadRank(); refresh(); return; }
  if(!t.closest('.sortpop')){ var sp2=document.querySelector('.sortpop'); if(sp2) sp2.remove(); }
  var apb=t.closest('[data-ap]');
  if(apb){ e.preventDefault(); if(apb.disabled) return; var ak=apb.getAttribute('data-ap'), av=apb.getAttribute('data-v');
    if(ak==='cap'||ak==='months') AP[ak]=+av; else if(ak==='watch'||ak==='tablet'||ak==='tv') AP[ak]=(AP[ak]===av?'':av); else AP[ak]=av;
    if(ak==='tv'&&AP.tv&&!AP.tvTier){ AP.tvTier=(tiersOf('tvfree')[0]||{}).k||''; }
    apRefresh(); return; }
  var app=t.closest('[data-ap-pick]');
  if(app){ e.preventDefault(); var pv=app.getAttribute('data-ap-pick'); if(pv!==AP.phone){ AP.cap=0; AP.color=''; if(pv!=='later'){ var pm=byId(pv), prs=sheetRows(pm); if(prs.length){ var pp=priceOf(pm); AP.cap=Math.max(0,prs.indexOf(pp.row)); } } }
    AP.phone=pv; AP.pick=false; apRefresh(); return; }
  var apt=t.closest('[data-ap-tip]');
  if(apt){ e.preventDefault(); AP.tip=AP.tip||{}; var tk=apt.getAttribute('data-ap-tip'); AP.tip[tk]=!AP.tip[tk]; apRefresh(); return; }
  var apd=t.closest('[data-ap-dev]');
  if(apd){ e.preventDefault(); AP.devOpen=AP.devOpen||{}; var dk=apd.getAttribute('data-ap-dev'); AP.devOpen[dk]=!AP.devOpen[dk]; apRefresh(); return; }
  var apc=t.closest('[data-ap-cond]');
  if(apc){ e.preventDefault(); var cid=apc.getAttribute('data-ap-cond'); AP.open[cid]=!(AP.open[cid]||AP[kindOf(byId(cid))==='tvfree'?'tv':kindOf(byId(cid))]===cid); apRefresh(); return; }
  var apa=t.closest('[data-ap-act]');
  if(apa){ e.preventDefault(); var aa=apa.getAttribute('data-ap-act');
    if(aa==='opts'){ AP.optOpen=!AP.optOpen; apRefresh(); }
    else if(aa==='change'){ AP.pick=true; apRefresh(); var si=$('#mDeviceSearch'); if(si) si.focus(); }
    else if(aa==='go'){ var cf=$('#consultForm'); if(cf) window.scrollTo({top:cf.getBoundingClientRect().top+window.scrollY-60,behavior:'smooth'}); }
    return; }
  if(t.closest('[data-privacy]')){ e.preventDefault(); $('#privacyTxt').classList.toggle('on'); return; }
  if(t.closest('#ticket') && (t.closest('.x') || t.id==='ticket')){ closeTicket(); return; }
  var mt=t.closest('[data-ms-tip]');
  if(mt){ e.preventDefault(); var mk=mt.getAttribute('data-ms-tip'); MSTIP[mk]=!MSTIP[mk]; var hm=location.hash.match(/#\/model\/([^/?]+)/); if(hm){ var y=window.scrollY; renderModel(hm[1],true); window.scrollTo(0,y); } return; }
  var cb=t.closest('[data-calc]');
  if(cb){ e.preventDefault(); e.stopPropagation(); if(cb.disabled) return; var mid=cb.getAttribute('data-model'), k=cb.getAttribute('data-calc'), v=cb.getAttribute('data-v'), sel=SEL[mid]||(SEL[mid]={});
    if(k==='tier') TIER[mid]=v; else if(k==='months') sel.months=+v; else sel[k]=v;
    var y=window.scrollY; renderModel(mid,true); window.scrollTo(0,y); return; }
  var op=t.closest('[data-opt-pick]');
  if(op){ e.preventDefault(); e.stopPropagation(); OPT[op.getAttribute('data-model')]=+op.getAttribute('data-opt-pick'); var y2=window.scrollY; renderModel(op.getAttribute('data-model'),true); window.scrollTo(0,y2); return; }
  var vb=t.closest('[data-video]'); if(vb){ e.preventDefault(); openVideo(vb.getAttribute('data-video')); return; }
  var cp=t.closest('[data-color-pick]');
  if(cp){ e.preventDefault(); e.stopPropagation(); var mm=byId(cp.getAttribute('data-model')), nm=cp.getAttribute('data-color-pick'), cc=colorsOf(mm).filter(function(c){return c.nm===nm})[0];
    PICK[mm.id]=nm; $$('[data-color-pick]').forEach(function(b){b.classList.toggle('on',b===cp)}); $('#cpickName').textContent=nm;
    if(cc&&cc.img) $('#mdImg').innerHTML=im(cc.img,'',true,mm.nm)+(SO(mm)?'<span class="so-tag" style="font-size:22px">일시품절</span>':'');
    var cb=$('.ucard-cta'); if(cb) cb.setAttribute('data-color',nm); return; }
  var w=t.closest('[data-wish]');
  if(w){e.preventDefault();e.stopPropagation();var id=w.getAttribute('data-wish'),l=store.get('wish',[]),i=l.indexOf(id);
    if(i>-1)l.splice(i,1);else l.unshift(id);store.set('wish',l);
    $$('[data-wish="'+id+'"]').forEach(function(b){b.classList.toggle('on',i<0)}); if($('#v-wish').classList.contains('on'))renderWish(); return}
  var o=t.closest('[data-open]'); if(o){e.preventDefault();act(o.getAttribute('data-open'),o);return}
  var g=t.closest('[data-go]'); if(g){e.preventDefault();act(g.getAttribute('data-go'),g);return}
  var c=t.closest('[data-cat]'); if(c){location.hash='#/cat/'+c.getAttribute('data-cat');return}
  var mp=t.closest('[data-mnp]'); if(mp){ e.preventDefault(); MNP=mp.getAttribute('data-mnp')==='1'; refresh(); return; }
  if(t.closest('[data-cert]')){e.preventDefault();openCert();return}
  if(t.closest('[data-home]')){e.preventDefault();closeSheet();location.hash='#/';window.scrollTo(0,0);return}
  if(t.closest('[data-back]')){e.preventDefault();history.length>1?history.back():location.hash='#/';return}
});
document.addEventListener('input',function(e){
  var id=e.target.id;
  if(id==='mPhone2'||id==='mPhone3'){ e.target.value=e.target.value.replace(/\D/g,'').slice(0,4); if(id==='mPhone2'&&e.target.value.length===4){ var n=$('#mPhone3'); if(n) n.focus(); } }
  else if(id==='mUserBirth'){ e.target.value=e.target.value.replace(/\D/g,'').slice(0,8); }
  else if(id==='mUserName'){ e.target.value=e.target.value.replace(/[0-9]/g,''); }
  else if(id==='q'){ renderSearch(e.target.value); }
  else if(id==='mDeviceSearch'){ var qv=e.target.value.toLowerCase().replace(/\s/g,''), al={'아이폰':'iphone','갤럭시':'','플립':'flip','폴드':'fold','울트라':'ultra'};
    $$('#apList .ap-li').forEach(function(li){ var nm=li.getAttribute('data-nm')||'', q2=qv; Object.keys(al).forEach(function(a){ if(al[a]) q2=q2.split(a).join(al[a]); }); li.hidden=!!qv && nm.indexOf(qv)<0 && (!q2||nm.indexOf(q2)<0); }); }
});
document.addEventListener('change',function(e){
  if(e.target.id==='mPlanSel'){ AP.tier=e.target.value; apRefresh(); return; }
  if(e.target.id==='apTvTier'){ AP.tvTier=e.target.value; apRefresh(); return; }
  if(e.target.id==='mTvOk'){ AP.tvOk=e.target.checked; return; }
  var cs=e.target.closest&&e.target.closest('[data-calc-sel]');
  if(cs){ var mid=cs.getAttribute('data-model'); if(cs.getAttribute('data-calc-sel')==='tier') TIER[mid]=cs.value; var y=window.scrollY; renderModel(mid,true); window.scrollTo(0,y); return; }
  if(e.target.id!=='mDeviceSelect') return;
  var o=e.target.selectedOptions&&e.target.selectedOptions[0], m=o&&byId(o.getAttribute('data-id')), h=colorOpts(m);
  $('#mColorSel').innerHTML=h; $('#mColorWrap').hidden=!h;
  var bw=$('#mBundleWrap'); if(bw) bw.innerHTML=bundleHtml(m);
  var oh=optOpts(m); $('#mOptSel').innerHTML=oh; $('#mOptWrap').hidden=!oh; $('#mOptLbl').textContent=m?optLabel(m):'사이즈';
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
  TYPES:TYPES, todayKST:todayKST, verAt:verAt, PV:PV, plansOf:plansOf, tiersOf:tiersOf, baseTier:baseTier, sheetRows:sheetRows, rowCalc:rowCalc, normPricing:normPricing,
  esc:esc, clone:clone, num:num, won:won, imgSrc:imgSrc, im:im, byId:byId, autoList:autoList, colorsOf:colorsOf, optsOf:optsOf, DEFCOLORS:DEFCOLORS, mImg:mImg, mCard:mCard, normalize:normalize,
  refresh:refresh, openSheet:openSheet, closeSheet:closeSheet, load:load, apply:apply,
  setEditing:function(v){ editing=v; document.body.classList.toggle('editing',v); },
  isEditing:function(){ return editing; },
  setStamp:function(v){ lastStamp=v; }
};

/* 시작 */
var ROOT=document.getElementById('storeRoot')||document.body;
ROOT.insertAdjacentHTML('afterbegin', MARKUP);
// 온라인 상담 신청 페이지
$('#app').insertAdjacentHTML('beforeend','<main class="view" id="v-apply"><div class="subhead"><button data-back><svg class="ico" viewBox="0 0 24 24"><path d="M19 12H5M11 18l-6-6 6-6"/></svg></button><h1>온라인 상담 신청서</h1><button data-home aria-label="홈으로"><svg class="ico" viewBox="0 0 24 24"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20h5v-6h4v6h5V9.5"/></svg></button></div><div id="apBody"></div><div class="ap-bar" id="apBar"></div></main>');
if(!EDIT) document.body.insertAdjacentHTML('beforeend','<div class="side-quick sq-img"><img src="/assets/store/side-quick.webp" alt="" aria-hidden="true">'+
  '<a class="sq-hit is-call" href="tel:'+esc(S.tel)+'" aria-label="전화 상담"></a><a class="sq-hit is-kakao" href="'+esc(S.kakao)+'" target="_blank" rel="noopener" aria-label="카톡 문의"></a></div>');
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
