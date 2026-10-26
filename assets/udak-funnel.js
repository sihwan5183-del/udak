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
     · 메타 단계 신호: 상세 화면(가격) → PriceCheck, 신청서 화면 → FormOpen
   v20261020 스토어: 홈·목록에서 누른 것도 방문자 전원 기록 — 따로 줄을 늘리지 않고 나갈 때 요약(exit)의 화면별 [ ] 안에 붙임
     · 예: 'home 12s 40% [특가:s26] > model:s26 56s 100% > home 5s 30% [기기변경>최대혜택:켬>인기:s26ultra]'
     · 상세 화면에서 누른 것은 원래대로 detail_exit '누름'에 (중복 안 함)
     · exit 한 줄 최대 600자 (detail_exit 와 같음) — DB 입력 규칙도 600자로 맞춤
       (전엔 규칙이 300자라 300자 넘는 상세 요약이 든 묶음이 통째로 거절 → 오래 본 손님 기록이 빠졌음)
     · 표본 기록에 '최대 혜택 기준으로 보기'(maxv) · 정렬(sort) 누름 추가 */
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
    // 표본: 이 방문(세션)이 행동 기록 대상인지 — 한 번 정하면 그 방문 동안(상세 페이지로 넘어가도) 유지
    //  20261020 사장님: 10명 중 1명 → 3명 → 5명 (스토어 하루 150명 안팎이라 저장 공간·속도 부담 거의 없음. 이날 20시쯤부터 표본 행동 기록 수가 약 5배)
    var SAMPLE_RATE=0.5, sampled=sget('udak_sampled');
    if(sampled!=='1' && sampled!=='0'){ sampled=(Math.random()<SAMPLE_RATE)?'1':'0'; sset('udak_sampled',sampled); }
    sampled=(sampled==='1');
    // 표본과 상관없이 항상 기록하는 것 — 신청 흐름·막힘
    var ALWAYS={ submit_send:1, lead:1, submit_fail:1, alert:1 };
    // 스토어는 방문자 전원의 들어옴·나감 요약·신청서 단계·신청 버튼·전화/카톡 문의를 남김 (자세한 누름·구간은 표본만)
    if(STORE){ ALWAYS.view=1; ALWAYS.exit=1; ALWAYS.form_step=1; ALWAYS.submit_click=1; ALWAYS.call=1; ALWAYS.kakao=1; ALWAYS.qk_open=1; ALWAYS.store_near=1; ALWAYS.store_near_fail=1;   // 20261019: 매장찾기 '가까운 매장' — 가장 가까운 매장 + 거리대만 (좌표·개인정보 없음)
      ALWAYS.detail_exit=1; ALWAYS.ap=1; ALWAYS.ap_pick=1; ALWAYS.ap_act=1; }   // 20261019: 상세 위치별 요약(아래 10번) · 신청서에서 고른 것(받는 방법 등)은 전원
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
      store:{ price:{'screen:model':1, calc:1, pick:1}, form:{'screen:apply':1, form_start:1, submit_click:1, qk_open:1} }
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
        q.push({ sid:sid, page:PAGE, event:String(name).slice(0,40), detail:(detail==null?null:String(detail).slice(0,(name==='detail_exit'||name==='exit')?600:300)),
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
    window.udakEv=function(n,d){ ev(n,d); };   // 20261019: 스토어 화면에서 직접 남기는 기록 (매장찾기 가까운 매장 등)

    // 11) v20261019 메타 '번호이동' 신호 — 메타가 번호이동 손님 위주로 찾게 하려고 (LG U+ 기기변경·내부 방문은 안 보냄)
    //   MnpSelect: 이 방문에서 처음 고른 통신사가 SKT·KT·알뜰폰일 때 한 번 (처음에 LG U+ 를 고른 방문은 안 보냄 — 기존 고객이 둘러보는 경우)
    //   MnpLead:   번호이동 접수가 들어갔을 때 (스토어 페이지에서 부름). 기존 Lead 신호는 그대로
    window.udakMeta=function(name, params){
      try{
        if(internal || typeof window.fbq!=='function') return;
        var p={ landing:PAGE }; if(params) for(var k in params) if(params[k]) p[k]=params[k];
        window.fbq('trackCustom', name, p);
      }catch(e){}
    };
    function carPick(el){
      try{
        var cv=el.getAttribute('data-qk-car')||el.getAttribute('data-v')||''; if(!cv) return;
        var first=sget('udak_car1'); if(first) return; sset('udak_car1', cv);   // 이 방문에서 처음 고른 통신사만 봄
        if(cv!=='LG U+') window.udakMeta('MnpSelect', { carrier:cv, model:el.getAttribute('data-model')||'' });
      }catch(e){}
    }

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
           ['wear','#wearSec'],['gift','#giftSec'],['rank','#rankSec'],['pick','#pickHead'],
           ['deal','#oyDealSec']],   // 20261020 'pick'은 구역이 화면보다 길어 25%가 한 번에 안 보임 → 구역 제목으로 봄 · 20261022 사장님: /shop 홈 '이번주 특가' 구역
      click:[['#mSubmitBtn','submit_click',function(){ return '상담 예약'; }],['#mKakaoBtn','submit_click',function(){ return '카톡 예약'; }],
             // v20261019: 상세 하단 [카톡 상담] → 카톡 간편 신청창, 그 안의 '카톡으로 상담 시작하기'
             ['#qkBtn','submit_click',function(){ return '카톡 간편'; }],['[data-qk]','qk_open',attr('data-qk')],['[data-qk-car]','qk_car',attr('data-qk-car')],['[data-qk-col]','qk_col',attr('data-qk-col')],
             ['[data-ap-pick]','ap_pick',attr('data-ap-pick')],
             ['[data-ap]','ap',function(el){ return el.getAttribute('data-ap')+'='+(el.getAttribute('data-v')||''); }],
             ['[data-ap-act]','ap_act',attr('data-ap-act')],
             ['[data-calc]','calc',function(el){ return (el.getAttribute('data-model')||'')+' '+el.getAttribute('data-calc')+'='+(el.getAttribute('data-v')||''); }],
             ['[data-opt-pick],[data-color-pick]','pick',function(el){ return (el.getAttribute('data-model')||'')+' '+(el.getAttribute('data-color-pick')||txt(el)); }],
             ['[data-wish]','wish',attr('data-wish')],
             ['[data-maxv]','maxv',function(el){ return el.classList.contains('on')?'끔':'켬'; }],['[data-sort]','sort',attr('data-sort')],   // 20261020
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
      if(v==='t' && h[1]) return 'tab:'+h[1]+(h[1]==='list'&&h[2]?'/'+h[2]:'');   // 20261022 사장님: /shop 위 탭 화면 (tab:deal 특가 · tab:rank 인기 모델 · tab:event 혜택/이벤트 · tab:ai AI추천 · tab:list/종류 분류 목록)
      if(v==='c') return 'cmenu'+(h[1]?':'+h[1]:'');   // 20261022 사장님: /shop 카테고리 화면 (cmenu:대분류)
      return /^(search|wish|apply)$/.test(v)?v:'home';
    }
    ev('view', (PAGE==='device'?(qs.get('id')||'')+' | ':'')+(STORE?scrKey()+' | ':'')+(ref||'-')+' | '+app+(os?' '+os:''));

    // ── 스토어: 화면마다 머문 초·내린 %, 신청서 진행 단계, 나갈 때 요약
    var cur=null, path=[], steps={};
    var STEPS=['kk','open','phone','carrier','name','tel','birth','agree','submit','lead'];
    var STEP_KO={kk:'카톡간편창',open:'신청서',phone:'휴대폰',carrier:'통신사',name:'이름',tel:'연락처',birth:'생년월일',agree:'동의',submit:'신청누름',lead:'접수완료'};
    function pctNow(){
      var h=Math.max(document.documentElement.scrollHeight, document.body?document.body.scrollHeight:0);
      return h?Math.min(100,((window.scrollY||window.pageYOffset)+window.innerHeight)/h*100):0;
    }
    function scrDesc(){ return cur?(cur.k+' '+Math.round((Date.now()-cur.t)/1000)+'s '+Math.round(cur.s)+'%'+(cur.taps.length?' ['+(cur.tcut?'…':'')+cur.taps.join('>')+']':'')):''; }
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
      var c0=cur={k:scrKey(), t:Date.now(), s:0, taps:[]};
      // 화면이 그려지고 스크롤 위치가 잡힌 뒤에 첫 위치를 잼 (짧은 화면은 안 내려도 끝까지 보임)
      setTimeout(function(){ if(cur===c0){ var p0=pctNow(); if(p0>cur.s) cur.s=p0; } }, 500);
      if(cur.k==='apply') formCheck();
    }
    function progress(){ var r=[]; STEPS.forEach(function(k){ if(steps[k]) r.push(STEP_KO[k]); }); return r.length?r.join('>'):'안 엶'; }
    function exitDetail(){
      var p=path.concat([scrDesc()]).join(' > '), head=app+(os?' '+os:'')+' | 신청서 '+progress()+' | ', room=600-head.length;
      if(p.length>room) p='…'+p.slice(p.length-room+1);
      return head+p;
    }
    // ── 10) v20261019 스토어 상세 화면: 위치(구간)별로 어디까지 봤고 · 어디에 오래 머물렀고 · 어디서 나갔고 · 뭘 눌렀는지 (전원)
    //   상세 화면을 떠날 때(다른 화면으로 가거나 페이지를 나갈 때) detail_exit 한 줄. 예:
    //   'fold8#1 | 52s | 끝 상담선택 | 마지막 할부금 | 사진3 컬러4 통신사9 할부금20 지원금6 | 바 번호이동 · 기기값 … | 누름 컬러:크림>통신사:SKT>카톡상담'
    //   · 끝 = 가장 아래까지 본 위치 · 마지막 = 나갈 때 보고 있던 위치 · 위치 뒤 숫자 = 그 위치를 보고 있던 초 · 바 = 아래 고정 줄(고른 조건·가격)
    // 20261020: 상세 정리 — '순서'(이 순서대로 하시면 돼요) 줄 없앰 · 지원금/꼭확인은 새로 바뀐 칸(.pv-sum/.pv-must1)
    // 20261021: 휴대폰 상세 순서가 통신사 → 내 가격 → 컬러 → 용량으로 바뀜 — '끝'은 목록 순서가 아니라 화면에서 가장 아래 있는 본 칸으로 셈
    //   '가격대기' = 통신사를 고르기 전 '내 가격' 자리(점선 칸)
    var MD_SECS=[['사진','.md-img'],['이름','.md-h'],['통신사','.mstep[data-step="car"]'],['가격대기','.pv-wait'],['할부금','.pv-hero'],['지원금','.pv-sum'],['꼭확인','.pv-must1'],
      ['요금제','.mstep-sub'],['월납부','.pv-more'],['가격','.ms-detail:not(.pv)'],['가이드','.guide'],['컬러','.mstep[data-step="color"]'],['용량','.mstep[data-step="cap"]'],['상담선택','.mstep.cs'],
      // 20261026 /shop 새 상세(폰슐랭샵 배치): 컬러사진 · 색상 · 용량칸 · 가입유형 · 요금제칸 · 지원금띠 · 할인방식 · 할부칸 · 계산표 · 아래 칸(구매혜택·유의사항·구매후기·모델정보)
      ['컬러사진','.pd-ths'],['색상','.pd-o[data-o="color"]'],['용량칸','.pd-o[data-o="cap"]'],['가입유형','.pd-o[data-o="jt"]'],['요금제칸','.pd-o[data-o="tier"]'],['지원금띠','.pd-our'],
      ['할인방식','.pd-o[data-o="method"]'],['할부칸','.pd-o[data-o="months"]'],['계산표','.pd-sum'],['구매혜택','#pdBen'],['유의사항','#pdNote'],['구매후기','#pdRev'],['모델정보','#pdInfo']];
    var MD=null, mdN=0;
    function mdStart(k){ MD=(k.indexOf('model:')===0)?{id:k.slice(6), n:++mdN, t:Date.now(), sec:{}, maxY:-1, maxNm:'', last:'', taps:[]}:null; if(MD) setTimeout(function(){ mdLook(false); }, 600); }
    function mdLook(add){
      try{
        if(!MD) return; var body=document.getElementById('mdBody'); if(!body) return;
        var vh=window.innerHeight||0, bar=document.getElementById('mdBar'), bt=bar?bar.getBoundingClientRect().top:vh, bottom=(bt>0&&bt<vh)?bt:vh;
        var sh=document.querySelector('#v-model .subhead'), top=sh?Math.max(0,sh.getBoundingClientRect().bottom):0, best=null, bestD=1e9;
        var line=top+(bottom-top)*0.45;   // 읽는 줄: 화면 가운데보다 조금 위
        var sH=Math.max(document.documentElement.scrollHeight, document.body?document.body.scrollHeight:0);
        if((window.scrollY||window.pageYOffset)+vh>=sH-4) line=bottom-8;   // 맨 아래까지 내렸으면 맨 아래 보이는 위치를 보고 있는 것
        for(var i=0;i<MD_SECS.length;i++){
          var el=body.querySelector(MD_SECS[i][1]); if(!el) continue;
          var r=el.getBoundingClientRect(), v=Math.min(r.bottom,bottom)-Math.max(r.top,top); if(v<=0) continue;
          if(v>=Math.min(r.height,bottom-top)*0.5){ var yy=r.top+(window.scrollY||window.pageYOffset||0); if(yy>MD.maxY){ MD.maxY=yy; MD.maxNm=MD_SECS[i][0]; } }   // 반 이상 보였으면 '봤다' — 그중 화면에서 가장 아래 칸이 '끝'
          var d=line<r.top?r.top-line:line>r.bottom?line-r.bottom:0;          // 읽는 줄에 걸친 위치 = 지금 보는 곳
          if(d<bestD){ bestD=d; best=MD_SECS[i][0]; }
        }
        if(best){ MD.last=best; if(add) MD.sec[best]=(MD.sec[best]||0)+1; }
      }catch(e){}
    }
    function mdDesc(){
      var secs=MD_SECS.map(function(p){ return MD.sec[p[0]]?p[0]+MD.sec[p[0]]:''; }).filter(Boolean).join(' ');
      var b=document.querySelector('#mdBar .md-bar-t'), bt=b?(b.textContent||'').replace(/\s+/g,' ').trim().slice(0,60):'';
      return MD.id+'#'+MD.n+' | '+Math.round((Date.now()-MD.t)/1000)+'s | 끝 '+(MD.maxNm||'-')+' | 마지막 '+(MD.last||'-')+' | '+(secs||'-')+(bt?' | 바 '+bt:'')+(MD.taps.length?' | 누름 '+MD.taps.join('>'):'');
    }
    function mdTap(s){ if(!MD||!s) return; MD.taps.push(String(s).slice(0,24)); if(MD.taps.length>14) MD.taps.shift(); }
    function mdTapOf(t){
      var el;
      if((el=t.closest('[data-color-pick]'))) return '컬러:'+el.getAttribute('data-color-pick');
      if((el=t.closest('[data-opt-pick]'))) return '용량:'+(el.textContent||'').replace(/품절/,'').trim();
      if((el=t.closest('[data-calc]'))){ var c=el.getAttribute('data-calc'), v=el.getAttribute('data-v')||''; return ({carrier:'통신사',method:'할인',months:'할부',jt:'가입유형'}[c]||c)+':'+({pub:'공시',sel:'선약','0':'일시납',mnp:'번호이동',chg:'기기변경'}[v]||v); }
      if((el=t.closest('[data-pd-tab]'))) return '아래칸:'+({ben:'구매혜택',note:'유의사항',rev:'구매후기',info:'모델정보'}[el.getAttribute('data-pd-tab')]||'');   // 20261026 /shop 새 상세
      if((el=t.closest('[data-pd-sum]'))) return '상세보기';
      if((el=t.closest('[data-pd-share]'))) return '공유';
      if((el=t.closest('[data-cert]'))) return '인증마크';   // 20261026 공통 그림 'U+ 공식 파트너사' 카드
      if((el=t.closest('[data-qk]'))) return el.closest('#mdBar')?'카톡상담(아래)':'카톡상담';
      if((el=t.closest('[data-open]'))) return el.getAttribute('data-open')==='consult'?(el.closest('#mdBar')?'상담신청(아래)':el.closest('.tabbar')?'상담신청(탭)':'전화상담'):'열기:'+el.getAttribute('data-open');
      if((el=t.closest('[data-mg]'))) return '순서:'+el.getAttribute('data-mg');
      if((el=t.closest('[data-md-go]'))) return '아래글';
      if((el=t.closest('[data-pv-x]'))) return '월납부열기';
      if((el=t.closest('[data-ms-tip]'))) return '설명:'+el.getAttribute('data-ms-tip');
      if((el=t.closest('[data-wish]'))) return '찜';
      if((el=t.closest('[data-back]'))) return '뒤로';
      if((el=t.closest('[data-home]'))) return '홈';
      if((el=t.closest('.tabbar a'))) return '탭:'+(el.getAttribute('data-tab')||'');
      if((el=t.closest('.side-quick a, .sq-hit'))) return /tel:/.test(el.getAttribute('href')||'')?'옆전화':'옆카톡';
      if((el=t.closest('#mdImg'))) return '사진';
      return null;
    }
    function mdEnd(){ if(MD){ mdLook(false); ev('detail_exit', mdDesc()); } }
    // ── 12) v20261020 스토어 홈·목록 화면에서 누른 것 (전원) — 나갈 때 요약(exit)의 그 화면 뒤 [ ] 안에 순서대로
    //   상세 화면은 위 10번 detail_exit '누름'에 이미 있어서 여기선 뺌. 화면마다 최근 8개까지 (넘치면 앞에 …)
    // 20261022 사장님: /shop 홈 '이번주 특가'(oyDealSec) 누름도 스토어처럼 '특가:모델'로
    var SEC_KO={hero:'배너',models:'모델',quick:'바로가기',trust:'신뢰',popSec:'인기',recentSec:'최근',zeroSec:'0원',wearSec:'워치',giftSec:'선물',
      rankSec:'순위',pickSec:'목록',oyDealSec:'특가',oyTabDeal:'특가탭',oyTabRank:'인기탭',oyTabZero:'0원탭',oyTabTv:'TV탭',oyTabEvent:'혜택탭',oyTabAi:'AI탭',oyTabList:'분류목록',oyTabCat:'카테고리','v-cat':'분류목록','v-search':'검색','v-wish':'찜'};
    function secOf(el){ var s=el.closest('#hero,#models,#quick,#trust,#popSec,#recentSec,#zeroSec,#wearSec,#giftSec,#rankSec,#pickSec,#oyDealSec,#oyTabDeal,#oyTabRank,#oyTabZero,#oyTabTv,#oyTabEvent,#oyTabAi,#oyTabList,#oyTabCat,#v-cat,#v-search,#v-wish'); return s?(SEC_KO[s.id]||s.id):''; }
    function goKey(g){ return String(g||'').replace(/^#\/?/,'').replace(/^model\//,''); }
    function tapOf(t){
      var el, s;
      if((el=t.closest('[data-maxv]'))) return '최대혜택:'+(el.classList.contains('on')?'끔':'켬');   // 누르는 순간(바뀌기 전) 켜져 있으면 → 끔
      if((el=t.closest('[data-mnp]'))) return el.getAttribute('data-mnp')==='1'?'번호이동':'기기변경';
      if((el=t.closest('[data-sort]'))) return '정렬:'+el.getAttribute('data-sort');
      if((el=t.closest('[data-sort-open]'))) return '정렬열기';
      if((el=t.closest('[data-cat]'))) return '분류:'+el.getAttribute('data-cat');
      if((el=t.closest('.dl-c'))) return '특가:'+(el.getAttribute('data-mid')||'');
      if((el=t.closest('a[href^="#/model/"]'))){ s=secOf(el); return (s?s+':':'')+goKey(el.getAttribute('href')); }
      if((el=t.closest('[data-go]'))){ s=secOf(el); return (s||'이동')+':'+goKey(el.getAttribute('data-go')); }
      if((el=t.closest('[data-video]'))) return '영상';
      if((el=t.closest('[data-store-i]'))) return '매장';
      if((el=t.closest('a[href^="tel:"]'))) return '전화';
      if((el=t.closest('a[href*="pf.kakao.com"]'))) return '카톡';
      return mdTapOf(t);   // 뒤로·홈·아래 탭·상담 버튼 등 공통
    }
    function scrTap(e){
      try{
        if(!cur || cur.k.indexOf('model:')===0 || !e.target || !e.target.closest) return;
        var s=tapOf(e.target); if(!s) return;
        cur.taps.push(String(s).slice(0,22)); if(cur.taps.length>8){ cur.taps.shift(); cur.tcut=true; }
      }catch(x){}
    }
    if(STORE){
      scrStart(); mdStart(cur.k);
      ev('screen', cur.k+' ← (처음)');   // 처음 화면 (광고에서 바로 상세로 들어온 경우도 PriceCheck 가 가게)
      window.addEventListener('hashchange', function(){
        var k=scrKey(); if(cur && k===cur.k) return;
        var prev=scrDesc(); if(prev){ path.push(prev); if(path.length>40) path.shift(); }
        mdEnd(); MD=null;
        scrStart(); mdStart(k);
        ev('screen', k+' ← '+(prev||'-'));
      });
      setInterval(function(){ if(MD && document.visibilityState==='visible') mdLook(true); }, 1000);
      window.addEventListener('scroll', function(){ if(!MD || mdLook._t) return; mdLook._t=setTimeout(function(){ mdLook._t=null; mdLook(false); }, 250); }, {passive:true});
      document.addEventListener('click', function(e){ try{ if(MD && e.target && e.target.closest) mdTap(mdTapOf(e.target)); }catch(x){} }, true);
      document.addEventListener('click', scrTap, true);   // 12) 홈·목록 화면 누름
      document.addEventListener('change', function(e){ try{ var el=e.target; if(MD && el && el.getAttribute && el.getAttribute('data-calc-sel')==='tier'){ var o=el.selectedOptions&&el.selectedOptions[0]; mdTap('요금제:'+((o&&o.textContent)||el.value).replace(/\s+/g,'')); } }catch(x){} }, true);
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
        if(STORE){ var ce=t.closest('[data-calc="carrier"],[data-ap="carrier"],[data-qk-car]'); if(ce) carPick(ce); }   // 11) 번호이동 신호
        for(var i=0;i<cfg.click.length;i++){
          var c=cfg.click[i], el=t.closest(c[0]);
          if(el){ ev(c[1], c[2]?c[2](el):null); hit=true;
            if(STORE && c[1]==='submit_click'){ if(c[0]!=='#qkBtn') formCheck(); steps.submit=1; }
            if(STORE && c[1]==='qk_open') steps.kk=1;   // v20261019: 상세 [카톡 상담] 간편 신청창을 엶
            break; }
        }
        var a=t.closest('a[href]'), h=a?(a.getAttribute('href')||''):'';
        if(!hit && a){ if(/^tel:/.test(h)) ev('call'); else if(/pf\.kakao\.com/.test(h)) ev('kakao'); }
        // 다른 페이지로 넘어가는 링크면 지금 바로 보냄 (넘어가는 중에도 전달되게)
        if(a && h && h.charAt(0)!=='#' && !/^javascript:/i.test(h)) flush(true);
        else if(hit) flush(false);
      }catch(err){}
    }, true);

    // 5) 신청서 칸을 처음 건드림 (칸마다 한 번) — 어느 칸에서 멈추는지 보기 위함
    //    신청서 칸만 신청서 시작으로 셈 (아이폰 rf*, 갤럭시 m*, 상세 dr*, 스토어 카톡 간편 qk*) — 소개 영상 진행바·상세 계산기 칸은 제외
    document.addEventListener('focusin', function(e){
      var el=e.target; if(!el||!/^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName)) return;
      var id=el.id||el.name; if(!id) return;
      if(/^(rf|dr|m[A-Z]|qk[A-Z])/.test(id)) ev('form_start', id, 'x');
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
      if(STORE){ try{ formCheck(); }catch(e){} try{ mdEnd(); }catch(e){} ev('exit', exitDetail()); }   // 스토어: 몇 초 · 신청서 어디까지 · 거쳐 간 화면 (전원) + 상세 화면이면 위치별 요약
      else ev('leave', Math.round(maxS));
      flush(true); }
    window.addEventListener('pagehide', leave);
    document.addEventListener('visibilitychange', function(){ if(document.visibilityState==='hidden') leave(); else left=false; });
  }catch(e){}
})();
