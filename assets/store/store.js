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

var MARKUP = "<!-- 스크롤 시 나타나는 상단바 (쿠팡이츠 방식) -->\n<header class=\"topbar\" id=\"topbar\">\n  <button class=\"lbl\" data-open=\"store\"><svg class=\"ico\" viewBox=\"0 0 24 24\"><path d=\"M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z\"/><circle cx=\"12\" cy=\"9.5\" r=\"2.5\"/></svg>매장찾기<svg class=\"ico chev\" viewBox=\"0 0 24 24\" style=\"width:18px;height:18px\"><path d=\"m6 9 6 6 6-6\"/></svg></button>\n  <button data-go=\"search\"><svg class=\"ico\" viewBox=\"0 0 24 24\"><circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"m20 20-3.5-3.5\"/></svg></button>\n  <button style=\"position:relative;display:flex\" data-open=\"noti\"><svg class=\"ico\" viewBox=\"0 0 24 24\"><path d=\"M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8\"/><path d=\"M10.3 21a1.9 1.9 0 0 0 3.4 0\"/></svg><i class=\"dot-new\"></i></button>\n</header>\n<div class=\"app\" id=\"app\">\n<!-- ===================== 홈 ===================== -->\n<main class=\"view on\" id=\"v-home\">\n  <!-- 1. 히어로 -->\n  <section class=\"hero\" id=\"hero\">\n    <div class=\"hero-top\">\n      <div class=\"brand\" id=\"brand\" data-edit=\"brand\"></div>\n      <div class=\"hero-r\">\n        <div class=\"uplus-logo\">U<sup>+</sup></div>\n        <div class=\"hero-icons\">\n          <button data-go=\"search\" aria-label=\"검색\"><svg class=\"ico\" viewBox=\"0 0 24 24\"><circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"m20 20-3.5-3.5\"/></svg></button>\n          <button data-open=\"noti\" aria-label=\"알림\"><svg class=\"ico\" viewBox=\"0 0 24 24\"><path d=\"M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8\"/><path d=\"M10.3 21a1.9 1.9 0 0 0 3.4 0\"/></svg><i class=\"dot-new\"></i></button>\n        </div>\n      </div>\n    </div>\n    <div class=\"hero-track\" id=\"heroTrack\"></div>\n    <div class=\"dots\" id=\"heroDots\"></div>\n    <div class=\"deal-subs\" id=\"dealSubs\"></div>\n  </section>\n  <!-- 2. 당일 출발 안내 (온라인 구매 과정 + 마감 카운트다운) -->\n  <div class=\"shipbar\" id=\"shipBar\" data-edit=\"ship\"></div>\n  <!-- 3. 검색 -->\n  <label class=\"search\" data-go=\"search\">\n    <svg class=\"ico\" viewBox=\"0 0 24 24\"><circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"m20 20-3.5-3.5\"/></svg>\n    <input type=\"text\" placeholder=\"어떤 휴대폰을 찾고 계세요?\" readonly tabindex=\"-1\">\n  </label>\n  <!-- 4. 모델 원형 아이콘 -->\n  <nav class=\"models\" id=\"models\"></nav>\n  <!-- 5. 퀵메뉴 -->\n  <nav class=\"quick hscroll\" id=\"quick\"></nav>\n  <!-- 6. 신뢰 스트립 -->\n  <div class=\"trust hscroll\" id=\"trust\"></div>\n  <!-- 7. 프로모 배너 -->\n  <a class=\"promo\" id=\"promo\" data-edit=\"promo\"></a>\n  <!-- 8. 많이 찾아요 -->\n  <section class=\"sec\" id=\"popSec\">\n    <div id=\"popHead\"></div>\n    <div class=\"popgrid\" id=\"popgrid\"></div>\n  </section>\n  <div class=\"divider\" style=\"margin-top:16px\"></div>\n  <!-- ===== 여기부터 쿠팡이츠 모티브 섹션 ===== -->\n  <!-- 9-1. 최근 본 모델 (본 게 없으면 숨김) -->\n  <section class=\"sec\" id=\"recentSec\" hidden>\n    <div id=\"recentHead\"></div>\n    <div class=\"hcards hscroll\" id=\"recent\"></div>\n  </section>\n  <!-- 9-2. 기기값 0원 모아보기 -->\n  <section class=\"sec zero-sec\" id=\"zeroSec\">\n    <div id=\"zeroHead\"></div>\n    <div class=\"hcards hscroll\" id=\"zero\"></div>\n  </section>\n  <section class=\"sec\" id=\"wearSec\">\n    <div id=\"wearHead\"></div>\n    <div class=\"hcards hscroll\" id=\"wear\"></div>\n  </section>\n  <div class=\"divider\"></div>\n  <!-- 10-1. 한정 사은품 -->\n  <section class=\"sec\" id=\"giftSec\">\n    <div id=\"giftHead\"></div>\n    <div class=\"dcards hscroll\" id=\"gifts\"></div>\n  </section>\n  <!-- 10-2. 우리 동네 인기 모델 -->\n  <section class=\"sec\" id=\"rankSec\">\n    <div id=\"rankHead\"></div>\n    <div class=\"dcards hscroll\" id=\"rank\"></div>\n  </section>\n  <div class=\"divider\" style=\"margin-top:16px\"></div>\n  <!-- 11. 골라보는 휴대폰 -->\n  <section class=\"sec ucat-wrap\" id=\"pickSec\" style=\"padding-bottom:0\">\n    <div id=\"pickHead\"></div>\n    <nav class=\"models hscroll\" id=\"pickCircles\" style=\"display:flex;gap:4px;padding:0 10px 6px\"></nav>\n    <div class=\"filters\">\n      <div class=\"seg\" data-seg></div><div class=\"maxv-wrap\" data-maxwrap></div>\n      <button class=\"fbtn\" type=\"button\" data-sort-open><span class=\"sort-lbl\">추천순</span> <svg class=\"ico\" viewBox=\"0 0 24 24\" style=\"width:14px;height:14px\"><path d=\"m6 9 6 6 6-6\"/></svg></button>\n      <button class=\"fbtn\">필터 <svg class=\"ico\" viewBox=\"0 0 24 24\" style=\"width:14px;height:14px\"><path d=\"M4 6h16M7 12h10M10 18h4\"/></svg></button>\n    </div>\n    <div class=\"adlabel\">추천 리스트</div>\n    <div id=\"bigList\"></div>\n  </section>\n  <footer class=\"foot\" id=\"foot\" data-edit=\"foot\"></footer>\n</main>\n<!-- ===================== 카테고리 (쿠팡이츠 '한식' 화면) ===================== -->\n<main class=\"view\" id=\"v-cat\">\n  <div class=\"subhead\"><button data-back><svg class=\"ico\" viewBox=\"0 0 24 24\"><path d=\"M19 12H5M11 18l-6-6 6-6\"/></svg></button><h1 id=\"catTitle\">전체</h1><span class=\"sh-r\"><button data-home aria-label=\"홈으로\"><svg class=\"ico\" viewBox=\"0 0 24 24\"><path d=\"M3 10.5 12 3l9 7.5\"/><path d=\"M5 9.5V20h5v-6h4v6h5V9.5\"/></svg></button><button data-go=\"search\"><svg class=\"ico\" viewBox=\"0 0 24 24\"><circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"m20 20-3.5-3.5\"/></svg></button></span></div>\n  <div class=\"sticky-tabs\"><nav class=\"ctabs hscroll\" id=\"catTabs\"></nav></div>\n  <nav class=\"hscroll\" id=\"catCircles\" style=\"display:flex;gap:4px;padding:14px 10px 6px\"></nav>\n  <div class=\"filters\">\n    <div class=\"seg\" data-seg></div><div class=\"maxv-wrap\" data-maxwrap></div>\n    <button class=\"fbtn\" type=\"button\" data-sort-open><span class=\"sort-lbl\">추천순</span> <svg class=\"ico\" viewBox=\"0 0 24 24\" style=\"width:14px;height:14px\"><path d=\"m6 9 6 6 6-6\"/></svg></button>\n    <button class=\"fbtn\">필터 <svg class=\"ico\" viewBox=\"0 0 24 24\" style=\"width:14px;height:14px\"><path d=\"M4 6h16M7 12h10M10 18h4\"/></svg></button>\n  </div>\n  <div class=\"adlabel\">추천 리스트</div>\n  <div id=\"catList\"></div>\n</main>\n<!-- ===================== 검색 ===================== -->\n<main class=\"view\" id=\"v-search\">\n  <div class=\"subhead\" style=\"gap:4px;justify-content:flex-start\"><button data-back><svg class=\"ico\" viewBox=\"0 0 24 24\"><path d=\"M19 12H5M11 18l-6-6 6-6\"/></svg></button>\n    <label class=\"search\" style=\"margin:0;flex:1;height:40px\"><svg class=\"ico\" viewBox=\"0 0 24 24\" style=\"width:18px;height:18px\"><circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"m20 20-3.5-3.5\"/></svg><input id=\"q\" type=\"search\" autocomplete=\"off\" placeholder=\"모델명을 입력하세요 (예: 폴드, 아이폰)\"></label></div>\n  <div class=\"s-modes\" id=\"sModes\"><button type=\"button\" data-smode=\"phone\">휴대폰</button><button type=\"button\" data-smode=\"store\">매장</button></div>\n  <div class=\"results\" id=\"results\"></div>\n</main>\n<!-- ===================== 찜한 모델 ===================== -->\n<main class=\"view\" id=\"v-wish\">\n  <div class=\"subhead\"><span style=\"width:40px\"></span><h1>찜한 모델</h1><span style=\"width:40px\"></span></div>\n  <div id=\"wishList\"></div>\n</main>\n<!-- ===================== 모델 상세 (다음 단계) ===================== -->\n<main class=\"view\" id=\"v-model\">\n  <div class=\"subhead\"><button data-back><svg class=\"ico\" viewBox=\"0 0 24 24\"><path d=\"M19 12H5M11 18l-6-6 6-6\"/></svg></button><h1 id=\"mdTitle\"></h1><button data-home aria-label=\"홈으로\"><svg class=\"ico\" viewBox=\"0 0 24 24\"><path d=\"M3 10.5 12 3l9 7.5\"/><path d=\"M5 9.5V20h5v-6h4v6h5V9.5\"/></svg></button></div>\n  <div id=\"mdBody\" style=\"padding:0 16px 20px\"></div>\n</main>\n</div><!-- /app -->\n<!-- 하단 탭바 -->\n<nav class=\"tabbar\" id=\"tabbar\">\n  <a href=\"#/\" data-tab=\"home\"><svg class=\"ico\" viewBox=\"0 0 24 24\"><path d=\"M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z\"/></svg>홈</a>\n  <a href=\"#/search\" data-tab=\"search\"><svg class=\"ico\" viewBox=\"0 0 24 24\"><circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"m20 20-3.5-3.5\"/></svg>검색</a>\n  <a href=\"#/wish\" data-tab=\"wish\"><svg class=\"ico\" viewBox=\"0 0 24 24\"><path d=\"M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z\"/></svg>찜</a>\n  <a href=\"javascript:void 0\" data-open=\"consult\" data-tab=\"consult\"><svg class=\"ico\" viewBox=\"0 0 24 24\"><rect x=\"5\" y=\"4\" width=\"14\" height=\"17\" rx=\"2\"/><path d=\"M9 4h6v3H9zM9 12l2 2 4-4\"/></svg>상담신청</a>\n  <a href=\"javascript:void 0\" data-open=\"store\" data-tab=\"store\"><svg class=\"ico\" viewBox=\"0 0 24 24\"><path d=\"M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z\"/><circle cx=\"12\" cy=\"9.5\" r=\"2.5\"/></svg>매장</a>\n</nav>\n<div class=\"dim\" id=\"dim\"></div>\n<div class=\"sheet\" id=\"sheet\"><button type=\"button\" class=\"sheet-x\" aria-label=\"닫기\">×</button><div id=\"sheetBody\"></div></div>";

/* ---------------- 기본 데이터 (파이어베이스가 비어 있을 때) ---------------- */
var DEFAULT = {
  v:1,
  brand:{small:'유플러스 공식파트너사', big:'유플러스 다이렉트'},
  // 맨 위: 이번 주 특가 (켜면 히어로 슬라이드 대신 보임). items 첫 줄이 대표 모델 — '모델|번호이동 최대|기기변경'
  ship:{on:true, cut:'15:00'},   // 당일 발송 마감 (월~금, 토·일은 택배 쉼)
  deal:{on:true, title:'이번 주 특가', img:'hero/hero-02.webp', items:'fold8|73만원|47만원\nflip8|60만원|34만원\ns26|68만원|50만원\niphone17|50만원|24만원'},
  hero:[
    {k:'U+ 최초의 온라인 대리점', t:'유플러스 다이렉트', s:'불필요한 가입 없이 온라인으로 간편하게.', img:'hero/hero-01.webp', go:'#/model/iphone18pro'},
    {k:'갤럭시 폴드8 / 플립8', t:'', s:'', sup:'폴드8|73만원|47만원\n플립8|60만원|34만원', img:'hero/hero-02.webp', go:'#/model/fold8'},
    {k:'갤럭시 S26 시리즈', t:'', s:'', sup:'|68만원|50만원', img:'hero/hero-03.webp', go:'#/model/s26ultra'}
  ],
  models:[
    {id:'iphone18pro',    nm:'아이폰 18프로',     cat:['iphone','zero'], ds:'프로가 하는 프로의 선택',      tags:['기기값 0원','최대 지원금']},
    {id:'iphone18promax', nm:'아이폰 18프로맥스', cat:['iphone','zero'], ds:'더 커진 프로의 등장',          tags:['기기값 0원','최대 지원금']},
    {id:'s26',            nm:'갤럭시 S26',        cat:['galaxy'],        ds:'새로운 AI, 새로운 일상',       tags:['기기값 할인','보호필름 · 투명케이스 · 고속충전기 제공']},
    {id:'s26plus',        nm:'갤럭시 S26+',       cat:['galaxy'],        ds:'더 커진 화면, 더 강한 성능',   tags:['기기값 할인','보호필름 · 투명케이스 · 고속충전기 제공']},
    {id:'s26ultra',       nm:'갤럭시 S26 울트라', cat:['galaxy'],        ds:'AI 카메라의 새로운 기준',      tags:['기기값 할인','보호필름 · 투명케이스 · 고속충전기 제공']},
    {id:'iphone17',       nm:'아이폰17',          cat:['iphone','zero'], ds:'새로운 컬러, 더 특별하게',     tags:['기기값 0원','최대 지원금']},
    {id:'flip8',          nm:'플립 8',            cat:['fold'],          ds:'한 손에 들어오는 혁신',        tags:['기기값 할인','보호필름 · 투명케이스 · 고속충전기 제공']},
    {id:'fold8ultra',     nm:'폴드 8 울트라',     cat:['fold'],          ds:'가장 강력한 폴더블 경험',      tags:['기기값 할인','보호필름 · 투명케이스 · 고속충전기 제공']},
    {id:'fold8',          nm:'폴드 8',            cat:['fold'],          ds:'더 넓은 세상, 더 많은 가능성', tags:['기기값 할인','보호필름 · 투명케이스 · 고속충전기 제공']},
    // 워치·태블릿·TV프리: 가격은 아래 pricing(가격표)에서 관리
    {id:'watchultra2', nm:'갤럭시 워치 울트라2', cat:['watch'], ds:'티타늄으로 완성한 아웃도어 워치', tags:['이통사 지원금','스마트기기']},
    {id:'watch9',      nm:'갤럭시 워치9',       cat:['watch'], ds:'매일 함께하는 건강 파트너',       tags:['이통사 지원금','스마트기기']},
    {id:'watchse3',    nm:'애플워치 SE3',       cat:['watch'], ds:'아이폰과 가장 잘 어울리는 워치',   tags:['이통사 지원금','스마트기기']},
    {id:'taba11plus',  nm:'갤럭시 탭 A11+',     cat:['tablet'],ds:'넉넉한 화면, 가벼운 태블릿',        tags:['상담 시 안내','스마트기기']},
    {id:'tvfree5',     nm:'U+ tv 프리5',        cat:['tvfree'],ds:'12.4인치 대화면, TV를 내 방 어디서나', tags:['유플러스 다이렉트 특별 혜택','약정 36개월']},
    {id:'ipada16',     nm:'아이패드 A16',        cat:['tvfree'],ds:'128GB · 가볍게 시작하는 아이패드',   tags:['유플러스 다이렉트 특별 혜택','약정 36개월']}
  ],
  quick:[
    {nm:'유닥 멤버십 가입', ic:'user',    c:'#FF3D8B', bg:'#FFF2F7', b:'#FADCE8', go:'soon'},
    {nm:'인기 모델',       ic:'star',    c:'#3B82F6', bg:'#F2F6FF', b:'#DCE6FB', go:'popular'},
    {nm:'기기값 0원',      ic:'phone',   c:'#8B5CF6', bg:'#F6F2FF', b:'#E6DCFB', go:'#/cat/tvfree'},
    {nm:'지원금 혜택',     ic:'gift',    c:'#22B573', bg:'#F0FBF5', b:'#D3F0E1', go:'subsidy'},
    {nm:'구매 가이드',     ic:'book',    c:'#FF8A1F', bg:'#FFF6EE', b:'#FBE4CF', go:'guide'},
    {nm:'QNA',             ic:'headset', c:'#FF2D78', bg:'#FFF2F7', b:'#FADCE8', go:'qna'},
    {nm:'다이렉트 특별 혜택',   ic:'won',     c:'#2563EB', bg:'#F2F6FF', b:'#DCE6FB', go:'special'},
    {nm:'매장 방문하기',   ic:'pin',     c:'#F43F5E', bg:'#FFF2F4', b:'#FADDE2', go:'store'}
  ],
  trust:[
    {b:'5분 상담',              s:'빠른 상담 가능',       ic:'headset'},
    {b:'당일 택배 발송',        s:'지금 주문하고 빠르게', ic:'truck'},
    {b:'제휴카드 의무가입 X',   s:'원하는 요금제로만',    ic:'cardx'},
    {b:'부가서비스 의무가입 X', s:'불필요한 가입 없이',   ic:'docx'}
  ],
  promo:{tag:'가장 인기있는 선택', t:'아이폰 18프로 / 프로맥스', s:'더 강력해진 성능, 지금 가장 핫한 아이폰.', img:'promo/promo-iphone18pro.webp', go:'#/cat/iphone/iphone18pro,iphone18promax'},
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
    pick:{t:'내게 맞는 휴대폰 찾기'},
    wear:{t:'오직! U+고객님께만 드리는, 유플러스 다이렉트 단독 혜택!', s:'U+ 인터넷TV를 이용하고 있으시다면?'}
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
var GO_OPTIONS = [['popular','인기 모델 (판매량순)'],['soon','준비중 팝업'],['subsidy','지원금 조건 안내 팝업'],['qna','자주 묻는 질문'],['special','다이렉트 특별 혜택(TV프리) 안내'],['#/cat/tvfree','TV프리 목록'],['sec:gifts','멤버십 사은품 구역으로'],['sec:wear','다이렉트 특별 혜택(TV프리) 구역으로'],['consult','상담 신청서 열기'],['contact','전화·카톡 문의'],['guide','구매 가이드'],['store','매장찾기'],['#/cat/all','전체 모델'],['#/cat/iphone','아이폰 모아보기'],['#/cat/galaxy','갤럭시 S 모아보기'],['#/cat/fold','폴더블 모아보기'],['#/cat/zero','기기값 0원 모아보기']];

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
// 20261021 사장님: 광고로 상세에 바로 들어오면 '컬러 → 1초 뒤 통신사'로 화면이 바뀌던 문제 —
//   실제 설정(가격 공개·가격표)을 받기 전엔 기본값(가격 비공개)으로 상세를 그려서 생김 → 받기 전엔 상세를 빈 틀로만 두고, 받으면 한 번에 그림
var CFG_WAIT = !EDIT;
function cfgDone(){ if(!CFG_WAIT) return; CFG_WAIT=false; refresh(); }   // 못 받았거나 너무 늦으면 기본값으로라도 그림

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
  o.deal=o.deal||clone(DEFAULT.deal); o.ship=o.ship||clone(DEFAULT.ship); o.lists=o.lists||{};
  o.applyAdd=!!o.applyAdd;   // 상담 신청 '요금제별 혜택(워치·태블릿·TV프리)' — 기본 숨김
  o.brand=o.brand||clone(DEFAULT.brand); o.biz=o.biz||clone(DEFAULT.biz); o.promo=o.promo||clone(DEFAULT.promo);
  o.pricing=normPricing(o.pricing);
  return o;
}
function vis(list){ return EDIT ? list : list.filter(function(x){return x && !x.hidden}); }
function models(){ return vis(S.models); }
function isWear(m){ return m.cat.indexOf('watch')>-1 || m.cat.indexOf('tablet')>-1 || m.cat.indexOf('tvfree')>-1; }
function isTv(m){ return m.cat.indexOf('tvfree')>-1; }
// TV프리·아이패드(TV 가입형): 통신사가 그냥 주는 게 아니라 U+ 인터넷TV 가입/이용 고객 조건 — 항상 조건을 함께 표시
var TV_FEE=9350, TV_FEE2=7700;   // TV프리 이용료: 첫 9개월 9,350원 → 10개월 차부터 7,700원
// TV프리 = U+ 기존 고객님(인터넷TV 1년 이상~2년 미만 이용 중)을 위한 유플러스 다이렉트만의 혜택 · 휴대폰 구매 없이도 가능
// 1GB/500MB는 가입할 인터넷 요금제가 아니라 '집에서 이미 쓰는 인터넷 속도' — 속도에 따라 지원금이 달라짐 (500MB 이상이어야 가능)
function tvTypeOf(){ return 'old'; }
var TV_WHO='유플러스 다이렉트 특별 혜택', TV_CHIPS=['U+ 인터넷TV 1년 이상 2년 미만 이용 중','500MB 이상 요금제'], TV_TGT='U+ 인터넷TV를 1년 이상 2년 미만, 500MB 이상 요금제로 이용 중인 고객님';
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
// 20261021 사장님: 휴대폰 요금제에서 105·115·130은 뺌 (85·95만) — 상세 요금제 고르기·가격 계산·신청서 모두 (관리자 가격표 편집(store-price.js)엔 그대로 남음)
var TIER_OFF={t105:1, t115:1, t130:1};
function tiersOf(g){ var ts=(S.pricing.tiers[g])||[]; return g==='phone'?ts.filter(function(t){ return !TIER_OFF[t.k]; }):ts; }
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
// 20261020 품절이면 신청 못 하게 (사장님 지시): 용량별 품절 여부 / 판매 중인 첫 용량 (없으면 -1)
function optSO(m,i){ var o=m?optsOf(m)[i||0]:null; return !!(o&&o.row&&o.row.so); }
function firstOkOpt(m){ var os=m?optsOf(m):[]; for(var i=0;i<os.length;i++){ if(!(os[i].row&&os[i].row.so)) return i; } return -1; }
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
// 20261021: 요금제가 85·95만 남아 '최대 혜택(월 115,000원 이상 요금제)' 기준이 없어짐 → 그런 요금제가 다시 생길 때만 버튼을 보여 주고 계산에도 씀
function maxOk(){ return tiersOf('phone').some(function(t){ return (t.fee||0)>=115000; }); }
function maxOn(){ return MAXV && maxOk(); }
function maxBar(){ if(!maxOk()) return ''; return '<button type="button" class="maxv'+(MAXV?' on':'')+'" data-maxv><span class="mv-sw"><i></i></span>최대 혜택 기준으로 보기</button>'+
  (MAXV?'<div class="maxv-note">최대 혜택 기준인 <b>월 115,000원 이상 요금제를 6개월 이상 유지</b>하는 조건일 때의 혜택이에요.</div>':''); }
function priceOf(m, oi){
  if(priceHidden(m)) return {kind:'hidden', v:null, out:null};   // 가격 비공개: 예전 가격 대신 '상담 시 안내'
  var rs=sheetRows(m);
  if(rs.length){
    var g=rs[0].g, pk=baseTier(g), type=curType(g), r=null, c=null, ct=null;
    // 카드·목록 가격: 휴대폰은 요금제 중 가장 싸게 살 수 있는 조건(최대 지원) 기준 — 조건은 카드에 함께 표시
    var best=function(x){ if(g!=='phone'||!maxOn()) return {c:rowCalc(x,type,pk),t:pk}; var b=null; tiersOf(g).forEach(function(t){ var cx=rowCalc(x,type,t); if(cx&&(!b||cx.v<b.c.v)) b={c:cx,t:t}; }); return b||{c:null,t:pk}; };
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
// 20261019: '사은품 증정' 표현은 전부 실제 드리는 것으로 (관리자에 예전 문구가 남아 있어도 화면엔 이렇게)
var GIFT_TXT='보호필름 · 투명케이스 · 고속충전기 제공';
function tagsOf(m){
  var t=arr(m&&m.tags).map(function(x){ return /사은품\s*증정/.test(String(x))?GIFT_TXT:x; }); if(!t.length) return t;
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
  if(SO(m)) return '일시품절';
  if(m.strip && !(/(^|[^0-9,])0원|공짜/.test(m.strip) && priceOf(m).v!==0)) return m.strip;
  var pp=priceOf(m);
  if(pp.kind==='sheet'){
    if(pp.g==='second') return pp.sub?('휴대폰과 함께 구매 시 '+won(pp.sub)+' 할인'):'휴대폰과 함께 구매 시 혜택';
    if(pp.g==='tvfree') return pp.v===0?(TV_WHO+' · 기기값 0원'):pp.sub?(TV_WHO+' · '+won(pp.sub)+' 할인'):'TV프리 상담 가능';
    var t1=tagsOf(m)[1], lead=(MNP?'번호이동':'기기변경')+' 시 ', tail=t1&&t1!==GIFT_TXT?' + '+t1:'';
    if(pp.v===0) return lead+'기기값 0원'+tail;
    var pct=pctOf(pp); if(pct>0) return lead+'기기값 '+pct+'% 할인'+tail;
  }
  if(pp.kind==='hidden' && isTv(m)) return TV_WHO;
  if(pp.kind==='hidden' && isWear(m)) return '휴대폰과 함께 구매 시 혜택';
  if(pp.kind==='sub') return pp.sub?((isTv(m)?TV_WHO:'이통사 지원금')+' '+won(pp.sub)+' 할인'):'스마트기기 상담 가능';
  if(isTv(m)) return TV_WHO+' · 상담 시 안내';
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
var PLAN_NOTE='';   // 20261020 '요금제는 6개월 후부터 47,000원 …' 안내는 뺌 (고객 입장에선 장벽 — 사장님 지시)
// 이 줄에서 쓰는 요금제 — 워치·탭처럼 구분 없는 줄은 첫 요금제 칸 하나만
function rowTiers(r){ return tiersOf(r.g); }
// TV프리: 집 인터넷 500MB·1GB 고객 모두 같은 조건(기기값 0원) — 고객이 고르지 않고 가장 좋은 조건으로 계산
function tvTier(r){ var ts=tiersOf('tvfree'), b=null; ts.forEach(function(t){ var c=r&&rowCalc(r,'all',t); var a=c?(c.pb!=null?c.pb:c.sel):null; if(a!=null&&(!b||a<b.a)) b={t:t,a:a}; }); return b?b.t:ts[0]; }
function curTier(m, g, r){ if(g==='tvfree'&&r) return tvTier(r); var ts=r?rowTiers(r):tiersOf(g); return ts.filter(function(t){return t.k===TIER[m.id]})[0]||(ts.indexOf(baseTier(g))>-1?baseTier(g):ts[0]); }
/* ---------- 상세 계산기: 컬러·용량 → 통신사 → 요금제 → 할인 방식 → 할부 → 예상 월 납부금액 ---------- */
var RATE={24:1.0626,30:1.0781,36:1.0935};   // 할부이자 포함 계수 (휴대폰·워치·태블릿 동일)
var SEL={};                                  // 모델별 고른 조건 {carrier, method, months}
var CARRIERS=['SKT','KT','알뜰폰','LG U+'];   // 20261021 사장님 순서: SKT / KT / 알뜰 / U+ (상세·신청서 모두 같은 순서)
// 20261019 메타 '번호이동 접수' 신호(MnpLead): 지금 통신사가 SKT·KT·알뜰폰(=번호이동)인 접수만 — 기기변경(LG U+)·TV프리만은 안 보냄. 기존 Lead 는 그대로
function mnpLead(b){ try{ var c=b&&b.carrier, sn=b&&b.snapshot, mnp=sn?(sn.jointype==='번호이동'):(!!c && c!=='LG U+'); if(mnp && window.udakMeta) window.udakMeta('MnpLead', {carrier:c, model:(b.device_interest||'')}); }catch(e){} }
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
  if(st.split&&st.t&&st.g!=='tvfree') a.push(tierTitle(st.t));
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
function eul(w){ var s=String(w||''), ch=s.charCodeAt(s.length-1); return (ch>=0xAC00&&ch<=0xD7A3&&(ch-0xAC00)%28)?'을':'를'; }
function ro(w){ var s=String(w||''), ch=s.charCodeAt(s.length-1); if(ch>=0xAC00&&ch<=0xD7A3){ var jj=(ch-0xAC00)%28; return (jj===0||jj===8)?'로':'으로'; } return '로'; }
var MD_NOW='';   // 상세에서 지금 할 단계 (color·cap·car, 다 고르면 'go') — 20261020 마지막 '상담' 단계 카드를 빼서 화면 대신 여기에 둠
function mdNowKey(){ return MD_NOW; }
// 고르고 나면 다음 단계로 따라감: 다음 단계가 하단 버튼에 가려 있으면 보이게 살짝 내림, 통신사까지 고르면 '내 가격'으로 (아래로만)
function mdFollow(prev){
  var key=MD_NOW; if(!key||key===prev) return;
  // 20261021: 통신사를 처음 고르면 언제나 '내 가격'을 화면 위로 (휴대폰은 통신사 → 내 가격 → 컬러 → 용량)
  var toPrice=(key==='go'||prev==='car');
  var nw=toPrice?$('#mdBody .mstep[data-step="price"]'):$('#mdBody .mstep[data-step="'+key+'"]'); if(!nw) return;
  var hd=$('#v-model .subhead'), top=(hd?hd.getBoundingClientRect().bottom:0)+8, bar=$('#mdBar'), bot=window.innerHeight-(bar?bar.offsetHeight:0)-8;
  var el=nw, r=el.getBoundingClientRect(), dy=0;
  if(toPrice) dy=r.top-top; else if(r.bottom>bot) dy=Math.min(r.bottom-bot, r.top-top);
  if(dy>4) window.scrollBy({top:dy, behavior:'smooth'});
}
function manwon(n){ return n%10000===0?(n/10000).toLocaleString('ko-KR')+'만원':won(n); }
var KKI='<svg class="kk" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.6c-5.2 0-9.4 3.3-9.4 7.4 0 2.6 1.7 4.9 4.3 6.2l-.9 3.3c-.1.3.3.6.6.4l3.9-2.6c.5.1 1 .1 1.5.1 5.2 0 9.4-3.3 9.4-7.4S17.2 3.6 12 3.6z"/></svg>';
var PHI='<svg class="cs-phi" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.61 21 3 13.39 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>';
function cgrid(label, key, items, cur, m, n, hint){
  // 20261020: 이름표가 비면(단계 제목과 같은 말이면) 이름표 칸 없이 버튼만 꽉 차게
  return '<div class="cpick'+(label?'':' nol')+'">'+(label?'<div class="cpick-l">'+label+'</div>':'')+'<div class="cgrid" style="--n:'+n+'">'+items.map(function(x){
    return '<button type="button" class="cg'+(String(x[0])===String(cur)?' on':'')+(x[2]?' dis':'')+'" data-calc="'+key+'" data-v="'+esc(x[0])+'" data-model="'+esc(m.id)+'"'+(x[2]?' disabled':'')+'>'+esc(x[1])+'</button>';
  }).join('')+'</div>'+(hint?'<div class="cpick-hint">'+hint+'</div>':'')+'</div>';
}
// 20261021 사장님: 폴드8 광고 'A 85 요금제 / B 95 요금제(한 단계 높이면) + 갤럭시 워치9 40mm 0원'
//   상세 '내 가격'의 요금제 고르기를 A/B 두 개로 — B를 고르면 신청서·CRM(ssgadmin)에 워치9 40mm가 함께 들어감
//   워치 0원 = 출고가 − 이통사 지원금(단가표에 등록된 값) − 나머지는 유플러스 다이렉트 지원금 / 워치 이용료는 워치 이용 가이드 기준(95 요금제 이상이면 0원)
var WPROMO={ fold8:{a:'t85', b:'t95', watch:'watch9', opt:'40mm', price:0} };
function wpFor(m){ var w=m&&WPROMO[m.id]; if(!w) return null; var x=byId(w.watch); if(!x || (!EDIT && SO(x)) || !wpRow(w)) return null;
  var ts=tiersOf('phone'); if(!ts.some(function(t){return t.k===w.a}) || !ts.some(function(t){return t.k===w.b})) return null; return w; }
function wpRow(w){ var x=byId(w.watch); return x?sheetRows(x).filter(function(r){ return r.cap===w.opt && num(r.out)!=null; })[0]||null:null; }
function wpName(w){ var x=byId(w.watch); return ((x&&x.nm)||'워치')+' '+w.opt; }
function wpShort(w){ var x=byId(w.watch); return ((x&&x.nm)||'워치').replace(/^갤럭시\s*/,''); }
function wpCalc(w){
  var r=wpRow(w); if(!r) return null; var t=tiersOf(r.g)[0], c0=rowCalc(r,'all',t), out=num(r.out);
  var after=w.price||0, pub=c0?Math.min(c0.pub||0,Math.max(0,out-after)):0, our=Math.max(0,out-pub-after);
  return {r:r, t:t, c:{out:out, pub:pub, our:our, pb:after, sel:after, v:after}, after:after, monthly:0, noint:false};
}
// 워치 이용료: 이용 가이드(셀룰러) 기준 — 요금제가 기준 이상이면 0원, 아니면 월 이용료
function wpLineFee(w, fee){ var g=GUIDE[w.watch]; return g&&g.fee&&(fee||0)<g.plan?g.fee:0; }
function tierNmOf(k){ var t=tiersOf('phone').filter(function(x){return x.k===k})[0]; return t?(t.nm||tierLabel(t)):k; }
// 이 요금제로 했을 때 매달 내는 돈 (휴대폰 할부금 + 요금제) — A/B 칸에 각각 보여 줌
function tierTotal(m, r, tk){
  var s=SEL[m.id]||{}, t=rowTiers(r).filter(function(x){return x.k===tk})[0]; if(!t) return null;
  var type=s.carrier?(s.carrier==='LG U+'?'chg':'mnp'):(MNP?'mnp':'chg'), c=rowCalc(r,type,t); if(!c) return null;
  var method=(s.method==='sel'||!c.pub)?'sel':'pub', after=(method==='pub'&&c.pb!=null)?c.pb:c.sel, mm=s.months==null?24:s.months;
  var monthly=mm===0?0:won10(after*RATE[mm]/mm), fee=t.fee?(method==='sel'?Math.round(t.fee*0.75):t.fee):0;
  return {total:monthly+fee, monthly:monthly, fee:fee, after:after, t:t, mm:mm};
}
function wpPickHtml(m, r, st, w){
  var on=(st.t&&st.t.k)===w.b, ta=tierTotal(m,r,w.a), tb=tierTotal(m,r,w.b), wr=wpRow(w), wout=wr?num(wr.out):null;
  // 20261021 사장님(3차): A/B 칸도 '월 기기값'을 앞에, 밑에 '+ 월 요금' (요금제까지 합친 14만원대 금액은 크게 안 보여 줌) · 일시납이면 매달은 요금만
  var amt=function(x,lf){ if(!x) return ''; if(x.mm===0) return '월 요금 '+won(x.fee+(lf||0));
    return '월 '+won(x.monthly)+'<small>+ 월 요금 '+won(x.fee)+(lf?' + 워치 이용료 '+won(lf):'')+'</small>'; };
  return '<div class="wp">'+
    '<button type="button" class="wp-c'+(on?'':' on')+'" data-calc="tier" data-v="'+esc(w.a)+'" data-model="'+esc(m.id)+'"><span class="wp-k">A</span><b>'+esc(tierNmOf(w.a))+' 요금제</b><small>'+esc(m.nm)+'</small><em>'+amt(ta)+'</em></button>'+
    '<button type="button" class="wp-c wp-b'+(on?' on':'')+'" data-calc="tier" data-v="'+esc(w.b)+'" data-model="'+esc(m.id)+'"><span class="wp-k">B</span><b>'+esc(tierNmOf(w.b))+' 요금제</b>'+
      '<small>+ '+esc(wpName(w))+(wout?' <s>'+won(wout)+'</s>':'')+' <i>'+wz(w.price||0)+'</i></small><em>'+amt(tb, tb?wpLineFee(w,tb.t.fee):0)+'</em>'+
      '<span class="wp-tag">한 단계 높이고 '+esc(wpShort(w)).replace(/ /g,'&nbsp;')+'&nbsp;혜택&nbsp;받기</span></button>'+   // 좁은 화면에선 '한 단계 높이고 / 워치9 혜택 받기'로만 끊김
  '</div>';
}
function calcPickers(m, r, st){
  var g=r.g, h='', car='', promo='';
  if(g==='phone') car=cgrid('','carrier',CARRIERS.map(function(c){return [c,c]}),st.s.carrier||'',m,4,
    '');   // 20261020 '사용 통신사' 이름표 뺌 — 단계 제목 '현재 이용 중인 통신사'와 같은 말
  var ts=g==='tvfree'?[]:rowTiers(r);
  if(g==='tvfree') h+=tvCondHtml();
  var wpw=g==='phone'?wpFor(m):null;
  if(wpw) promo=wpPickHtml(m, r, st, wpw);
  else if(ts.length>1) h+='<div class="cpick"><div class="cpick-l">'+(g==='tvfree'?'집 인터넷':'요금제')+'</div><select class="csel" data-calc-sel="tier" data-model="'+esc(m.id)+'">'+ts.map(function(t){
      return '<option value="'+esc(t.k)+'"'+(st.t&&st.t.k===t.k?' selected':'')+'>'+esc(tierTitle(t))+'</option>'; }).join('')+'</select>'+(g==='phone'&&PLAN_NOTE?'<div class="cpick-hint">'+PLAN_NOTE+'</div>':'')+'</div>';
  if(g==='phone'&&st.c) h+=cgrid('할인 방식','method',[['pub','공시지원금',!st.c.pub],['sel','선택약정 (요금 25%↓)']],st.method,m,2,
    !st.c.pub?'공시지원금이 없어 선택약정으로 계산돼요':adviceTxt(cmpMethod(st.c,st.fee,st.months),st.method));
  if(g!=='tvfree') h+=cgrid('할부 개월','months',[['0','일시납'],['24','24개월'],['30','30개월'],['36','36개월']],String(st.months),m,4,'');
  return {car:car, rest:h, promo:promo};   // 20261019: 통신사 / 나머지 따로 · 20261021 A/B 요금제(워치 혜택)
}
var MSTIP={};   // 상세 계산 박스 ? 설명 열림
/* 20261019 상세 가격 (휴대폰): '싸 보이게' — 기기값(월 기기 할부금)을 맨 앞에, 받는 혜택(총 기기 지원금)을 크게.
   통신 요금까지 합친 금액은 맨 아래 '월 예상 납부금액'에 (처음엔 접어 둠). TV프리·워치·태블릿은 기존 배치 그대로 */
var PVOFF=true;    // 맨 아래 '월 예상 납부금액' 접힘 여부 — 처음엔 접어 둠 (20261019 요청)
var PVI={
  phone:'<svg viewBox="0 0 24 40"><rect x="2" y="2" width="20" height="36" rx="4.5"/><path d="M9.5 6h5"/></svg>',
  gift:'<svg viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13M3 12h18M12 8c-1.5-3-5.5-3.5-5.5-1S9 8 12 8c3 0 7-.5 5.5-2.5S13.5 5 12 8z"/></svg>',
  coin:'<svg viewBox="0 0 24 24"><ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/></svg>',
  doc:'<svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>',
  bars:'<svg viewBox="0 0 24 24"><path d="M4 20h16M7 17v-6M11 17V6M15 17V9M19 17v-4"/></svg>',
  cal:'<svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M4 10h16M9 3v4M15 3v4M9 14h.01M12 14h.01M15 14h.01"/></svg>',
  down:'<svg viewBox="0 0 24 24"><path d="M12 5v14M6 13l6 6 6-6"/></svg>',
  ck:'<svg viewBox="0 0 24 24"><path d="m6.5 12.5 3.6 3.6 7.4-8"/></svg>',
  chev:'<svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>'
};
function pvTip(k,t){ return '<button type="button" class="tipb'+(MSTIP[k]?' on':'')+'" data-ms-tip="'+k+'" aria-label="설명 보기">?</button>'+(MSTIP[k]?'<div class="tip-bub">'+t+'</div>':''); }
function pvRow(l,v,cls){ return '<div class="pv-r'+(cls?' '+cls:'')+'"><span>'+l+'</span><b>'+v+'</b></div>'; }
function pvCk(t){ return '<li><i>'+PVI.ck+'</i><span>'+t+'</span></li>'; }
function pvPhone(m, r, st){
  var c=st.c, tn=typeNm(st), mm=st.months, sel=st.method==='sel', out=num(c.out)||0;
  var monthly=mm===0?0:(st.monthly||0), fee=st.feeAfter||0, total=monthly+fee;
  var wpw=wpFor(m), wpOn=!!(wpw&&st.t&&st.t.k===wpw.b), wpc=wpOn?wpCalc(wpw):null, wlf=wpOn?wpLineFee(wpw,st.t.fee):0;   // 20261021 B(95 요금제 + 워치)
  if(wlf) total+=wlf;   // 워치 이용료는 요금제와 따로 더함 (95 요금제 이상이면 0원이라 보통 안 더해짐)
  var sup=Math.max(0,out-st.after), pct=out?Math.floor(sup/out*100):0, selCut=(sel&&st.fee)?st.fee-st.feeAfter:0;
  // ① 월 기기 할부금 — 기기값만 (할부이자 포함)
  var lab, big, sub, sub2='';
  // 20261021 사장님: 큰 숫자는 '요금제까지 합친 월 금액' — 매달 내는 돈 = 휴대폰 할부금 + 요금제 (선택약정이면 할인된 요금)
  //   바로 밑에 어떻게 합쳐졌는지 한 줄 (광고에 쓴 할부금 숫자도 여기서 보임) · 그 밑에 용량 기준·할부 개월
  var capTxt=(optsOf(m).length>1&&r.cap)?r.cap+' 기준':'';
  // 20261021 사장님(3차): 큰 숫자는 다시 '월 기기값'(할부금) — 요금제까지 합친 14만원대 금액이 크게 나오면 진입장벽
  //   바로 밑에 '+ 월 요금 85,000원 = 합산 132,730원' 한 줄 · 그 밑에 용량 기준·할부 개월 / 일시납이면 기기값 + 월 요금
  var feeTxt='<span class="nw">+ 월 요금 '+won(fee)+(sel?' (25% 할인)':'')+'</span>'+(wlf?' <span class="nw">+ 워치 이용료 '+won(wlf)+'</span>':'');
  if(mm===0){ lab='기기값 (일시납)'; big=wz(st.after); sub=fee?feeTxt:''; sub2=capTxt; }
  else { lab='월 기기값 (할부이자 포함)'; big=wz(monthly)+'<small> / 월</small>'; sub=fee?feeTxt+' <span class="nw">= 합산 <b>'+won(total)+'</b></span>':'';
    sub2=[capTxt, mm+'개월 할부'].filter(Boolean).join(' · '); }
  var hc=[]; if(selCut) hc.push('통신 요금도 매달 '+won(selCut)+' 할인 (선택약정)');
  hc.push('제휴카드·부가서비스 의무가입 없음');
  var h='<div class="ms-detail pv">'+
    '<div class="pv-card pv-hero"><div class="pv-hl"><div class="pv-ch">'+lab+'</div>'+
      '<div class="pv-v">'+big+'</div>'+(sub?'<div class="pv-s pv-s1">'+sub+'</div>':'')+(sub2?'<div class="pv-s">'+sub2+'</div>':'')+'</div>'+
      (pct>0?'<div class="pv-hr"><i class="pv-ph">'+PVI.phone+'</i><div class="pv-bub"><span>출고가 대비</span><b>'+(st.after===0?'전액 지원':pct+'% 할인')+'</b></div></div>':'')+
      '<ul class="pv-ck">'+hc.map(pvCk).join('')+'</ul></div>';
  // ② 총 기기 지원금 · ③ 지원 후 기기값 — 20261020 깔끔하게: 상자 2개(계산표) → 두 줄
  //    '총 기기 지원금 (공시 50만 + 추가 70만) … 120만원' / '지원 후 기기값 (출고가 …) … 1,078,100원'
  var parts=[]; if(!sel&&c.pub) parts.push(['공시',c.pub]); if(c.our) parts.push(['추가',c.our]);
  var rnd=parts.every(function(x){ return x[1]%10000===0; });
  var how=parts.length>1?parts.map(function(x){ return x[0]+' '+(rnd?(x[1]/10000).toLocaleString('ko-KR')+'만':won(x[1])); }).join(' + ')
    :parts.length?(parts[0][0]==='공시'?'공시지원금':'유플러스 다이렉트 추가 지원'):'';
  h+='<div class="pv-card pv-sum">'+
    (sup>0?'<div class="pv-sr"><span>총 기기 지원금'+(how?'<small>'+how+'</small>':'')+'</span><b class="pink">'+manwon(sup)+'</b></div>':'')+
    '<div class="pv-sr"><span>지원 후 기기값<small>출고가 '+won(out)+'</small></span><b>'+wz(st.after)+'</b></div>'+
    // 20261021 사장님: 워치는 계산식 없이 '529,100원 → 0원'만 + 안내는 '*셀룰러 제품입니다. 24개월 약정 제품입니다.' 두 마디만 (줄이 넘치면 문장 사이에서만 끊김)
    (wpc?'<div class="pv-sr pv-wp"><span>'+esc(wpName(wpw))+'<small>*셀룰러&nbsp;제품입니다. 24개월&nbsp;약정&nbsp;제품입니다.</small></span><b><s>'+won(wpc.c.out)+'</s> '+wz(wpc.after)+'</b></div>':'')+'</div>';
  // ④ 혜택 조건 — 20261020 깔끔하게: 제목·번호 목록 → 한 줄 '조건 85,000원 이상 요금제 6개월 · 약정 2년' (조건은 남겨야 개통할 때 말이 안 나옴)
  //    ('이후에는 47,000원 …'·'LG U+ 통신사 변경 조건 (번호이동)'은 20261020 사장님 지시로 이미 뺌)
  var mu=[]; if(st.t&&st.t.fee) mu.push(won(st.t.fee)+' 이상 요금제 6개월');
  mu.push('약정 2년');
  h+='<div class="pv-must1"><b>조건</b><span>'+mu.join(' · ')+'</span></div>';
  // ⑤ 월 예상 납부금액(통신 요금 포함) 카드는 뺌 — 20261020 사장님 지시 (통신 요금 합친 금액은 고객 입장에선 진입장벽)
  return h+'</div>';
}
function calcBox(m, r, st){
  var out=num(r.out);
  if(!st.c) return crow('출고가','',out!=null?won(out):'상담 시 안내');
  if(st.g==='phone') return pvPhone(m, r, st);   // 20261019: 휴대폰은 '기기값 앞 · 혜택 크게' 배치
  var tv=st.g==='tvfree', c=st.c, tn=typeNm(st), mm=tv?0:st.months, monthly=mm===0?0:(st.monthly||0), fee=tv?TV_FEE:(st.feeAfter||0), total=monthly+fee;
  var tipB=function(k,t){ return '<button type="button" class="tipb'+(MSTIP[k]?' on':'')+'" data-ms-tip="'+k+'" aria-label="설명 보기">?</button>'+(MSTIP[k]?'<div class="tip-bub">'+t+'</div>':''); };
  var line=function(l,v,cls){ return '<div class="ms-r'+(cls?' '+cls:'')+'"><span>'+l+'</span><b>'+v+'</b></div>'; };
  // 기간별 (85·95 요금제만): 7개월 차부터 월 47,000원 요금제로 바꾸면
  var low=null, F=['처음 6개월','7개월 차부터',esc(st.t?(st.t.title||tierLabel(st.t)):'')+' 기준','월 '+won(LOW_FEE)+' 요금제로 변경 시'];
  if(st.g==='phone'&&st.fee&&st.fee<=95000&&st.fee>LOW_FEE) low=monthly+(st.method==='sel'?Math.round(LOW_FEE*0.75):LOW_FEE);
  if(tv){ low=monthly+TV_FEE2; F=['처음 9개월','10개월 차부터','TV프리 이용료 월 '+won(TV_FEE),'월 '+won(TV_FEE2)+' 요금제로 변경 시']; }
  var h='<div class="ap-sumsec ms-detail"><div class="ms-top'+(low!=null?'':' solo')+'"><div class="ms-main"><span class="ms-l">월 예상 납부금액</span>'+
    '<b class="ms-v">'+(total?won(total)+'<small> / 월</small>':(st.after===0?'0원':won(st.after)+'<small> 일시납</small>'))+'</b>'+
    '<span class="ms-h">'+(tv?'TV프리 이용료 · 약정 36개월':mm===0?(fee?'통신 요금 기준 · 기기값은 일시납':'기기값 일시납'):(fee?'기기 할부금 + 통신 요금 ('+mm+'개월 기준)':mm+'개월 할부 · '+(st.noint?'이자 없음':'할부이자 포함')))+'</span>'+
    (!tv&&mm===0&&st.after>0&&fee?'<span class="ms-h">+ 일시납 '+won(st.after)+'</span>':'')+'</div>';
  if(low!=null) h+='<div class="ms-flow">'+
    '<div class="ms-f"><i class="ic"><svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M4 10h16M9 3v4M15 3v4M9 14h.01M12 14h.01M15 14h.01"/></svg></i><div><span>'+F[0]+'</span><b>'+won(total)+'<small> / 월</small></b><em>'+F[2]+'</em></div></div>'+
    '<div class="ms-f"><i class="ic"><svg viewBox="0 0 24 24"><path d="M12 5v14M6 13l6 6 6-6"/></svg></i><div><span>'+F[1]+'</span><b>'+won(low)+'<small> / 월</small></b><em>'+F[3]+'</em></div></div></div>';
  h+='</div>';
  var mon='';
  if(tv){ if(st.after>0) mon+=line('기기값 (별도)',won(st.after)); }
  else if(mm===0) mon+=line('기기값 일시납',wz(st.after)); else mon+=line('기기 할부금 ('+mm+'개월)',st.after===0?'0원':won(monthly));
  if(tv) mon+=line('TV프리 이용료 <small>첫 9개월</small>',won(TV_FEE));
  else if(st.fee) mon+=line('월 통신 요금'+(st.method==='sel'?' <small>25% 할인</small>':''),won(fee));
  mon+=line('월 합계',won(total),'sum');
  var ben=line('출고가',won(c.out));
  if(tv){ if(c.out>st.after) ben+=line('유플러스 다이렉트 지원금','-'+won(c.out-st.after),'minus'); }
  else if(st.method==='pub'&&c.pub) ben+=line((st.g==='phone'?'공시지원금':st.g==='tvfree'?'기존 고객 지원금':'이통사 지원금')+(tn?' ('+tn+')':''),'-'+won(c.pub),'minus');
  if(c.our&&!tv) ben+=line('추가 지원금 (유플러스 다이렉트)','-'+won(c.our),'minus');
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
  var best=null, g=rs[0].g, bt=baseTier(g);
  // 20261016: 이번주 특가는 카드와 같은 기준 요금제(85) 가격 — 예전엔 요금제 중 가장 싼 값(115 기준)이 잡혔음.
  //           카드처럼 '최대 혜택 기준으로 보기'를 켰을 때만 요금제 중 가장 싼 값
  rs.forEach(function(r){ (g==='phone'&&bt&&!maxOn()?[bt]:tiersOf(g)).forEach(function(t){ var c=rowCalc(r,type,t); if(c && c.v!=null && (best==null || c.v<best)) best=c.v; }); });
  return best;
}
function dealItems(){
  var D=S.deal||{};
  return String(D.items||'').split('\n').map(function(l){ var r=l.split('|').map(function(x){return x.trim()}); var m=r[0]&&(byId(r[0])||models().filter(function(x){return x.nm.replace(/\s/g,'')===r[0].replace(/\s/g,'')})[0]); return m?{m:m,mnp:dealPrice(m,'mnp'),chg:dealPrice(m,'chg')}:null; }).filter(Boolean);
}
/* 당일 출발 띠: 월~금 마감 전이면 '오늘 출발' + 남은 시간, 이후엔 다음 발송일 (토·일 택배 쉼) */
var shipTimer=null;
function kstNow(){ var d=new Date(Date.now()+9*3600e3); return {dow:d.getUTCDay(), h:d.getUTCHours(), m:d.getUTCMinutes(), s:d.getUTCSeconds()}; }
function shipState(){
  var sh=S.ship||{}, c=String(sh.cut||'15:00').split(':'), ch=+c[0]||15, cm=+c[1]||0, n=kstNow();
  var sec=n.h*3600+n.m*60+n.s, cut=ch*3600+cm*60, wk=n.dow>=1&&n.dow<=5;
  if(wk && sec<cut) return {today:true, left:cut-sec, cutTxt:ch+(cm?':'+('0'+cm).slice(-2):'')+'시'};
  var nd=(n.dow+1)%7, add=1; while(nd===0||nd===6){ nd=(nd+1)%7; add++; }
  var DN=['일','월','화','수','목','금','토'];
  return {today:false, when:add===1?'내일':DN[nd]+'요일', cutTxt:ch+'시'};
}
function hms(t){ var h=Math.floor(t/3600), m=Math.floor(t%3600/60), x=t%60; return ('0'+h).slice(-2)+':'+('0'+m).slice(-2)+':'+('0'+x).slice(-2); }
// TV프리 대상 카드 (레퍼런스: '이런 고객님께 추천드려요' + 항목별 둥근 칸)
function tvCondHtml(){
  var ck='<svg viewBox="0 0 24 24"><path d="m5.5 12.5 4.3 4.3L18.5 8"/></svg>', sp='<svg class="tc-sp" viewBox="0 0 24 24"><path d="M3 15.5l4 1.6M7.2 7.5l2.6 3.2M13.4 4v4"/></svg>';
  return '<div class="tc"><div class="tc-h">'+sp+'이런 고객님께 <em>추천드려요</em></div>'+
    '<div class="tc-it"><i>'+ck+'</i><span><b>U+ 인터넷TV</b> 1년 이상 ~ 2년 미만 이용 중인 고객님</span></div>'+
    '<div class="tc-it"><i>'+ck+'</i><span>인터넷 <b>500MB 이상</b> 요금제를 이용 중인 고객님</span></div></div>';
}
function cutLabel(){ var c=String((S.ship||{}).cut||'15:00').split(':'), h=+c[0]||15, m=+c[1]||0; return (h<12?'오전 ':'오후 ')+(h%12||12)+'시'+(m?' '+m+'분':''); }
function cdBoxes(t){ var h=Math.floor(t/3600), m=Math.floor(t%3600/60), x=t%60, p=function(n){return ('0'+n).slice(-2)};
  return '<span class="shp-u"><b>'+p(h)+'</b><small>시</small></span><i>:</i><span class="shp-u"><b>'+p(m)+'</b><small>분</small></span><i>:</i><span class="shp-u"><b>'+p(x)+'</b><small>초</small></span>'; }
function renderShip(){
  var el=$('#shipBar'); if(!el) return;
  var sh=S.ship||{}; clearInterval(shipTimer);
  if(!sh.on && !EDIT){ el.hidden=true; return; } el.hidden=false;
  // 20261020 깔끔하게: 큰 카드(트럭 그림·마감 시/분/초·신청 순서·구매 가이드) → 한 줄
  //   '오후 3시까지 구매확정 시 오늘 발송 [2시간 14분 남음]' · 마감 뒤엔 '지금 구매확정 시 내일 발송' (누르면 구매 가이드는 그대로 열림)
  var st=shipState(), clock='<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.2 1.8"/></svg>';
  var left=function(t){ var h=Math.floor(t/3600), mi=Math.floor(t%3600/60); return t<60?'곧 마감':(h?h+'시간 ':'')+(mi||!h?mi+'분 ':'')+'남음'; };
  var txt=st.today?'<b>'+cutLabel()+'</b>까지 구매확정 시 <em>오늘 발송</em>':'지금 구매확정 시 <em>'+st.when+' 발송</em>';
  el.innerHTML='<div class="shp1" data-go="guide">'+clock+'<span class="shp1-t">'+txt+'</span>'+(st.today?'<span class="shp1-cd" id="shipCd">'+left(st.left)+'</span>':'')+'</div>';
  if(st.today) shipTimer=setInterval(function(){ var s2=shipState(), c2=$('#shipCd'); if(!s2.today||!c2){ renderShip(); return; } c2.textContent=left(s2.left); },15000);
}
function renderDeal(){
  var D=S.deal, sub=$('#dealSubs'), hero=document.querySelector('.hero');
  if(sub) sub.innerHTML='';
  var it=(D&&D.on)?dealItems():[];
  if(hero) hero.classList.toggle('hero-deal',!!it.length);
  if(!it.length) return false;
  clearInterval(heroTimer);
  $('#heroTrack').style.transform='';
  var tt=esc(String(D.title||'이번주 특가').replace(/^이번 주 /,'이번주 ')).split(' '), tl=tt.pop();
  $('#heroTrack').innerHTML='<div class="deal-box" data-edit="deal"><div class="dl-head"><h3 class="dl-ttl"><span>'+(tt.length?tt.join(' ')+' ':'')+'<em>'+tl+'</em></span></h3><i class="dl-sep"></i><span class="dl-date">'+weekRange()+'</span></div>'+
    '<div class="dl-grid">'+it.map(function(x){
      return '<a class="dl-c" href="#/model/'+esc(x.m.id)+'" data-edit="deal" data-mid="'+esc(x.m.id)+'"><div class="dl-c-h"><span class="dl-c-img">'+im(mImg(x.m),'','',x.m.nm)+'</span><b>'+esc(x.m.nm)+'</b></div>'+
        (x.mnp!=null?'<div class="dl-c-m"><small>번호이동</small><em>'+wz(x.mnp)+'</em></div>':'<div class="dl-c-m"><small>구매가</small><em class="ask">상담 시 안내</em></div>')+
        (x.chg!=null?'<div class="dl-c-c">기기변경 '+wz(x.chg)+'</div>':'')+'</a>';
    }).join('')+'</div></div>';   // 20261019: 카드 아래 '구매 가능 금액 · 월 115,000원 이상 요금제 6개월 유지 기준' 문구 뺌 (기준이 맞지 않음)
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
  $('#brand').innerHTML='<small>'+esc(b.small)+'</small><b>'+esc(b.big)+'</b>'+(tr?'<span class="brand-trust" data-cert role="button"><svg viewBox="0 0 24 24"><path d="M12 3 5 6v6c0 4.5 3 7.7 7 9 4-1.3 7-4.5 7-9V6l-7-3z"/><path d="m9 12 2 2 4-4"/></svg>'+esc(tr).replace(/^U\+\s*/,'<b class="bt-u">U<sup>+</sup></b><i class="bt-dot">·</i>')+'<svg class="bt-go" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg></span>':'');
  if(renderDeal()) return;
  var list=vis(S.hero);
  $('#heroTrack').innerHTML = list.map(function(h,i){
    var k=esc(h.k||'').replace(/^U\+/, '<em>U<sup style="font-size:.6em">+</sup></em>');
    var real=S.hero.indexOf(h);
    return '<a class="slide'+(h.full?' full':'')+hidCls(h)+'" data-go="'+esc(h.go||'')+'" data-edit="hero:'+real+'">'+
      '<div class="slide-txt"><div class="k">'+k+'</div>'+(h.t?'<div class="t">'+esc(h.t)+'</div>':'')+(h.s?'<div class="s">'+esc(h.s)+'</div>':'')+heroSup(h.sup)+'</div>'+
      im(h.img,'slide-img',true,h.img?String((h.k||'')+' '+(h.t||'')).trim():'')+'</a>';
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
  $('#quick').classList.toggle('q-fit', vis(S.quick).length<=5);   // 20261020: 5개 이하면 한 줄에 꽉 차게 (옆으로 밀지 않음)
  $('#quick').innerHTML=vis(S.quick).map(function(q){
    var i=S.quick.indexOf(q);
    return '<a class="'+hidCls(q).trim()+'" data-go="'+esc(q.go||'')+'" data-edit="quick:'+i+'" style="--qc:'+esc(q.c)+';--qbg:'+esc(q.bg)+';--qb:'+esc(q.b)+'"><span class="qi"><svg viewBox="0 0 24 24">'+(QI[q.ic]||QI.star)+'</svg></span><span>'+esc(q.nm)+'</span></a>';
  }).join('');
}
function renderTrust(){
  $('#trust').hidden=!vis(S.trust).length;   // 20261020: 항목을 다 숨기면 회색 띠도 안 보이게
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
    '<svg class="ico" viewBox="0 0 24 24" style="width:14px;height:14px"><path d="m9 6 6 6-6 6"/></svg></span></div>'+im(p.img,'pimg','',p.img?String((p.tag||'')+' '+(p.t||'')).trim():'');
}
function secHead(k, more){
  var s=S.sec[k]||{};
  return '<div class="sec-h" data-edit="sec:'+k+'"><div>'+(s.s?'<div style="font-size:12.5px;color:var(--sub)">'+esc(s.s)+'</div>':'')+'<h2'+(String(s.t||'').length>15?' class="long"':'')+'>'+esc(s.t)+(EDIT&&s.off?' <small style="color:#DC2626;font-size:12px">(숨김)</small>':'')+'</h2></div>'+
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
    return '<a class="pc'+(SO(m)?' soldout':'')+hidCls(m)+'" href="#/model/'+esc(m.id)+'" data-edit="sec:pop" data-mid="'+esc(m.id)+'"><div class="thumb" style="position:relative">'+im(mImg(m),'','',m.nm)+(SO(m)?'<span class="so-tag" style="font-size:11px">품절</span>':'')+'</div><div class="info">'+
      '<div class="nm">'+esc(m.nm)+CHEV+'</div><div class="ds">'+esc(m.ds)+'</div>'+
      '<div class="pills">'+tagsOf(m).map(function(t){return '<span class="pill">'+esc(t)+'</span>'}).join('')+'</div></div></a>';
  }).join('');
}
function hcard(m,opt){
  opt=opt||{};
  var badge=opt.badge||badgeOf(m);
  return '<a class="hc'+(SO(m)?' soldout':'')+hidCls(m)+'" href="#/model/'+esc(m.id)+'" data-edit="'+esc(opt.edit||('model:'+m.id))+'" data-mid="'+esc(m.id)+'"><div class="im">'+(badge?'<span class="badge'+(opt.dark||SO(m)?' dark':'')+'">'+esc(badge)+'</span>':'')+
    im(mImg(m),'','',m.nm)+'</div><div class="strip">'+esc(isTv(m)?TV_WHO:stripOf(m).replace(/ \+ .*$/,'').replace(/^(번호이동|기기변경) 시 /,'$1 '))+'</div>'+
    '<div class="bd"><div class="t">'+esc(m.nm)+'</div>'+priceLine(m)+'<div class="mt">'+(isTv(m)?'약정 36개월 · 당일발송':'카드·부가서비스 X · 당일발송')+'</div></div></a>';
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
  {ic:'tv', hl:1, b:'오직 U+ 고객님께만, 유플러스 다이렉트 특별 혜택', p:'U+ 인터넷·TV를 1년 이상 2년 미만 이용 중이면서, 인터넷 500MB 이상 요금제를 이용 중인 고객님이라면 기기값 0원 혜택을 받으실 수 있어요.', tag:'U+ 인터넷·TV 이용 고객님 대상'},
  {ic:'tv', b:'태블릿으로 U+tv를 이용할 수 있어요', p:'U+tv를 시청할 수 있는 TV 가입형 태블릿 상품이에요.'},
  {ic:'won', hl:1, b:'첫 9개월 월 9,350원', p:'첫 9개월은 월 9,350원으로 이용하고,\n10개월 차부터는 월 7,700원 요금제로 변경해 이용하실 수 있어요.', tag:'10개월 차부터 월 7,700원'},
  {ic:'cal', b:'36개월 약정 상품이에요', p:'36개월 약정, TV 가입형 상품입니다.'}]}; }
var GUIDE={
  watchultra2:cellGuide('워치',11000,95000,'플러스플랜 95'), watch9:cellGuide('워치',11000,95000,'플러스플랜 95'), watchse3:cellGuide('워치',11000,95000,'플러스플랜 95'),
  taba11plus:cellGuide('태블릿',22000,105000,'플러스플랜 105'),
  tvfree5:tvGuide('TV프리'), ipada16:tvGuide('아이패드')
};
function guideHtml(m){
  var g=GUIDE[m.id]; if(!g) return '';
  return '<div class="guide"><div class="guide-h"><b>'+esc(g.t)+'</b><span>알아두면 더 알뜰하게 쓸 수 있어요</span></div>'+g.items.map(function(x){
    return '<div class="guide-it'+(x.hl?' hl':'')+'"><i><svg viewBox="0 0 24 24">'+GI[x.ic]+'</svg></i><div><b>'+esc(x.b)+'</b><p>'+esc(x.p).replace(/\n/g,'<br>')+'</p>'+(x.tag?'<span class="guide-tag">'+esc(x.tag)+'</span>':'')+'</div></div>';
  }).join('')+'</div>';
}
function renderWear(){
  var list=wears();
  $('#wearSec').hidden=!secOn('wear') || !list.length;
  var wk=['watch','tablet','tvfree'].filter(function(k){ return list.some(function(m){return m.cat.indexOf(k)>-1}); });
  $('#wearHead').innerHTML=secHead('wear','#/cat/'+(wk[0]||'watch'));
  $('#wear').innerHTML=list.map(function(m){return hcard(m)}).join('');
}
function renderGifts(){
  $('#giftSec').hidden=!secOn('gifts');
  $('#giftHead').innerHTML=secHead('gifts');
  $('#gifts').innerHTML=vis(S.gifts).map(function(g){
    var i=S.gifts.indexOf(g);
    return '<a class="dc'+hidCls(g)+'" data-go="'+esc(g.go||'soon')+'" data-edit="gift:'+i+'">'+im(g.img,'','',g.nm)+'<div class="ov"><div class="sm">'+esc(g.sm)+'</div><div class="tt">'+esc(g.nm)+'</div><div class="pr">'+esc(g.pr||'')+'</div></div></a>';
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
    '<div class="bp-m">'+(p.g==='tvfree'?'약정 36개월 · TV프리 이용료 월 '+won(TV_FEE)+'부터':p.v===0?'기기값 0원 · 할부금 없음':'월 <b>'+won(mon)+(p.from?'~':'')+'</b> <small>24개월 할부 · '+(noint?'이자 없음':'할부이자 포함')+'</small>')+'</div>'+
    (p.g==='tvfree'?'<div class="bp-c">U+ 인터넷TV 1년 이상 2년 미만 · 500MB 이상 요금제 이용 고객님 대상</div>':'')+
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
    '<div class="chips">'+(isTv(m)?TV_CHIPS.map(function(t){return '<span class="chip">'+t+'</span>'}).join(''):'<span class="chip">제휴카드 X</span><span class="chip">부가서비스 X</span>')+'<span class="chip gray">5분 상담</span></div>'+
    '<div class="stamp">'+(SO(m)?'현재 일시품절':'구매 시 보호필름 · 투명케이스 · 고속충전기 제공')+'</div></a>';
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
  document.querySelectorAll('[data-maxwrap]').forEach(function(w){ w.innerHTML=maxBar(); w.hidden=!maxOk(); });
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
  renderHero(); renderShip(); renderModels(); renderQuick(); renderTrust(); renderPromo(); renderPop(); renderRecent();
  renderZero(); renderWear(); renderGifts(); renderRank(); renderPick(); renderFoot(); syncMnp();
}

/* 카테고리 */
function renderCat(k, only){
  var tab=CAT_TABS.filter(function(t){return t.k===k})[0]||CAT_TABS[0];
  // #/cat/탭/모델1,모델2 — 특정 모델만 모아 보기 (예: 배너 '아이폰 18프로 / 프로맥스')
  var ids=only?decodeURIComponent(only).split(',').filter(Boolean):null, picked=ids?ids.map(byId).filter(function(m){return m&&(EDIT||!m.hidden)}):null;
  $('#catTitle').textContent=picked&&picked.length?picked.map(function(m){return m.nm}).join(' · '):tab.nm;
  $('#v-cat').classList.toggle('cat-tv',tab.k==='tvfree');   // TV프리: 번호이동/기기변경·최대 혜택 토글 없음
  // 고객 화면: 보이는 모델이 하나도 없는 탭(예: 워치·태블릿 노출 멈춤)은 숨김
  var tabs=CAT_TABS.filter(function(t){ return EDIT||t.k==='all'||t.k==='zero'||t.k===tab.k||models().some(function(m){return m.cat.indexOf(t.k)>-1}); });
  $('#catTabs').innerHTML=tabs.map(function(t){return '<button class="'+(t.k===tab.k?'on':'')+'" data-cat="'+t.k+'">'+t.nm+'</button>'}).join('');
  var list=picked&&picked.length ? picked : tab.k==='zero'&&S.lists&&S.lists.zero&&S.lists.zero.length ? pickList('zero')   // 관리자가 고른 '기기값 0원' 목록과 똑같이
    : models().filter(function(m){return tab.k==='all'||m.cat.indexOf(tab.k)>-1||(tab.k==='zero'&&!isWear(m)&&isZero(m))});
  $('#catCircles').innerHTML=smallCircles(list);
  $('#catList').innerHTML=sortedCards(list) || '<div class="empty">해당 모델이 없습니다</div>';
  syncMnp();
  var on=$('#catTabs .on'); if(on&&on.scrollIntoView) on.scrollIntoView({inline:'center',block:'nearest'});
}
/* 검색 — 20261019: 휴대폰 / 매장 둘 중 하나 */
var SMODE='phone';
function syncSMode(){ $$('#sModes [data-smode]').forEach(function(b){ b.classList.toggle('on', b.getAttribute('data-smode')===SMODE); }); var qi=$('#q'); if(qi) qi.placeholder=SMODE==='store'?'동네·매장 이름 (예: 인창동, 사가정)':'모델명을 입력하세요 (예: 폴드, 아이폰)'; }
function renderSearch(q){
  syncSMode(); if(SMODE==='store'){ renderStoreSearch(q); return; }
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
  if(!keepRecent){ var r=store.get('recent',[]).filter(function(x){return x!==id}); r.unshift(id); store.set('recent',r.slice(0,10)); }
  // 20261021: 설정 받기 전엔 빈 틀만 (사진 자리 · 이름 · 회색 줄) — 받으면 refresh()가 통신사 → 내 가격 순서로 한 번에 그림
  if(CFG_WAIT){ var m0=byId(id); $('#mdTitle').textContent=m0?m0.nm:'';
    $('#mdBody').innerHTML='<div class="ucard md-skel"><div class="md-img"></div><h2 class="md-h ucard-name">'+esc(m0?m0.nm:'')+'</h2><div class="sk-l"></div><div class="sk-b"></div><div class="sk-b"></div></div>'; return; }
  var m=byId(id); if(!m||(m.hidden&&!EDIT)){location.hash='#/';return}
  var srs=sheetRows(m), selRow=null, rows='', pickers='';
  if(srs.length && (OPT[m.id]==null || !srs[OPT[m.id]])) OPT[m.id]=Math.max(0, srs.indexOf(priceOf(m).row));
  if(!EDIT && optSO(m,OPT[m.id])){ var fo=firstOkOpt(m); if(fo>=0) OPT[m.id]=fo; }   // 20261020 품절 용량은 못 고름
  var p=priceOf(m, optsOf(m).length?(OPT[m.id]||0):null);
  if(p.kind==='sheet'){ selRow=p.row; var cst=calcState(m,p.row); pickers=calcPickers(m,p.row,cst); rows=calcBox(m,p.row,cst); }
  else if(p.kind==='hidden'){ rows='<div class="r hi"><span>가격</span><b>상담 시 안내</b></div>'; }
  else if(p.kind==='sub'){
    rows+='<div class="r"><span>출고가</span><b>'+(p.out!=null?won(p.out):'상담 시 안내')+'</b></div>';
    rows+='<div class="r"><span>'+(isTv(m)?'유플러스 다이렉트 지원금':'이통사 지원금')+'</span><b style="color:var(--pink)">'+(p.sub?'-'+won(p.sub):'-')+'</b></div>';
    rows+='<div class="r hi"><span>구매가</span><b>'+(p.v!=null?won(p.v):'상담 시 안내')+'</b></div>';
  } else {
  rows+='<div class="r"><span>출고가</span><b>'+(p.out!=null?won(p.out):'상담 시 안내')+'</b></div>';
  rows+='<div class="r hi"><span>번호이동 구매가</span><b>'+(p.mnp!=null?(p.mnp===0?'0원':won(p.mnp)):'상담 시 안내')+'</b></div>';
  rows+='<div class="r hi"><span>기기변경 구매가</span><b>'+(p.chg!=null?(p.chg===0?'0원':won(p.chg)):'상담 시 안내')+'</b></div>';
  }
  $('#mdTitle').textContent=m.nm;
  var pc=colorsOf(m).filter(function(c){return c.nm===PICK[m.id]})[0];
  var PK=(pickers&&typeof pickers==='object')?pickers:{car:'',rest:pickers||''}, gg=selRow?selRow.g:'';
  var soNow=SO(m)||(selRow&&selRow.so), needCar=!!PK.car && !((SEL[m.id]||{}).carrier);
  var soDis=(soNow&&!EDIT)?' disabled':'';   // 20261020 품절이면 카톡·전화 상담 버튼 막음
  // 20261019 행동 유도: '이 순서대로 하시면 돼요' + 컬러 → 용량 → 통신사를 한 단계씩
  //  · 컬러·용량은 기본값을 골라 두되 '기본'으로 보여 줌 (점선 + 기본 표시) — 고객이 직접 누르면 ✓ 로 바뀜
  //  · 지금 할 차례(반짝임)는 고객이 고를 때마다 다음 단계로 넘어감. 앞으로만 — 뒤 단계를 먼저 고르면 앞 단계로 되돌아가지 않음
  var mcs=colorsOf(m), mos=optsOf(m), cN=mcs.length>1, oN=mos.length>1, oL=optLabel(m);
  var colNm=PICK[m.id]||(mcs[0]&&mcs[0].nm)||'', capNm=oN?((mos[OPT[m.id]||0]||{}).nm||''):'', carNm=(SEL[m.id]||{}).carrier||'';
  // 20261021 사장님: 휴대폰은 들어오자마자 통신사부터 → 고르면 바로 내 가격 → 그다음 컬러·용량
  //   (폴드8 광고: 상세를 연 111명 중 47명이 가격을 못 보고 나감 — 컬러·용량·통신사를 다 지나야 가격이 있었음)
  //   통신사 칸이 없는 상품(워치·태블릿·TV프리 등)은 예전 순서 그대로: 컬러 → 용량 → 가격
  var carFirst=!!PK.car;
  // 20261021 사장님(2차): 휴대폰 상세는 통신사 → 가격 → [상담 신청하기] 까지만. 컬러·용량은 신청서 1번에서 고름
  //   (관리자 화면은 사진·컬러 확인용으로 컬러·용량 칸을 가격 밑에 그대로 보여 줌)
  var order=[]; if(carFirst){ order.push('car'); if(EDIT){ if(cN) order.push('color'); if(oN) order.push('cap'); } } else { if(cN) order.push('color'); if(oN) order.push('cap'); }
  var done={color:!!PICK[m.id], cap:!!OPTT[m.id], car:!!carNm}, last=-1;
  order.forEach(function(k,i){ if(done[k]) last=i; });
  var nowKey=order[last+1]||'go';
  if(carFirst && !done.car) nowKey='car';   // 통신사를 안 골랐으면 언제나 통신사가 먼저 (컬러를 먼저 눌러도)
  var steps=[], body='';
  var step=function(key, short, title, sub, inner, chip, cls){ var ok=!!done[key], now=(key===nowKey); steps.push({k:key, t:short, ok:ok, now:now});
    return '<div class="mstep'+(now?' now':'')+(ok?' ok':'')+(cls?' '+cls:'')+'" data-step="'+key+'"><div class="mstep-h"><b>'+(ok?'✓':steps.length)+'</b><div><span>'+title+'</span>'+(sub?'<small>'+sub+'</small>':'')+'</div>'+(chip||'')+'</div>'+inner+'</div>'; };
  // 20261020 컬러 이름표를 뺀 대신 기본 컬러 이름은 여기 표시 · ask: 제목이 이미 '…해 주세요'면 '골라 주세요' 표시는 안 붙임(같은 말 두 번)
  var chipOf=function(key, val, dflt, ask){ return done[key]?'<em class="mstep-ok">✓ '+esc(val)+'</em>':key===nowKey?(ask?'<em class="mstep-go">골라 주세요</em>':''):dflt?'<em class="mstep-df">기본'+(key==='color'&&val?' · '+esc(val):'')+'</em>':''; };
  // 20261019 단계 아래 설명 문구(기본값 안내·통신사 안내·'그대로 두셔도 돼요')는 전부 뺌 — 제목 + 고르는 칸만
  // 20261020 단계 제목 (사장님 문구, 온점까지): 컬러를 선택해 주세요. / 용량을 선택해 주세요. / 현재 이용 중인 통신사를 선택해 주세요. / 내 가격 — 칸 안 이름표(컬러·용량·사용 통신사)는 뺌
  // 20261020 '당일 택배 발송 · 5분 상담' 칩 뺌 (첫 화면·신청서와 같은 말) — TV프리 대상 조건 칩, 워치·태블릿 '의무가입 X' 칩은 그대로
  var mdc=isTv(m)?TV_CHIPS.map(function(t){return '<span class="chip">'+t+'</span>'}).join(''):(gg==='phone'&&cst&&cst.c)?'':'<span class="chip">제휴카드 의무가입 X</span><span class="chip">부가서비스 의무가입 X</span>';
  var soHtml=soNow?'<div class="so-notice">'+(SO(m)?'현재 일시품절이에요. 지금은 신청할 수 없어요.':'선택하신 '+esc(selRow.cap||'옵션')+'은(는) 일시품절이에요.')+'</div>':'';
  var colorStep=cN?step.bind(null,'color', '컬러', '컬러를 선택해 주세요.', '', colorPicker(m), chipOf('color', colNm, true, false), done.color?'':'dflt'):null;
  var capStep=oN?step.bind(null,'cap', oL, esc(oL)+eul(oL)+' 선택해 주세요.', '', optPicker(m), chipOf('cap', capNm, true, false), done.cap?'':'dflt'):null;
  if(carFirst){
    // ① 통신사 ② 내 가격(고르기 전엔 자리만) → 아래 [상담 신청하기] — 요금제·할인 방식·할부 개월은 가격 바로 밑에서 바꿈
    body+=step('car', '통신사', '현재 이용 중인 통신사를 선택해 주세요.', '', PK.car, chipOf('car', carNm, false, false));
    var wait=needCar&&!EDIT;   // 관리자 화면은 통신사를 안 골라도 가격 칸을 그대로 보여 줌 (편집용)
    body+=step('price', '내 가격', '내 가격', '', wait?(soHtml||'<div class="pv-wait">통신사를 고르면 여기에 내 가격이 바로 나와요</div>'):
      soHtml+(PK.promo||'')+'<div class="ptable" id="ucatPrice">'+rows+'</div>'+(PK.rest?'<div class="mstep-sub">'+PK.rest+'</div>':'')+guideHtml(m)+
      (mdc?'<div class="md-chips">'+mdc+'</div>':''), '');
    if(EDIT){ if(colorStep) body+=colorStep(); if(capStep) body+=capStep(); }
  } else {
    if(colorStep) body+=colorStep();
    if(capStep) body+=capStep();
    if(PK.rest) body+='<div class="mstep-sub">'+PK.rest+'</div>';
    body+=step('price', '내 가격', '내 가격', '', soHtml+'<div class="ptable" id="ucatPrice">'+rows+'</div>'+guideHtml(m)+
      (mdc?'<div class="md-chips">'+mdc+'</div>':''), '');
  }
  // 20261020 사장님: 카톡 상담은 하나도 안 들어옴 → 카톡 상담 버튼은 빼고 '[제품명] 상담 신청하기' 하나만 (하단 고정)
  //   그래서 마지막 '상담' 단계 카드([카톡 상담][전화 상담])도 뺌 — 같은 버튼이 두 번 안 보이게.
  //   단계: 휴대폰은 통신사 → 내 가격 → 컬러 → 용량 (20261021) · 그 밖의 상품은 컬러 → 용량 → 내 가격
  MD_NOW=nowKey;   // 다 고르면 'go' → 내 가격으로 내려 줌 (mdFollow)
  // 20261020 위 '이 순서대로 하시면 돼요 ①컬러 ②용량 …' 줄은 뺌 — 단계마다 번호가 이미 있음 (이틀간 126명 중 누른 사람 0명)
  var guide='';
  // 하단 고정: 지금 상태 한 줄 + [제품명 상담 신청하기]
  var bt, btBuy=false, shortNm=m.nm.replace(/^갤럭시\s+/,'');
  if(soNow) bt='<b>일시품절</b> · 지금은 신청할 수 없어요';
  else if(needCar) bt='현재 이용 중인 <b>통신사</b>를 고르면 내 가격이 바로 나와요';
  else if(p.kind==='sheet' && cst && cst.c){ var sup=(num(p.row.out)||0)-cst.after;
    // 20261020 사장님 문구: 휴대폰은 '고른 이통사(번호이동·기기변경) 혜택(공시지원금·선택약정) 금액 제품명 구매 가능'
    //   예) 번호이동 공시지원금 104,000원 S26 구매 가능 — 금액은 지원 후 기기값, 제품명은 '갤럭시' 뺀 짧은 이름
    if(gg==='phone' && typeNm(cst)){ btBuy=true;
      var wpb=wpFor(m), wpbOn=!!(wpb&&cst.t&&cst.t.k===wpb.b);   // 20261021 B면 '폴드 8 + 워치9'
      bt=esc(typeNm(cst))+' '+(cst.method==='sel'?'선택약정':'공시지원금')+' <em>'+(cst.after===0?'0원':won(cst.after))+'</em> <b>'+esc(shortNm)+(wpbOn?' + '+esc(wpShort(wpb)):'')+'</b> 구매 가능'; }
    else bt=(typeNm(cst)?esc(typeNm(cst))+' · ':'')+'기기값 <b>'+(cst.after===0?'0원':won(cst.after))+'</b>'+(sup>0?' · 지원 <em>'+manwon(sup)+'</em>':''); }
  else bt='상담 신청하시면 <b>내 가격</b>을 안내해 드려요';
  $('#mdBody').innerHTML='<div class="ucard" data-edit="model:'+esc(m.id)+'"><div class="md-img" id="mdImg">'+im((pc&&pc.img)||mImg(m),'',true,m.nm)+(SO(m)?'<span class="so-tag" style="font-size:22px">일시품절</span>':'')+'</div>'+
    // 20261020 휴대폰 소개 문구('더 넓은 세상, 더 많은 가능성' 등)는 뺌 — 워치·태블릿·TV프리는 무슨 상품인지 알려 주는 말이라 그대로
    // 20261021 사장님(GPT 안에서 가져옴): 이름 옆 컬러 점(어떤 색이 있는지만 — 고르는 건 신청서) · 혜택 글씨 칩 → 아이콘 칸
    '<div class="md-hrow"><h2 class="md-h ucard-name">'+esc(m.nm)+'</h2>'+colDots(m)+'</div>'+(isWear(m)&&m.ds?'<p style="color:var(--sub);margin-top:4px">'+esc(m.ds)+'</p>':'')+
    benTiles(m)+
    guide+body+'</div>'+
    '<div class="md-bar" id="mdBar"><div class="md-bar-t'+(btBuy?' buy':'')+'"'+(needCar&&!soNow?' data-md-go="car"':'')+'>'+bt+'</div><div class="md-bar-b one">'+
      '<button type="button" class="mb-ap" data-open="consult" data-model="'+esc(m.id)+'"'+soDis+'>'+(soNow?'일시품절':esc(shortNm)+' 상담 신청하기<svg class="cta-ar" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg>')+'</button></div></div>';   // 20261021 GPT 안: 버튼 끝 '>' 표시
}

// 20261021 사장님(GPT 안에서 가져옴): 상세 이름 밑 혜택 → 아이콘 칸 (기기값 할인 / 보호필름·케이스 / 고속충전기 제공)
//   '보호필름 · 투명케이스 · 고속충전기 제공' 한 줄은 두 칸으로 나눔 (GPT 안 글자 그대로) · 그 밖의 혜택 글자는 그대로 한 칸씩
var BEN_I={gift:PVI.gift, shield:'<svg viewBox="0 0 24 24"><path d="M12 3 5 6v5c0 4.4 3 8.3 7 9.5 4-1.2 7-5.1 7-9.5V6z"/></svg>',
  bolt:'<svg viewBox="0 0 24 24"><path d="M13 2 5 13.5h6L10 22l8-11.5h-6z"/></svg>', ck:'<svg viewBox="0 0 24 24"><path d="m6.5 12.5 3.6 3.6 7.4-8"/></svg>'};
function benTiles(m){
  var ts=[]; tagsOf(m).forEach(function(t){
    if(t===GIFT_TXT){ ts.push(['shield','보호필름·케이스']); ts.push(['bolt','고속충전기 제공']); }
    else ts.push([/할인|0원|지원/.test(t)?'gift':'ck', t]); });
  if(!ts.length) return '';
  return '<div class="md-ben" style="--n:'+Math.min(ts.length,3)+'">'+ts.map(function(x){ return '<div class="mb-t"><i>'+BEN_I[x[0]]+'</i><span>'+esc(x[1])+'</span></div>'; }).join('')+'</div>';
}
// 이름 옆 컬러 점 — 보여 주기만 (컬러는 신청서 ①에서 고름). 4색 넘으면 이름 없이 점만
function colDots(m){ var cs=colorsOf(m); if(cs.length<2) return ''; var wn=cs.length<=4;
  return '<div class="md-cols'+(wn?'':' nn')+'">'+cs.map(function(c){ return '<span class="mc" title="'+esc(c.nm)+'"><i style="--c:'+esc(c.hex||'#ddd')+'"></i>'+(wn?'<em>'+esc(c.nm)+'</em>':'')+'</span>'; }).join('')+'</div>'; }
var PICK={};   // 상세에서 고른 컬러 (모델별)
var OPTT={};   // 상세에서 고객이 직접 고른 용량 (모델별) — 기본값과 구분
function optPicker(m){
  var os=optsOf(m); if(os.length<2) return '';
  var cur=OPT[m.id]||0;
  return '<div class="cpick nol"><div class="cpick-row">'+os.map(function(o,i){   // 20261020 '용량' 이름표 뺌 (단계 제목과 같은 말)
    var so=o.row&&o.row.so;
    return '<button type="button" class="opt'+(i===cur?' on':'')+(so?' so':'')+'" data-opt-pick="'+i+'" data-model="'+esc(m.id)+'"'+(so&&!EDIT?' disabled':'')+'>'+esc(o.nm)+(so?' <small>품절</small>':'')+'</button>';
  }).join('')+'</div></div>';
}
function colorPicker(m){
  var cs=colorsOf(m); if(cs.length<2) return '';
  var cur=PICK[m.id]||cs[0].nm;
  return '<div class="cpick nol"><div class="cpick-row">'+cs.map(function(c){   // 20261020 '컬러 라벤더' 이름표 뺌 — 고르면 제목 옆에 ✓ 라벤더
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
  if(v==='cat'){renderCat(h[1]||'all',h[2]);$('#v-cat').classList.add('on')}
  else if(v==='model'){renderModel(decodeURIComponent(h[1]||''));$('#v-model').classList.add('on')}
  else if(v==='search'){ var sm=(h[1]==='store')?'store':'phone'; if(sm!==SMODE){ SMODE=sm; $('#q').value=''; }   // 20261019: 검색 = 휴대폰 / 매장 둘 중 하나
    $('#v-search').classList.add('on'); tab=SMODE==='store'?'store':'search'; renderSearch($('#q').value); if(SMODE==='phone') setTimeout(function(){try{$('#q').focus()}catch(e){}},50) }
  else if(v==='wish'){renderWish();$('#v-wish').classList.add('on');tab='wish'}
  else if(v==='apply'){renderApply(true);$('#v-apply').classList.add('on');tab='consult'}
  else {
    $('#v-home').classList.add('on');renderRecent();renderPick();
    requestAnimationFrame(function(){window.scrollTo(0,homeScroll)});onScroll();
    setTab('home'); document.body.classList.remove('no-sq'); document.body.classList.remove('md-on'); return;
  }
  window.scrollTo(0,0); $('#topbar').classList.remove('show'); setTab(tab);
  document.body.classList.toggle('no-sq', v==='model'||v==='apply');
  document.body.classList.toggle('md-on', v==='model');   // 20261019: 상세는 탭바 대신 하단 고정 버튼 (20261020: '[제품명] 상담 신청하기' 하나)
}
function setTab(t){ $$('.tabbar a').forEach(function(a){a.classList.toggle('on',a.getAttribute('data-tab')===t)}); }
// 데이터가 바뀌었을 때 지금 보고 있는 화면을 스크롤 유지한 채 다시 그림
function refresh(){
  var y=window.scrollY;
  renderHome();
  var h=location.hash.replace(/^#\/?/,'').split('/'), v=h[0]||'home';
  if(v==='cat') renderCat(h[1]||'all',h[2]);
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
    '<div class="todo" style="margin-top:12px">고객센터 '+esc(S.tel)+'<br>상담 신청서를 남겨 주시면 순서대로 연락드립니다.</div>'+
    '<button class="cta" data-open="consult">온라인 상담 신청하기</button>';
}
function sheetGuide(){
  var st=[
    ['모델·조건 선택','원하시는 휴대폰, 요금제, 할인 방식을 선택하시면 <br class="gd-br">예상 월 납부금액을 바로 확인하실 수 있습니다.'],
    ['온라인 상담 신청서 작성','이름, 연락처, 생년월일을 남겨 주시면 상담 신청이 완료됩니다.'],
    ['상담 진행','상담사가 연락드려 최종 금액과 진행 조건을 안내해 드립니다. <br class="gd-br">고객님께서 동의하실 때만 진행됩니다.'],
    ['개통 및 수령','당일 택배로 받아보시거나 가까운 매장에서 개통 및 수령하실 수 있습니다.']];
  return '<h3 class="gd-t">구매 가이드</h3><ol class="gd-steps">'+st.map(function(x,i){ return '<li><span class="gd-n">'+(i+1)+'</span><div><b>'+x[0]+'</b><p>'+x[1]+'</p></div></li>'; }).join('')+'</ol>'+
    '<div class="gd-note"><div class="gd-note-h"><i>!</i>꼭 확인해 주세요</div><ul>'+
      '<li>월 <em>85,000원</em> 요금제를 <em>6개월 이상 유지</em>하는 조건입니다. 6개월 이후에는 월 47,000원 이상 요금제로 자유롭게 변경하실 수 있습니다.</li>'+
      '<li>제휴카드 및 부가서비스 <em>의무 가입 없이</em> 진행됩니다.</li>'+
      '<li>구매 시 <em>보호필름, 투명케이스, 고속충전기</em>를 함께 드립니다.</li></ul></div>'+
    '<button class="cta gd-cta c-guide" data-open="consult">온라인 상담 신청하기 <svg viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg></button>';
}
function sheetSoon(){
  return '<div class="soon-box"><div class="soon-ic">🛠</div><b>현재 준비 중이에요!</b><p>더 좋은 혜택으로 곧 찾아올게요.</p></div><button class="cta" type="button" data-close-sheet>확인</button>';
}
function sheetSubsidy(){
  var gift='<svg viewBox="0 0 24 24"><rect x="3.5" y="8.5" width="17" height="4" rx="1"/><path d="M5 12.5v7.5h14v-7.5M12 8.5V20M12 8.5c-1.6-3.6-6-4-6-1.4 0 1.6 2.6 1.4 6 1.4zM12 8.5c1.6-3.6 6-4 6-1.4 0 1.6-2.6 1.4-6 1.4z"/></svg>';
  return '<h3 class="gd-t">지원금 혜택 안내</h3><div class="sb-box"><i class="sb-ic">'+gift+'</i><div class="sb-txt">'+
    '<p>월 <em>85,000원</em> 요금제를 <em>6개월 이상</em> 유지하시는 조건으로 안내드리고 있어요.</p>'+
    '<p>6개월 이후에는 월 <em>47,000원 이상</em> 요금제로 자유롭게 변경하실 수 있습니다.</p></div></div>'+
    '<div class="gd-sub">제휴카드 · 부가서비스 의무 가입 없이 진행됩니다.</div>'+
    '<button class="cta gd-cta c-sub" data-go="#/cat/all">지원금 받는 모델 보러가기 <svg viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg></button>';
}
var QNA=[["가격·가입 조건", [["제휴카드나 부가서비스에 꼭 가입해야 하나요?", "아니요. 제휴카드 및 부가서비스 의무가입 없이 진행됩니다."], ["표시된 금액은 어떻게 계산되나요?", "선택하신 모델, 가입유형, 요금제, 할인 방식 등을 기준으로 예상 금액을 안내해 드립니다."], ["요금제는 얼마나 유지해야 하나요?", "월 85,000원 요금제를 6개월 이상 유지하는 조건입니다. 이후에는 월 47,000원 이상 요금제로 변경하실 수 있습니다."], ["6개월 이후에는 꼭 요금제를 변경해야 하나요?", "아닙니다. 현재 요금제를 계속 이용하시거나, 조건 충족 후 월 47,000원 이상 요금제로 변경하실 수 있습니다."], ["공시지원금과 선택약정은 무엇이 다른가요?", "공시지원금은 휴대폰 기기값을 할인받는 방식이며, 선택약정은 월 통신요금의 25%를 할인받는 방식입니다. 신청 화면에서 조건별 예상 금액을 비교하실 수 있습니다."], ["번호이동과 기기변경은 어떤 차이인가요?", "SKT·KT·알뜰폰에서 LG U+로 변경하시면 번호이동, 현재 LG U+를 이용 중이시면 기기변경으로 진행됩니다."], ["번호이동을 하면 전화번호도 변경되나요?", "아닙니다. 사용 중인 전화번호를 유지하면서 통신사만 LG U+로 변경하는 방식입니다."], ["왜 번호이동과 기기변경 가격이 다른가요?", "가입유형에 따라 적용되는 지원 조건이 달라 휴대폰 구매금액에 차이가 있을 수 있습니다."], ["월 예상 납부금에는 무엇이 포함되나요?", "선택하신 조건 기준의 휴대폰 기기 할부금과 월 통신요금을 합산하여 안내해 드립니다."], ["휴대폰 가격과 월 납부금은 왜 다르게 보이나요?", "휴대폰 가격은 단말기 구매금액이며, 월 예상 납부금은 기기 할부금과 통신요금을 합산한 금액입니다."], ["할부기간을 선택할 수 있나요?", "신청 화면에서 제공되는 할부기간 중 원하는 조건을 선택하실 수 있습니다."], ["일시불로 구매할 수도 있나요?", "가능한 결제 방식은 선택하신 모델과 조건에 따라 상담 시 확인해 드립니다."], ["조건을 바꾸면 예상 금액도 달라지나요?", "네. 가입유형, 요금제, 할인 방식, 할부기간 등에 따라 예상 금액이 달라질 수 있습니다."]]], ["상담·신청", [["상담 신청을 하면 바로 구매가 진행되나요?", "상담 신청 후 담당자가 선택하신 조건과 예상 금액을 다시 안내해 드립니다. 상담 내용을 확인한 뒤 다음 절차가 진행됩니다."], ["상담은 얼마나 걸리나요?", "기본적인 조건 안내는 약 5분 내외로 진행되며, 문의내용에 따라 상담시간이 달라질 수 있습니다."], ["전화 상담이 필요한 이유가 무엇인가요?", "선택하신 모델과 가입조건, 요금제, 예상 금액 등 신청 내용을 정확하게 확인하기 위해 상담을 진행합니다."], ["온라인으로 어떻게 신청하나요?", "원하는 휴대폰과 가입조건을 선택한 뒤 이름, 연락처 등 상담에 필요한 정보를 입력해 주시면 됩니다."], ["입력한 조건은 상담할 때 다시 확인해주나요?", "네. 고객님이 선택하신 모델, 가입유형, 요금제, 할인 방식 등을 기준으로 상담을 진행합니다."], ["상담 신청 전에 예상 금액을 확인할 수 있나요?", "네. 모델과 가입조건을 선택하시면 예상 월 납부금과 적용 가능한 지원금 정보를 확인하실 수 있습니다."], ["상담할 때 다른 모델도 함께 물어볼 수 있나요?", "네. 상담 시 다른 모델이나 조건도 함께 문의하실 수 있습니다."], ["온라인 상담 신청은 언제든 할 수 있나요?", "페이지에서 상담 신청을 접수하실 수 있으며, 상담은 운영시간 내 순차적으로 진행됩니다."], ["이름, 연락처, 생년월일은 왜 필요한가요?", "상담 및 가입조건 확인을 위해 필요한 정보를 받고 있습니다. 자세한 내용은 개인정보 수집 및 이용 동의를 확인해 주세요."], ["전달사항에는 무엇을 적으면 되나요?", "원하는 연락시간, 색상, 용량, 문의사항 등 상담 시 참고가 필요한 내용을 자유롭게 남겨 주시면 됩니다."]]], ["배송·수령", [["휴대폰은 어떻게 받을 수 있나요?", "상담 완료 후 선택하신 모델의 진행 가능 여부와 수령 방법을 안내해 드립니다."], ["택배로 받을 수 있나요?", "네. 택배 수령이 가능한 경우 상담 과정에서 배송 절차를 안내해 드립니다."], ["매장에서 직접 받을 수도 있나요?", "서울·경기 내 이용 가능한 지정매장의 경우 방문 수령 가능 여부를 상담 시 확인해 드립니다."], ["원하는 색상과 용량을 선택할 수 있나요?", "신청 화면에서 선택 가능한 색상과 용량을 확인하실 수 있습니다."], ["선택한 색상이나 용량이 없는 경우에는 어떻게 하나요?", "상담 시 진행 가능한 색상과 용량을 확인하여 안내해 드립니다."], ["휴대폰은 언제 받을 수 있나요?", "모델, 색상, 용량, 재고 상황 및 진행 절차에 따라 수령 일정이 달라질 수 있으며 상담 시 안내해 드립니다."], ["유심이나 eSIM도 안내받을 수 있나요?", "네. 가입유형과 이용하실 휴대폰에 따라 필요한 유심 또는 eSIM 절차를 안내해 드립니다."], ["온라인으로 구매하고 매장에서 도움을 받을 수도 있나요?", "서울·경기 내 지정매장에서 지원 가능한 업무에 한해 방문 안내를 받으실 수 있습니다."], ["데이터 이전도 가능한가요?", "서울·경기 지정매장 방문 시 지원 가능한 범위 내에서 데이터 이전 및 초기 설정을 도와드립니다."], ["초기 설정도 도움받을 수 있나요?", "지정매장 방문 시 지원 가능한 범위 내에서 기본적인 휴대폰 설정을 도와드립니다."]]], ["지원금·혜택", [["휴대폰 구매 시 제공되는 혜택이 있나요?", "모델과 진행 중인 행사에 따라 제공되는 혜택을 상품 페이지에서 확인하실 수 있습니다."], ["투명케이스·보호필름·충전기 혜택은 어떻게 확인하나요?", "해당 혜택이 적용되는 모델은 상품 페이지에 별도로 표시됩니다."], ["지원금 혜택은 어떤 조건으로 받을 수 있나요?", "모델, 가입유형, 요금제 등에 따라 적용되는 지원금이 달라질 수 있으며 신청 화면에서 예상 금액을 확인하실 수 있습니다."], ["번호이동과 기기변경 모두 지원금이 있나요?", "번호이동과 기기변경 각각 적용 가능한 조건에 따라 예상 지원금이 안내됩니다."], ["지원금은 모든 모델이 동일한가요?", "아닙니다. 모델과 가입유형, 요금제 등에 따라 적용되는 지원금이 다를 수 있습니다."], ["지원금이 가장 큰 모델을 볼 수 있나요?", "상품 목록과 지원금 혜택 메뉴에서 현재 조건이 좋은 모델을 확인하실 수 있습니다."], ["기기값 0원 모델은 어떤 의미인가요?", "안내된 조건을 적용했을 때 휴대폰 기기값이 0원으로 계산되는 모델을 의미합니다. 세부 적용 조건은 상품 페이지에서 확인하실 수 있습니다."], ["사은품은 모든 모델에 제공되나요?", "모델 및 행사에 따라 제공 여부와 구성이 다를 수 있으며 적용되는 혜택은 상품 페이지에 표시됩니다."], ["TV프리 혜택은 누가 받을 수 있나요?", "안내된 인터넷·TV 이용조건을 충족하는 고객님을 대상으로 제공되는 혜택입니다. 대상 여부는 상담 시 확인해 드립니다."], ["인터넷·TV를 이용 중인데 추가 혜택을 확인할 수 있나요?", "네. 현재 이용 중인 U+ 인터넷·TV 조건을 알려 주시면 적용 가능한 혜택이 있는지 확인해 드립니다."], ["워치나 태블릿 혜택도 있나요?", "진행 중인 행사 및 적용 모델에 따라 관련 혜택이 있는 경우 상품 페이지에서 안내해 드립니다."]]], ["가입 가능 여부", [["알뜰폰을 사용 중인데 번호이동할 수 있나요?", "네. 알뜰폰에서 LG U+로 번호이동 신청이 가능합니다."], ["현재 LG U+를 사용 중인데 신청할 수 있나요?", "네. LG U+ 이용 고객님은 기기변경 조건으로 확인하실 수 있습니다."], ["SKT를 사용 중인데 신청할 수 있나요?", "네. SKT를 이용 중이시면 LG U+ 번호이동 조건으로 확인하실 수 있습니다."], ["KT를 사용 중인데 신청할 수 있나요?", "네. KT를 이용 중이시면 LG U+ 번호이동 조건으로 확인하실 수 있습니다."], ["미성년자도 신청할 수 있나요?", "미성년자는 가입 과정에서 법정대리인 확인 및 필요한 절차가 추가될 수 있습니다."], ["가족 명의로 신청할 수 있나요?", "가입자 명의에 따라 필요한 본인확인 절차가 있으므로 상담 시 확인해 드립니다."], ["외국인도 신청할 수 있나요?", "가입에 필요한 본인확인 조건 등에 따라 가능 여부가 달라질 수 있어 상담을 통해 확인해 드립니다."], ["법인 또는 사업자 명의도 가능한가요?", "명의 유형에 따라 필요한 절차가 달라질 수 있어 상담을 통해 확인해 드립니다."]]], ["현재 이용 중인 휴대폰·약정", [["기존 휴대폰 할부금이 남아 있어도 새 휴대폰을 신청할 수 있나요?", "기존 휴대폰의 할부 상태와 별개로 새로운 휴대폰 가입조건을 확인하실 수 있습니다. 기존 단말 관련 금액은 현재 이용 중인 통신사를 통해 확인해 주세요."], ["현재 약정이 남아 있는데 신청할 수 있나요?", "현재 약정 상태에 따라 조건이 달라질 수 있으므로 상담 시 현재 이용 중인 조건을 함께 확인해 주세요."], ["기존 휴대폰을 꼭 반납해야 하나요?", "별도의 반납 조건이 안내되지 않은 상품은 휴대폰 반납을 전제로 하지 않습니다."], ["기존에 사용하던 유심을 계속 사용할 수 있나요?", "가입유형과 휴대폰 모델에 따라 달라질 수 있으며 상담 시 안내해 드립니다."], ["선택약정을 이용 중인데 기기변경할 수 있나요?", "현재 약정 상태와 가입조건에 따라 확인이 필요하며 상담 시 안내해 드립니다."], ["현재 사용 중인 요금제를 그대로 사용할 수 있나요?", "상품별로 적용되는 요금제 조건이 다를 수 있으며 신청 화면에서 선택 가능한 요금제를 확인하실 수 있습니다."]]], ["요금제", [["왜 특정 요금제를 일정 기간 사용해야 하나요?", "안내된 휴대폰 가격과 지원금이 해당 요금제 및 유지조건을 기준으로 적용되기 때문입니다."], ["6개월 이후에는 어떤 요금제로 변경할 수 있나요?", "안내된 조건 기준으로 월 47,000원 이상 요금제로 변경하실 수 있습니다."], ["요금제를 계속 85,000원으로 사용해도 되나요?", "네. 원하시는 경우 현재 요금제를 계속 이용하실 수 있습니다."], ["요금제 변경은 어디에서 하나요?", "요금제 변경 가능 시점 이후 LG U+ 고객센터 및 이용 가능한 채널에서 변경하실 수 있습니다."], ["선택한 요금제에 따라 휴대폰 가격도 달라지나요?", "네. 요금제에 따라 적용 가능한 지원금과 예상 구매금액이 달라질 수 있습니다."]]], ["기타", [["상담 가능한 시간은 언제인가요?", "상담 운영시간 내 접수 건부터 순차적으로 안내해 드립니다."], ["상품마다 가격이 다른 이유는 무엇인가요?", "모델별 출고가와 가입유형, 요금제, 할인 방식, 적용 가능한 지원조건이 서로 다르기 때문입니다."], ["같은 휴대폰인데 조건에 따라 금액이 달라지는 이유는 무엇인가요?", "번호이동·기기변경 여부, 요금제, 공시지원금·선택약정 등 선택하신 조건에 따라 예상 금액이 달라집니다."], ["가장 저렴한 조건은 어떻게 확인하나요?", "상품 페이지에서 가입조건을 변경해보시면 조건별 예상 금액을 비교하실 수 있습니다."], ["인기 모델은 어디에서 확인하나요?", "홈 화면의 인기모델 및 추천 목록에서 확인하실 수 있습니다."], ["기기값 0원 모델만 따로 볼 수 있나요?", "네. 기기값 0원 메뉴에서 해당 조건의 모델을 모아 확인하실 수 있습니다."], ["원하는 휴대폰을 빠르게 찾는 방법이 있나요?", "검색창 또는 상단 모델 카테고리를 이용하시면 원하는 모델을 빠르게 확인하실 수 있습니다."], ["조건이 어려운데 직접 비교해주실 수 있나요?", "네. 상담 신청 시 현재 사용 중인 통신사와 원하는 모델을 알려 주시면 조건 비교를 도와드립니다."]]]];
var QCAT=0, QQ='';
// 검색: 질문·답변 전체에서 찾기 (비슷한 말도 함께 — 예: 배송 → 택배·수령)
var QSYN={'배송':['택배','수령'],'택배':['배송','수령'],'수령':['배송','택배'],'가격':['금액','기기값'],'금액':['가격'],'요금':['요금제'],'할부':['할부기간','일시불'],'지원금':['혜택','공시'],'사은품':['혜택','케이스','필름','충전기'],'약정':['선택약정'],'매장':['방문','지정매장'],'상담':['신청'],'유심':['eSIM'],'번호':['번호이동'],'tv':['TV프리','인터넷']};
function qnaItem(x,i,cat){
  var hl=function(t){ var e=esc(t); if(!QQ) return e; var ws=qWords(); ws.forEach(function(w){ if(!w) return; e=e.split(esc(w)).join('<mark>'+esc(w)+'</mark>'); }); return e; };
  return '<details'+(i||QQ?'':' open')+'><summary><i>Q</i><span>'+(cat?'<small class="qna-c">'+esc(cat)+'</small>':'')+hl(x[0])+'</span></summary><div class="qa"><i>A</i><p>'+hl(x[1])+'</p></div></details>';
}
function qWords(){ var w=QQ.trim(); if(!w) return []; var k=w.toLowerCase(), out=[w]; Object.keys(QSYN).forEach(function(s){ if(k.indexOf(s.toLowerCase())>-1) out=out.concat(QSYN[s]); }); return out; }
function qnaList(){
  if(QQ.trim()){
    var ws=qWords(), main=QQ.trim().toLowerCase(), hit=[];
    QNA.forEach(function(c){ c[1].forEach(function(x){ var t=(x[0]+' '+x[1]).toLowerCase(), sc=0;
      if(x[0].toLowerCase().indexOf(main)>-1) sc+=3; if(t.indexOf(main)>-1) sc+=2;
      ws.forEach(function(w){ if(t.indexOf(w.toLowerCase())>-1) sc+=1; });
      if(c[0].toLowerCase().indexOf(main)>-1) sc+=1;   // 카테고리 이름이 맞으면 그 카테고리 질문도 함께
      if(sc) hit.push({x:x,c:c[0],sc:sc}); }); });
    hit.sort(function(a,b){ return b.sc-a.sc; });
    return hit.length ? '<div class="qna-n">\''+esc(QQ.trim())+'\' 관련 질문 '+hit.length+'개</div>'+hit.map(function(h,i){ return qnaItem(h.x,i,h.c); }).join('')
      : '<div class="qna-none">\''+esc(QQ.trim())+'\'에 대한 질문이 없어요.<br>아래 전화·카톡으로 편하게 물어보세요.</div>';
  }
  var c=QNA[QCAT]||QNA[0];
  return c[1].map(function(x,i){ return qnaItem(x,i); }).join('');
}
function sheetQna(){
  var b=S.biz||{};
  QQ='';
  return '<h3 class="gd-t">자주 묻는 질문</h3><label class="qna-search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input type="search" id="qnaQ" placeholder="궁금한 내용을 검색하세요 (예: 배송, 요금제)" autocomplete="off"><button type="button" class="qna-x" data-qx aria-label="지우기">×</button></label><div class="qna-cats">'+QNA.map(function(c,i){ return '<button type="button" class="'+(i===QCAT?'on':'')+'" data-qcat="'+i+'">'+esc(c[0])+'</button>'; }).join('')+'</div>'+
    '<div class="qna" id="qnaList">'+qnaList()+'</div>'+
    '<div class="gd-sub" style="margin-top:14px">더 궁금한 점은 편하게 물어보세요'+(b.hours?' · 상담 시간 '+esc(b.hours):'')+'</div>'+
    '<div class="contact-btns"><a href="tel:'+esc(S.tel)+'">📞 전화 상담</a><a class="kakao" href="'+esc(S.kakao)+'" target="_blank" rel="noopener">💬 카톡 문의</a></div>';
}
function sheetSpecial(){
  var ck='<svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';
  var tv='<svg class="sp-tv" viewBox="0 0 120 90"><ellipse cx="58" cy="46" rx="56" ry="40" fill="#FBE1EC"/><defs><linearGradient id="spg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#FCE3EE"/></linearGradient></defs>'+
    '<rect x="16" y="14" width="84" height="54" rx="4" fill="url(#spg)" stroke="#E6007E" stroke-width="3.5"/><rect x="50" y="68" width="16" height="7" fill="#E6007E"/><rect x="38" y="74" width="40" height="4" rx="2" fill="#E6007E"/>'+
    '<text x="58" y="47" text-anchor="middle" font-family="Pretendard,sans-serif" font-weight="900" font-size="15" fill="#E6007E">U<tspan dy="-6" font-size="10">+</tspan><tspan dy="6" fill="#4A2B3A" dx="2">TV</tspan></text></svg>';
  return '<div class="sp-k">U+ 인터넷TV를 이용하고 있으시다면</div><h3 class="gd-t sp-t">오직 <em>U+ 고객님</em>께만 드리는,<br>유플러스 다이렉트 단독 혜택!</h3>'+
    '<div class="sp-hero2">'+tv+'<div class="sp-hr"><b>TV프리 <em>기기값 0원</em></b><span>약정 36개월 · 이용료 첫 9개월 월 '+won(TV_FEE)+', 10개월 차부터 월 '+won(TV_FEE2)+'</span></div></div>'+
    tvCondHtml()+
    '<button class="cta gd-cta c-sp" data-go="#/cat/tvfree">TV프리 보러가기 <svg viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg></button>';
}
/* 20261019 매장찾기 '내 위치에서 가까운 매장' — 매장 위치(위도·경도)는 주소로 한 번 찾아 둔 값 (OpenStreetMap 기준, 번지까지 안 잡힌 곳은 역·동 기준).
   관리자에서 매장에 lat·lng 가 있으면 그걸 우선. 새 매장(여기 없는 주소)은 거리 없이 목록 맨 아래에 나옴.
   고객 위치는 이 화면에서 거리 계산에만 쓰고 어디에도 저장·전송하지 않음 */
var STORE_GEO={
  '서울시 광진구 능동로 95':[37.533913,127.067926], '서울시 광진구 천호대로 573':[37.556583,127.081845], '서울시 광진구 천호대로 548':[37.556827,127.078992],
  '서울시 광진구 자양번영로 42':[37.531000,127.075000], '서울시 성동구 아차산로 96':[37.544554,127.054421], '서울시 성동구 용답동 58-1':[37.561333,127.058015],
  '서울시 중랑구 사가정로52길 5':[37.580390,127.087632], '서울시 중랑구 동일로 917':[37.611436,127.077608], '서울시 동대문구 장한로 3':[37.562410,127.065380],
  '서울시 강북구 미아동 202-11':[37.631950,127.024080], '서울시 강북구 도봉로 187':[37.628000,127.025800], '서울시 도봉구 도당로 2':[37.658330,127.035268],
  '서울시 도봉구 쌍문동 88-144':[37.648664,127.034736], '서울시 강동구 올림픽로 769':[37.549967,127.127179], '서울시 강동구 양재대로 1465':[37.536854,127.139488],
  '하남시 미사강변동로 70':[37.561315,127.194177], '성남시 중원구 광명로 337':[37.446430,127.165925], '구리시 갈매순환로 188':[37.625620,127.111785],
  '구리시 경춘로 239':[37.601591,127.141744], '남양주시 퇴계원읍 퇴계원로 64':[37.651000,127.146000], '남양주시 진접읍 해밀예당3로 57':[37.714891,127.199508],
  '남양주시 오남읍 진건오남로 639':[37.689304,127.210191], '남양주시 진접읍 장현로 83':[37.717946,127.181589], '남양주시 화도읍 마석중앙로 65':[37.652500,127.306000]
};
var MYPOS=null, MYPOS_L='내 위치', NEAR_ERR='', NEARQ='', GEOC={}, FROMLL=null, FROMQ='';   // MYPOS: 지금 기준 위치(내 위치 또는 고객이 적은 동네) · FROMLL: 신청서 '어디서 오세요'로 찾은 위치
var PIN_I='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/></svg>';
function storeLL(s){ if(s && s.lat && s.lng) return [+s.lat, +s.lng]; return STORE_GEO[String((s&&s.addr)||'').trim()]||null; }
function kmBetween(a,b){ var r=Math.PI/180, dLa=(b[0]-a[0])*r, dLo=(b[1]-a[1])*r, x=Math.sin(dLa/2)*Math.sin(dLa/2)+Math.cos(a[0]*r)*Math.cos(b[0]*r)*Math.sin(dLo/2)*Math.sin(dLo/2); return 12742*Math.asin(Math.min(1,Math.sqrt(x))); }
function storeDist(s){ var ll=MYPOS&&storeLL(s); return ll?kmBetween(MYPOS,ll):null; }
function distBand(km){ return km<1?'1km 이내':km<3?'1~3km':km<5?'3~5km':km<10?'5~10km':km<20?'10~20km':'20km 이상'; }
function distTxt(km){ return km<1?Math.max(10,Math.round(km*100)*10)+'m':(km<10?km.toFixed(1):String(Math.round(km)))+'km'; }
// 20261019 걸리는 시간 어림값 — 직선거리 ×1.3(실제 길), 1.2km 안쪽은 걸어서(시속 4.5km), 그 밖은 차로(평균 시속 24km + 출발·주차 4분). 정확한 시간은 카카오맵 길찾기로
function tripTxt(km){ var r=km*1.3; return km<1.2?'걸어서 약 '+Math.max(1,Math.round(r/4.5*60))+'분':'차로 약 '+Math.round(4+r/24*60)+'분'; }
function kakaoTo(s){ var ll=storeLL(s); return ll?'https://map.kakao.com/link/to/'+encodeURIComponent(s.nm)+','+ll[0]+','+ll[1]:'https://map.naver.com/p/search/'+encodeURIComponent(s.addr||s.nm); }
function nearestStore(){ var best=null; S.stores.forEach(function(s){ if(!s||!s.nm) return; var d=storeDist(s); if(d!=null&&(!best||d<best.d)) best={nm:s.nm, d:d}; }); return best; }
// 이탈 분석 기록: 가장 가까운 매장 + 거리대만 (위치 좌표·이름·번호는 남기지 않음) — '어느 매장 근처, 얼마나 먼 고객이 찾는지' 수요 파악용
function nearLog(n,d){ try{ if(typeof window.udakEv==='function') window.udakEv(n,d); }catch(x){} }
// 동네·주소 → 위치 (OpenStreetMap 무료 주소 검색 · 같은 말은 한 번만 물어봄 · 고객 이름·번호는 안 보냄)
function geoFind(q, cb){
  q=String(q||'').trim(); if(!q){ cb(null); return; }
  if(Object.prototype.hasOwnProperty.call(GEOC,q)){ cb(GEOC[q]); return; }
  fetch('https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=kr&accept-language=ko&viewbox=126.6,37.95,127.75,37.15&q='+encodeURIComponent(q))
    .then(function(r){ return r.ok?r.json():[]; })
    .then(function(j){ var g=(j&&j[0])?[+j[0].lat, +j[0].lon]:null; GEOC[q]=g; cb(g); })
    .catch(function(){ cb(null); });
}
function storeSheetRedraw(){
  if($('#sheet').classList.contains('show') && $('#sheet #nearBtn')) openSheet(sheetStore());
  else if(SMODE==='store' && $('#v-search').classList.contains('on')) renderSearch($('#q').value);   // 20261019: 검색 화면 '매장'
}
// 20261019 검색 화면 '매장' — 매장 이름·주소로 바로 거르고, 동네면 [‘인창동’ 근처 매장 찾기]로 그 동네 기준 가까운 순 (회사에 있어도 집 기준으로)
function renderStoreSearch(q){
  var raw=String(q||'').trim(), k=raw.replace(/\s/g,''), list=S.stores.filter(function(s){ return s&&s.nm; });
  var gps=MYPOS&&MYPOS_L==='내 위치', geoQ=!!(MYPOS&&!gps&&raw&&MYPOS_L===raw);
  var sortD=function(arr){ return arr.map(function(s){ return {s:s, d:storeDist(s)}; }).sort(function(a,b){ return (a.d==null?1e9:a.d)-(b.d==null?1e9:b.d); }); };
  var h='<div class="ss-wrap"><button type="button" class="near-btn'+(gps?' on':'')+'" id="nearBtn" data-near>'+PIN_I+'<span>'+(gps?'내 위치 다시 찾기':'내 위치에서 가까운 매장 찾기')+'</span></button>';
  if(k && !geoQ) h+='<button type="button" class="ss-geo" data-ss-geo>'+PIN_I+'<span>‘'+esc(raw)+'’ 근처 매장 찾기</span></button>';
  if(NEAR_ERR) h+='<div class="near-err">'+esc(NEAR_ERR)+'</div>';
  var hit=(k && !geoQ)?list.filter(function(s){ return (s.nm+(s.addr||'')).replace(/\s/g,'').indexOf(k)>-1; }):[];
  if(hit.length){   // 매장 이름·주소에 맞는 매장
    h+='<div class="sl-g">‘'+esc(raw)+'’ 매장 '+hit.length+'곳</div>'+sortD(hit).map(function(x){ return storeItem(x.s, x.d); }).join('');
  } else if(MYPOS){   // 기준 위치(내 위치·동네)에서 가까운 순 — 맞는 매장이 없을 때도 전체를 보여 줌
    h+='<div class="sl-g">'+esc(MYPOS_L)+'에서 가까운 순</div>'+sortD(list).map(function(x,i){ return storeItem(x.s, x.d, i===0&&x.d!=null); }).join('');
  } else {
    var se=list.filter(function(s){ return /^서울/.test(s.addr||''); }), gg=list.filter(function(s){ return !/^서울/.test(s.addr||''); }), it=function(s){ return storeItem(s); };
    h+=(se.length?'<div class="sl-g">서울</div>'+se.map(it).join(''):'')+(gg.length?'<div class="sl-g">경기</div>'+gg.map(it).join(''):'');
  }
  h+='<div class="near-src">주소 검색 © OpenStreetMap</div>'+(S.storeNote?'<div class="todo" style="margin-top:10px">'+esc(S.storeNote)+'</div>':'')+
    '<button class="cta" data-open="consult" data-store="">방문 예약 상담 신청하기</button></div>';
  $('#results').innerHTML=h;
}
function searchStoreGeo(){
  var raw=String(($('#q')||{}).value||'').trim(); if(!raw) return;
  var b=$('[data-ss-geo]'); if(b){ b.disabled=true; var bs=b.querySelector('span'); if(bs) bs.textContent='찾는 중…'; }
  geoFind(raw, function(g){
    if(g){ MYPOS=g; MYPOS_L=raw; NEAR_ERR=''; var best=nearestStore(); if(best) nearLog('store_near', best.nm+' · '+distBand(best.d)+' · 동네 검색'); }
    else NEAR_ERR='‘'+raw+'’ 위치를 찾지 못했어요. 동 이름으로 적어 주세요. (예: 인창동)';
    renderSearch(raw);
  });
}
// 매장찾기 '내 위치에서 가까운 매장 찾기' (GPS)
function findNear(){
  if(!navigator.geolocation){ NEAR_ERR='이 브라우저에서는 위치를 확인할 수 없어요.'; storeSheetRedraw(); return; }
  var b=$('#nearBtn'); if(b){ b.disabled=true; var bs=b.querySelector('span'); if(bs) bs.textContent='내 위치 확인 중…'; }
  navigator.geolocation.getCurrentPosition(function(p){ MYPOS=[p.coords.latitude, p.coords.longitude]; MYPOS_L='내 위치'; NEAR_ERR='';
      var qi=$('#q'); if(qi && SMODE==='store' && $('#v-search').classList.contains('on')) qi.value='';   // 검색 '매장': 내 위치 기준 전체 목록이 보이게
      var best=nearestStore(); if(best) nearLog('store_near', best.nm+' · '+distBand(best.d)); storeSheetRedraw(); },
    function(er){ nearLog('store_near_fail', (er&&er.code===1)?'위치 거부':'위치 확인 실패'); NEAR_ERR=(er&&er.code===1)?'위치 권한이 꺼져 있어요. 동네 이름으로 찾아 주세요.':'위치를 확인하지 못했어요. 동네 이름으로 찾아 주세요.'; storeSheetRedraw(); },
    {enableHighAccuracy:false, timeout:10000, maximumAge:300000});
}
// 20261019 매장찾기 '동네로 찾기' — 회사에 있어도 집 기준으로 (예: 구리 인창동)
function findNearQ(){
  var inp=$('#nearQ'), q=inp?inp.value.trim():''; if(!q){ if(inp) inp.focus(); return; }
  NEARQ=q; var b=$('[data-near-q]'); if(b){ b.disabled=true; b.textContent='찾는 중…'; }
  geoFind(q, function(g){
    if(g){ MYPOS=g; MYPOS_L=q; NEAR_ERR=''; var best=nearestStore(); if(best) nearLog('store_near', best.nm+' · '+distBand(best.d)+' · 동네 검색'); }
    else NEAR_ERR='‘'+q+'’ 위치를 찾지 못했어요. 동 이름으로 적어 주세요. (예: 인창동)';
    storeSheetRedraw();
  });
}
function storeItem(s, km, top){
  var i=S.stores.indexOf(s);
  var th=String(s.img||'').split(',')[0].trim();
  return '<div class="store-li'+(th?' has-th':'')+'" data-store-i="'+i+'" role="button">'+(th?'<div class="sl-th">'+im(th,'','',s.nm)+'</div>':'')+'<div class="sl-r"><b>'+esc(s.nm)+(km!=null?'<em class="sl-km'+(top?' top':'')+'">'+(top?'가장 가까움 · ':'')+distTxt(km)+'</em>':'')+'</b><a class="sl-map" href="https://map.naver.com/p/search/'+encodeURIComponent(s.addr||s.nm)+'" target="_blank" rel="noopener">지도</a></div><div>'+esc(s.addr||'')+'</div>'+
    (km!=null?'<div class="sl-trip">'+esc(MYPOS_L)+'에서 '+tripTxt(km)+'</div>':'')+
    (s.tel?'<div><a href="tel:'+esc(s.tel)+'" style="color:var(--pink);font-weight:700">'+esc(s.tel)+'</a></div>':'')+'<span class="sl-go">자세히 '+CHEV_I+'</span></div>';
}
// 매장 상세 (사진은 관리자에서 매장별 img 추가 시 표시) — 20261019: 지도(위치) + 거리·걸리는 시간 + 길찾기
function sheetStoreOne(s){
  var b=S.biz||{}, map='https://map.naver.com/p/search/'+encodeURIComponent(s.addr||s.nm), ll=storeLL(s), d=storeDist(s);
  var mapv=ll?'<a class="st-mapv" href="https://map.kakao.com/link/map/'+encodeURIComponent(s.nm)+','+ll[0]+','+ll[1]+'" target="_blank" rel="noopener" aria-label="'+esc(s.nm)+' 지도 크게 보기">'+
      '<iframe src="https://www.openstreetmap.org/export/embed.html?bbox='+(ll[1]-0.006).toFixed(6)+'%2C'+(ll[0]-0.0035).toFixed(6)+'%2C'+(ll[1]+0.006).toFixed(6)+'%2C'+(ll[0]+0.0035).toFixed(6)+'&amp;layer=mapnik&amp;marker='+ll[0]+'%2C'+ll[1]+'" loading="lazy" tabindex="-1" title="'+esc(s.nm)+' 위치"></iframe><span>지도 크게 보기</span></a>':'';
  return '<button class="st-back" type="button" data-go="store">‹ 매장 목록</button>'+
    (function(){ var ims=String(s.img||'').split(',').map(function(x){return x.trim()}).filter(Boolean); if(!ims.length) return '';
      return '<div class="st-gal'+(ims.length>1?' multi':'')+'">'+ims.map(function(x){ return '<div class="st-img">'+im(x,'',true,s.nm)+'</div>'; }).join('')+'</div>'+(ims.length>1?'<div class="st-gal-n">옆으로 넘겨서 '+ims.length+'장 보기</div>':''); })()+
    '<h3>'+esc(s.nm)+'</h3><div class="st-rows">'+
    '<div><span>주소</span><b>'+esc(s.addr||'-')+'</b></div>'+
    (d!=null?'<div><span>거리</span><b>'+esc(MYPOS_L)+'에서 약 '+distTxt(d)+' · '+tripTxt(d)+'</b></div>':'')+
    '<div><span>영업시간</span><b>'+esc(s.hours||b.hours||'상담 시 안내')+'</b></div>'+
    '<div><span>전화</span><b>'+(s.tel?'<a href="tel:'+esc(s.tel)+'">'+esc(s.tel)+'</a>':'<a href="tel:'+esc(S.tel)+'">'+esc(S.tel)+' (대표)</a>')+'</b></div></div>'+
    mapv+
    '<div class="st-mapb"><a class="go" href="'+kakaoTo(s)+'" target="_blank" rel="noopener">'+PIN_I+'길찾기</a><a href="'+map+'" target="_blank" rel="noopener">네이버 지도로 보기</a></div>'+
    (S.storeNote?'<div class="todo" style="margin-top:12px">'+esc(S.storeNote)+'</div>':'')+
    '<button class="cta" data-open="consult" data-store="'+esc(s.nm)+'">'+esc(s.nm)+' 방문 예약 상담 신청하기</button>';
}
function sheetStore(){
  var list=S.stores.filter(function(s){return s&&s.nm});
  var seoul=list.filter(function(s){return /^서울/.test(s.addr||'')}), gg=list.filter(function(s){return !/^서울/.test(s.addr||'')});
  var it=function(s){ return storeItem(s); };
  // 20261019: '내 위치에서 가까운 매장 찾기'(GPS) 또는 '동네로 찾기'(집 기준 등) → 가까운 순 + 거리·걸리는 시간
  var near=MYPOS?list.map(function(s){ return {s:s, d:storeDist(s)}; }).sort(function(a,b){ return (a.d==null?1e9:a.d)-(b.d==null?1e9:b.d); }):null;
  var gps=MYPOS&&MYPOS_L==='내 위치';
  var nb=list.length?'<button type="button" class="near-btn'+(gps?' on':'')+'" id="nearBtn" data-near>'+PIN_I+'<span>'+(gps?'내 위치 다시 찾기':'내 위치에서 가까운 매장 찾기')+'</span></button>'+
    '<div class="near-q"><input type="text" id="nearQ" maxlength="40" placeholder="동네로 찾기 (예: 구리 인창동)" value="'+esc(NEARQ)+'" enterkeyhint="search"><button type="button" data-near-q>찾기</button></div>'+
    (NEAR_ERR?'<div class="near-err">'+esc(NEAR_ERR)+'</div>':'')+'<div class="near-src">주소 검색 © OpenStreetMap</div>':'';
  return '<h3>매장찾기 <small style="font-size:13px;color:var(--sub);font-weight:600">서울·경기 '+list.length+'곳</small></h3>'+nb+
    (list.length?(near?'<div class="sl-g">'+esc(MYPOS_L)+'에서 가까운 순</div>'+near.map(function(x,i){ return storeItem(x.s, x.d, i===0&&x.d!=null); }).join('')
      :(seoul.length?'<div class="sl-g">서울</div>'+seoul.map(it).join(''):'')+(gg.length?'<div class="sl-g">경기</div>'+gg.map(it).join(''):''))
      :'<div class="todo">가까운 매장은 상담 시 안내드립니다.</div>')+
    (S.storeNote?'<div class="todo" style="margin-top:10px">'+esc(S.storeNote)+'</div>':'')+
    '<button class="cta" data-open="consult" data-store="">방문 예약 상담 신청하기</button>';
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
    '<div class="ff"><label>전달사항</label><textarea id="mUserNote" rows="3" maxlength="500" placeholder="요청사항을 적어 주세요"></textarea></div>'+
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
  if(!name){ alert('이름을 입력해 주세요.'); return; }
  if(phone.length!==11){ alert('010으로 시작하는 11자리 전화번호를 입력해 주세요.'); return; }
  if(window.udakBlocked && window.udakBlocked(phone)){ alert('현재 해당 번호로는 신청이 제한되어 있습니다.\n문의사항은 고객센터로 연락해 주세요.'); return; }
  var t=new Date(), bY=+birth.slice(0,4), bM=+birth.slice(4,6), bD=+birth.slice(6,8);
  if(birth.length!==8||bY<1900||bY>t.getFullYear()||bM<1||bM>12||bD<1||bD>31){ alert('생년월일을 정확히 입력해 주세요. (예: 940101)'); return; }
  var age=t.getFullYear()-bY; if(t.getMonth()+1<bM||(t.getMonth()+1===bM&&t.getDate()<bD)) age--;
  if(age<19){ alert('미성년자 고객님 안내\n\n미성년자 고객님은 개통 시 본인 신분증 확인과\n법정대리인 동의가 필수입니다.\n보호자와 함께 신청해 주세요.'); return; }
  if(!carrier){ alert('현재 이용 중인 통신사를 선택해 주세요.'); return; }
  if(!device){ alert('관심 기기를 선택해 주세요.'); return; }
  var bPhone=$('#mBundlePhone'), bList=$$('#mBundleWrap select[data-bslot]').filter(function(x){return x.id!=='mBundlePhone'&&x.value}).map(function(x){return x.getAttribute('data-bslot')+': '+x.value});
  if(bPhone && !bPhone.value){ alert('워치·태블릿 혜택은 휴대폰과 함께 구매할 때 적용돼요.\n함께 구매할 휴대폰을 선택해 주세요.'); return; }
  if(!$('#mPrivacyCheck').checked){ alert('개인정보 수집 및 이용에 동의해 주세요.'); return; }
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
    if(res.ok){ if(typeof window.fbq!=='undefined') window.fbq('track','Lead'); mnpLead(body); reset(); closeSheet(); showTicket(); }
    else { reset(); res.text().then(function(x){ console.error('Supabase:',x); alert('신청 오류가 발생했습니다. 다시 시도해 주세요.'); }); }
  }).catch(function(e){ console.error(e); reset(); alert('네트워크 오류가 발생했습니다. 다시 시도해 주세요.'); });
}
// 20261019 카톡 상담 접수 뒤 — 폰: 곧바로 카카오톡 앱 채팅방으로 / PC: '카카오톡 채팅방 열기' 버튼(새 창)
//  (PC 웹에선 채팅창이 안 뜨고 PC·폰 카카오톡 앱으로 넘어가서 '안 열린 것처럼' 보였음. 채팅방에 고객이 먼저 한마디 남겨야 우리가 답할 수 있음)
var IS_MOBILE=/Android|iPhone|iPad|iPod|Mobile|Instagram|FBAN|FBAV|KAKAOTALK|NAVER/i.test(navigator.userAgent||'')||((navigator.maxTouchPoints||0)>1&&/Macintosh/.test(navigator.userAgent||''));
function kakaoUrl(){ return String(S.kakao||'').replace(/^http:\/\//,'https://'); }
function kakaoDone(ph, kw){
  var KK=kakaoUrl(), el=$('#kkDone'), sent=false;
  if(kw && KK){ try{ kw.opener=null; kw.location.replace(KK); sent=true; }catch(x){ sent=false; } }   // PC: 미리 열어 둔 새 창 → 카카오톡 채팅방
  if(!el){ document.body.insertAdjacentHTML('beforeend','<div class="kkd" id="kkDone" role="dialog" aria-modal="true"></div>'); el=$('#kkDone'); }
  el.innerHTML='<div class="kkd-w"><button type="button" class="kkd-x" data-kkd-x aria-label="닫기">×</button>'+
    '<div class="kkd-ic">'+KKI+'</div><h3>카카오톡 상담 접수 완료</h3>'+
    '<p class="kkd-t">유플러스 다이렉트 카카오톡 채널 <b>‘UDak’</b> 채팅방에서 바로 상담해 드려요.</p>'+
    '<div class="kkd-tip">채팅방에 <b>“상담 신청했어요”</b> 한마디 남겨 주시면<br>더 빨리 답해 드려요.</div>'+
    (KK?'<a class="kkd-go" href="'+esc(KK)+'"'+(IS_MOBILE?'':' target="_blank" rel="noopener"')+'>'+KKI+'<span>카카오톡 채팅방 열기</span></a>':'')+
    '<p class="kkd-s">'+(IS_MOBILE?'카카오톡이 바로 열리지 않으면 위 버튼을 눌러 주세요.':sent?'휴대폰·PC 카카오톡에 UDak 채팅방이 열려요. 새 창이 안 보이면 위 버튼을 눌러 주세요.':'PC에서는 PC 카카오톡(또는 휴대폰 카카오톡)에 채팅방이 열려요.')+'</p>'+
    (ph?'<p class="kkd-ph"><b>'+esc(ph)+'</b> 번호로 접수됐어요</p>':'')+'</div>';
  el.classList.add('on'); document.body.style.overflow='hidden';
  if(KK && IS_MOBILE) setTimeout(function(){ location.href=KK; }, 250);   // 폰: 메타 신청 신호가 나갈 틈만 두고 바로 카카오톡으로 (20261019: 0.4초 → 0.25초)
}
function closeKakaoDone(){ var el=$('#kkDone'); if(el) el.classList.remove('on'); document.body.style.overflow=''; if(location.hash==='#/apply'){ AP=apInit(); location.hash='#/'; } }
function showTicket(){
  // 20261019 사장님: 그림의 '010-XXXX-XXXX 번호로'는 "영업사원이 010 일반 번호로 전화 드리니 받아 달라"는 뜻 — 고객이 적은 번호를 그 자리에 넣으면 안 된다 (그림 글자 그대로)
  var t=$('#ticket'), o=$('#tkPh'); t.classList.add('on'); document.body.style.overflow='hidden';
  if(o) o.hidden=true;
}
function closeTicket(){ $('#ticket').classList.remove('on'); document.body.style.overflow=''; if(location.hash==='#/apply'){ AP=apInit(); location.hash='#/'; } }

function act(go, el){
  if(!go) return;
  if(go.charAt(0)==='#'){ closeSheet(); location.hash=go; return; }
  if(go==='popular'){ closeSheet(); SORT='sales'; loadRank(); if(location.hash==='#/cat/all') refresh(); else location.hash='#/cat/all'; return; }
  if(go==='soon'){ openSheet(sheetSoon()); return; }
  if(go==='subsidy'){ openSheet(sheetSubsidy()); return; }
  if(go==='qna'){ openSheet(sheetQna()); return; }
  if(go==='special'){ openSheet(sheetSpecial()); return; }
  if(go.indexOf('sec:')===0){ var id={gifts:'giftSec',wear:'wearSec',zero:'zeroSec',rank:'rankSec',pick:'pickSec',pop:'popSec'}[go.slice(4)];
    var goSec=function(){ var el=id&&document.getElementById(id); if(el) window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-60,behavior:'smooth'}); };
    if(!$('#v-home').classList.contains('on')){ location.hash='#/'; setTimeout(goSec,120); } else goSec(); return; }
  if(go==='search'){ closeSheet(); location.hash='#/search'; return; }
  if(go==='consult'){ closeSheet(); openApply(el); }
  else if(go==='contact') openSheet(sheetContact());
  else if(go==='guide') openSheet(sheetGuide());
  else if(go==='store'){ closeSheet(); if(location.hash==='#/search/store') renderSearch($('#q').value); else location.hash='#/search/store'; }   // 20261019: 매장찾기는 검색 화면 '매장' 칸에 고정
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
function apInit(){ return {recv:'',store:'',from:'',phone:'',cap:0,color:'',carrier:'',tier:'',method:'',months:24,watch:'',tablet:'',tv:'',tvTier:'',tvType:'old',tvFix:false,tvOk:false,pick:false,note:'',open:{}}; }
function brandOf(m){ return (m && (/iphone|ipad|watchse|apple/i.test(m.id) || m.cat.indexOf('iphone')>-1)) ? 'apple' : 'samsung'; }
var AP_SLOTS=[['watch','워치','watch'],['tablet','태블릿','tablet'],['tv','TV프리','tvfree']];
function apPhone(){ return AP.phone && AP.phone!=='later' ? byId(AP.phone) : null; }
function apTier(){ var ts=tiersOf('phone'); return ts.filter(function(t){return t.k===AP.tier})[0] || baseTier('phone'); }
function apNeed(m){ var g=GUIDE[m.id]; return g&&g.fee ? g.plan : (kindOf(m)==='tablet'?105000:95000); }
// 함께 구매할 수 없는 이유 (없으면 '')
function apReason(m){
  var k=kindOf(m), ph=apPhone(), t=apTier(), fee=(t&&t.fee)||0;
  if(SO(m) && !EDIT) return '일시품절이에요';   // 20261020
  if(k==='tvfree') return '';
  if(k==='tablet' && ph && brandOf(ph)==='apple') return '갤럭시 휴대폰과 함께 구매할 때 선택할 수 있어요';
  if(k==='watch' && ph && brandOf(ph)!==brandOf(m)) return brandOf(ph)==='apple' ? '아이폰은 애플워치와 함께 구매할 수 있어요' : '갤럭시 휴대폰은 갤럭시 워치와 함께 구매할 수 있어요';
  var need=apNeed(m); if(fee<need){ var tt=tiersOf('phone').filter(function(x){return (x.fee||0)>=need})[0]; return '월 '+won(need)+' 이상 요금제'+(tt&&tt.title?'('+tt.title+' 이상)':'')+'에서 선택할 수 있어요'; }
  return '';
}
function apValidate(){
  var pm0=apPhone(); if(pm0 && !EDIT){ if(SO(pm0)){ AP.phone=''; AP.cap=0; AP.color=''; } else if(optSO(pm0,AP.cap)){ var fo=firstOkOpt(pm0); if(fo>=0) AP.cap=fo; } }   // 20261020 품절은 신청 못 함
  if(AP.wpromo && (AP.phone!==AP.wpm || AP.tier!==AP.wpromo.b)){ AP.wpromo=null; AP.wpm=''; AP.watch=''; AP.wcolor=''; }   // 20261021 휴대폰·요금제를 바꾸면 워치 혜택도 빠짐
  if(!apAddOn()){ if(!AP.wpromo) AP.watch=''; AP.tablet=''; if(!AP.tvFix){ AP.tv=''; AP.tvOk=false; } }
  if(AP.phone==='none' && !(AP.tv && AP.tvType==='old')) AP.phone='';
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
  if(AP && AP.wpromo && m && m.id===AP.wpromo.watch) return wpCalc(AP.wpromo);   // 20261021 워치 혜택(0원)
  var rs=sheetRows(m); if(!rs.length) return null;
  var r=rs.filter(function(x){return !x.so})[0]||rs[0], g=r.g, ts=tiersOf(g), t=g==='tvfree'?tvTier(r):ts[0];
  var c=rowCalc(r,'all',t); if(!c) return null;
  var after=c.pb!=null?c.pb:c.sel, mm=AP.months, noint=noInterest(r);
  return {r:r, t:t, c:c, after:after, monthly:mm===0||after===0?0:won10(noint?after/mm:after*RATE[mm]/mm), noint:noint};
}
function apChips(key, items, cur, n){
  return '<div class="cgrid" style="--n:'+n+'">'+items.map(function(x){
    return '<button type="button" class="cg'+(String(x[0])===String(cur)?' on':'')+(x[2]?' dis':'')+'" data-ap="'+key+'" data-v="'+esc(x[0])+'"'+(x[2]?' disabled':'')+'>'+esc(x[1])+'</button>'; }).join('')+'</div>';
}
// 20261019 신청서 간단하게 (카톡 간편 신청창처럼): 고른 휴대폰 + 월 기기 할부금·총 기기 지원금 → 컬러·용량·통신사 → 고객 정보 → 버튼
//  요금제·할인 방식·할부는 상세에서 고른 그대로 (화면엔 '…기준' 한 줄만). 워치·태블릿 함께 구매를 켜 둔 때만 예전처럼 요금제 칸이 나옴
function apPhoneHtml(){
  var m=apPhone(), h='';
  if((AP.phone && !AP.pick)){
    var os0=m?optsOf(m):[], cs0=m?colorsOf(m):[], capNm=os0[AP.cap]&&os0[AP.cap].nm!=='기본'?os0[AP.cap].nm:'', colNm=AP.color||(cs0.length===1?cs0[0].nm:'');
    // 20261021 사장님(2차): 신청서는 ① 컬러·용량 ② 고객 정보 두 칸만 — 위엔 고른 휴대폰 한 줄 + 요금제 포함 월 금액만
    //   (기기값 계산 내역은 상세 '내 가격'에서 이미 봄 — 그래서 큰 금액표는 뺌)
    var pc0=m?apPhoneCalc():null, typ=AP.carrier?(AP.carrier+' '+(AP.carrier==='LG U+'?'기기변경':'번호이동')):'', fee0=apMonthFee(pc0);
    var sub=m?[capNm,typ,AP.wpromo?tierNmOf(AP.wpromo.b)+' 요금제':''].filter(Boolean).join(' · '):(AP.phone==='none'?'TV프리만 신청해요':'상담하면서 함께 골라 드릴게요');
    // 20261021 사장님(3차): 큰 금액은 '월 기기값', 밑에 '+ 월 요금' (요금제까지 합친 금액은 크게 안 보여 줌) · 일시납이면 기기값
    var pr=pc0?'<div class="ap1-mp"><b>'+(pc0.mm===0?'기기값 '+wz(pc0.after):'월 '+wz(pc0.monthly||0))+'</b>'+(fee0!=null?'<small>+ 월 요금 '+won(fee0)+'</small>':'')+'</div>'
      :m?'<div class="ap1-mp"><small>가격은 상담 때 안내</small></div>':'';
    h+='<div class="ap1-pick ap1-mini"><div class="ap1-dev"><div class="ap1-img">'+(m?im(apColorImg(m),'',true,m.nm):'')+'</div>'+
      '<div class="ap1-t"><b>'+esc(m?m.nm:(AP.phone==='none'?'휴대폰은 바꾸지 않아요':'상담 후 결정할게요'))+(AP.wpromo?'<em class="ap1-wp">+ '+esc(wpName(AP.wpromo))+' '+wz(AP.wpromo.price||0)+'</em>':'')+'</b>'+(sub?'<span>'+esc(sub)+'</span>':'')+'</div>'+pr+
      '<button type="button" class="ap1-chg" data-ap-act="change">변경</button></div></div>';
  } else {
    var list=models().filter(function(x){return !x.hidden&&kindOf(x)==='phone'});
    h+='<div class="qk-l">휴대폰 <span class="req">*</span></div>'+
      '<label class="ap-search"><svg class="ico" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input type="search" id="mDeviceSearch" placeholder="모델명을 검색하세요 (예: S26, 아이폰)" autocomplete="off"></label>'+
      '<div class="ap-list" id="apList">'+list.map(function(x){
        return '<div class="ap-li" data-nm="'+esc((x.nm+' '+x.id).toLowerCase().replace(/\s/g,''))+'"><div class="ap-li-img">'+im(mImg(x),'','',x.nm)+'</div><b>'+esc(x.nm)+(SO(x)?' <small>일시품절</small>':'')+'</b>'+
          '<button type="button" class="ap-pick'+(x.id===AP.phone?' on':'')+'" data-ap-pick="'+esc(x.id)+'"'+(SO(x)&&!EDIT?' disabled':'')+'>'+(SO(x)&&!EDIT?'일시품절':(x.id===AP.phone?'선택됨':'선택하기'))+'</button></div>'; }).join('')+
      // 20261016: '상담 후 결정할게요' 줄 삭제 (휴대폰은 꼭 골라서 신청)
      (AP.tv&&AP.tvType==='old'?'<div class="ap-li later" data-nm="휴대폰변경없음tv프리만"><b>휴대폰은 바꾸지 않아요 (TV프리만)</b><button type="button" class="ap-pick" data-ap-pick="none">선택하기</button></div>':'')+'</div>';
  }
  if(m && !AP.pick){
    var os=optsOf(m), cs=colorsOf(m);
    // ① 컬러·용량 (통신사는 상세에서 이미 골랐으면 안 물음 — 안 골랐을 때만 여기서)
    var t1=cs.length>1&&os.length>1?'컬러 · '+optLabel(m)+eul(optLabel(m))+' 선택해 주세요.':cs.length>1?'컬러를 선택해 주세요.':os.length>1?optLabel(m)+eul(optLabel(m))+' 선택해 주세요.':'현재 이용 중인 통신사를 선택해 주세요.';
    if(cs.length>1||os.length>1||!AP.carrier) h+='<div class="ap-stp"><b>1</b><span>'+esc(t1)+'</span></div>';
    // 컬러는 꼭 직접 고르게 (안 고르면 신청 안 됨) — 아직 안 골랐으면 처음부터 분홍 테두리 + '컬러를 선택해 주세요.'
    if(cs.length>1) h+='<div class="qk-car qk-col'+(AP.color?'':' need')+'" id="apColorRow"><div class="qk-l">컬러 <span class="req">*</span>'+(AP.color?'':'<em class="need-t">컬러를 선택해 주세요.</em>')+'</div><div class="qk-cc">'+cs.map(function(c){
        return '<button type="button" class="'+(AP.color===c.nm?'on':'')+'" data-ap="color" data-v="'+esc(c.nm)+'"><i style="--c:'+esc(c.hex||'#ddd')+'"></i>'+esc(c.nm)+'</button>'; }).join('')+'</div></div>';
    if(os.length>1) h+='<div class="qk-car"><div class="qk-l">'+esc(optLabel(m))+'</div>'+apChips('cap',os.map(function(o,i){ var so=!!(o.row&&o.row.so); return [i,o.nm+(so?' (품절)':''),so&&!EDIT]; }),AP.cap,Math.min(os.length,4))+'</div>';
    if(AP.wpromo){ var wcs=colorsOf(byId(AP.wpromo.watch)||{id:''}); if(wcs.length>1) h+='<div class="qk-car qk-col"><div class="qk-l">워치 컬러 <small>(선택)</small></div><div class="qk-cc">'+wcs.map(function(c){
        return '<button type="button" class="'+(AP.wcolor===c.nm?'on':'')+'" data-ap="wcolor" data-v="'+esc(c.nm)+'"><i style="--c:'+esc(c.hex||'#ddd')+'"></i>'+esc(c.nm)+'</button>'; }).join('')+'</div></div>'; }
    if(!AP.carrier) h+='<div class="qk-car" id="apCarRow"><div class="qk-l">현재 이용 중인 통신사 <span class="req">*</span></div>'+apChips('carrier',CARRIERS.map(function(c){return [c,c]}),AP.carrier,4)+'</div>';
  }
  return h;
}
// 신청서 위 한 줄·아래 고정 줄: 요금제까지 합친 월 금액 (할부금 + 요금제, 일시납이면 요금제만) — 요금제 금액이 없으면 null
function apMonthTotal(pc){ if(!pc || !pc.fee) return null; return (pc.mm===0?0:(pc.monthly||0))+(pc.feeAfter||0)+(AP&&AP.wpromo?wpLineFee(AP.wpromo,pc.fee):0); }
// 20261021(3차): 매달 내는 요금만 (요금제 — 선택약정이면 할인된 금액 + 워치 이용료가 있으면 더함) — 요금제 금액이 없으면 null
function apMonthFee(pc){ if(!pc || !pc.fee) return null; return (pc.feeAfter||0)+(AP&&AP.wpromo?wpLineFee(AP.wpromo,pc.fee):0); }
// 20261019 받는 방법: 택배(당일 발송) / 매장에서 수령하기 — 상담 방법(전화·카톡)과는 따로 고르는 칸.
//  매장에서 수령하기 → 어디서 오세요(구·동, 고객이 직접 적음 → 그 동네 기준으로 가까운 매장 정렬 + 거리·교통비 분석용) → 수령 매장(현재 위치로도 정렬 가능) → 고른 매장 주소·거리·길찾기
var TRUCK_I='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 6.5h11v9.5h-11zM13.5 9.5h4l3 3.5v3h-7"/><circle cx="6.5" cy="17.5" r="1.7"/><circle cx="17" cy="17.5" r="1.7"/></svg>';
function apRecvHtml(){
  // 20261021 사장님(2차): 신청서는 ① 컬러·용량 ② 고객 정보만 — '받는 방법(택배/매장 수령)' 칸은 뺌 (상담 때 정함, 고객이 안 고른 값을 지어서 남기지 않음)
  //   매장 화면에서 '이 매장 상담'으로 들어온 경우만 어느 매장인지 한 줄 보여 줌 (CRM 에도 그 매장으로 남음)
  if(!AP.phone || AP.pick || !(AP.recv==='store' && AP.store)) return '';
  return '<div class="ap-recv-mini">'+PIN_I+'<span><b>'+esc(AP.store)+'</b> 상담으로 접수돼요</span></div>';
}
// 신청서 '어디서 오세요' → 그 동네 기준으로 가까운 매장 (회사에 있어도 집 기준으로 고를 수 있게). 매장을 아직 안 골랐으면 가장 가까운 매장을 골라 둠
function apFromFind(){
  var fi=$('#mFromIn'); if(fi && AP) AP.from=fi.value;
  var q=String((AP&&AP.from)||'').trim(); if(!q){ if(fi) fi.focus(); return; }
  var b=$('[data-ap-from]'); if(b){ b.disabled=true; b.textContent='찾는 중…'; }
  geoFind(q, function(g){
    if(g){ MYPOS=g; MYPOS_L=q; FROMLL=g; FROMQ=q; NEAR_ERR=''; var best=nearestStore(); if(best){ nearLog('store_near', best.nm+' · '+distBand(best.d)+' · 동네 검색'); if(AP && !AP.store) AP.store=best.nm; } }
    else NEAR_ERR='‘'+q+'’ 위치를 찾지 못했어요. 동 이름으로 적어 주세요. (예: 인창동)';
    apRefresh();
  });
}
// 신청서 '현재 위치로 찾기' — 위치 허용하면 매장 목록을 가까운 순으로, 매장을 아직 안 골랐으면 가장 가까운 매장을 골라 둠
function apNear(){
  if(!navigator.geolocation){ NEAR_ERR='이 브라우저에서는 위치를 확인할 수 없어요.'; apRefresh(); return; }
  var b=$('[data-ap-near]'); if(b){ b.disabled=true; var bs=b.querySelector('span'); if(bs) bs.textContent='내 위치 확인 중…'; }
  navigator.geolocation.getCurrentPosition(function(p){ MYPOS=[p.coords.latitude, p.coords.longitude]; MYPOS_L='내 위치'; NEAR_ERR='';
      var best=nearestStore(); if(best){ nearLog('store_near', best.nm+' · '+distBand(best.d)); if(AP && !AP.store) AP.store=best.nm; } apRefresh(); },
    function(er){ nearLog('store_near_fail', (er&&er.code===1)?'위치 거부':'위치 확인 실패'); NEAR_ERR=(er&&er.code===1)?'위치 권한이 꺼져 있어요. 동네를 적고 찾거나 매장을 직접 골라 주세요.':'위치를 확인하지 못했어요. 동네를 적고 찾거나 매장을 직접 골라 주세요.'; apRefresh(); },
    {enableHighAccuracy:false, timeout:10000, maximumAge:300000});
}
// 신청서 금액: 월 기기 할부금 + 총 기기 지원금만 (통신 요금 합친 금액은 안 보여 줌)
function apPriceHtml(){
  var pc=apPhoneCalc();
  if(!pc) return '<div class="ap1-price"><div class="ap1-ask">가격은 상담 시 안내드려요</div></div>';
  var out=num(pc.c.out)||0, sup=Math.max(0,out-pc.after), mm=pc.mm, lab, big, sub;
  if(pc.after===0){ lab='월 기기 할부금'; big='0원'; sub='할부금 없음'; }
  else if(mm===0){ lab='기기값 (일시납)'; big=won(pc.after); sub='한 번에 결제'; }
  else { lab='월 기기 할부금'; big=won(pc.monthly)+'<small> / 월</small>'; sub=mm+'개월 할부 · 할부이자 포함'; }
  return '<div class="ap1-price">'+
    '<div class="ap1-r"><span>'+lab+'<small>'+sub+'</small></span><b class="ap1-v">'+big+'</b></div>'+
    '<div class="ap1-r"><span>총 기기 지원금</span><b>'+won(sup)+'<small> 지원</small></b></div>'+
    // 20261020 사장님: 지원금 맨 밑에 계산 — '[제품명] 기기값 − 공시지원금 − 유플러스 다이렉트 지원금 = 남은 기기값' (지원금이 있을 때만)
    //   선택약정이면 공시지원금 줄 없음 · 두 줄 합이 늘 (기기값 − 남은 기기값)과 맞게 나눔
    (sup>0&&out?(function(){ var pubA=pc.method==='pub'?Math.min(pc.c.pub||0, sup):0, ourA=sup-pubA;
      return '<div class="ap1-eq"><div><span>'+esc(pc.m.nm)+' 기기값</span><b>'+won(out)+'</b></div>'+
        (pubA>0?'<div><span>− 공시지원금</span><b>'+won(pubA)+'</b></div>':'')+
        (ourA>0?'<div><span>− 유플러스 다이렉트 지원금</span><b>'+won(ourA)+'</b></div>':'')+
        '<div class="sum"><span>= 남은 기기값</span><b>'+wz(pc.after)+'</b></div></div>'; })():'')+
    '<div class="ap1-base">'+esc([pc.type==='chg'?'기기변경':'번호이동', tierTitle(pc.t), pc.method==='sel'?'선택약정':'공시지원금'].join(' · '))+' 기준</div></div>';
}
function apColorImg(m){ var cs=colorsOf(m), c=cs.filter(function(x){return x.nm===AP.color})[0]||cs[0]; return (c&&c.img)||mImg(m); }
function apPlanHtml(){
  if(AP.phone==='none') return '';
  var ts=tiersOf('phone'), t=apTier(), pc=apPhoneCalc(), h='<section class="ap-sec"><div class="ap-h"><b>02</b>신청 내용</div>';
  // 20261019: 통신사는 위(컬러·용량 아래)에서 고름 — 이 칸은 워치·태블릿 함께 구매를 켜 둔 때만 나옴
  h+='<div class="ap-f ap-row"><div class="ap-l">요금제</div><div class="ap-r"><select class="csel" id="mPlanSel">'+ts.map(function(x){ return '<option value="'+esc(x.k)+'"'+(t&&x.k===t.k?' selected':'')+'>'+esc(tierTitle(x))+'</option>'; }).join('')+'</select>'+
    (PLAN_NOTE?'<div class="cpick-hint">'+PLAN_NOTE+'</div>':'')+apPerk(t)+'</div></div>';
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
function apTvOn(){ return apAddOn() || !!(AP&&AP.tvFix); }   // TV프리 상세에서 신청하면 설정과 상관없이 TV프리 칸을 보여줌
function apAddHtml(){
  if(!apTvOn()) return '';
  var all=models().filter(function(x){return !x.hidden}), h='<section class="ap-sec"><div class="ap-h"><b>03</b>'+(apAddOn()?'요금제별 혜택 <small>(선택사항)</small>':'TV프리')+'</div>'+
    (AP.note?'<div class="ap-note">'+AP.note+'</div>':'');
  AP_SLOTS.forEach(function(s){
    if(!apAddOn() && s[0]!=='tv') return;
    // 지금 조건(요금제·휴대폰 브랜드)으로 고를 수 없는 건 아예 안 보이게
    var list=all.filter(function(x){return kindOf(x)===s[2] && !apReason(x)}); if(!list.length) return;
    h+='<div class="ap-f">'+(apAddOn()?'<div class="ap-l">'+s[1]+'</div>':'')+'<div class="ap-cards">'+list.map(function(x){
      var on=AP[s[0]]===x.id, ac=apAddCalc(x), g=GUIDE[x.id], open=on||AP.open[x.id];
      var dev=ac?(ac.after===0?'기기값 0원':'기기 월 '+won(ac.monthly)+(AP.months===0?'':' ('+AP.months+'개월)')):'기기값은 상담 시 안내';
      var fee=s[0]==='tv'?'이용료 월 9,350원부터':(g&&g.fee?'회선 이용료 월 '+won(g.fee)+' (요금제 포함)':'');
      return '<div class="ap-card'+(on?' on':'')+'"><button type="button" class="ap-card-main" data-ap="'+s[0]+'" data-v="'+esc(x.id)+'">'+
        '<span class="ap-card-img">'+im(mImg(x),'','',x.nm)+'</span><span class="ap-card-t"><b>'+esc(x.nm)+'</b><i>'+esc(dev)+'</i>'+(fee?'<em>'+esc(fee)+'</em>':'')+'</span><span class="ap-chk"></span></button>'+
        (g?'<button type="button" class="ap-cond" data-ap-cond="'+esc(x.id)+'">'+(open?'이용 조건 접기 ▴':'이용 조건 보기 ▾')+'</button>'+
          (open?'<ul class="ap-cond-list">'+g.items.map(function(it){ return '<li><b>'+esc(it.b)+'</b><span>'+esc(it.p).replace(/\n/g,' ')+'</span></li>'; }).join('')+'</ul>':''):'')+
        '</div>';
    }).join('')+'</div>';
    if(s[0]==='tv' && AP.tv){
      var tm=byId(AP.tv), ts=tiersOf('tvfree');
      h+='<div class="ap-tvnote"><b>오직 U+ 고객님께만 드리는, 유플러스 다이렉트 특별 혜택</b>이에요. U+ 인터넷TV를 1년 이상 2년 미만, 500MB 이상 요금제로 이용 중인 고객님이라면 신청하실 수 있어요.'+
        '<br>TV프리 이용료는 첫 9개월 월 '+won(TV_FEE)+', 10개월 차부터 월 '+won(TV_FEE2)+'이에요. (약정 36개월)</div>';   // 20261016: '이용 중이에요(필수)' 체크 뺌 — 대상 여부는 전산 조회로 우리가 확인
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
  // 20261020 깔끔하게: '이 조건에선 … 24개월 기준 약 …' → '… 2년간 … 더 저렴해요' (월 차이로 오해 안 하게 '2년간'은 남김)
  return '<b class="adv"><i>💡</i><span><em>'+(cm.best==='pub'?'공시지원금':'선택약정')+'</em>이 2년간 '+won(d)+' 더 저렴해요'+(cur&&cur!==cm.best?' · 눌러서 바꿔 보세요':'')+'</span></b>';
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
    r.cs=Math.min(pub||0,r.sup); r.os=r.sup-r.cs; r.csNm=pubNm;   // 20261016: 직원용 — 이통사 지원금 / 유플러스 다이렉트 지원금 따로 (출고가를 넘으면 이통사 몫 먼저, 나머지가 우리 몫)
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
  if(apTvOn() || AP.wpromo) AP_SLOTS.forEach(function(s){
    if(!apAddOn() && s[0]!=='tv' && !(s[0]==='watch' && AP.wpromo)) return;
    var x=AP[s[0]]&&byId(AP[s[0]]); if(!x) return; var isWp=!!(AP.wpromo&&x.id===AP.wpromo.watch), r=rec(s[1],isWp?wpName(AP.wpromo):x.nm,s[0],x), ac=apAddCalc(x);
    if(!ac){ r.ask=true; row(r.dev,'기기값',null,'',null,'','상담 시 안내'); }
    else {
      // 20261021 사장님: 워치 혜택은 계산식 없이 '출고가 529,100 → 0원'만 — 이통사·우리 지원금으로 나누지 않고 지원금 합계에도 안 넣음 (CRM 카드도 이 한 줄)
      if(isWp){ r.promo=true; row(r.dev,'출고가',ac.c.out); row(r.dev,'지원 후 기기값',ac.after,'',null,'sum'); r.after=ac.after; }
      else if(s[0]==='tv'){ row(r.dev,'출고가',ac.c.out); if(ac.c.out>ac.after) row(r.dev,'유플러스 다이렉트 지원금',-(ac.c.out-ac.after),'',null,'minus'); r.sup=ac.c.out-ac.after; r.after=ac.after; r.cs=Math.min(ac.c.pb!=null?ac.c.pub:0,r.sup); r.os=r.sup-r.cs; r.csNm='기존 고객 지원금'; row(r.dev,'지원 후 기기값',ac.after,r.sup?'총 '+won(r.sup)+' 지원':'',null,'sum'); }
      else dev(r, ac.c, ac.c.pb!=null?ac.c.pub:0, '이통사 지원금', '', ac.after);
      if(s[0]==='tv'){ if(ac.after>0){ r.up+=ac.after; row(r.mon,'기기값',ac.after,'별도'); } }
      else if(AP.months===0){ r.up+=ac.after; row(r.mon,'기기값 일시납',ac.after,'한 번에 결제해요'); }
      else { r.sub+=ac.monthly; row(r.mon,'기기 할부금',ac.monthly,ac.after===0?'기기값 0원이라 할부금이 없어요':AP.months+'개월'+(ac.noint?' · 이자 없음':' · 할부이자 포함')); }
    }
    if(s[0]==='tv'){ out.tv=true; r.sub+=TV_FEE; row(r.mon,'TV프리 이용료',TV_FEE,'첫 9개월 · 10개월 차부터 '+won(TV_FEE2)); }
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
  // TV프리만(휴대폰 기간 흐름이 없을 때): 10개월 차부터 이용료 7,700원
  if(!out.flow.length && out.tv && out.total){
    out.flow.push({l:'처음 9개월',a:out.total,sub:'TV프리 이용료 월 '+won(TV_FEE)});
    out.flow.push({l:'10개월 차부터',a:out.total-(TV_FEE-TV_FEE2),sub:'월 '+won(TV_FEE2)+' 요금제로 바꾸시면',tip:null});
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
  var h='<section class="ap-sec ap-sumsec"><div class="ap-h"><b>04</b>예상 월 납부금액</div>';
  if(!recs.length||(!S2.total&&!S2.upfront)){ h+='<div class="ap-sub">휴대폰과 조건을 고르시면 예상 금액을 바로 보여드려요.</div>'; return h+'</section>'; }
  AP.tip=AP.tip||{};
  var tipB=function(k,t){ return '<button type="button" class="tipb'+(AP.tip[k]?' on':'')+'" data-ap-tip="'+k+'" aria-label="설명 보기">?</button>'+(AP.tip[k]?'<div class="tip-bub">'+t+'</div>':''); };
  var line=function(l,v,cls){ return '<div class="ms-r'+(cls?' '+cls:'')+'"><span>'+l+'</span><b>'+v+'</b></div>'; };
  // 위: 월 예상 납부금액 + 기간별
  var flow=S2.flow, f1=flow[0], f2=flow[1];
  h+='<div class="ms-top'+(f2?'':' solo')+'"><div class="ms-main"><span class="ms-l">월 예상 납부금액</span><b class="ms-v">'+won(S2.total)+'<small> / 월</small></b>'+
    '<span class="ms-h">'+(!pc&&S2.tv?'TV프리 이용료 · 약정 36개월':pc&&pc.mm===0?'통신 요금 기준 · 기기값은 일시납':'기기 할부금 + 통신 요금 ('+(AP.months||24)+'개월 기준)')+'</span>'+(S2.upfront?'<span class="ms-h">+ 일시납 '+won(S2.upfront)+'</span>':'')+'</div>';
  if(f2) h+='<div class="ms-flow">'+
      '<div class="ms-f"><i class="ic"><svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M4 10h16M9 3v4M15 3v4M9 14h.01M12 14h.01M15 14h.01"/></svg></i><div><span>'+f1.l+'</span><b>'+won(f1.a)+'<small> / 월</small></b><em>'+f1.sub+'</em></div></div>'+
      '<div class="ms-f"><i class="ic"><svg viewBox="0 0 24 24"><path d="M12 5v14M6 13l6 6 6-6"/></svg></i><div><span>'+f2.l+(f2.tip?tipB(f2.tip.k,f2.tip.t):'')+'</span><b>'+won(f2.a)+'<small> / 월</small></b><em>'+f2.sub.replace('바꾸시면','변경 시')+'</em></div></div>'+
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
  adds.forEach(function(r){ r.mon.forEach(function(x){ if(typeof x.a==='number'&&x.a>0&&x.l!=='기기값 일시납') mon+=line(x.l.indexOf(r.kind)===0?esc(x.l):esc(r.kind)+' '+esc(x.l.replace('기기 ','')),won(x.a)); }); });
  mon+=line('월 합계',won(S2.total),'sum');
  // 아래 오른쪽: 기기 구매 혜택
  var ben='', BA=(A&&A.after!=null)?A:(!A?adds.filter(function(r){return r.after!=null})[0]:null);
  if(BA){
    BA.dev.forEach(function(x){
      if(x.l==='출고가') ben+=line('출고가',won(x.a));
      else if(x.cls==='minus') ben+=line((x.l==='유플러스 다이렉트 지원금'&&BA.sk!=='tv'?'추가 지원금 (유플러스 다이렉트)':esc(x.l)+(x.sub?' ('+esc(x.sub)+')':'')),'-'+won(-x.a),'minus');
    });
    ben+=line('지원 후 기기값',wz(BA.after),'sum');
  } else ben+='<div class="ms-ask">기기값은 상담 시 안내드려요</div>';
  adds.forEach(function(r){ if(r.sup&&r!==BA) ben+=line(esc(r.kind)+' 지원금','-'+won(r.sup),'minus'); });
  h+='<div class="ms-grid">'+
    '<div class="ms-card"><div class="ms-ch"><i class="ic won">₩</i>월 납부 구성'+tipB('mon','기기 할부금은 할부이자(연 5.9%)가 포함된 금액이에요. 통신 요금은 고르신 요금제 기준이에요.')+'</div>'+mon+'</div>'+
    '<div class="ms-card"><div class="ms-ch"><i class="ic"><svg viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13M3 12h18M12 8c-1.5-3-5.5-3.5-5.5-1S9 8 12 8c3 0 7-.5 5.5-2.5S13.5 5 12 8z"/></svg></i>기기 구매 혜택'+tipB('ben','출고가에서 지원금을 빼고 남은 기기값을 할부로 나눠 내요.')+'</div>'+ben+'</div>'+
  '</div>';
  return h+'</section>';
}
function apInfoHtml(){
  return '<div class="ap-info" id="consultForm">'+   // 20261021 사장님(2차): ② 고객 정보 — 이름·연락처·생년월일
    '<div class="ap-stp"><b>2</b><span>고객 정보를 입력해 주세요.</span></div>'+
    '<div class="ff"><label>이름 <span class="req">*</span></label><input type="text" id="mUserName" placeholder="이름을 입력해 주세요" autocomplete="name"></div>'+
    '<div class="ff"><label>연락처 <span class="req">*</span></label><div class="phone3"><input type="text" id="mPhone1" value="010" readonly tabindex="-1"><span>-</span><input type="tel" id="mPhone2" maxlength="4" inputmode="numeric" placeholder="0000"><span>-</span><input type="tel" id="mPhone3" maxlength="4" inputmode="numeric" placeholder="0000"></div></div>'+
    '<div class="ff"><label>생년월일 <span class="req">*</span></label><input type="text" id="mUserBirth" inputmode="numeric" maxlength="8" placeholder="예: 940101"></div>'+
    '<div class="ff" style="display:none"><label>전달사항</label><textarea id="mUserNote" rows="3" maxlength="500"></textarea></div>'+
    '<label class="agree"><input type="checkbox" id="mPrivacyCheck"> 개인정보 수집 및 이용 동의 (필수)<button type="button" data-privacy>자세히 보기 ›</button></label>'+
    '<div class="privacy-txt" id="privacyTxt">유플러스 다이렉트(이하 "회사")는 온라인 상담 신청 접수 및 상담 안내를 위해 아래와 같이 개인정보를 수집·이용합니다.<br><br>'+
    '· 항목: 이름, 전화번호, 생년월일, 희망기종, 현재 통신사, 받는 방법(매장에서 받는 경우 수령 매장·출발 동네)<br>· 목적: 온라인 상담 신청 접수, 상담 연락 및 구매·개통 안내<br>· 보유 기간: 수집일로부터 6개월<br><br>'+
    '동의를 거부할 권리가 있으며, 거부 시 온라인 상담 신청이 제한될 수 있습니다. 수집된 개인정보는 제3자에게 제공되지 않으며, 보유 기간 종료 후 즉시 파기됩니다.</div>'+
    // 20261021 사장님(GPT 안에서 가져옴): 신청 버튼 위 안내 — '누르면 바로 결제되나?' 걱정 줄이기 (확인 화면은 따로 안 둠)
    '<div class="ap-guide"><b><i>i</i>상담 신청 안내</b><ul><li>상담 신청은 구매 확정이나 결제가 아닙니다.</li><li>전문 상담사가 고객님께 연락드려 최종 조건을 안내해 드립니다.</li></ul></div></div>';
}
// 20261016: 신청 버튼 2개 — 상담 예약(전화) / 카톡 예약(신청서는 똑같이 CRM에 저장 + 우리 카카오톡 상담 채널 열기, CRM엔 '카톡 상담 요청'으로 표시)
function apBtnsHtml(){
  if(AP && AP.mode==='kakao') return '<div class="ap-btns"><button type="button" class="cta cta-kakao" id="mKakaoBtn">'+KKI+'<span class="rf-submit-label">카톡으로 상담 시작하기</span></button></div>';
  // 20261020 사장님: 카톡 상담은 하나도 안 들어옴 → 신청서도 '카톡 예약 신청하기' 버튼은 빼고 '상담 예약 신청하기' 하나만
  // 20261021 사장님(GPT 안에서 가져옴): 그 '상담 예약 신청하기'는 본문 맨 아래 대신 아래 고정 줄 버튼으로 옮김 (늘 보이게) — apBarHtml
  return '';
}
function apBarHtml(){
  // 20261019: 휴대폰은 월 기기 할부금 + 지원금만 (통신 요금 합친 금액 X). TV프리만 신청할 땐 예전처럼 예상 월 금액
  // 20261021 사장님(GPT 안에서 가져옴): 아래 고정 줄 = 상세 아래 줄과 같은 말('번호이동 공시지원금 1,078,100원 폴드 8 구매 가능') + 바로 [상담 예약 신청하기]
  //   (예전 [신청서 작성]은 입력칸으로 내려가기만 했고, 진짜 신청 버튼은 맨 아래에 따로 있었음)
  var pc=apPhoneCalc(), m=apPhone(), t, kk=!!(AP&&AP.mode==='kakao');
  if(pc && m){ var sn=m.nm.replace(/^갤럭시\s+/,'');
    t=!AP.carrier?'현재 이용 중인 <b>통신사</b>를 고르면 내 가격이 바로 나와요':
      '<span class="nw">'+(pc.type==='chg'?'기기변경':'번호이동')+' '+(pc.method==='sel'?'선택약정':'공시지원금')+'</span> <b class="nw">'+wz(pc.after)+'</b><br><span class="nw"><i>'+esc(sn)+(AP.wpromo?' + '+esc(wpShort(AP.wpromo)):'')+'</i> 구매 가능</span>'; }
  else if(m) t='상담 신청하시면 <b>내 가격</b>을 안내해 드려요';
  else { var tot=apSummary().total; t=tot?'예상 월 <b>'+won(tot)+'</b>':'조건을 골라 주세요'; }
  return '<div class="ap-bar-t">'+t+'</div>'+(kk?'<button type="button" class="ap-bar-b" data-ap-act="go">신청서 작성</button>':
    '<button type="button" class="ap-bar-b" id="mSubmitBtn"><span class="rf-submit-label">상담 신청하기</span><svg class="cta-ar" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg></button>');   // GPT 안 글자 그대로 '상담 신청하기 >'
}
function renderApply(full){
  if(!AP) AP=apInit();
  if(full || !$('#apCond')){
    // 20261019: 카드 하나에 — 고른 휴대폰·금액·컬러·통신사 → 고객 정보 → 버튼 (카톡 간편 신청창처럼)
    $('#apBody').innerHTML='<section class="ap-sec ap-one"><div id="apCond"></div><div id="apSum"></div>'+apInfoHtml()+apBtnsHtml()+'</section>';
  }
  $('#apCond').innerHTML=apPhoneHtml()+(apAddOn()?apPlanHtml():'')+apAddHtml()+apRecvHtml();   // 20261019: 맨 끝에 '받는 방법'
  $('#apSum').innerHTML=(!apPhone()&&(AP.tv||AP.watch||AP.tablet))?apSumHtml():'';   // 금액표는 TV프리만 신청할 때만 (휴대폰은 위에 월 기기 할부금·총 기기 지원금)
  $('#apBar').innerHTML=apBarHtml();
  Array.prototype.forEach.call(document.querySelectorAll('#apBody .ap-h > b'),function(b,i){ b.textContent=(i<9?'0':'')+(i+1); });
  Array.prototype.forEach.call(document.querySelectorAll('#apBody .ap-stp > b'),function(b,i){ b.textContent=i+1; });   // 20261021 ① 컬러·용량 ② 고객 정보
  AP.note='';
}
function apRefresh(){ var y=window.scrollY; apValidate(); renderApply(false); window.scrollTo(0,y); }
// 20261016: 이탈 분석(udak-funnel.js)용 — 신청서를 어디까지 채웠는지만 (이름·번호 같은 내용은 넘기지 않음). 신청서를 안 열었으면 null
window.udakFormState=function(){
  try{
    if(!AP || !$('#mUserName')) return null;
    var dl=function(s){ var el=$(s); return el?String(el.value||'').replace(/\D/g,'').length:0; };
    return { model:AP.phone||'', phone:!!AP.phone, carrier:!!AP.carrier||AP.phone==='none', name:!!String($('#mUserName').value||'').trim(),
      tel:(dl('#mPhone2')+dl('#mPhone3'))>=8, birth:dl('#mUserBirth')>=6, agree:!!($('#mPrivacyCheck')&&$('#mPrivacyCheck').checked) };
  }catch(x){ return null; }
};
function apSetFrom(m){
  AP=apInit();
  if(m){ var k=kindOf(m);
    if(k==='phone'){ AP.phone=m.id; AP.cap=OPT[m.id]||0; AP.color=PICK[m.id]||''; var s=SEL[m.id]||{}; AP.carrier=s.carrier||''; AP.method=s.method||''; if(s.months!=null) AP.months=s.months; AP.tier=TIER[m.id]||'';
      var wp=wpFor(m); if(wp && AP.tier===wp.b){ AP.watch=wp.watch; AP.wpromo=wp; AP.wpm=m.id; } }   // 20261021 B(95 요금제 + 워치9 40mm)
    else if(k==='tvfree'){ AP.tv=m.id; AP.tvTier=TIER[m.id]||''; AP.tvType=tvTypeOf((SEL[m.id]||{}).tvtype); AP.tvFix=true; var ts0=SEL[m.id]||{}; if(ts0.months!=null) AP.months=ts0.months; if(AP.tvType==='old') AP.phone='none'; }
    else AP[k]=m.id;
  }
}
// 20261019: [카톡 상담]도 전화 상담과 같은 신청서 — mode 'kakao' 면 맨 아래 버튼만 '카톡으로 상담 시작하기' (신청만 카톡으로)
function openApply(el, mode){
  var id=el&&el.getAttribute&&(el.getAttribute('data-model')||el.getAttribute('data-qk')), m=id&&byId(id);
  apSetFrom(m); AP.mode=mode||'';
  // 20261017: 매장찾기에서 '방문 예약 상담 신청하기'로 들어오면 고른 매장을 신청서까지 가져감 (목록 버튼은 매장 미정)
  var stn=el&&el.getAttribute&&el.getAttribute('data-store'); if(stn!=null){ AP.visit=true; AP.store=stn; AP.recv='store'; }   // 20261019: '매장에서 수령하기'로 미리 골라 둠
  apValidate();
  if(location.hash==='#/apply'){ renderApply(true); window.scrollTo(0,0); } else location.hash='#/apply';
}
// 20261019: 신청 저장 내용 만들기 (신청서 · 상세 카톡 간편 신청 공통) — AP(고른 조건) 기준. 통신사 미선택(카톡 간편)이면 가입유형은 비움
function apPayload(o){
  var name=o.name, phone=o.phone, birth=o.birth||null, memo=o.memo||'', kakao=!!o.kakao;
  var m=apPhone(), os=m?optsOf(m):[], cap=os[AP.cap]?os[AP.cap].nm:null, cs=m?colorsOf(m):[], color=AP.color||(cs.length>1?'':(cs[0]&&cs[0].nm))||null;
  if(cap==='기본') cap=null;
  var tt=apTier(), SM=apSummary(), pc=SM.pc, type=AP.carrier==='LG U+'?'기기변경':'번호이동', pv=PV()||{};
  var nums=function(rows){ return rows.filter(function(x){return typeof x.a==='number'}).map(function(x){ return {label:x.l==='지원 후 기기값'?'기기값 원금':x.l, amount:x.a}; }); };
  var item=function(r){ var o={key:r.key, kind:r.kind, device:r.nm, subsidy:nums(r.dev), monthly:nums(r.mon), subtotal:r.ask&&!r.sub?null:r.sub, support:r.sup};
    // 20261016: 직원용(ssgadmin) — 기기별 이통사 지원금 / 우리(유플러스 다이렉트) 지원금 금액을 따로 저장. TV프리는 고객 화면에선 합계 한 줄이지만 여기선 나눔
    if(r.cs!=null){ o.carrierSupport=r.cs; o.ourSupport=r.os; o.carrierLabel=r.csNm;
      if(r.sk==='tv'){ var sp=[]; o.subsidy.forEach(function(x){ if(x.label==='유플러스 다이렉트 지원금') return; sp.push(x);
        if(x.label==='출고가'){ if(r.cs) sp.push({label:r.csNm, amount:-r.cs}); if(r.os) sp.push({label:'유플러스 다이렉트 지원금', amount:-r.os}); } }); o.subsidy=sp; } }
    if(r.promo) o.promo=true;   // 20261021 워치 혜택(폴드8 B) — CRM 카드에서 '출고가 → 0원' 한 줄로
    return o; };
  var A=SM.recs.filter(function(r){return r.sk==='phone'})[0], addRecs=SM.recs.filter(function(r){return r.sk!=='phone'});
  var tvTierNm=function(){ return '집 인터넷 500MB 이상'; };
  var fee=[]; if(pc&&pc.fee){ fee.push({label:tt.title||tierTitle(tt), amount:pc.fee}); if(pc.method==='sel') fee.push({label:'선택약정 할인(25%)', amount:-(pc.fee-pc.feeAfter)}); fee.push({label:'월 통신요금', amount:pc.feeAfter}); }
  var subsidy=A&&A.after!=null?nums(A.dev):[]; if(pc&&pc.mm) subsidy.push({label:'기기값 월 청구 예정액', amount:pc.monthly});
  var tvTypeNm='U+ 기존 고객(인터넷TV 1년 이상~2년 미만 이용)';
  var benefits=addRecs.map(function(r){ return (r.sk==='tablet'?'탭':r.kind)+': '+r.nm+(r.sk==='tv'?(tvTierNm()?' ('+tvTierNm()+')':'')+' · '+tvTypeNm+' · 이용료 첫 9개월 '+won(TV_FEE)+'→10개월 차부터 '+won(TV_FEE2):''); });
  var cm=pc?cmpMethod(pc.c,pc.fee,AP.months):null;
  var tvx=AP.tv&&byId(AP.tv), wx=AP.watch&&byId(AP.watch), tbx=AP.tablet&&byId(AP.tablet);
  var noPh=AP.phone==='none';
  var snapshot={v:2, source:o.source||'온라인 상담 신청', jointype:(noPh||!AP.carrier)?null:type, carrier:AP.carrier||null, device:m?m.nm:(AP.phone==='none'?'휴대폰 변경 없음 (TV프리만)':'상담 후 결정'), storage:cap, color:color,
    plan:tt&&!noPh?{name:tt.title||tierTitle(tt), price:tt.fee||null, group:tt.grp||null}:null,
    discount:noPh?null:pc?(pc.method==='sel'?'선택약정':'공시지원금'):(AP.method==='sel'?'선택약정':'공시지원금'),
    fee:fee, feeNote:null, subsidy:subsidy, subsidyNote:noPh?'TV프리 약정 36개월':AP.months===0?'일시납':'할부 '+AP.months+'개월 · 연 5.9%',
    benefits:benefits, estimatedMonthly:SM.total||null, installmentMonths:noPh?null:(AP.months||null), upfront:SM.upfront||null,
    items:SM.recs.map(item), supportTotal:SM.sup||null, supportSplit:{carrier:SM.recs.reduce(function(t,r){return t+(r.cs||0)},0), our:SM.recs.reduce(function(t,r){return t+(r.os||0)},0)}, selDiscountTotal:SM.selSave||null,
    flow:SM.flow.map(function(f){ return {label:f.l, amount:f.a, note:f.sub||null}; }),
    advice:cm&&cm.diff>=1000?(cm.best==='pub'?'공시지원금':'선택약정')+' 쪽이 24개월 기준 약 '+won(Math.round(cm.diff/1000)*1000)+' 저렴':null,
    tvJoin:tvx?'U+ 기존 고객 (인터넷TV 1년 이상~2년 미만 이용 · 500MB 이상)':null,
    policy:{id:pv.id||null, from:pv.from||null, memo:pv.memo||null}, submittedAt:new Date().toISOString()};
  var body={name:name, phone:phone.slice(0,3)+'-'+phone.slice(3,7)+'-'+phone.slice(7), carrier:AP.carrier, channel:window.PAGE_CHANNEL||'메타', utm_campaign:window.PAGE_UTM_CAMPAIGN||null,
    device_interest:m?m.nm:(AP.phone==='none'?'휴대폰 변경 없음 (TV프리만)':'상담 후 결정'), capacity:cap, product_color:color, birth_date:birth, memo:memo||null, status:'신규',
    subscription_type:!AP.carrier?null:AP.carrier==='LG U+'?'기기변경':'MNP('+AP.carrier+')', rate_plan:AP.phone==='none'?null:tt?(tt.title||tierTitle(tt)):null,
    installment_months:AP.phone==='none'?null:AP.months===0?'일시납':AP.months+'개월', bundle_watch:wx?((AP.wpromo&&wx.id===AP.wpromo.watch)?wpName(AP.wpromo):wx.nm):null, bundle_watch_color:wx&&AP.wcolor?AP.wcolor:null, bundle_tablet:tbx?tbx.nm:null, bundle_tablet_type:tbx?'신규':null,
    home_tv:tvx?(tvx.id==='tvfree5'?'프리5':tvx.id==='ipada16'?'아이패드':tvx.nm):null, snapshot:snapshot};
  // 20261016: 카톡 예약으로 신청 → CRM '카톡 상담 요청' (전화 전에 문자·카톡으로 먼저 케어)
  snapshot.consult=kakao?'카톡':'전화'; if(kakao) body.consult_channel='카톡';
  if(AP.wpromo) snapshot.promo=tierNmOf(AP.wpromo.b)+' 요금제 + '+wpName(AP.wpromo)+' '+wz(AP.wpromo.price||0);   // 20261021 A/B 중 B(워치 혜택)로 신청
  if(AP.recv==='store' || (AP.visit && AP.recv!=='courier')){ body.visit_store=AP.store||'미정'; snapshot.visitStore=AP.store||'미정'; }   // 20261017: CRM에 '📍OO점 방문'으로 표시
  // 20261019 받는 방법: 택배 / 매장 수령 (+ 매장 수령이면 고객이 적은 출발 동네 — CRM 메모 맨 앞에도 붙임)
  snapshot.recv=AP.recv==='store'?'매장 수령':AP.recv==='courier'?'택배':null;
  if(AP.recv==='store' && String(AP.from||'').trim()){ snapshot.from=String(AP.from).trim().slice(0,40);
    // 고객이 적은 동네를 찾아 둔 경우(가까운 매장 찾기)만 → 고른 매장까지 직선거리(km) — 교통비·거리 분석용 (현재 위치(GPS)는 저장 안 함)
    var fst=S.stores.filter(function(x){ return x&&x.nm===AP.store; })[0], fll=fst&&storeLL(fst), fkm=(FROMLL && FROMQ===snapshot.from && fll)?Math.round(kmBetween(FROMLL,fll)*10)/10:null;
    if(fkm!=null) snapshot.fromKm=fkm;
    body.memo='[매장 수령 · 출발 동네] '+snapshot.from+(fkm!=null?' → '+AP.store+' 약 '+fkm+'km':'')+(body.memo?' / '+body.memo:''); }
  if(typeof window.udakMetaIds==='function'){ var mi=window.udakMetaIds(); Object.keys(mi).forEach(function(k){ body[k]=mi[k]; }); }
  return {body:body, snapshot:snapshot};
}
// 20261019: 상세 [카톡 상담] — 이름·연락처·동의만 받고 CRM에 '카톡 상담 요청'으로 저장한 뒤 우리 카카오톡 채널로
var QK={m:'', car:'', col:''};
var QK_PV='유플러스 다이렉트(이하 "회사")는 카카오톡 상담 신청 접수 및 상담 안내를 위해 아래와 같이 개인정보를 수집·이용합니다.<br><br>'+
  '· 항목: 이름, 전화번호, 생년월일, 희망기종, 현재 통신사<br>· 목적: 카카오톡·전화 상담 연락 및 구매·개통 안내<br>· 보유 기간: 수집일로부터 6개월<br><br>'+
  '동의를 거부할 권리가 있으며, 거부 시 상담 신청이 제한될 수 있습니다. 수집된 개인정보는 제3자에게 제공되지 않으며, 보유 기간 종료 후 즉시 파기됩니다.';
function sheetQuickKakao(m){
  var p=priceOf(m, optsOf(m).length?(OPT[m.id]||0):null), st=p.kind==='sheet'?calcState(m,p.row):null;
  var cs=colorsOf(m), col=PICK[m.id]||(cs.length===1?cs[0].nm:''), os=optsOf(m), cap=os.length>1?os[OPT[m.id]||0].nm:'';
  var hasCar=!!((SEL[m.id]||{}).carrier), needCar=kindOf(m)!=='tvfree';   // 통신사는 신청서처럼 필수 (TV프리만 제외)
  var needCol=qkNeedCol(m);   // 20261019: 컬러를 직접 안 골랐으면 여기서 꼭 고르게 (안 고르면 CRM 컬러 칸이 비어서 들어옴)
  return '<h3>카톡으로 상담받기</h3>'+
    '<div class="qk-sub">고객 정보를 남겨 주시면 <b>유플러스 다이렉트 카카오톡 상담 채널</b>로 바로 연결돼요. 고르신 조건은 상담사에게 같이 전달돼요.</div>'+
    '<div class="qk-pick"><b>'+esc([m.nm, col, cap].filter(Boolean).join(' · '))+'</b>'+(st&&st.c?'<span>'+esc(st.g==='tvfree'?'TV프리 약정 36개월':calcSummary(st))+'</span>':'')+'</div>'+
    (needCol?'<div class="qk-car qk-col"><div class="qk-l">컬러 <span class="req">*</span></div><div class="qk-cc">'+cs.map(function(c){ return '<button type="button" class="'+(QK.col===c.nm?'on':'')+'" data-qk-col="'+esc(c.nm)+'"><i style="--c:'+esc(c.hex||'#ddd')+'"></i>'+esc(c.nm)+'</button>'; }).join('')+'</div></div>':'')+
    (needCar&&!hasCar?'<div class="qk-car"><div class="qk-l">현재 이용 중인 통신사 <span class="req">*</span></div><div class="cgrid" style="--n:4">'+CARRIERS.map(function(cn){ return '<button type="button" class="cg'+(QK.car===cn?' on':'')+'" data-qk-car="'+esc(cn)+'">'+esc(cn)+'</button>'; }).join('')+'</div></div>':'')+
    '<div class="ff"><label>이름 <span class="req">*</span></label><input type="text" id="qkName" placeholder="이름을 입력해 주세요" autocomplete="name"></div>'+
    '<div class="ff"><label>연락처 <span class="req">*</span></label><div class="phone3"><input type="text" value="010" readonly tabindex="-1"><span>-</span><input type="tel" id="qkP2" maxlength="4" inputmode="numeric" placeholder="0000"><span>-</span><input type="tel" id="qkP3" maxlength="4" inputmode="numeric" placeholder="0000"></div></div>'+
    '<div class="ff"><label>생년월일 <span class="req">*</span></label><input type="text" id="qkBirth" inputmode="numeric" maxlength="8" placeholder="예: 940101"></div>'+
    '<label class="agree"><input type="checkbox" id="qkAgree"> 개인정보 수집 및 이용 동의 (필수)<button type="button" data-qk-pv>자세히 보기 ›</button></label>'+
    '<div class="privacy-txt" id="qkPv">'+QK_PV+'</div>'+
    '<button type="button" class="cta cta-kakao qk-btn" id="qkBtn">'+KKI+'<span>카톡으로 상담 시작하기</span></button>'+
    '<div class="qk-foot">누르시면 신청이 접수되고 카카오톡 상담 채널이 열려요.</div>';
}
function qkNeedCol(m){ return kindOf(m)==='phone' && colorsOf(m).length>1 && !PICK[m.id]; }
function openQuickKakao(mid){ var m=byId(mid); if(!m) return; QK={m:mid, car:'', col:''}; openSheet(sheetQuickKakao(m)); }
function qkSubmit(){
  if(EDIT){ alert('관리자 화면에서는 신청이 저장되지 않습니다.'); return; }
  var m=byId(QK.m); if(!m) return;
  var name=$('#qkName').value.trim(), phone='010'+$('#qkP2').value.replace(/\D/g,'')+$('#qkP3').value.replace(/\D/g,''), birth=birth8($('#qkBirth').value);
  var qk=kindOf(m), car=QK.car||(SEL[m.id]||{}).carrier||'';
  // 고객 정보는 신청서와 똑같이 전부 필수 — 하나라도 없으면 접수 안 됨 (컬러 → 통신사 → 이름 → 연락처 → 생년월일 → 동의)
  if(qkNeedCol(m) && !QK.col){ alert('컬러를 선택해 주세요.'); return; }
  if(qk!=='tvfree' && !car){ alert('현재 이용 중인 통신사를 선택해 주세요.'); return; }
  if(!name){ alert('이름을 입력해 주세요.'); return; }
  if(phone.length!==11){ alert('010으로 시작하는 11자리 전화번호를 입력해 주세요.'); return; }
  if(window.udakBlocked && window.udakBlocked(phone)){ alert('현재 해당 번호로는 신청이 제한되어 있습니다.\n문의사항은 고객센터로 연락해 주세요.'); return; }
  var be=birthErr(birth); if(be){ alert(be); return; }
  if(!$('#qkAgree').checked){ alert('개인정보 수집 및 이용에 동의해 주세요.'); return; }
  var btn=$('#qkBtn'); if(!btn||btn.disabled) return;
  // 상세에서 고른 컬러·용량·통신사·요금제·할인·할부 그대로
  //  (신청서 규칙 apValidate 는 안 씀 — 워치·태블릿은 '휴대폰과 함께'일 때만 남기는 규칙이라 보던 상품이 빠져 버림)
  if(QK.col) PICK[m.id]=QK.col;   // 창에서 고른 컬러 → 상세에도 '✓ 고름'으로
  apSetFrom(m); if(QK.car) AP.carrier=QK.car;
  var notes=[];
  if(qk==='watch'||qk==='tablet'){ var qcs=colorsOf(m), qos=optsOf(m); notes.push('보던 상품: '+[m.nm, PICK[m.id]||(qcs.length===1?qcs[0].nm:''), qos.length>1?qos[OPT[m.id]||0].nm:''].filter(function(x){ return x && x!=='기본'; }).join(' · ')); }
  var body=apPayload({name:name, phone:phone, birth:birth, memo:notes.length?'[카톡 간편 신청] '+notes.join(' / '):null, kakao:true, source:'상세 화면 카톡 상담'}).body;
  var lb=btn.querySelector('span'), lb0=lb?lb.textContent:''; btn.disabled=true; if(lb) lb.textContent='접수 중...';
  var reset=function(){ btn.disabled=false; if(lb) lb.textContent=lb0; };
  fetch(SB_URL,{method:'POST',keepalive:true,headers:{'Content-Type':'application/json','apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY,'Prefer':'return=minimal'},body:JSON.stringify(body)})
  .then(function(res){
    if(res.ok){ if(typeof window.fbq!=='undefined') window.fbq('track','Lead',{content_name:'카톡 상담 (상세)'}); mnpLead(body); reset(); closeSheet(); kakaoDone(body.phone); }
    else { reset(); res.text().then(function(x){ console.error('Supabase:',x); alert('신청 오류가 발생했습니다. 다시 시도해 주세요.'); }); }
  }).catch(function(e){ console.error(e); reset(); alert('네트워크 오류가 발생했습니다. 다시 시도해 주세요.'); });
}
// 생년월일 확인 (신청서 · 카톡 간편 신청 공통) — 문제 있으면 안내 문구, 괜찮으면 ''
function birthErr(birth){
  var t=new Date(), bY=+birth.slice(0,4), bM=+birth.slice(4,6), bD=+birth.slice(6,8);
  if(birth.length!==8||bY<1900||bY>t.getFullYear()||bM<1||bM>12||bD<1||bD>31) return '생년월일을 정확히 입력해 주세요. (예: 940101)';
  var age=t.getFullYear()-bY; if(t.getMonth()+1<bM||(t.getMonth()+1===bM&&t.getDate()<bD)) age--;
  if(age<19) return '미성년자 고객님 안내\n\n미성년자 고객님은 개통 시 본인 신분증 확인과\n법정대리인 동의가 필수입니다.\n보호자와 함께 신청해 주세요.';
  return '';
}
function apSubmit(mode){
  var kakao=(mode==='kakao');
  if(EDIT){ alert('관리자 화면에서는 신청이 저장되지 않습니다.'); return; }
  var name=$('#mUserName').value.trim(), phone='010'+$('#mPhone2').value.replace(/\D/g,'')+$('#mPhone3').value.replace(/\D/g,''), birth=birth8($('#mUserBirth').value), memo=$('#mUserNote').value.trim();
  var apm=apPhone(); if(apm && colorsOf(apm).length>1 && !AP.color){ alert('컬러를 선택해 주세요.'); var acr=$('#apColorRow'); if(acr) acr.scrollIntoView({block:'center',behavior:'smooth'}); return; }   // 20261019: 컬러도 필수
  if(!AP.phone){ alert('휴대폰을 선택해 주세요.'); window.scrollTo({top:0,behavior:'smooth'}); return; }
  if(apm && (SO(apm) || optSO(apm,AP.cap))){ alert('선택하신 '+apm.nm+(SO(apm)?'':' '+optsOf(apm)[AP.cap].nm)+'은(는) 일시품절이라 신청할 수 없어요.'+(SO(apm)?' 다른 휴대폰을 골라 주세요.':' 다른 '+optLabel(apm)+'을(를) 골라 주세요.')); apValidate(); apRefresh(); return; }   // 20261020 품절은 신청 못 함
  // 20261021: 신청 버튼이 아래 고정 줄로 가서 다 안 채우고 누를 수 있음 → 안내 뒤 빠진 칸으로 데려감
  var go=function(s){ var el=$(s); if(!el) return; try{ el.scrollIntoView({block:'center',behavior:'smooth'}); if(el.focus) el.focus({preventScroll:true}); }catch(x){} };
  if(!AP.carrier && AP.phone!=='none'){ alert('현재 이용 중인 통신사를 선택해 주세요.'); go('#apCarRow'); return; }
  // 20261021: '받는 방법' 확인은 뺌 (신청서에 칸이 없음 — 택배·매장 수령은 상담 때 정함)
  if(!name){ alert('이름을 입력해 주세요.'); go('#mUserName'); return; }
  if(phone.length!==11){ alert('010으로 시작하는 11자리 전화번호를 입력해 주세요.'); go($('#mPhone2').value.replace(/\D/g,'').length<4?'#mPhone2':'#mPhone3'); return; }
  if(window.udakBlocked && window.udakBlocked(phone)){ alert('현재 해당 번호로는 신청이 제한되어 있습니다.\n문의사항은 고객센터로 연락해 주세요.'); return; }
  var be=birthErr(birth); if(be){ alert(be); go('#mUserBirth'); return; }
  if(!$('#mPrivacyCheck').checked){ alert('개인정보 수집 및 이용에 동의해 주세요.'); go('#mPrivacyCheck'); return; }
  var btn=$(kakao?'#mKakaoBtn':'#mSubmitBtn'), btns=$$('#mSubmitBtn,#mKakaoBtn'); if(!btn||btn.disabled) return;
  var lbl=btn.querySelector('.rf-submit-label'), lbl0=lbl?lbl.textContent:'';
  btns.forEach(function(b){ b.disabled=true; }); if(lbl) lbl.textContent='신청 중...';
  var reset=function(){ btns.forEach(function(b){ b.disabled=false; }); if(lbl) lbl.textContent=lbl0; };
  // 카톡 예약: 신청서를 먼저 CRM에 저장하고 → 메타 신청 신호 → 완료 팝업 → 잠시 뒤 우리 카카오톡 상담 채널로 이동
  //  (인스타·페북 앱 안 브라우저는 새 창을 못 띄우고 지금 화면을 바꿔 버려서, 먼저 열면 저장·메타 신호가 끊길 수 있음)
  var body=apPayload({name:name, phone:phone, birth:birth, memo:memo, kakao:kakao, source:(AP&&AP.mode==='kakao')?'상세 화면 카톡 상담':'온라인 상담 신청'}).body;
  // 20261019 PC: 누르는 순간 새 창을 먼저 열어 두고(팝업 차단 안 걸리게) 저장되면 그 창을 바로 카카오톡 채팅방으로 → 버튼 한 번에 채팅까지
  var kw=null; if(kakao && !IS_MOBILE && kakaoUrl()){ try{ kw=window.open('', '_blank'); if(kw) kw.document.write('<title>카카오톡 채팅방 여는 중</title><p style="font:15px sans-serif;padding:24px;color:#555">카카오톡 채팅방을 여는 중이에요…</p>'); }catch(x){ kw=null; } }
  var kwX=function(){ try{ if(kw) kw.close(); }catch(x){} };
  fetch(SB_URL,{method:'POST',keepalive:kakao,headers:{'Content-Type':'application/json','apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY,'Prefer':'return=minimal'},body:JSON.stringify(body)})
  .then(function(res){
    if(res.ok){ if(typeof window.fbq!=='undefined') window.fbq('track','Lead',{content_name:kakao?'카톡 예약 신청':'상담 예약 신청'}); mnpLead(body); reset();
      if(kakao) kakaoDone(body.phone, kw); else showTicket(); }   // 카톡 예약은 카카오톡 채팅방으로
    else { kwX(); reset(); res.text().then(function(x){ console.error('Supabase:',x); alert('신청 오류가 발생했습니다. 다시 시도해 주세요.'); }); }
  }).catch(function(e){ console.error(e); kwX(); reset(); alert('네트워크 오류가 발생했습니다. 다시 시도해 주세요.'); });
}

/* ---------------- 이벤트 ---------------- */
var editing = EDIT; // 관리자: 편집 켜짐(누르면 수정) / 꺼짐(고객처럼 둘러보기)
document.addEventListener('input',function(e){
  if(e.target&&e.target.id==='qnaQ'){ QQ=e.target.value; e.target.parentNode.classList.toggle('on',!!QQ); var cs=$('.qna-cats'); if(cs) cs.classList.toggle('qdim',!!QQ.trim()); $('#qnaList').innerHTML=qnaList(); }
});
document.addEventListener('click',function(e){
  if(EDIT && editing && window.__stEditClick && window.__stEditClick(e)) return;
  var t=e.target;
  if(t.closest('.sheet-x')||t.closest('[data-close-sheet]')){ e.preventDefault(); closeSheet(); return; }
  if(t.closest('#mSubmitBtn')){ e.preventDefault(); apSubmit(); return; }
  if(t.closest('#mKakaoBtn')){ e.preventDefault(); apSubmit('kakao'); return; }
  if(t.closest('#qkBtn')){ e.preventDefault(); qkSubmit(); return; }
  var qkb=t.closest('[data-qk]'); if(qkb){ e.preventDefault(); if(qkb.disabled) return; closeSheet(); openApply(qkb, 'kakao'); return; }   // 20261019: 카톡 상담도 같은 신청서로 (예전 카톡 간편 신청창 openQuickKakao 는 안 씀)
  var qkl=t.closest('[data-qk-col]'); if(qkl){ e.preventDefault(); QK.col=qkl.getAttribute('data-qk-col'); $$('[data-qk-col]').forEach(function(x){ x.classList.toggle('on', x===qkl); }); return; }
  var qkc=t.closest('[data-qk-car]'); if(qkc){ e.preventDefault(); var qv=qkc.getAttribute('data-qk-car'); QK.car=(QK.car===qv?'':qv); $$('[data-qk-car]').forEach(function(x){ x.classList.toggle('on', x.getAttribute('data-qk-car')===QK.car); }); return; }
  if(t.closest('[data-qk-pv]')){ e.preventDefault(); var qp=$('#qkPv'); if(qp) qp.classList.toggle('on'); return; }
  var mgi=t.closest('[data-mg]'); if(mgi){ e.preventDefault(); var ms=$('#mdBody .mstep[data-step="'+mgi.getAttribute('data-mg')+'"]'), mh=$('#v-model .subhead'); if(ms) window.scrollTo({top:ms.getBoundingClientRect().top+window.scrollY-(mh?mh.offsetHeight:0)-8, behavior:'smooth'}); return; }
  var mgo=t.closest('[data-md-go]'); if(mgo){ e.preventDefault(); var gs=$('#mdBody .mstep[data-step="'+mgo.getAttribute('data-md-go')+'"]'); if(gs) gs.scrollIntoView({behavior:'smooth',block:'center'}); return; }   // 하단 '통신사를 고르면…' 누르면 그 단계로
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
    if(ak==='tvType'){ AP.tvOk=false; if(av==='old'&&!AP.phone) AP.phone='none'; if(av!=='old'&&AP.phone==='none') AP.phone=''; }
    apRefresh(); return; }
  var app=t.closest('[data-ap-pick]');
  if(app){ e.preventDefault(); if(app.disabled) return; var pv=app.getAttribute('data-ap-pick'); if(pv!==AP.phone){ AP.cap=0; AP.color=''; if(pv!=='later'){ var pm=byId(pv), prs=sheetRows(pm); if(prs.length){ var pp=priceOf(pm); AP.cap=Math.max(0,prs.indexOf(pp.row)); if(optSO(pm,AP.cap)){ var fo2=firstOkOpt(pm); if(fo2>=0) AP.cap=fo2; } } } }
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
  if(t.closest('#ticket') && (t.closest('.x') || t.closest('.ok') || t.id==='ticket')){ closeTicket(); return; }
  if(t.closest('[data-kkd-x]') || t.id==='kkDone'){ e.preventDefault(); closeKakaoDone(); return; }
  if(t.closest('[data-pv-x]')){ e.preventDefault(); PVOFF=!PVOFF; var pvm=t.closest('.pv-more'); if(pvm) pvm.classList.toggle('off', PVOFF); return; }
  var mt=t.closest('[data-ms-tip]');
  if(mt){ e.preventDefault(); var mk=mt.getAttribute('data-ms-tip'); MSTIP[mk]=!MSTIP[mk]; var hm=location.hash.match(/#\/model\/([^/?]+)/); if(hm){ var y=window.scrollY; renderModel(hm[1],true); window.scrollTo(0,y); } return; }
  var cb=t.closest('[data-calc]');
  if(cb){ e.preventDefault(); e.stopPropagation(); if(cb.disabled) return; var mid=cb.getAttribute('data-model'), k=cb.getAttribute('data-calc'), v=cb.getAttribute('data-v'), sel=SEL[mid]||(SEL[mid]={});
    if(k==='tier') TIER[mid]=v; else if(k==='months') sel.months=+v; else sel[k]=v;
    var pn=mdNowKey(), y=window.scrollY; renderModel(mid,true); window.scrollTo(0,y); if(k==='carrier') mdFollow(pn); return; }
  var op=t.closest('[data-opt-pick]');
  if(op){ e.preventDefault(); e.stopPropagation(); if(op.disabled) return; var omid=op.getAttribute('data-model'); OPT[omid]=+op.getAttribute('data-opt-pick'); OPTT[omid]=true;
    var pn2=mdNowKey(), y2=window.scrollY; renderModel(omid,true); window.scrollTo(0,y2); mdFollow(pn2); return; }
  var vb=t.closest('[data-video]'); if(vb){ e.preventDefault(); openVideo(vb.getAttribute('data-video')); return; }
  var cp=t.closest('[data-color-pick]');
  if(cp){ e.preventDefault(); e.stopPropagation(); var mm=byId(cp.getAttribute('data-model')), nm=cp.getAttribute('data-color-pick');
    PICK[mm.id]=nm; var pn3=mdNowKey(), y3=window.scrollY; renderModel(mm.id,true); window.scrollTo(0,y3); mdFollow(pn3); return; }   // 20261019: 단계 표시(✓)도 같이 바뀌게 다시 그림
  var w=t.closest('[data-wish]');
  if(w){e.preventDefault();e.stopPropagation();var id=w.getAttribute('data-wish'),l=store.get('wish',[]),i=l.indexOf(id);
    if(i>-1)l.splice(i,1);else l.unshift(id);store.set('wish',l);
    $$('[data-wish="'+id+'"]').forEach(function(b){b.classList.toggle('on',i<0)}); if($('#v-wish').classList.contains('on'))renderWish(); return}
  var o=t.closest('[data-open]'); if(o){e.preventDefault();if(o.disabled)return;act(o.getAttribute('data-open'),o);return}
  if(t.closest('[data-qx]')){ e.preventDefault(); var qi=$('#qnaQ'); if(qi){ qi.value=''; QQ=''; qi.parentNode.classList.remove('on'); $('.qna-cats').classList.remove('qdim'); $('#qnaList').innerHTML=qnaList(); qi.focus(); } return; }
  var qc=t.closest('[data-qcat]'); if(qc){ e.preventDefault(); QCAT=+qc.getAttribute('data-qcat'); var qi2=$('#qnaQ'); if(qi2){ qi2.value=''; QQ=''; qi2.parentNode.classList.remove('on'); $('.qna-cats').classList.remove('qdim'); } $$('.qna-cats button').forEach(function(x){ x.classList.toggle('on',x===qc); }); $('#qnaList').innerHTML=qnaList(); qc.scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'}); return; }
  if(t.closest('[data-near]')){ e.preventDefault(); findNear(); return; }
  if(t.closest('[data-ap-near]')){ e.preventDefault(); apNear(); return; }
  if(t.closest('[data-near-q]')){ e.preventDefault(); findNearQ(); return; }
  if(t.closest('[data-ss-geo]')){ e.preventDefault(); searchStoreGeo(); return; }   // 20261019 검색 '매장' — 동네 근처 매장
  var smb=t.closest('[data-smode]'); if(smb){ e.preventDefault(); var md=smb.getAttribute('data-smode'); if(md!==SMODE) location.replace('#/search'+(md==='store'?'/store':'')); return; }   // 20261019 매장찾기 '동네로 찾기'
  if(t.closest('[data-ap-from]')){ e.preventDefault(); apFromFind(); return; }   // 20261019 신청서 '어디서 오세요' → 가까운 매장   // 20261019 신청서 '가까운 매장 찾기'   // 20261019 매장찾기: 내 위치에서 가까운 매장
  var sti=t.closest('[data-store-i]'); if(sti && !t.closest('a')){ e.preventDefault(); var so=S.stores[+sti.getAttribute('data-store-i')]; if(so){ openSheet(sheetStoreOne(so)); } return; }
  var g=t.closest('[data-go]'); if(g){e.preventDefault();act(g.getAttribute('data-go'),g);return}
  var c=t.closest('[data-cat]'); if(c){location.hash='#/cat/'+c.getAttribute('data-cat');return}
  var mp=t.closest('[data-mnp]'); if(mp){ e.preventDefault(); MNP=mp.getAttribute('data-mnp')==='1'; refresh(); return; }
  if(t.closest('[data-cert]')){e.preventDefault();openCert();return}
  if(t.closest('[data-home]')){e.preventDefault();closeSheet();location.hash='#/';window.scrollTo(0,0);return}
  if(t.closest('[data-back]')){e.preventDefault();history.length>1?history.back():location.hash='#/';return}
});
document.addEventListener('input',function(e){
  var id=e.target.id;
  if(id==='mPhone2'||id==='mPhone3'||id==='qkP2'||id==='qkP3'){ e.target.value=e.target.value.replace(/\D/g,'').slice(0,4); if((id==='mPhone2'||id==='qkP2')&&e.target.value.length===4){ var n=$(id==='qkP2'?'#qkP3':'#mPhone3'); if(n) n.focus(); } }
  else if(id==='mUserBirth'||id==='qkBirth'){ e.target.value=e.target.value.replace(/\D/g,'').slice(0,8); }
  else if(id==='mUserName'||id==='qkName'){ e.target.value=e.target.value.replace(/[0-9]/g,''); }
  else if(id==='mFromIn'){ if(AP) AP.from=e.target.value; }   // 20261019 매장 수령 '어디서 오세요' (다시 그려도 안 지워지게)
  else if(id==='q'){ renderSearch(e.target.value); }
  else if(id==='mDeviceSearch'){ var qv=e.target.value.toLowerCase().replace(/\s/g,''), al={'아이폰':'iphone','갤럭시':'','플립':'flip','폴드':'fold','울트라':'ultra'};
    $$('#apList .ap-li').forEach(function(li){ var nm=li.getAttribute('data-nm')||'', q2=qv; Object.keys(al).forEach(function(a){ if(al[a]) q2=q2.split(a).join(al[a]); }); li.hidden=!!qv && nm.indexOf(qv)<0 && (!q2||nm.indexOf(q2)<0); }); }
});
document.addEventListener('keydown',function(e){   // 20261019: 동네 칸에서 엔터 = 찾기
  if(e.key!=='Enter' || !e.target) return;
  if(e.target.id==='nearQ'){ e.preventDefault(); findNearQ(); }
  else if(e.target.id==='mFromIn'){ e.preventDefault(); apFromFind(); }
  else if(e.target.id==='q' && SMODE==='store'){ e.preventDefault(); searchStoreGeo(); try{ e.target.blur(); }catch(x){} }
});
document.addEventListener('change',function(e){
  if(e.target.id==='mPlanSel'){ AP.tier=e.target.value; apRefresh(); return; }
  if(e.target.id==='mStoreSel'){ AP.store=e.target.value; apRefresh(); return; }   // 20261019: 고른 매장 주소·거리·길찾기 줄도 바꿔 그림
  if(e.target.id==='apTvTier'){ AP.tvTier=e.target.value; apRefresh(); return; }
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
var CFG_PRE=(!EDIT && window.__stCfg && typeof window.__stCfg.then==='function')?window.__stCfg:null;   // 20261021: galaxy_z8.html 맨 위에서 미리 받기 시작한 설정 (처음 한 번만 씀)
function load(){
  var p=CFG_PRE||fetch(DB+'/store.json',{cache:'no-store'}).then(function(r){return r.ok?r.json():null}); CFG_PRE=null;
  return p.then(function(d){ CFG_WAIT=false; apply(d); return d; }).catch(function(){ cfgDone(); return null; });
}
function live(){
  if(!window.EventSource) return;
  try{
    var es=new EventSource(DB+'/store.json');
    // 20261019: 관리자 저장은 바뀐 칸만 보내는 방식(patch)이라 — 통째로 다시 받아서 반영.
    //   (예전엔 바뀐 칸만으로 화면을 다시 그려서, 손님이 보고 있던 화면의 가격이 '상담 시 안내'로 바뀌던 문제)
    var on=function(ev){ try{ var x=JSON.parse(ev.data); if(ev.type==='put' && x && x.path==='/'){ apply(x.data); } else { load(); } }catch(e){} };
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
try{ var SEOS=document.getElementById('seoSummary'); if(SEOS) SEOS.parentNode.removeChild(SEOS); }catch(e){}   // 20261021 검색엔진용 글 요약은 화면이 뜨면 지움 (galaxy_z8.html)
ROOT.insertAdjacentHTML('afterbegin', MARKUP);
// 온라인 상담 신청 페이지
$('#app').insertAdjacentHTML('beforeend','<main class="view" id="v-apply"><div class="subhead"><button data-back><svg class="ico" viewBox="0 0 24 24"><path d="M19 12H5M11 18l-6-6 6-6"/></svg></button><h1>온라인 상담 신청서</h1><button data-home aria-label="홈으로"><svg class="ico" viewBox="0 0 24 24"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20h5v-6h4v6h5V9.5"/></svg></button></div><div id="apBody"></div><div class="ap-bar" id="apBar"></div></main>');
if(!EDIT) document.body.insertAdjacentHTML('beforeend','<div class="side-quick sq-img"><img src="/assets/store/side-quick.webp" alt="" aria-hidden="true">'+
  '<a class="sq-hit is-call" href="tel:'+esc(S.tel)+'" aria-label="전화 상담"></a><a class="sq-hit is-kakao" href="'+esc(S.kakao)+'" target="_blank" rel="noopener" aria-label="카톡 문의"></a></div>');
document.body.insertAdjacentHTML('beforeend','<div class="ticket" id="ticket"><div class="tw"><img src="/assets/store/ticket-consult-pink.webp" width="936" height="1351" alt="상담 신청이 정상적으로 접수되었습니다. 평일 오전 9시 ~ 오후 8시 내에 전문 상담사가 순차적으로 연락드립니다. 연락드릴 예정이니 수신 부탁드립니다. 문의사항은 편하게 말씀해 주세요."><span class="tk-ph" id="tkPh" hidden></span><button class="x" aria-label="닫기"></button><button class="ok" aria-label="확인"></button></div></div>');
$('#dim').addEventListener('click',closeSheet);
window.addEventListener('scroll',onScroll,{passive:true});
window.addEventListener('hashchange',route);
bindHeroSwipe();
renderHome();
// 20261019: 광고 주소 galaxy_z8?m=fold8 → 그 상품 상세로 바로 열림 (뒤로 가기는 홈으로).
//   메타가 주소 뒤에 붙이는 광고 정보(utm·fbclid)는 ? 뒤에 그대로 남아서 CRM·기록에 정상으로 잡힘
//   (#/model/fold8 주소를 광고에 바로 넣으면 메타가 # 뒤에 광고 정보를 붙여 화면·기록이 깨질 수 있어 이 방식으로)
(function(){ try{
  var mq=new URLSearchParams(location.search).get('m');
  if(!EDIT && mq && /^[\w-]{1,40}(,[\w-]{1,40}){0,5}$/.test(mq) && (!location.hash || location.hash==='#')){   // 처음 들어올 때만 (홈에서 새로고침하면 홈 그대로)
    var base=location.pathname+location.search, ids=mq.split(','), to='#/model/'+ids[0];
    if(ids.length>1){   // 20261019: 모델 여러 개 → 그 모델만 모아 보기 (예: ?m=iphone18pro,iphone18promax → 아이폰 18프로·프로맥스, 탭은 '아이폰')
      var ms=ids.map(byId), ck='all';
      CAT_TABS.forEach(function(t){ if(ck==='all' && t.k!=='all' && t.k!=='zero' && ms.every(function(m){ return m && m.cat && m.cat.indexOf(t.k)>-1; })) ck=t.k; });
      to='#/cat/'+ck+'/'+ids.join(',');
    }
    history.replaceState(null,'',base+'#/');
    history.pushState(null,'',base+to);
  }
}catch(e){} })();
route();
if(EDIT) document.body.classList.add('edit','editing');
if(CFG_WAIT) setTimeout(cfgDone, 5000);   // 20261021: 설정이 5초 넘게 안 오면 기본값으로 그림
load().then(function(){ if(!EDIT) live(); if(window.__stReady) window.__stReady(); });
})();
