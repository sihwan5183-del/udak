/* udak 랜딩 이탈 분석 (v20261006d — 신청서 요약 카드 버튼 기록 추가) — 개인정보 없이 '어디까지 봤고 어디서 나갔는지'만 익명으로 기록
   기록처: Supabase landing_events (랜딩은 쓰기만 가능, 읽기 불가)
   직원·내부 확인 방문 표시: 주소 뒤에 ?internal=1 로 한 번 열면 그 브라우저는 내부 방문으로 표시됨 (?internal=0 으로 해제) */
(function(){
  try{
    var S=document.currentScript;
    var PAGE=(S&&S.getAttribute('data-page'))||(location.pathname.replace(/^\/|\.html$/g,'')||'home');
    var API='https://ebggtghzqtxfylbhqfoh.supabase.co/rest/v1/landing_events';
    var KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZ2d0Z2h6cXR4ZnlsYmhxZm9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNDk4MzgsImV4cCI6MjA5NjgyNTgzOH0.bPqIVbrnh2I9pi9rBQzQNOXQcG8v5WbBauZynkED_-Q';
    var origFetch=window.fetch?window.fetch.bind(window):null;
    if(!origFetch) return;

    function sget(k){ try{ return sessionStorage.getItem(k); }catch(e){ return null; } }
    function sset(k,v){ try{ sessionStorage.setItem(k,v); }catch(e){} }
    var sid=sget('udak_sid');
    if(!sid){ sid=(Date.now().toString(36)+Math.random().toString(36).slice(2,10)).slice(0,24); sset('udak_sid',sid); }
    var qs=new URLSearchParams(location.search);
    if(qs.get('internal')==='1'){ try{ localStorage.setItem('udak_internal','1'); }catch(e){} }
    if(qs.get('internal')==='0'){ try{ localStorage.removeItem('udak_internal'); }catch(e){} }
    var internal=false; try{ internal=localStorage.getItem('udak_internal')==='1'; }catch(e){}
    // 광고 정보: 처음 들어온 주소의 utm 을 이 방문 동안 유지 (상세 페이지로 넘어가도 같은 광고로 묶임)
    var src={ s:qs.get('utm_source'), c:qs.get('utm_campaign'), a:qs.get('utm_content'), f:qs.has('fbclid') };
    if(src.s||src.c||src.a||src.f){ sset('udak_src',JSON.stringify(src)); }
    else { try{ src=JSON.parse(sget('udak_src')||'{}')||{}; }catch(e){ src={}; } }

    var q=[], t0=Date.now(), maxS=0, done={};
    function ev(name, detail, onceKey){
      try{
        if(onceKey!==undefined){ var k=name+'|'+onceKey; if(done[k]) return; done[k]=1; }
        q.push({ sid:sid, page:PAGE, event:String(name).slice(0,40), detail:(detail==null?null:String(detail).slice(0,300)),
          sec:Math.round((Date.now()-t0)/1000), vw:(window.innerWidth||null),
          utm_source:src.s||null, utm_campaign:src.c||null, utm_content:src.a||null, fbclid:!!src.f, internal:internal });
        if(q.length>=8) flush(false);
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
    setInterval(function(){ flush(false); }, 3000);

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
               ['.mfs-edit','form_edit',txt],['.mfs-car-row button','form_carrier',function(el){ return el.getAttribute('data-car'); }],['.mfs-more-btn','calc_more'],['.mf-note-add','note_add']]
      },
      device:{
        see:[['carrier','#udCarrier'],['discount','#udDiscount'],['price_detail','#udSubsidyWrap'],['buttons','.udetail-btn-order']],
        click:[['#udCarrier .ud-chip','carrier',txt],['#udColors .ud-color','color'],['.udetail-btn-consult','consult_btn'],
               ['.udetail-btn-order','order_btn'],['.modal-submit','submit_click'],['.dtopbar-back','back'],['.side-quick-btn','quick',txt]]
      },
      iphone18:{
        see:[['preorder_info','#preorderInfo'],['models','#duoInline'],['benefit_imgs','.b-stack'],['form','#reserveForm']],
        click:[['.pm-swatch','pick_color',function(el){ return el.getAttribute('data-color'); }],['.b-storage-badge','pick_cap',txt],
               ['.pm-badge[data-carrier]','pick_carrier',txt],['.pm-badge[data-months]','pick_months',txt],
               ['.b-modal-cta','card_cta'],['.bottom-cta-btn','cta_bottom',function(el){ return el.classList.contains('scta-on')?'이 조건으로':null; }],['#rfSubmitBtn','submit_click'],['.about-trigger','about_video'],
               ['.m-hdr-hit','hdr',lbl],['.top-nav-item','topnav',txt],['.nav-drawer-item','menu',txt],['.side-quick-btn','quick',txt],
               ['.mfs-edit','form_edit',txt],['.mfs-car-row button','form_carrier',function(el){ return el.getAttribute('data-car'); }],['.mf-note-add','note_add']]
      }
    };
    var cfg=CFG[PAGE]||{see:[],click:[]};

    // 1) 들어옴
    var ref=''; try{ ref=document.referrer?new URL(document.referrer).hostname:''; }catch(e){}
    // 어떤 앱·OS에서 열었는지 (예: 'IG iOS 27.0.1') — 특정 앱·기종에서만 신청이 막히는지 확인용
    var ua=navigator.userAgent||'', app=/Instagram/.test(ua)?'IG':/FBAN|FBAV|FB_IAB/.test(ua)?'FB':/KAKAOTALK/i.test(ua)?'KAKAO':/NAVER/.test(ua)?'NAVER':/SamsungBrowser/.test(ua)?'Samsung':/CriOS|Chrome\//.test(ua)?'Chrome':/Safari\//.test(ua)?'Safari':'기타';
    var os=(ua.match(/OS (\d+)_(\d+)(?:_(\d+))? like Mac/)||[]).slice(1).filter(Boolean).join('.'); os=os?('iOS '+os):((ua.match(/Android ([\d.]+)/)||[])[1]?('Android '+ua.match(/Android ([\d.]+)/)[1]):(/Windows/.test(ua)?'Windows':/Mac OS X/.test(ua)?'Mac':''));
    ev('view', (PAGE==='device'?(qs.get('id')||'')+' | ':'')+(ref||'-')+' | '+app+(os?' '+os:''));

    // 2) 스크롤 깊이 25/50/75/100
    function onScroll(){
      var h=Math.max(document.documentElement.scrollHeight, document.body?document.body.scrollHeight:0);
      var pct=h?Math.min(100,((window.scrollY||window.pageYOffset)+window.innerHeight)/h*100):0;
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
          if(el){ ev(c[1], c[2]?c[2](el):null); hit=true; break; }
        }
        var a=t.closest('a[href]'), h=a?(a.getAttribute('href')||''):'';
        if(!hit && a){ if(/^tel:/.test(h)) ev('call'); else if(/pf\.kakao\.com/.test(h)) ev('kakao'); }
        // 다른 페이지로 넘어가는 링크면 지금 바로 보냄 (넘어가는 중에도 전달되게)
        if(a && h && h.charAt(0)!=='#' && !/^javascript:/i.test(h)) flush(true);
        else if(hit) flush(false);
      }catch(err){}
    }, true);

    // 5) 신청서 칸을 처음 건드림 (칸마다 한 번) — 어느 칸에서 멈추는지 보기 위함
    document.addEventListener('focusin', function(e){
      var el=e.target; if(!el||!/^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName)) return;
      var id=el.id||el.name; if(!id) return;
      ev('form_start', id, 'x'); ev('field', id, id);
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
          p.then(function(r){ ev(r.ok?'lead':'submit_fail', r.ok?null:('HTTP '+r.status)); flush(false); },
                 function(err){ ev('submit_fail','network: '+((err&&err.message)||err)); flush(false); });
        }
      }catch(e){}
      return p;
    };

    // 8) 나감 — 마지막으로 어디까지 내렸는지
    var left=false;
    function leave(){ if(left) return; left=true; ev('leave', Math.round(maxS)); flush(true); }
    window.addEventListener('pagehide', leave);
    document.addEventListener('visibilitychange', function(){ if(document.visibilityState==='hidden') leave(); else left=false; });
  }catch(e){}
})();
