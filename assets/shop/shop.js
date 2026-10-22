/* =========================================================
   /shop — 올리브영 배치로 바꾼 스토어 홈 (20261022 사장님 실험 페이지 landing.uplusdak.com/shop)
   · 스토어 엔진(store.js)은 그대로 쓰고 '홈 화면'만 이 파일이 그림
     → 상세·신청서·검색·찜·팝업·가격 계산·신청 저장(유닥 시트)은 /store 와 똑같음
       (신청 경로 표시만 '온라인 상담 신청 · /shop' 처럼 뒤에 /shop 이 붙음 — shop.html 의 srcTag)
   · 칸 크기·간격은 올리브영 모바일 홈 실측값 (화면 폭 390 기준, 2026-10-22) — 화면 폭에 맞춰 같은 비율로
       상단 로고줄 48 · 탭 메뉴 44 · 메인 배너 화면 폭 92% × 74.67% (양옆 배너 88% 크기로 살짝) · 01|04 · +전체보기
       퀵메뉴 아이콘 52 (폭 400 이상 60) 2줄 · 띠배너 92% × 21.33% + 점 · 섹션 사이 48 · 상품 3열 · 큰 카드 360×287 · 하단 탭 51
   · 문구는 관리자(스토어 설정)에 있는 그대로 — 새 문구를 지어 넣지 않음
   · 설정(가격표·노출)을 받기 전엔 회색 자리만 — 다른 내용이 잠깐 떴다가 바뀌지 않게
   ========================================================= */
(function(){
'use strict';

var SVG_SEARCH='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>';
var SVG_BELL='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/></svg>';
var SVG_PLUS='<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M5 1v8M1 5h8"/></svg>';
var SVG_CHEV='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';

var HOME=
'<main class="view on oy" id="v-home">'+
  '<div class="oy-top">'+
    '<header class="oy-hd">'+
      '<a class="oy-logo" href="#/" data-home><img src="/assets/shop/logo-mark.png" alt="" width="34" height="22"><span>유플러스 다이렉트</span></a>'+
      '<div class="oy-hd-r">'+
        '<button type="button" class="oy-ib" data-go="search" aria-label="검색">'+SVG_SEARCH+'</button>'+
        '<button type="button" class="oy-ib" data-open="noti" aria-label="알림">'+SVG_BELL+'<i class="dot-new"></i></button>'+
      '</div>'+
    '</header>'+
    '<nav class="oy-gnb" id="oyGnb" aria-label="카테고리"></nav>'+
  '</div>'+
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
  '<footer class="foot" id="foot"></footer>'+
'</main>';

var A=null;   // 스토어 엔진이 넘겨주는 도구 묶음 (store.js SKIN_API) — 가격 계산·모델·문구는 /store 와 같은 함수
var BN={i:0, lo:-1, n:0, list:[], timer:null, drag:null, moved:false};          // 메인 배너
var BD={i:0, n:0, timer:null, t2:null, drag:null, moved:false};                 // 띠배너
var POPCAT='all', CD=null, bound=false;
var BN_BG=['linear-gradient(155deg,#F7F8FF 0%,#E4EAFF 100%)','linear-gradient(155deg,#F6F3FF 0%,#E8E1FF 100%)','linear-gradient(155deg,#F2F8FF 0%,#DFEBFF 100%)','linear-gradient(155deg,#FFF6FA 0%,#FFE3EE 100%)'];
var BC_BG=['linear-gradient(160deg,#F5F7FF 0%,#E3E9FF 100%)','linear-gradient(160deg,#F8F5FF 0%,#ECE4FF 100%)','linear-gradient(160deg,#FFF7FB 0%,#FFE6F0 100%)'];
var BD_BG={ship:'#FFF0F7', truck:'#FFF0F7', headset:'#F0FBF5', cardx:'#F2F6FF', docx:'#F6F2FF'};
var BD_C={headset:'#22B573', cardx:'#2563EB', docx:'#7C3AED', truck:'#E6007E'};

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
function modelOf(go){ var id=(String(go||'').match(/^#\/model\/([\w-]+)/)||[])[1]; return id?A.byId(id):null; }

/* ---------- 탭 메뉴: 홈 + 손님 화면에 모델이 있는 분류 (스토어 분류 탭과 같은 이름) ---------- */
function renderGnb(wait){
  var h='<a href="#/" class="on" data-home aria-current="page">홈</a>';
  if(wait) h+=sk('48px','16px','4px')+sk('58px','16px','4px')+sk('48px','16px','4px')+sk('66px','16px','4px');
  else A.CAT_TABS.forEach(function(t){
    if(t.k!=='all' && A.models().some(function(m){ return m.cat.indexOf(t.k)>-1; })) h+='<a href="#/cat/'+E(t.k)+'" data-cat="'+E(t.k)+'">'+E(t.nm)+'</a>';
  });
  put($('#oyGnb'), h);
}

/* ---------- 메인 배너: 스토어 히어로 슬라이드 + 프로모 배너 ---------- */
function bannerList(){
  var S=A.S, out=A.vis(S.hero||[]).map(function(h){
    var m=modelOf(h.go);   // 설명이 비어 있으면 연결된 모델의 소개 문구 (관리자에 있는 그대로)
    return {tag:'', l1:h.k||'', l2:h.t||'', s:h.s||(m&&m.ds)||'', img:h.img||'', go:h.go||''};
  });
  var p=S.promo; if(p && !p.hidden && (p.t||p.img)) out.push({tag:p.tag||'', l1:p.t||'', l2:'', s:p.s||'', img:p.img||'', go:p.go||''});
  return out;
}
function renderBanner(wait){
  var tr=$('#oyBn');
  if(wait){ clearInterval(BN.timer); BN.n=0; BN.list=[]; put(tr,'<span class="oy-sl oy-sl-sk"></span>'); put($('#oyBnCnt'),''); $('#oyBnAll').hidden=true; return; }
  var list=bannerList(), n=list.length;
  var h=list.map(function(b,i){
    return '<a class="oy-sl" href="'+E(href(b.go))+'" data-i="'+i+'" data-go="'+E(b.go)+'" style="background:'+BN_BG[i%BN_BG.length]+'">'+img(b.img,'oy-sl-im',true)+
      '<span class="oy-sl-t">'+(b.tag?'<span class="oy-sl-tag">'+E(b.tag)+'</span>':'')+
        '<span class="oy-sl-h">'+(b.l1?'<b>'+E(b.l1)+'</b>':'')+(b.l2?'<b class="pk">'+E(b.l2)+'</b>':'')+'</span>'+
        (b.s?'<span class="oy-sl-s">'+E(b.s)+'</span>':'')+'</span></a>';
  }).join('');
  BN.list=list;
  if(put(tr,h)){ BN.n=n; if(BN.i>=n) BN.i=0; BN.lo=n>=3?-1:0; bnLayout(null); }
  $('#oyBnAll').hidden=n<2;
  bnAuto();
}
// 자리(d): 0 = 가운데, -1/+1 = 양옆(88% 크기로 살짝 보임), 그 밖 = 화면 밖
function bnGeo(){ var t=$('#oyBn'), W=t?t.clientWidth:0; return {W:W, w:W*.92, gap:W*.0144, sw:W*.92*.88}; }
function bnPos(g,d){ if(d===0) return {x:g.W*.04, s:1}; var c=g.W/2+(d>0?1:-1)*(g.w/2+g.gap+g.sw/2+(Math.abs(d)-1)*(g.sw+g.gap)); return {x:c-g.w/2, s:.88}; }
function bnPut(el,g,d,anim,dx){
  var p=bnPos(g,d); el.classList.toggle('nt',!anim); el.classList.add('ok');
  el.style.transform='translate3d('+(p.x+(dx||0)).toFixed(1)+'px,0,0) scale('+p.s+')'; el.__d=d;
  var on=d===0; el.setAttribute('aria-hidden',on?'false':'true'); el.tabIndex=on?0:-1;
}
// dir: +1 다음 · -1 이전 · 0 제자리로(손 뗐을 때) · null 바로 그 자리에 / dx: 손가락으로 끄는 중
function bnLayout(dir, dx){
  var tr=$('#oyBn'); if(!tr) return;
  var sl=tr.querySelectorAll('.oy-sl[data-i]'), n=sl.length, g=bnGeo(); if(!n || !g.W) return;   // 홈이 안 보일 땐 다음에
  var v=document.getElementById('v-home'); if(v && v.__W!==g.W){ v.style.setProperty('--W', g.W+'px'); v.__W=g.W; }
  Array.prototype.forEach.call(sl,function(el){
    var i=+el.getAttribute('data-i'), t=((i-BN.i-BN.lo)%n+n)%n+BN.lo, p=el.__d;
    if(dx!=null){ bnPut(el,g,p==null?t:p,false,dx); return; }
    if(p==null || dir==null){ bnPut(el,g,t,false); return; }
    if(!dir || t===p || t===p-dir){ bnPut(el,g,t,true); return; }
    var pv=Math.abs(p)<=1, tv=Math.abs(t)<=1;
    if(!tv){ if(pv && Math.abs(p-dir)>=2) bnPut(el,g,p-dir,true); else bnPut(el,g,t,false); return; }   // 화면 밖으로 나감
    bnPut(el,g,t+dir,false); void el.offsetWidth; bnPut(el,g,t,true);                                    // 반대쪽에서 들어옴
  });
  put($('#oyBnCnt'), '<b>'+two(BN.i+1)+'</b><i></i><span>'+two(n)+'</span>');
}
function bnGo(dir){
  var n=BN.n; if(n<2) return;
  BN.i=((BN.i+dir)%n+n)%n;
  BN.lo=n>=3?Math.max(-(n-2),Math.min(-1,BN.lo-dir)):Math.max(-1,Math.min(0,BN.lo-dir));
  bnLayout(dir);
}
function bnAuto(){ clearInterval(BN.timer); if(BN.n>1) BN.timer=setInterval(function(){ if(!document.hidden && !BN.drag && homeOn()) bnGo(1); },4000); }
function bnAll(){
  if(!BN.list.length) return;
  A.openSheet('<h3>전체보기</h3><div class="oy-all">'+BN.list.map(function(b,i){
    return '<a class="oy-all-it" href="'+E(href(b.go))+'" data-go="'+E(b.go)+'"><span class="oy-all-im" style="background:'+BN_BG[i%BN_BG.length]+'">'+img(b.img,'',true)+'</span>'+
      '<span class="oy-all-tx">'+(b.tag?'<small class="pk">'+E(b.tag)+'</small>':'')+'<b>'+E([b.l1,b.l2].filter(Boolean).join(' '))+'</b>'+(b.s?'<small>'+E(b.s)+'</small>':'')+'</span></a>';
  }).join('')+'</div>');
}

/* ---------- 퀵메뉴 2줄: 첫 줄 휴대폰(스토어 모델 순서), 둘째 줄 바로가기(관리자 퀵메뉴 그대로) ---------- */
function renderQuick(wait){
  if(wait){ var s=''; for(var k=0;k<6;k++) s+='<span class="oy-qi"><span class="oy-qi-ic oy-skb"></span><span class="oy-qi-t">'+sk('40px','11px','4px')+'</span></span>';
    put($('#models'),s); put($('#quick'),s); return; }
  put($('#models'), A.phones().map(function(m,i){
    var so=A.SO(m);
    return '<a class="oy-qi" href="#/model/'+E(m.id)+'"><span class="oy-qi-ic">'+img(A.mImg(m),'oy-qi-im',i<6)+(so?'<i class="oy-so">품절</i>':'')+'</span><span class="oy-qi-t">'+E(m.nm)+'</span></a>';
  }).join(''));
  put($('#quick'), A.vis(A.S.quick||[]).map(function(q){
    return '<a class="oy-qi" href="'+E(href(q.go))+'" data-go="'+E(q.go||'')+'"><span class="oy-qi-ic" style="background:'+E(q.bg||'#F4F5F7')+'"><svg viewBox="0 0 24 24" aria-hidden="true" style="stroke:'+E(q.c||'#131518')+'">'+(A.QI[q.ic]||A.QI.star)+'</svg></span><span class="oy-qi-t">'+E(q.nm)+'</span></a>';
  }).join(''));
}

/* ---------- 띠배너: 당일 택배 발송(마감까지 남은 시간) + 신뢰 문구(관리자 '신뢰' 항목 그대로) ---------- */
function bandList(){
  var S=A.S, out=[], shipOn=!!(S.ship && S.ship.on);
  if(shipOn){
    var st=A.shipState();   // 스토어 당일 발송 카드와 같은 문구
    out.push(st.today
      ? {k:'ship', go:'guide', l1:E('오늘 '+A.cutLabel()+'까지 구매확정'), l2:'당일 택배 발송 · 발송 마감까지 <b class="oy-cd"></b>', im:'/assets/store/ship/truck.webp'}
      : {k:'ship', go:'guide', l1:'지금 구매확정하시면', l2:'<b>'+E(st.when)+'</b> 택배 발송 · 순차 발송', im:'/assets/store/ship/truck.webp'});
  }
  A.vis(S.trust||[]).forEach(function(t){
    if(t.ic==='truck' && shipOn) return;   // 당일 발송은 위 칸(남은 시간)으로 보여 줌
    out.push({k:t.ic, go:t.ic==='headset'?'contact':'guide', l1:E(t.b), l2:E(t.s),
      im:t.ic==='headset'?'/assets/store/ship/ico-call.webp':t.ic==='truck'?'/assets/store/ship/truck.webp':'', svg:A.TI[t.ic]||A.TI.headset});
  });
  return out;
}
function bdOne(b, clone){
  return '<a class="oy-bd oy-bd-'+E(b.k)+'" href="javascript:void 0" data-go="'+E(b.go)+'" style="background:'+(BD_BG[b.k]||'#F4F5F7')+'"'+(clone?' data-clone aria-hidden="true" tabindex="-1"':'')+'>'+
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
  if(n>1) BD.timer=setInterval(function(){ if(!document.hidden && !BD.drag && homeOn()) bdGo(1); },4000);
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

/* ---------- 상품 카드 (올리브영 3열: 사진 · 이름 2줄 · 할인율 + 가격) — 가격은 스토어 카드와 같은 계산 ---------- */
function priceHtml(m){
  var p=A.priceOf(m);
  if(p.v==null) return '<span class="oy-card-pr"><span class="oy-ask">'+E(A.tagsOf(m)[0]||'상담 시 안내')+'</span></span>';
  var pct=p.v>0?A.pctOf(p):0;
  var h='<span class="oy-card-pr">'+(pct>0?'<em>'+pct+'%</em>':'')+'<span class="oy-v">'+n0(p.v)+'<small>원</small>'+(p.from?'<i>~</i>':'')+'</span></span>';
  if(p.v===0 && p.out) h+='<s class="oy-card-s">'+E(A.won(p.out))+'</s>';
  if(A.isTv(m)) h+='<span class="oy-card-c">약정 36개월</span>';
  return h;
}
function card(m){
  var so=A.SO(m);
  return '<a class="oy-card'+(so?' so':'')+'" href="#/model/'+E(m.id)+'" data-mid="'+E(m.id)+'"><span class="oy-card-im">'+img(A.mImg(m),'oy-card-img',false)+'<i class="oy-dim"></i>'+(so?'<i class="oy-so">일시품절</i>':'')+'</span>'+
    '<span class="oy-card-nm">'+E(m.nm)+'</span>'+priceHtml(m)+'</a>';
}
function skCards(n){ var h=''; for(var i=0;i<n;i++) h+='<span class="oy-card"><span class="oy-card-im oy-skb"></span><span class="oy-card-nm">'+sk('80%','12px','4px')+'</span><span class="oy-card-pr">'+sk('64%','14px','4px')+'</span></span>'; return h; }

/* ---------- 섹션 1: 많이 찾아요 (스토어 '인기' 목록 · 번호이동/기기변경 + 분류 칩 · 3열) ---------- */
function renderPop(wait){
  var sec=$('#popSec');
  if(wait){ sec.hidden=false; put($('#oyPopT'),sk('190px','18px')); put($('#oyPopChips'),sk('150px','32px','16px')+sk('56px','32px','16px')+sk('64px','32px','16px')+sk('72px','32px','16px')); put($('#oyPop'),skCards(6)); return; }
  var list=A.secOn('pop')?A.pickList('pop'):[];
  sec.hidden=!list.length; if(!list.length) return;
  put($('#oyPopT'), E((A.S.sec.pop||{}).t||''));
  var cats=A.CAT_TABS.filter(function(t){ return t.k!=='all' && t.k!=='zero' && list.some(function(m){ return m.cat.indexOf(t.k)>-1; }); });
  if(POPCAT!=='all' && !cats.some(function(t){ return t.k===POPCAT; })) POPCAT='all';
  var mnp=!!A.MNP;
  put($('#oyPopChips'),
    '<span class="oy-flt" role="group" aria-label="가입 유형"><button type="button" data-mnp="1" class="'+(mnp?'on':'')+'" aria-pressed="'+mnp+'">번호이동</button><i aria-hidden="true"></i><button type="button" data-mnp="0" class="'+(mnp?'':'on')+'" aria-pressed="'+(!mnp)+'">기기변경</button>'+SVG_CHEV+'</span>'+
    (cats.length>1?[{k:'all',nm:'전체'}].concat(cats).map(function(t){ var on=POPCAT===t.k; return '<button type="button" class="oy-chip'+(on?' on':'')+'" data-shop-cat="'+E(t.k)+'" aria-pressed="'+on+'">'+E(t.nm)+'</button>'; }).join(''):''));
  put($('#oyPop'), (POPCAT==='all'?list:list.filter(function(m){ return m.cat.indexOf(POPCAT)>-1; })).map(card).join(''));
}

/* ---------- 섹션 2: 이번주 특가 (올리브영 Weekly Special 큰 카드 · 스토어 특가와 같은 모델·가격) ---------- */
function renderDeal(wait){
  var sec=$('#oyDealSec'), D=A.S.deal||{};
  if(wait){ sec.hidden=false; put($('#oyDealT'),sk('96px','18px')); put($('#oyDealD'),''); put($('#oyDeal'),'<span class="oy-bc oy-skb"></span>'); return; }
  var it=D.on?A.dealItems():[];
  sec.hidden=!it.length; if(!it.length) return;
  put($('#oyDealT'), E(String(D.title||'이번주 특가').replace(/^이번 주 /,'이번주 ')));
  put($('#oyDealD'), E(A.weekRange()));
  put($('#oyDeal'), it.map(function(x,i){
    var m=x.m, so=A.SO(m);
    var pr=x.mnp!=null?'번호이동 <em>'+E(A.wz(x.mnp))+'</em>':'구매가 <em class="ask">상담 시 안내</em>';
    if(x.chg!=null) pr+=' · 기기변경 '+E(A.wz(x.chg));
    return '<a class="oy-bc'+(so?' so':'')+'" href="#/model/'+E(m.id)+'" data-mid="'+E(m.id)+'" style="background:'+BC_BG[i%BC_BG.length]+'"><span class="oy-bc-im">'+img(A.mImg(m),'oy-bc-img',false)+'</span>'+
      '<b class="oy-bc-t">'+E(m.nm)+'</b><span class="oy-bc-d">'+pr+'</span>'+(so?'<i class="oy-so oy-so-l">일시품절</i>':'')+'</a>';
  }).join(''));
}

/* ---------- 섹션 3: 기기값 0원 모아보기 (스토어 '0원' 목록 · 3열) ---------- */
function renderZero(wait){
  var sec=$('#zeroSec');
  if(wait){ sec.hidden=false; put($('#oyZeroT'),sk('150px','18px')); put($('#oyZero'),skCards(3)); return; }
  var list=A.secOn('zero')?A.pickList('zero'):[];
  sec.hidden=!list.length; if(!list.length) return;
  put($('#oyZeroT'), E((A.S.sec.zero||{}).t||''));
  put($('#oyZero'), list.map(card).join(''));
}

/* ---------- 손가락으로 넘기기 · 칩 · 전체보기 (한 번만 묶음) ---------- */
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
function bindOnce(){
  if(bound) return; bound=true;
  swipe($('#oyBn'), BN, function(dx){ bnLayout(null,dx); }, function(dx){ if(dx<=-40) bnGo(1); else if(dx>=40) bnGo(-1); else bnLayout(0); bnAuto(); });
  swipe($('#oyBand'), BD, function(dx){ bdShow(false,dx); }, function(dx){ if(dx<=-40) bdGo(1); else if(dx>=40) bdGo(-1); else bdShow(true); });
  $('#oyBnAll').addEventListener('click',function(e){ e.preventDefault(); bnAll(); });
  document.addEventListener('click',function(e){
    var c=e.target && e.target.closest && e.target.closest('[data-shop-cat]'); if(!c) return;
    e.preventDefault(); POPCAT=c.getAttribute('data-shop-cat'); renderPop(false);
  });
  // 바로가기 '구역으로 이동'(sec:…) — 위에 붙은 상단(로고줄+탭 메뉴)에 제목이 가리지 않게 그만큼 덜 내림
  document.addEventListener('click',function(e){
    var g=e.target && e.target.closest && e.target.closest('#v-home [data-go^="sec:"]'); if(!g) return;
    var id={zero:'zeroSec', pop:'popSec'}[g.getAttribute('data-go').slice(4)], el=id && document.getElementById(id); if(!el || el.hidden) return;
    e.preventDefault(); e.stopPropagation();
    var top=$('.oy-top'); window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-(top?top.offsetHeight:0)-4, behavior:'smooth'});
  },true);
  var rt=null; window.addEventListener('resize',function(){ clearTimeout(rt); rt=setTimeout(function(){ bnLayout(null); },120); });
  window.addEventListener('hashchange',function(){ if(homeOn()) setTimeout(function(){ bnLayout(null); },0); });   // 상세에서 홈으로 돌아왔을 때 배너 자리 다시 맞춤
}

/* ---------- 스토어 엔진이 홈을 그릴 때마다 부름 (처음 · 설정 받았을 때 · 번호이동/기기변경 바꿀 때 · 관리자 저장 반영) ---------- */
function render(api){
  A=api; var wait=api.prWait();
  bindOnce();
  renderGnb(wait); renderBanner(wait); renderQuick(wait); renderBand(wait); renderPop(wait); renderDeal(wait); renderZero(wait);
  api.renderFoot();
}

window.STORE_CFG=window.STORE_CFG||{};
window.STORE_CFG.skin={home:HOME, render:render};
})();
