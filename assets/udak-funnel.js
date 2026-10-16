/* udak 랜딩 이탈 분석 (v20261013 — 기록량 대폭 축소) — 개인정보 없이 '어디까지 봤고 어디서 나갔는지'만 익명으로 기록
   v20261013: 하루 6,600건씩 쌓이던 기록을 대폭 줄임 (사장님 지시)
     · 방문 10명 중 1명(브라우저 세션 단위)만 행동(보기·스크롤·누름)을 기록 → 추이는 10배로 보면 됨
     · 신청 시도·성공·실패·안내창(막힘)은 표본과 상관없이 전원 기록 (신청이 막히는 문제는 놓치면 안 되니까)
     · 보내는 주기 3초 → 20초, 나갈 때 한 번에 (요청 횟수 자체도 줄임)
     · 메타 픽셀 단계 신호(PriceCheck/FormOpen)는 전원 그대로 보냄 (광고 타겟용이라 표본 적용 안 함)
   기록처: Supabase landing_events (랜딩은 쓰기만 가능, 읽기 불가)
   메타 픽셀 단계 신호(9번): 가격 확인 → PriceCheck, 신청서 열기 → FormOpen (페이지마다 한 번씩, 내부 방문은 안 보냄)
   직원·내부 확인 방문 표시: 주소 뒤에 ?internal=1 로 한 번 열면 그 브라우저는 내부 방문으로 표시됨 (?internal=0 으로 해제)
   v20261016 새 홈페이지(스토어, /galaxy_z8): 화면이 주소 # 로만 바뀌는 한 페이지라 화면 단위로 기록
     · 방문자 전원: view(들어옴) · exit(나갈 때 요약 — 몇 초 · 신청서 어디까지 · 거쳐 간 화면별 머문 초·내린 %)
                    · form_step(신청서 단계: 신청서 열기 → 휴대폰 → 통신사 → 이름 → 연락처 → 생년월일 → 동의, 단계마다 한 번)
                    · submit_click(상담 예약 / 카톡 예약 누름) · call · kakao
     · 표본(10명 중 1명)만: screen(화면 이동) · see(홈 구간) · 버튼 누름 · 칸 누름
     · 메타 단계 신호: 상세 화면(가격) → PriceCheck, 신청서 화면 → FormOpen */
(function(){
  try{
    var S=document.currentScript;
    var PAGE=(S&&S.getAttribute('data-page'))||(location.pathname.replace(/^\/|\.html$/g,'')||'home');
    // v20261016: 새 홈페이지(스토어 앱)가 떠 있는지 — 예전 갤럭시 랜딩(galaxy_z8_prev)은 해당 없음
    var STORE=!!(window.STORE_CFG && window.STORE_CFG.mode==='view' && document.getElementById('storeRoot'));
    var API='https://ebggtghzqtxfylbhqfoh.supabase.co/rest/v1/landing_events';
    var KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZ2d0Z2h6cXR4ZnlsYmhxZm9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNDk4MzgsImV4cCI6MjA5NjgyNTgzOH0.bPqIVbrnh2I9pi9rBQzQNOXQcG8v5WbBauZynkED_-Q';
    var origFetch=window.fetch?window.fetch.bind(window):null;
    if(!origFetch) return;

    function sget(k){ try{ return sessionStorage.getItem(k); }catch(e){ return null; } }
    function sset(k,v){ try{ sessionStorage.setItem(k,v); }catch(e){} }
    var sid=sget('udak_sid');
    if(!sid){ sid=(Date.now().toString(36)+Math.random().toString(36).slice(2,10)).slice(0,24); sset('udak_sid',sid); }
    // 표본: 이 방문(세션)이 행동 기록 대상인지 — 10명 중 1명. 한 번 정하면 그 방문 동안(상세 페이지로 넘어가도) 유지
    var SAMPLE_1_IN=10, sampled=sget('udak_sampled');
    if(sampled!=='1' && sampled!=='0'){ sampled=(Math.random()*SAMPLE_1_IN<1)?'1':'0'; sset('udak_sampled',sampled); }
    sampled=(sampled==='1');
    // 표본과 상관없이 항상 기록하는 것 — 신청 흐름·막힘
    var ALWAYS={ submit_send:1, lead:1, submit_fail:1, alert:1 };
    // 스토어는 방문자 전원의 들어옴·나감 요약·신청서 단계·신청 버튼·전화/카톡 문의를 남김 (자세한 누름·구간은 표본만)
    if(STORE){ ALWAYS.view=1; ALWAYS.exit=1; ALWAYS.form_step=1; ALWAYS.submit_click=1; ALWAYS.call=1; ALWAYS.kakao=1; }
    var qs=new URLSearchParams(location.search);
    if(qs.get('internal')==='1'){ try{ localStorage.setItem('udak_internal','1'); }catch(e){} }
    if(qs.get('internal')==='0'){ try{ localStorage.removeItem('udak_internal'); }catch(e){} }
    var internal=false; try{ internal=localStorage.getItem('udak_internal')==='1'; }catch(e){}
    // 광고 정보: 처음 들어온 주소의 utm 을 이 방문 동안 유지 (상세 페이지로 넘어가도 같은 광고로 묶임)
    var src={ s:qs.get('utm_source'), c:qs.get('utm_campaign'), a:qs.get('utm_content'), f:qs.has('fbclid') };
    if(src.s||src.c||src.a||src.f){ sset('udak_src',JSON.stringify(src)); }
    else { try{ src=JSON.parse(sget('udak_src')||'{}')||{}; }catch(e){ src={}; } }

    // 9) 메타 리타겟팅용 단계 신호 — '가격까지 본 사람'과 '신청서 열고 나간 사람'을 메타 맞춤 타겟으로 나누기 위함
    //    PriceCheck: 할인 가격이 보인 순간 (아이폰 듀오는 통신사 선택 후에만 할인가가 보이고, 갤럭시 카드·상세는 처음부터 SKT 기준 할인가가 보임)
    //    FormOpen:   신청서를 연 순간 (신청하기 버튼 또는 신청서 칸 첫 터치). 신청 완료(Lead)는 원래대로 페이지에서 보냄
    var STAGE={
      iphone18:{ price:{pick_carrier:1, form_carrier:1}, form:{cta_bottom:1, card_cta:1, form_start:1, form_edit:1, form_carrier:1} },
      galaxy_z8:{ price:{'see:catalog':1, card_carrier:1, card_color:1, card_cta:1, form_carrier:1, calc_more:1}, form:{cta_bottom:1, card_cta:1, form_start:1, form_edit:1, form_carrier:1} },
      device:{ price:{'see:price_detail':1, carrier:1, color:1}, form:{consult_btn:1, order_btn:1, form_start:1} },
      // v20261016 스토어: 상세 화면(가격·계산기)을 본 사람 → PriceCheck, 신청서 화면을 연 사람 → FormOpen
      store:{ price:{'screen:model':1, calc:1, pick:1}, form:{'screen:apply':1, form_start:1, submit_click:1} }
    };
    STAGE.apple=STAGE.galaxy_z8;   // v20261008: /apple (아이폰 18 Pro 랜딩)은 갤럭시 랜딩과 같은 구성
    var stageSent={};
    function metaStage(name, detail){
      try{
        var m=STAGE[STORE?'store':PAGE]; if(!m || internal) return;
        var key=(name==='see')?('see:'+detail):(name==='screen')?('screen:'+String(detail||'').split(/[: ]/)[0]):name;
        [['price','PriceCheck'],['form','FormOpen']].forEach(function(p){
          if(!m[p[0]][key] || stageSent[p[1]] || typeof window.fbq!=='function') return;
          stageSent[p[1]]=1;
          window.fbq('trackCustom', p[1], { landing:PAGE });
        });
      }catch(e){}
    }

    var q=[], t0=Date.now(), maxS=0, done={};
    function ev(name, detail, onceKey){
      try{
        if(onceKey!==undefined){ var k=name+'|'+onceKey; if(done[k]) return; done[k]=1; }
        metaStage(name, detail);
        if(!sampled && !ALWAYS[name]) return; // 표본 밖 방문은 행동 기록을 남기지 않음 (픽셀 신호는 위에서 이미 보냄)
        q.push({ sid:sid, page:PAGE, event:String(name).slice(0,40), detail:(detail==null?null:String(detail).slice(0,300)),
          sec:Math.round((Date.now()-t0)/1000), vw:(window.innerWidth||null),
          utm_source:src.s||null, utm_campaign:src.c||null, utm_content:src.a||null, fbclid:!!src.f, internal:internal });
        if(q.length>=20) flush(false);
      }catch(e){}
    }
    function flush(leaving){
      if(!q.length) return;
      var body=JSON.stringify(q); q=[];
      try{
        origFetch(API,{ method:'POST', keepalive:!!leaving,
          headers:{'Content-Type':'application/json','apikey':KEY,'Authorization':'Bearer '+KEY,'Prefer':'return=minimal'},
          body:body }).catch(function(){});
      }catch(e){}
    }
    setInterval(function(){ flush(false); }, 20000);

    // ── 페이지별로 보는 구간·버튼
    var txt=function(el){ return (el.textContent||'').replace(/\s+/g,' ').trim().slice(0,40); };
    var lbl=function(el){ return el.getAttribute('aria-label')||txt(el); };
    var CFG={
      galaxy_z8:{
        see:[['video','.hero-col'],['nocard','.intro-hero-nocard'],['plan_info','.intro-hero-plan'],['storage_info','.intro-hero-storage'],
             ['catalog','.ucat-wrap'],['trust','.acc-kit'],['form','#consultForm']],
        click:[['.ucard-dot','card_color',function(el){ var c=el.closest('.ucard'), n=c&&c.querySelector('.ucard-name'); return (n?txt(n)+' · ':'')+(el.getAttribute('aria-label')||''); }],
               ['.ucard .ucard-type','card_carrier',function(el){ var c=el.closest('.ucard'), n=c&&c.querySelector('.ucard-name'); return (n?txt(n)+' · ':'')+txt(el); }],
               ['.ucard-cta','card_cta',function(el){ var c=el.closest('.ucard'), n=c&&c.querySelector('.ucard-name'); return n?txt(n):null; }],
               ['#ucatSubZ','tab_z'],['#ucatSubS','tab_s'],['.sticky-cta-btn','cta_bottom',function(el){ return el.classList.contains('scta-on')?'이 조건으로':null; }],['#mSubmitBtn','submit_click'],
               ['.hero-col','video_tap'],['.m-hdr-hit','hdr',lbl],['.top-nav-sub-item,.top-nav-item','topnav',txt],
               ['.nav-drawer-item','menu',txt],['.side-quick-btn','quick',txt],
               ['.mfs-edit','form_edit',txt],['.mfs-car-row button','form_carrier',function(el){ return el.getAttribute('data-car'); }],['.mfs-more-btn','calc_more']]
      },
      device:{
        see:[['carrier','#udCarrier'],['discount','#udDiscount'],['price_detail','#udSubsidyWrap'],['buttons','.udetail-btn-order']],
        click:[['#udCarrier .ud-chip','carrier',txt],['#udColors .ud-color','color'],['.udetail-btn-consult','consult_btn'],
               ['.udetail-btn-order','order_btn'],['.modal-submit','submit_click'],['.dtopbar-back','back'],['.side-quick-btn','quick',txt]]
      },
      iphone18:{
        // v20261008: preorder_info = 사전예약 안내 포스터, subsidy = 지원금 이미지, preorder_steps = 사전예약 진행 절차 (각각 따로)
        see:[['preorder_info','#preorderNotice'],['subsidy','#subsidyInfo'],['preorder_steps','#preorderSteps'],['models','#duoInline'],['benefit_imgs','.b-stack'],['form','#reserveForm']],
        click:[['.b-phone-item','model_open',function(el){ return (el.getAttribute('onclick')||'').replace(/^.*openPhoneModal\(|\).*$/g,'').replace(/'/g,''); }],   // 예전 화면(상세 열기)에만 있음
               ['.pm-swatch','pick_color',function(el){ return el.getAttribute('data-color'); }],['.b-storage-badge','pick_cap',txt],
               ['.pm-badge[data-carrier]','pick_carrier',txt],['.pm-badge[data-months]','pick_months',txt],
               ['.b-modal-cta','card_cta'],['.bottom-cta-btn','cta_bottom',function(el){ return el.classList.contains('scta-on')?'이 조건으로':null; }],['#rfSubmitBtn','submit_click'],['.about-trigger','about_video'],
               ['.m-hdr-hit','hdr',lbl],['.top-nav-item','topnav',txt],['.nav-drawer-item','menu',txt],['.side-quick-btn','quick',txt],
               ['.mfs-edit','form_edit',txt],['.mfs-car-row button','form_carrier',function(el){ return el.getAttribute('data-car'); }]]
      }
    };
    // v20261008: /apple — 같은 구성(카드·신청서)이라 같은 구간·버튼을 봄 + 카드의 할인 방식(공시지원금/선택약정)·용량 누름은 따로 기록
    var cardPick=function(el){ var c=el.closest('.ucard'), n=c&&c.querySelector('.ucard-name'); return (n?txt(n)+' · ':'')+txt(el); };
    CFG.apple={ see:CFG.galaxy_z8.see, click:[['.ucard-disc','card_discount',cardPick],['.ucard-stor','card_storage',cardPick]].concat(CFG.galaxy_z8.click) };
    // v20261016: 스토어(새 홈페이지) — 홈 구간 + 버튼 (먼저 맞는 것 하나만 기록)
    var attr=function(n){ return function(el){ return el.getAttribute(n); }; };
    CFG.store={
      see:[['hero','#hero'],['models','#models'],['quick','#quick'],['trust','#trust'],['popular','#popSec'],['recent','#recentSec'],['zero','#zeroSec'],
           ['wear','#wearSec'],['gift','#giftSec'],['rank','#rankSec'],['pick','#pickSec']],
      click:[['#mSubmitBtn','submit_click',function(){ return '상담 예약'; }],['#mKakaoBtn','submit_click',function(){ return '카톡 예약'; }],
             ['[data-ap-pick]','ap_pick',attr('data-ap-pick')],
             ['[data-ap]','ap',function(el){ return el.getAttribute('data-ap')+'='+(el.getAttribute('data-v')||''); }],
             ['[data-ap-act]','ap_act',attr('data-ap-act')],
             ['[data-calc]','calc',function(el){ return (el.getAttribute('data-model')||'')+' '+el.getAttribute('data-calc')+'='+(el.getAttribute('data-v')||''); }],
             ['[data-opt-pick],[data-color-pick]','pick',function(el){ return (el.getAttribute('data-model')||'')+' '+(el.getAttribute('data-color-pick')||txt(el)); }],
             ['[data-wish]','wish',attr('data-wish')],
             ['[data-mnp]','mnp',function(el){ return el.getAttribute('data-mnp')==='1'?'번호이동':'기기변경'; }],
             ['[data-open]','open',function(el){ return el.getAttribute('data-open')+(el.getAttribute('data-model')?' '+el.getAttribute('data-model'):''); }],
             ['[data-go]','go',attr('data-go')],['[data-cat]','cat',attr('data-cat')],['[data-video]','video',attr('data-video')],
             ['.tabbar a','tab',function(el){ return el.getAttribute('data-tab')||txt(el); }]]
    };
    var cfg=CFG[STORE?'store':PAGE]||{see:[],click:[]};

    // 1) 들어옴
    var ref=''; try{ ref=document.referrer?new URL(document.referrer).hostname:''; }catch(e){}
    // 어떤 앱·OS에서 열었는지 (예: 'IG iOS 27.0.1') — 특정 앱·기종에서만 신청이 막히는지 확인용
    var ua=navigator.userAgent||'', app=/Instagram/.test(ua)?'IG':/FBAN|FBAV|FB_IAB/.test(ua)?'FB':/KAKAOTALK/i.test(ua)?'KAKAO':/NAVER/.test(ua)?'NAVER':/SamsungBrowser/.test(ua)?'Samsung':/CriOS|Chrome\//.test(ua)?'Chrome':/Safari\//.test(ua)?'Safari':'기타';
    var os=(ua.match(/OS (\d+)_(\d+)(?:_(\d+))? like Mac/)||[]).slice(1).filter(Boolean).join('.'); os=os?('iOS '+os):((ua.match(/Android ([\d.]+)/)||[])[1]?('Android '+ua.match(/Android ([\d.]+)/)[1]):(/Windows/.test(ua)?'Windows':/Mac OS X/.test(ua)?'Mac':''));
    // ── 스토어: 지금 화면 이름 (home · cat:종류 · model:모델 · search · wish · apply)
    function scrKey(){
      var h=location.hash.replace(/^#\/?/,'').split('/'), v=h[0]||'home';
      if(v==='cat') return 'cat:'+(h[1]||'all')+(h[2]?'/'+h[2]:'');
      if(v==='model'){ var id=h[1]||''; try{ id=decodeURIComponent(id); }catch(e){} return 'model:'+id; }
      return /^(search|wish|apply)$/.test(v)?v:'home';
    }
    ev('view', (PAGE==='device'?(qs.get('id')||'')+' | ':'')+(STORE?scrKey()+' | ':'')+(ref||'-')+' | '+app+(os?' '+os:''));

    // ── 스토어: 화면마다 머문 초·내린 %, 신청서 진행 단계, 나갈 때 요약
    var cur=null, path=[], steps={};
    var STEPS=['open','phone','carrier','name','tel','birth','agree','submit','lead'];
    var STEP_KO={open:'신청서',phone:'휴대폰',carrier:'통신사',name:'이름',tel:'연락처',birth:'생년월일',agree:'동의',submit:'신청누름',lead:'접수완료'};
    function pctNow(){
      var h=Math.max(document.documentElement.scrollHeight, document.body?document.body.scrollHeight:0);
      return h?Math.min(100,((window.scrollY||window.pageYOffset)+window.innerHeight)/h*100):0;
    }
    function scrDesc(){ return cur?(cur.k+' '+Math.round((Date.now()-cur.t)/1000)+'s '+Math.round(cur.s)+'%'):''; }
    function step(n, extra){ if(steps[n]) return; steps[n]=1; ev('form_step', n+(extra?' '+extra:'')); }
    function formCheck(){
      var f=null; try{ f=(typeof window.udakFormState==='function')?window.udakFormState():null; }catch(e){}
      if(!f) return;
      step('open', f.model||'-');
      ['phone','carrier','name','tel','birth','agree'].forEach(function(k){ if(f[k]) step(k, k==='phone'?f.model:''); });
    }
    var fcT=null;
    function formSoon(){ if(!cur || cur.k!=='apply') return; clearTimeout(fcT); fcT=setTimeout(formCheck, 700); }
    function scrStart(){
      var c0=cur={k:scrKey(), t:Date.now(), s:0};
      // 화면이 그려지고 스크롤 위치가 잡힌 뒤에 첫 위치를 잼 (짧은 화면은 안 내려도 끝까지 보임)
      setTimeout(function(){ if(cur===c0){ var p0=pctNow(); if(p0>cur.s) cur.s=p0; } }, 500);
      if(cur.k==='apply') formCheck();
    }
    function progress(){ var r=[]; STEPS.forEach(function(k){ if(steps[k]) r.push(STEP_KO[k]); }); return r.length?r.join('>'):'안 엶'; }
    function exitDetail(){
      var p=path.concat([scrDesc()]).join(' > '), head=app+(os?' '+os:'')+' | 신청서 '+progress()+' | ', room=300-head.length;
      if(p.length>room) p='…'+p.slice(p.length-room+1);
      return head+p;
    }
    if(STORE){
      scrStart();
      ev('screen', cur.k+' ← (처음)');   // 처음 화면 (광고에서 바로 상세로 들어온 경우도 PriceCheck 가 가게)
      window.addEventListener('hashchange', function(){
        var k=scrKey(); if(cur && k===cur.k) return;
        var prev=scrDesc(); if(prev){ path.push(prev); if(path.length>40) path.shift(); }
        scrStart();
        ev('screen', k+' ← '+(prev||'-'));
      });
      document.addEventListener('input', formSoon, true);
      document.addEventListener('change', formSoon, true);
      document.addEventListener('click', formSoon, true);
    }

    // 2) 스크롤 깊이 25/50/75/100
    function onScroll(){
      var h=Math.max(document.documentElement.scrollHeight, document.body?document.body.scrollHeight:0);
      var pct=h?Math.min(100,((window.scrollY||window.pageYOffset)+window.innerHeight)/h*100):0;
      if(STORE){ if(cur && pct>cur.s) cur.s=pct; return; }   // 스토어는 화면마다 따로 (나갈 때 요약에 들어감)
      if(pct>maxS) maxS=pct;
      [25,50,75].forEach(function(m){ if(maxS>=m) ev('scroll', m, m); });
      if(maxS>=98) ev('scroll', 100, 100);
    }
    window.addEventListener('scroll', function(){ if(onScroll._t) return; onScroll._t=setTimeout(function(){ onScroll._t=null; onScroll(); },300); }, {passive:true});

    // 3) 구간이 화면에 들어옴 (한 번씩)
    function watch(){
      if(!('IntersectionObserver' in window)) return;
      var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ ev('see', e.target.__udk, e.target.__udk); io.unobserve(e.target); } }); },{threshold:0.25});
      cfg.see.forEach(function(p){ var el=document.querySelector(p[1]); if(el){ el.__udk=p[0]; io.observe(el); } });
    }
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', watch); else watch();

    // 4) 버튼·링크 누름
    document.addEventListener('click', function(e){
      try{
        var t=e.target; if(!t||!t.closest) return;
        var hit=false;
        for(var i=0;i<cfg.click.length;i++){
          var c=cfg.click[i], el=t.closest(c[0]);
          if(el){ ev(c[1], c[2]?c[2](el):null); hit=true; if(STORE && c[1]==='submit_click'){ formCheck(); steps.submit=1; } break; }
        }
        var a=t.closest('a[href]'), h=a?(a.getAttribute('href')||''):'';
        if(!hit && a){ if(/^tel:/.test(h)) ev('call'); else if(/pf\.kakao\.com/.test(h)) ev('kakao'); }
        // 다른 페이지로 넘어가는 링크면 지금 바로 보냄 (넘어가는 중에도 전달되게)
        if(a && h && h.charAt(0)!=='#' && !/^javascript:/i.test(h)) flush(true);
        else if(hit) flush(false);
      }catch(err){}
    }, true);

    // 5) 신청서 칸을 처음 건드림 (칸마다 한 번) — 어느 칸에서 멈추는지 보기 위함
    //    신청서 칸만 신청서 시작으로 셈 (아이폰 rf*, 갤럭시 m*, 상세 dr*) — 소개 영상 진행바·상세 계산기 칸은 제외
    document.addEventListener('focusin', function(e){
      var el=e.target; if(!el||!/^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName)) return;
      var id=el.id||el.name; if(!id) return;
      if(/^(rf|dr|m[A-Z])/.test(id)) ev('form_start', id, 'x');
      ev('field', id, id);
    }, true);

    // 6) 막힘(안내창) — 입력 확인에 걸린 문구
    var origAlert=window.alert;
    window.alert=function(m){ try{ ev('alert', m); flush(false); }catch(e){} return origAlert.apply(window, arguments); };

    // 7) 신청 저장 시도 → 성공/실패 (reservations* 로 보내는 저장 요청을 지켜봄)
    window.fetch=function(input, init){
      var p=origFetch(input, init);
      try{
        var url=(typeof input==='string')?input:((input&&input.url)||'');
        var method=String((init&&init.method)||(input&&input.method)||'GET').toUpperCase();
        if(method==='POST' && /\/rest\/v1\/reservations/.test(url)){
          ev('submit_send', url.split('/').pop().split('?')[0]);
          p.then(function(r){ if(r.ok) steps.lead=1; ev(r.ok?'lead':'submit_fail', r.ok?null:('HTTP '+r.status)); flush(false); },
                 function(err){ ev('submit_fail','network: '+((err&&err.message)||err)); flush(false); });
        }
      }catch(e){}
      return p;
    };

    // 8) 나감 — 마지막으로 어디까지 내렸는지
    var left=false;
    function leave(){ if(left) return; left=true;
      if(STORE){ try{ formCheck(); }catch(e){} ev('exit', exitDetail()); }   // 스토어: 몇 초 · 신청서 어디까지 · 거쳐 간 화면 (전원)
      else ev('leave', Math.round(maxS));
      flush(true); }
    window.addEventListener('pagehide', leave);
    document.addEventListener('visibilitychange', function(){ if(document.visibilityState==='hidden') leave(); else left=false; });
  }catch(e){}
})();
