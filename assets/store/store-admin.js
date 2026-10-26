/* =========================================================
   유플러스 다이렉트 스토어 — 관리자(애플 페이지) 편집 기능
   고객 화면(갤럭시)과 똑같은 화면을 띄우고, 누르면 그 자리에서 수정 → '적용' 누르면 갤럭시에 바로 반영
   ========================================================= */
(function(){
'use strict';
var T = window.STORE; if(!T) return;
var esc=T.esc, DB=T.DB;
function $(s,el){return (el||document).querySelector(s)}
function $$(s,el){return Array.prototype.slice.call((el||document).querySelectorAll(s))}
var LAST=null;      // 마지막으로 저장된 상태 (되돌리기 기록용)
// 20261026 사장님: 관리자 화면 = /shop 거울 (apple.html 이 shop.js 를 먼저 불러서 /shop 화면 그대로) · /apple?view=store 는 예전 스토어 화면
var SHOPV=!!(window.STORE_CFG && window.STORE_CFG.skin);
var CUR=null;       // 지금 열린 편집 대상 키

/* ---------- 상단 관리자 바 ---------- */
document.body.insertAdjacentHTML('afterbegin',
  '<div class="adm-bar"><div class="ttl">관리자 · '+(SHOPV?'/shop 연동':'스토어 연동')+'<small id="admSub">누르면 수정 → 적용 시 바로 반영</small></div>'+
  '<button id="admEdit" class="on">편집 ON</button><button id="admPrice" class="pr">💰 가격표</button><button id="admAdd">＋ 추가</button><button id="admSet">⚙ 설정</button><button id="admUndo">↶</button></div>'+
  '<div class="adm-toast" id="admToast"></div>');
var toastT;
function toast(m){ var t=$('#admToast'); t.textContent=m; t.classList.add('on'); clearTimeout(toastT); toastT=setTimeout(function(){t.classList.remove('on')},2600); }

/* ---------- 저장 ---------- */
function snapshot(){ var o=T.clone(T.S); return o; }
// 저장: 이 화면에서 바뀐 칸(최상위 항목)만 덮어씀 — 다른 창·다른 사람이 바꾼 다른 칸은 그대로 둠
function save(msg){
  var now=Date.now(), cur=snapshot(), base=LAST||{}, patch={};
  Object.keys(cur).forEach(function(k){ if(k!=='updatedAt' && JSON.stringify(cur[k])!==JSON.stringify(base[k])) patch[k]=cur[k]; });
  Object.keys(base).forEach(function(k){ if(k!=='updatedAt' && !(k in cur)) patch[k]=null; });
  patch.updatedAt=now; T.S.updatedAt=now; T.setStamp(now);
  $('#admSub').textContent='저장 중…';
  return fetch(DB+'/store.json',{cache:'no-store'}).then(function(r){ return r.ok?r.json():null; })
    .then(function(remote){ return remote ? fetch(DB+'/store_history/'+now+'.json',{method:'PUT',body:JSON.stringify(remote)}) : null; })
    .then(function(){ return fetch(DB+'/store.json',{method:'PATCH',body:JSON.stringify(patch)}); })
    .then(function(r){ if(!r.ok) throw new Error('HTTP '+r.status); return fetch(DB+'/store.json',{cache:'no-store'}); })
    .then(function(r){ return r.json(); })
    .then(function(d){ T.setStamp(0); T.apply(d); LAST=T.clone(T.S); T.setStamp(now); $('#admSub').textContent='반영 완료 · '+new Date(now).toLocaleTimeString('ko-KR'); toast(msg||'고객 화면에 반영됐어요'); })
    .catch(function(e){ $('#admSub').textContent='저장 실패'; alert('저장에 실패했어요. 인터넷 연결을 확인하고 다시 적용해 주세요.\n('+e.message+')'); });
}
function commit(msg){ T.refresh(); return save(msg); }
window.__stCommit=commit; window.__stToast=toast;

/* ---------- 입력칸 만들기 ---------- */
function txt(name,label,val,ph,extra){ return '<div class="grp"><div class="lbl">'+label+'</div><input type="text" name="'+name+'" value="'+esc(val==null?'':val)+'" placeholder="'+esc(ph||'')+'" '+(extra||'')+'></div>'; }
function area(name,label,val,rows){ return '<div class="grp"><div class="lbl">'+label+'</div><textarea name="'+name+'" rows="'+(rows||3)+'">'+esc(val||'')+'</textarea></div>'; }
function sw(name,label,on,danger){ return '<div class="grp"><label class="sw'+(danger?' danger':'')+'">'+label+'<input type="checkbox" name="'+name+'"'+(on?' checked':'')+'></label></div>'; }
function thumb(v){ return v ? T.im(v,'',true) : '<div class="ph">없음</div>'; }
function imgField(name,label,folder,val,auto){
  return '<div class="grp"><div class="lbl">'+label+'</div><div class="imgf"><div class="th" data-th="'+name+'">'+thumb(val||auto)+'</div><div class="rt">'+
    '<input type="text" name="'+name+'" value="'+esc(val||'')+'" placeholder="'+esc(auto||(folder+'/파일명.jpg'))+'">'+
    '<button type="button" class="btn2" data-ed="gal" data-for="'+name+'" data-folder="'+folder+'">사진 고르기 (깃허브 '+folder+' 폴더)</button></div></div>'+
    (auto?'<div class="hint">비워두면 기본 파일 <b>'+esc(auto)+'</b> 를 씁니다.</div>':'')+
    '<div data-galfor="'+name+'"></div></div>';
}
function goField(name,val){
  var opts=T.GO_OPTIONS.map(function(o){return '<option value="'+esc(o[0])+'"'+(o[0]===val?' selected':'')+'>'+esc(o[1])+'</option>'}).join('');
  T.S.models.forEach(function(m){ var v='#/model/'+m.id; opts+='<option value="'+esc(v)+'"'+(v===val?' selected':'')+'>'+esc(m.nm)+' 상세</option>'; });
  return '<div class="grp"><div class="lbl">누르면 이동</div><select data-gosel="'+name+'"><option value="">— 고르기 —</option>'+opts+'</select>'+
    '<input type="text" name="'+name+'" value="'+esc(val||'')+'" placeholder="또는 주소 직접 입력 (https://…)" style="margin-top:6px"></div>';
}
function moveBtns(del){ return '<div class="btns"><button type="button" class="btn2" data-ed="left">◀ 앞으로</button><button type="button" class="btn2" data-ed="right">뒤로 ▶</button>'+(del?'<button type="button" class="btn2 del" data-ed="del">삭제</button>':'')+'</div>'; }
function applyBtn(){ return '<button type="button" class="cta" data-ed="apply">적용 (고객 화면에 바로 반영)</button>'; }
function V(n){ var el=$('#sheet [name="'+n+'"]'); return el?el.value.trim():''; }
function C(n){ var el=$('#sheet [name="'+n+'"]'); return !!(el&&el.checked); }
function open(title, html){ T.openSheet('<div class="ed"><h3>'+title+'</h3>'+html+'</div>'); }

/* ---------- 편집 대상별 화면 ---------- */
var CATS=[['iphone','아이폰'],['galaxy','갤럭시 S'],['fold','폴더블'],['buddy','갤럭시 버디'],['watch','워치'],['tablet','태블릿'],['tvfree','TV프리'],['zero','기기값 0원 모아보기']];
function edModel(m){
  var srs=T.sheetRows(m);
  return txt('nm','모델 이름',m.nm)+txt('ds','한 줄 설명',m.ds)+
    '<div class="grp"><div class="lbl">태그 2개 (카드의 분홍 글씨)</div><div class="row2c"><input type="text" name="tag0" value="'+esc(m.tags[0]||'')+'"><input type="text" name="tag1" value="'+esc(m.tags[1]||'')+'"></div></div>'+
    (srs.length ? '<div class="grp"><div class="lbl">가격</div><div class="pz-link">💰 가격표에서 관리 중 · '+srs.map(function(r){return esc(r.cap||'기본')+(r.so?'(품절)':'')}).join(', ')+
      '<button type="button" class="btn2" data-ed="price" data-model="'+esc(m.id)+'">가격표 열기</button></div><div class="hint">출고가·지원금·용량별 품절은 가격표에서 바꿉니다. 아래 "일시품절"을 켜면 모든 용량이 품절로 보입니다.</div></div>' : (
    '<div class="grp"><div class="lbl">가격 (원, 숫자만 · 비우면 "상담 시 안내")</div><div class="row3c">'+
      '<input type="text" inputmode="numeric" name="out" placeholder="출고가" value="'+esc(m.price.out==null?'':m.price.out)+'">'+
      '<input type="text" inputmode="numeric" name="mnp" placeholder="번호이동" value="'+esc(m.price.mnp==null?'':m.price.mnp)+'">'+
      '<input type="text" inputmode="numeric" name="chg" placeholder="기기변경" value="'+esc(m.price.chg==null?'':m.price.chg)+'"></div>'+
      '<div class="hint">왼쪽부터 출고가 / 번호이동 구매가 / 기기변경 구매가. 0 을 넣으면 "0원"으로 표시됩니다.</div></div>'+
    area('opts','워치·태블릿처럼 사이즈별 가격일 때 — 한 줄에 하나씩 "사이즈 | 출고가 | 이통사 지원금"',T.optsOf(m).map(function(o){return [o.nm,o.out==null?'':o.out,o.sub==null?'':o.sub].join(' | ')}).join('\n'),3)+
    '<div class="hint">이 칸을 채우면 위 가격(번호이동/기기변경) 대신 "출고가 - 지원금 = 구매가"로 표시됩니다. 휴대폰은 비워두세요. 💰 가격표에서 이 모델을 연결하면 가격표 값이 우선합니다.</div>'))+
    sw('pubOnly','할인 방식은 공시지원금만 (선택약정 안 보이게 — 갤럭시 버디 5처럼 공시지원금으로 0원인 모델)',m.pubOnly)+   // 20261026 사장님
    sw('soldout','일시품절 표시',m.soldout,true)+sw('hidden','고객 화면에서 숨기기',m.hidden)+
    '<div class="grp"><div class="lbl">분류 (탭·모아보기에 나오는 곳)</div><div class="chk-row">'+CATS.map(function(c){return '<label><input type="checkbox" name="cat_'+c[0]+'"'+(m.cat.indexOf(c[0])>-1?' checked':'')+'> '+c[1]+'</label>'}).join('')+'</div></div>'+
    txt('strip','카드 띠 문구 (비우면 자동)',m.strip,'번호이동 시 '+(m.tags[0]||'')+' + '+(m.tags[1]||''))+
    area('colors','컬러 — 한 줄에 하나씩 "컬러명 | #색코드 | 사진"',T.colorsOf(m).map(function(c){return [c.nm,c.hex||'',c.img||''].join(' | ')}).join('\n'),4)+
    '<div class="hint">사진은 깃허브 경로(model/파일.webp) 또는 https 주소. 첫 줄 컬러가 대표 사진이 되고, 상세 화면에서 컬러를 누르면 사진이 바뀝니다.</div>'+
    imgField('img','대표 사진 (비우면 첫 번째 컬러 사진)','model',m.img,'')+
    imgField('c0','큰 카드 사진 ① 왼쪽 큰 칸','card',m.cards[0],'card/'+m.id+'-1.jpg')+
    imgField('c1','큰 카드 사진 ② 오른쪽 위','card',m.cards[1],'card/'+m.id+'-2.jpg')+
    imgField('c2','큰 카드 사진 ③ 오른쪽 아래','card',m.cards[2],'card/'+m.id+'-3.jpg')+
    // 20261026 /shop 상세 아래 칸 (구매혜택 · 유의사항 · 구매후기 · 모델정보) — 그림을 한 줄에 하나씩, 위에서부터 차례로 보임
    '<div class="grp"><div class="lbl">상세 내용 그림 (/shop 상세 아래 칸)</div><div class="hint">한 줄에 그림 하나 — 깃허브 <b>assets/store/detail/</b> 에 올린 파일(예: detail/'+esc(m.id)+'-1.webp) 또는 https 주소. 구매후기는 그림을 넣어야 칸이 생겨요.</div></div>'+
    [['ben','구매혜택'],['note','유의사항'],['rev','구매후기'],['info','모델정보']].map(function(x){ var v=((m.dt||{})[x[0]]||[]).join('\n');
      return area('dt_'+x[0],'상세 내용 그림 · '+x[1],v,2)+'<div class="btns" style="margin-top:-4px"><button type="button" class="btn2" data-ed="gal" data-for="dt_'+x[0]+'" data-folder="detail">사진 고르기 (깃허브 detail 폴더 · 고르면 한 줄 추가)</button></div><div data-galfor="dt_'+x[0]+'"></div>'; }).join('')+
    '<div class="hint">모델 코드: <b>'+esc(m.id)+'</b> (사진 파일 이름에 쓰는 이름)</div>'+
    moveBtns(true)+applyBtn();
}
function saveModel(m){
  m.nm=V('nm')||m.nm; m.ds=V('ds'); m.tags=[V('tag0'),V('tag1')].filter(Boolean); m.strip=V('strip')||null;
  if($('#sheet [name="out"]')) m.price={out:T.num(V('out')), mnp:T.num(V('mnp')), chg:T.num(V('chg'))};
  if($('#sheet [name="opts"]')) m.opts=V('opts').split('\n').map(function(l){ var p=l.split('|').map(function(x){return x.trim()}); return p[0]?{nm:p[0],out:T.num(p[1]),sub:T.num(p[2])}:null; }).filter(Boolean);
  m.soldout=C('soldout'); m.hidden=C('hidden'); m.pubOnly=C('pubOnly');
  m.cat=CATS.map(function(c){return c[0]}).filter(function(k){return C('cat_'+k)});
  m.colors=V('colors').split('\n').map(function(l){ var p=l.split('|').map(function(x){return x.trim()}); return p[0]?{nm:p[0],hex:p[1]||'',img:p[2]||null}:null; }).filter(Boolean);
  m.img=V('img')||null; m.cards=[V('c0')||null,V('c1')||null,V('c2')||null];
  if(!m.cards[0]&&!m.cards[1]&&!m.cards[2]) m.cards=[];
  // 20261026 /shop 상세 내용 그림 (칸마다 한 줄에 하나) — 다 비면 지움
  if($('#sheet [name="dt_ben"]')){ var dt={}; ['ben','note','rev','info'].forEach(function(k){ var l=V('dt_'+k).split('\n').map(function(x){ return x.trim(); }).filter(Boolean); if(l.length) dt[k]=l; });
    if(Object.keys(dt).length) m.dt=dt; else delete m.dt; }
}
var ED = {
  // 20261026 /shop 메인 배너 (통이미지) — 그림 · 이름 · 누르면 가는 곳 · 숨기기 · 순서
  bn:{
    title:function(i){ return '🖼 메인 배너 '+(+i+1); }, list:function(){ return T.S.bn; },
    html:function(i){ var b=T.S.bn[i];
      return imgField('img','배너 그림 (가로 1392 × 세로 1130 · 글씨까지 그림 안에)','banner',b.img)+
        '<div class="hint">새 그림은 깃허브 assets/store/banner/ 에 올린 뒤 고르거나 이름을 넣으세요 (예: banner/bn-04.webp).</div>'+
        txt('nm','배너 이름 (배너 전체보기 목록에 나오는 이름)',b.nm)+goField('go',b.go)+sw('hidden','숨기기',b.hidden)+moveBtns(true)+applyBtn(); },
    save:function(i){ var b=T.S.bn[i]; b.img=V('img')||null; b.nm=V('nm'); b.go=V('go'); b.hidden=C('hidden'); }
  },
  model:{
    title:function(id){ var m=T.byId(id); return '📱 '+esc(m?m.nm:''); },
    list:function(){ return T.S.models; }, find:function(id){ return T.byId(id); },
    html:function(id){ return edModel(T.byId(id)); },
    save:function(id){ saveModel(T.byId(id)); }
  },
  hero:{
    title:function(i){ return '🖼 히어로 슬라이드 '+(+i+1); }, list:function(){ return T.S.hero; },
    html:function(i){ var h=T.S.hero[i]; return txt('k','첫째 줄 (U+ 로 시작하면 로고 표시)',h.k)+txt('t','둘째 줄 (비우면 숨김)',h.t)+txt('s','설명 (비우면 숨김)',h.s)+area('sup','지원금 표 — 한 줄에 하나: 모델|번호이동|기기변경 (모델 비우면 한 줄형)',h.sup,3)+
      imgField('img','사진','hero',h.img)+goField('go',h.go)+sw('full','사진만 크게 (글자 숨김 · 배너형)',h.full)+sw('hidden','숨기기',h.hidden)+moveBtns(true)+applyBtn(); },
    save:function(i){ var h=T.S.hero[i]; h.k=V('k'); h.t=V('t'); h.s=V('s'); h.sup=V('sup')||null; h.img=V('img')||null; h.go=V('go'); h.full=C('full'); h.hidden=C('hidden'); }
  },
  promo:{
    title:function(){ return '🎀 프로모 배너'; },
    html:function(){ var p=T.S.promo; return txt('tag','분홍 꼬리표',p.tag)+txt('t','제목',p.t)+txt('s','설명',p.s)+imgField('img','사진','promo',p.img)+goField('go',p.go)+
      sw('full','사진만 크게 (글자 숨김 · 배너형)',p.full)+sw('hidden','숨기기',p.hidden)+applyBtn(); },
    save:function(){ var p=T.S.promo; p.tag=V('tag'); p.t=V('t'); p.s=V('s'); p.img=V('img')||null; p.go=V('go'); p.full=C('full'); p.hidden=C('hidden'); }
  },
  quick:{
    title:function(i){ return '🔘 퀵메뉴 · '+esc(T.S.quick[i].nm); }, list:function(){ return T.S.quick; },
    html:function(i){ var q=T.S.quick[i]; return txt('nm','이름',q.nm)+goField('go',q.go)+sw('hidden','숨기기',q.hidden)+moveBtns(false)+applyBtn(); },
    save:function(i){ var q=T.S.quick[i]; q.nm=V('nm'); q.go=V('go'); q.hidden=C('hidden'); }
  },
  trust:{
    title:function(){ return '✅ 신뢰 문구'; }, list:function(){ return T.S.trust; },
    html:function(i){ var t=T.S.trust[i]; return txt('b','굵은 글씨',t.b)+txt('s','작은 글씨',t.s)+sw('hidden','숨기기',t.hidden)+moveBtns(false)+applyBtn(); },
    save:function(i){ var t=T.S.trust[i]; t.b=V('b'); t.s=V('s'); t.hidden=C('hidden'); }
  },
  gift:{
    title:function(i){ return '🎁 사은품 · '+esc(T.S.gifts[i].nm); }, list:function(){ return T.S.gifts; },
    html:function(i){ var g=T.S.gifts[i]; return txt('nm','이름',g.nm)+txt('sm','윗줄 작은 글씨',g.sm)+txt('pr','아랫줄 굵은 글씨',g.pr)+imgField('img','사진','gift',g.img)+
      goField('go',g.go||'consult')+sw('hidden','숨기기',g.hidden)+moveBtns(true)+applyBtn(); },
    save:function(i){ var g=T.S.gifts[i]; g.nm=V('nm'); g.sm=V('sm'); g.pr=V('pr'); g.img=V('img')||null; g.go=V('go'); g.hidden=C('hidden'); }
  },
  ship:{
    title:function(){ return '🚚 당일 출발 안내'; },
    html:function(){ var d=T.S.ship||{}; return sw('on','켜기',d.on)+txt('cut','당일 발송 마감 시각 (24시간, 예: 15:00)',d.cut||'15:00')+
      '<div class="hint">월~금 마감 전에는 "오늘 출발 + 남은 시간", 마감 후·토·일에는 다음 발송일(내일/월요일)이 자동으로 나와요.</div>'+applyBtn(); },
    save:function(){ var c=(V('cut')||'15:00').replace(/[^0-9:]/g,''); T.S.ship={on:C('on'), cut:/^\d{1,2}(:\d{2})?$/.test(c)?c:'15:00'}; }
  },
  // 20261026 사장님: 모든 휴대폰 상세 '구매혜택' 칸 맨 아래 공통 그림 (다 지우면 안 나옴)
  dtc:{
    title:function(){ return '📄 모든 휴대폰 공통 상세 그림'; },
    html:function(){ var c=T.S.dtc||{}, v=c.off?'':(c.ben||[]).join('\n');
      return area('dtc_ben','구매혜택 칸 맨 아래 — 모든 휴대폰 상세에 똑같이 나와요 (한 줄에 그림 하나 · 위에서부터 차례로)',v,5)+
        '<div class="btns" style="margin-top:-4px"><button type="button" class="btn2" data-ed="gal" data-for="dtc_ben" data-folder="detail">사진 고르기 (깃허브 detail 폴더 · 고르면 한 줄 추가)</button></div><div data-galfor="dtc_ben"></div>'+
        '<div class="hint">다 지우고 적용하면 공통 그림이 안 나와요. 한 모델에만 넣을 그림은 그 모델 편집 → \'상세 내용 그림\'에 넣으세요. 줄 끝의 #1080x1990 같은 글자는 그림 크기예요 (그대로 두세요).</div>'+applyBtn(); },
    save:function(){ var l=V('dtc_ben').split('\n').map(function(x){ return x.trim(); }).filter(Boolean); T.S.dtc=l.length?{ben:l}:{off:true}; }
  },
  deal:{
    title:function(){ return '🔥 이번 주 특가 (맨 위)'; },
    html:function(){ var d=T.S.deal||{}; return sw('on','켜기 (끄면 예전 슬라이드 배너가 보여요)',d.on)+txt('title','제목 (마지막 단어가 분홍색)',d.title||'이번주 특가')+
      area('items','모델 — 한 줄에 하나 (2칸씩 뱃지로 나열)\n모델은 이름(예: 폴드8) 또는 코드(예: fold8) · 구매가(번호이동/기기변경)는 가격표에서 자동 계산',d.items,4)+
      '<div class="hint">날짜(이번 주 월~일)는 자동으로 바뀌어요.</div>'+applyBtn(); },
    save:function(){ T.S.deal={on:C('on'), title:V('title')||'이번주 특가', items:V('items')}; }
  },
  brand:{
    title:function(){ return '🏷 상단 브랜드'; },
    html:function(){ var b=T.S.brand; return txt('small','윗줄',b.small)+txt('big','분홍 큰 글씨',b.big)+txt('trust','신뢰 문구 (비우면 숨김)',b.trust==null?'U+ 최초의 온라인 대리점':b.trust)+applyBtn(); },
    save:function(){ T.S.brand={small:V('small'), big:V('big'), trust:V('trust')}; }
  },
  foot:{
    title:function(){ return '📄 회사 소개 · 하단 정보'; },
    html:function(){ var b=T.S.biz||{}; return txt('b_name','상호명',b.name)+txt('b_ceo','대표자',b.ceo)+txt('b_addr','사업장 주소',b.addr)+txt('b_no','사업자등록번호',b.no)+txt('b_sale','통신판매업 신고번호',b.sale)+
      txt('b_email','이메일',b.email)+txt('b_hours','상담시간',b.hours)+'<div class="hint">대표 전화번호·카카오톡 주소는 ⚙ 설정에서 바꿉니다.</div>'+applyBtn(); },
    save:function(){ T.S.biz={name:V('b_name'),ceo:V('b_ceo'),addr:V('b_addr'),no:V('b_no'),sale:V('b_sale'),email:V('b_email'),hours:V('b_hours')}; }
  },
  sec:{
    title:function(k){ return '📑 구역 제목'; },
    html:function(k){
      var s=T.S.sec[k]||{}, h=txt('t','제목',s.t)+txt('s','제목 위 작은 글씨 (선택)',s.s)+sw('off','이 구역 통째로 숨기기',s.off);
      if(k==='rank'||k==='pop'||k==='zero'){ var arr=listArr(k);
        h+='<div class="grp"><div class="lbl">'+(k==='rank'?'순위':'보여줄 모델')+' (◀▶ 로 순서, ✕ 로 빼기)</div><div class="mlist" id="rankList">'+rankList(k)+'</div>'+
        '<select data-rankadd data-k="'+k+'" style="margin-top:8px"><option value="">＋ 모델 추가</option>'+T.S.models.filter(function(m){return arr.indexOf(m.id)<0}).map(function(m){return '<option value="'+esc(m.id)+'">'+esc(m.nm)+'</option>'}).join('')+'</select></div>'; }
      return h+applyBtn();
    },
    save:function(k){ var s=T.S.sec[k]=T.S.sec[k]||{}; s.t=V('t'); s.s=V('s')||null; s.off=C('off');
      if((k==='pop'||k==='zero')&&T.S.lists&&T.S.lists[k]&&!T.S.lists[k].length) T.S.lists[k]=['_none'];   // 다 빼면 빈 목록으로 저장 (자동으로 돌아가지 않게)
    }
  }
};
// 순위·많이 찾아요·기기값 0원 — 모델 목록 직접 고르기 (처음 열면 지금 보이는 목록에서 시작)
function listArr(k){
  if(k==='rank') return T.S.rank;
  T.S.lists=T.S.lists||{};
  if(!T.S.lists[k]) T.S.lists[k]=T.autoList(k);
  T.S.lists[k]=T.S.lists[k].filter(function(id){return id!=='_none'});
  return T.S.lists[k];
}
function rankList(k){
  k=k||'rank';
  return listArr(k).map(function(id,i){ var m=T.byId(id); return '<div class="it"><b style="width:28px">'+(i+1)+(k==='rank'?'위':'')+'</b><span>'+esc(m?m.nm:id)+'</span><button type="button" data-rk="up" data-k="'+k+'" data-i="'+i+'">◀</button><button type="button" data-rk="down" data-k="'+k+'" data-i="'+i+'">▶</button><button type="button" data-rk="x" data-k="'+k+'" data-i="'+i+'">✕</button></div>'; }).join('');
}

function openEditor(key){
  var p=key.split(':'), type=p[0], arg=p.slice(1).join(':'), ed=ED[type];
  if(!ed) return;
  if(type==='model' && !T.byId(arg)) return;
  CUR={type:type, arg:arg};
  open(ed.title(arg), ed.html(arg));
}
function reopen(){ if(CUR) openEditor(CUR.type+':'+CUR.arg); }

/* 편집 켜짐일 때 화면을 누르면 */
window.__stEditClick=function(e){
  var t=e.target;
  if(t.closest('.adm-bar')||t.closest('#sheet')||t.closest('#dim')||t.closest('.login')) return false;
  if(t.closest('.tabbar')||t.closest('.topbar')||t.closest('[data-back]')||t.closest('.ctabs')||t.closest('[data-toggle]')||t.closest('.subhead')) return false;
  if(t.closest('.oy-hd')||t.closest('.oy-gnb')||t.closest('.oy-subhd')||t.closest('.oy-cl')||t.closest('.oy-cm-h')||t.closest('.oy-csl')||t.closest('.oy-chips')||t.closest('.oy-frow')||t.closest('#oyBnAll')||t.closest('.oy-more')||t.closest('.oy-pg')) return false;   // 20261026 /shop 화면 이동 (전체보기 · 옆으로 넘겨 더보기 포함)
  if(t.closest('[data-mnp]')||t.closest('[data-opt-pick]')||t.closest('[data-tier-pick]')||t.closest('[data-calc]')||t.closest('[data-color-pick]')||t.closest('[data-sort-open]')||t.closest('[data-maxv]')||t.closest('[data-ms-tip]')||t.closest('[data-sort]')||t.closest('.pz')||t.closest('a[download]')) return false;
  var el=t.closest('[data-edit]');
  if(!el){
    if(t.closest('a,[data-go],[data-open],label.search')){ e.preventDefault(); e.stopPropagation(); toast('편집 중에는 이동하지 않아요 · [편집 ON] 을 끄면 고객처럼 둘러볼 수 있어요'); return true; }
    return false;
  }
  e.preventDefault(); e.stopPropagation(); openEditor(el.getAttribute('data-edit')); return true;
};

/* ---------- 사진 고르기 (깃허브 assets/store 폴더) ---------- */
var galCache={};
function galLoad(folder){
  if(galCache[folder]) return Promise.resolve(galCache[folder]);
  return fetch(T.GH+folder+'?ref=main').then(function(r){ if(r.status===404) return []; if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); })
    .then(function(list){ var out=(list||[]).filter(function(f){return f.type==='file'&&/\.(jpe?g|png|webp|gif)$/i.test(f.name)}).map(function(f){return {path:folder+'/'+f.name, url:f.download_url, name:f.name}});
      galCache[folder]=out; return out; });
}
function galRender(box, forName, folder){
  var cur=V(forName);
  box.innerHTML='<div class="grp" style="margin-top:8px"><div class="gal-tabs">'+T.FOLDERS.map(function(f){return '<button type="button" class="'+(f===folder?'on':'')+'" data-galtab="'+f+'" data-for="'+forName+'">'+f+'</button>'}).join('')+
    '<button type="button" data-galref="'+folder+'" data-for="'+forName+'">↻ 새로고침</button></div><div class="gal" data-galgrid>불러오는 중…</div></div>';
  galLoad(folder).then(function(list){
    var g=$('[data-galgrid]',box);
    if(!list.length){ g.style.display='block'; g.innerHTML='<div class="hint">깃허브 <b>assets/store/'+folder+'/</b> 폴더에 아직 사진이 없어요. 올린 뒤 ↻ 새로고침을 눌러주세요.</div>'; return; }
    g.innerHTML=list.map(function(f){ return '<button type="button" class="'+(f.path===cur?'sel':'')+'" data-pick="'+esc(f.path)+'" data-for="'+forName+'"><img src="'+esc(f.url)+'" loading="lazy" alt=""><span>'+esc(f.name)+'</span></button>'; }).join('');
  }).catch(function(e){ $('[data-galgrid]',box).innerHTML='<div class="hint">목록을 못 불러왔어요 ('+esc(e.message)+'). 파일 이름을 직접 입력해도 됩니다.</div>'; });
}
function setImg(forName, path, pic){
  var inp=$('#sheet [name="'+forName+'"]');
  if(inp && inp.tagName==='TEXTAREA'){   // 20261026 상세 내용 그림: 고르면 한 줄 추가 (그림 크기 #가로x세로 를 같이 적어 두면 고객 화면에서 자리를 미리 잡아 밀리지 않음)
    var lines=inp.value.split('\n').map(function(x){ return x.trim(); }).filter(Boolean);
    if(!lines.some(function(x){ return x.replace(/#.*$/,'')===path; })) lines.push(path+(pic&&pic.naturalWidth?'#'+pic.naturalWidth+'x'+pic.naturalHeight:''));
    inp.value=lines.join('\n'); return; }
  if(inp) inp.value=path;
  var th=$('#sheet [data-th="'+forName+'"]'); if(th) th.innerHTML=thumb(path||inp&&inp.placeholder);
}

/* ---------- 추가 / 설정 ---------- */
function openAdd(){
  open('＋ 추가하기',
    '<div class="grp"><div class="lbl">새 모델</div>'+
    '<div class="row2c"><input type="text" name="newnm" placeholder="모델 이름 (예: 갤럭시 A57)"><input type="text" name="newid" placeholder="영문 코드 (예: a57)"></div>'+
    '<div class="hint">영문 코드는 사진 파일 이름에 씁니다 (model/a57.jpg). 처음엔 <b>숨김 상태</b>로 만들어지니 사진·가격을 넣고 숨기기를 끄세요.</div>'+
    '<button type="button" class="btn2" style="width:100%;margin-top:8px" data-ed="newmodel">모델 추가</button></div>'+
    '<div class="btns">'+(SHOPV?'<button type="button" class="btn2" data-ed="newbn">메인 배너 추가</button>':'<button type="button" class="btn2" data-ed="newhero">히어로 슬라이드 추가</button>')+'<button type="button" class="btn2" data-ed="newgift">사은품 추가</button></div>');
  CUR=null;
}
function openSettings(){
  var secNames={pop:'많이 찾아요',recent:'최근 본 모델',zero:'기기값 0원 모아보기',gifts:'멤버십 사은품',rank:'인기 TOP',pick:'내게 맞는 휴대폰 찾기',wear:'다이렉트 특별 혜택 (TV프리)'};
  open('⚙ 설정',
    txt('tel','고객센터 전화번호',T.S.tel)+txt('kakao','카카오톡 문의 주소',T.S.kakao)+
    area('priceNote','상세 화면 가격 안내 문구',T.S.priceNote,3)+
    area('stores','매장 목록 — 한 줄에 하나씩 "매장명 | 주소 | 전화 | 사진" (사진은 깃허브 store 폴더 파일명, 여러 장은 쉼표로: store/건대-1.jpg, store/건대-2.jpg)',T.S.stores.map(function(s){return [s.nm,s.addr||'',s.tel||'',s.img||''].join(' | ').replace(/( \| )+$/,'')}).join('\n'),8)+
    txt('storeNote','매장찾기 안내 문구',T.S.storeNote)+
    '<div class="grp"><div class="lbl">구역 보이기</div>'+Object.keys(secNames).map(function(k){return '<label class="sw" style="margin-top:6px">'+secNames[k]+'<input type="checkbox" name="secon_'+k+'"'+(T.S.sec[k]&&T.S.sec[k].off?'':' checked')+'></label>'}).join('')+'</div>'+
    '<div class="grp"><div class="lbl">온라인 상담 신청</div><label class="sw" style="margin-top:6px">워치 · 태블릿 · TV프리 함께 구매 보이기<input type="checkbox" name="applyAdd"'+(T.S.applyAdd?' checked':'')+'></label><div class="hint">끄면 신청서에서 03 요금제별 혜택(워치·태블릿·TV프리)이 통째로 숨겨져요.</div></div>'+
    '<button type="button" class="cta" data-ed="saveset">적용 (고객 화면에 바로 반영)</button>');
  CUR={type:'settings'};
}

/* ---------- 관리자 화면 버튼들 ---------- */
document.addEventListener('click',function(e){
  var t=e.target, b;
  if(t.closest('#admEdit')){ var v=!T.isEditing(); T.setEditing(v); t.closest('#admEdit').classList.toggle('on',v); t.closest('#admEdit').textContent=v?'편집 ON':'편집 OFF'; toast(v?'누르면 수정할 수 있어요':'고객 화면처럼 둘러보기'); return; }
  if(t.closest('#admAdd')){ openAdd(); return; }
  if(t.closest('#admSet')){ openSettings(); return; }
  if(t.closest('#admUndo')){ undo(); return; }
  if(t.closest('#admPrice')){ if(window.__stPriceOpen) window.__stPriceOpen(); return; }
  if(!t.closest('#sheet')) return;

  if((b=t.closest('[data-pick]'))){ setImg(b.getAttribute('data-for'), b.getAttribute('data-pick'), b.querySelector('img'));$$('[data-pick]',b.parentNode).forEach(function(x){x.classList.toggle('sel',x===b)}); return; }
  if((b=t.closest('[data-galtab]'))){ galRender(b.closest('[data-galfor]'), b.getAttribute('data-for'), b.getAttribute('data-galtab')); return; }
  if((b=t.closest('[data-galref]'))){ delete galCache[b.getAttribute('data-galref')]; galRender(b.closest('[data-galfor]'), b.getAttribute('data-for'), b.getAttribute('data-galref')); return; }
  if((b=t.closest('[data-rk]'))){
    var i=+b.getAttribute('data-i'), rk=b.getAttribute('data-k')||'rank', r=listArr(rk), a=b.getAttribute('data-rk');
    if(a==='x') r.splice(i,1); else { var j=a==='up'?i-1:i+1; if(j>=0&&j<r.length){ var tmp=r[i]; r[i]=r[j]; r[j]=tmp; } }
    $('#rankList').innerHTML=rankList(rk); return;
  }
  if(!(b=t.closest('[data-ed]'))) return;
  var act=b.getAttribute('data-ed');
  if(act==='price'){ T.closeSheet(); if(window.__stPriceOpen) window.__stPriceOpen(b.getAttribute('data-model')); return; }
  if(act==='gal'){ var box=$('#sheet [data-galfor="'+b.getAttribute('data-for')+'"]'); if(box.innerHTML){ box.innerHTML=''; } else galRender(box, b.getAttribute('data-for'), b.getAttribute('data-folder')); return; }
  if(act==='apply' && CUR){ ED[CUR.type].save(CUR.arg); T.closeSheet(); commit(); return; }
  if((act==='left'||act==='right'||act==='del') && CUR){
    var ed=ED[CUR.type], list=ed.list(), idx=CUR.type==='model'?list.indexOf(T.byId(CUR.arg)):+CUR.arg;
    if(act==='del'){
      var nm=CUR.type==='model'?T.byId(CUR.arg).nm:'이 항목';
      if(!confirm(nm+' 을(를) 삭제할까요?\n(잠깐 내리는 거면 삭제 대신 "숨기기"를 쓰세요)')) return;
      list.splice(idx,1);
      if(CUR.type==='model'){ var id=CUR.arg; T.S.rank=T.S.rank.filter(function(x){return x!==id}); T.S.removed=(T.S.removed||[]).concat([id]); }
      T.closeSheet(); CUR=null; commit('삭제했어요'); return;
    }
    ed.save(CUR.arg);   // 입력해둔 내용 먼저 반영
    var j=act==='left'?idx-1:idx+1; if(j<0||j>=list.length){ toast('더 이동할 수 없어요'); return; }
    var tmp=list[idx]; list[idx]=list[j]; list[j]=tmp;
    if(CUR.type!=='model') CUR.arg=String(j);
    commit('순서를 바꿨어요').then(reopen); return;
  }
  if(act==='newmodel'){
    var nm=V('newnm'), id=V('newid').toLowerCase();
    if(!nm){ alert('모델 이름을 입력해 주세요.'); return; }
    if(!/^[a-z0-9][a-z0-9-]*$/.test(id)){ alert('영문 코드는 영어 소문자·숫자·하이픈(-)만 쓸 수 있어요. (예: a57, zflip7)'); return; }
    if(T.byId(id)){ alert('이미 있는 코드예요. 다른 코드를 써주세요.'); return; }
    T.S.models.push({id:id, nm:nm, ds:'', cat:[], tags:['기기값 할인','보호필름 · 투명케이스 · 고속충전기 제공'], price:{}, cards:[], hidden:true});
    commit('모델을 추가했어요 (숨김 상태)').then(function(){ openEditor('model:'+id); }); return;
  }
  if(act==='newbn'){ T.S.bn=T.S.bn||[]; T.S.bn.push({img:null, nm:'새 배너', go:'', hidden:true}); commit('배너를 추가했어요 (숨김 상태)').then(function(){ openEditor('bn:'+(T.S.bn.length-1)); }); return; }
  if(act==='newhero'){ T.S.hero.push({k:'',t:'새 슬라이드',s:'',img:null,go:'',hidden:true}); commit('슬라이드를 추가했어요 (숨김 상태)').then(function(){ openEditor('hero:'+(T.S.hero.length-1)); }); return; }
  if(act==='newgift'){ T.S.gifts.push({nm:'새 사은품',sm:'',pr:'무료 증정',img:null,hidden:true}); commit('사은품을 추가했어요 (숨김 상태)').then(function(){ openEditor('gift:'+(T.S.gifts.length-1)); }); return; }
  if(act==='saveset'){
    T.S.tel=V('tel'); T.S.kakao=V('kakao'); T.S.priceNote=V('priceNote'); T.S.storeNote=V('storeNote');
    T.S.stores=V('stores').split('\n').map(function(l){ var p=l.split('|').map(function(x){return x.trim()}); return p[0]?{nm:p[0],addr:p[1]||'',tel:p[2]||'',img:p[3]||''}:null; }).filter(Boolean);
    Object.keys(T.S.sec).forEach(function(k){ var el=$('#sheet [name="secon_'+k+'"]'); if(el) T.S.sec[k].off=!el.checked; });
    var aa=$('#sheet [name="applyAdd"]'); if(aa) T.S.applyAdd=aa.checked;
    T.closeSheet(); commit(); return;
  }
});
document.addEventListener('change',function(e){
  var t=e.target;
  if(!t.closest||!t.closest('#sheet')) return;
  var gs=t.getAttribute('data-gosel'); if(gs){ if(t.value){ var inp=$('#sheet [name="'+gs+'"]'); if(inp) inp.value=t.value; } return; }
  if(t.hasAttribute('data-rankadd')){ if(t.value){ var ak=t.getAttribute('data-k')||'rank'; listArr(ak).push(t.value); $('#rankList').innerHTML=rankList(ak); t.querySelector('option[value="'+t.value+'"]').remove(); t.value=''; } return; }
});
document.addEventListener('input',function(e){
  var t=e.target; if(!t.closest||!t.closest('#sheet')) return;
  var th=t.name && $('#sheet [data-th="'+t.name+'"]');
  if(th){ clearTimeout(t.__d); t.__d=setTimeout(function(){ th.innerHTML=thumb(t.value||t.placeholder); },400); }
});

/* ---------- 되돌리기 (마지막 적용 이전으로) ---------- */
function undo(){
  fetch(DB+'/store_history.json?orderBy=%22%24key%22&limitToLast=1').then(function(r){return r.json()}).then(function(o){
    var keys=Object.keys(o||{});
    if(!keys.length){ toast('되돌릴 기록이 없어요'); return; }
    if(!confirm('마지막으로 적용한 수정을 취소하고 그 전 상태로 되돌릴까요?\n(고객 화면도 같이 되돌아갑니다)')) return;
    var k=keys[0], st=o[k], now=Date.now(); st.updatedAt=now;
    return fetch(DB+'/store.json',{method:'PUT',body:JSON.stringify(st)}).then(function(r){
      if(!r.ok) throw new Error('HTTP '+r.status);
      return fetch(DB+'/store_history/'+k+'.json',{method:'DELETE'});
    }).then(function(){ LAST=st; T.setStamp(0); T.apply(st); toast('되돌렸어요'); });
  }).catch(function(e){ alert('되돌리기에 실패했어요. ('+e.message+')'); });
}

/* ---------- 꾹 눌러서 끌어 순서 바꾸기 (모델 원형 아이콘 · 퀵메뉴 · 신뢰 스트립 · 이번주 특가 · 많이 찾아요 · 기기값 0원) ---------- */
(function(){
  var ZONES=[
    {box:'#models', item:'a.m', key:'models'},
    {box:'#quick', item:'a', key:'quick'},
    {box:'#trust', item:'.it', key:'trust'},
    {box:'.dl-grid', item:'a.dl-c', key:'deal'},
    {box:'#popgrid', item:'a.pc', key:'list:pop'},
    {box:'#zero', item:'a.hc', key:'list:zero'},
    {box:'#models', item:'a.oy-hp-it', key:'models'},       // 20261026 /shop 지금 많이 보는 휴대폰 (옆으로 넘기는 줄)
    {box:'#oyDeal', item:'a.oy-dc', key:'deal'},            // /shop 이번주 특가 (두 장 나란히)
    {box:'#oyPop', item:'a.oy-c2-a', key:'list:pop'},       // /shop 많이 찾아요 (2×2)
    {box:'#oyZero', item:'a.oy-card', key:'list:zero'}      // /shop 기기값 0원
  ];
  var D=null, timer=null, justDragged=false;
  function zoneOf(el){ for(var i=0;i<ZONES.length;i++){ var z=ZONES[i], box=el.closest(z.box); if(box){ var it=el.closest(z.item); if(it&&box.contains(it)) return {z:z,box:box,it:it}; } } return null; }
  function items(box,z){ return Array.prototype.slice.call(box.querySelectorAll(z.item)); }
  function idOf(it){ var e=it.getAttribute('data-edit')||''; return e.split(':').slice(1).join(':'); }
  function start(hit,x,y){
    var r=hit.it.getBoundingClientRect(), g=hit.it.cloneNode(true);
    g.className+=' drag-ghost'; g.style.cssText+='position:fixed;left:'+r.left+'px;top:'+r.top+'px;width:'+r.width+'px;height:'+r.height+'px;pointer-events:none;z-index:9999;';
    document.body.appendChild(g); hit.it.classList.add('drag-src'); document.body.classList.add('dragging');
    D={hit:hit, ghost:g, dx:x-r.left, dy:y-r.top, target:null};
  }
  function move(x,y){
    D.ghost.style.left=(x-D.dx)+'px'; D.ghost.style.top=(y-D.dy)+'px';
    var el=document.elementFromPoint(x,y), t=el&&el.closest(D.hit.z.item);
    if(D.target&&D.target!==t) D.target.classList.remove('drag-over');
    if(t&&t!==D.hit.it&&D.hit.box.contains(t)){ t.classList.add('drag-over'); D.target=t; } else D.target=null;
  }
  function end(){
    var d=D; D=null; d.ghost.remove(); d.hit.it.classList.remove('drag-src'); document.body.classList.remove('dragging');
    if(d.target) d.target.classList.remove('drag-over');
    justDragged=true; setTimeout(function(){ justDragged=false; },350);
    if(!d.target) return;
    var list=items(d.hit.box,d.hit.z), from=list.indexOf(d.hit.it), to=list.indexOf(d.target);
    if(from<0||to<0||from===to) return;
    var k=d.hit.z.key;
    if(k.indexOf('list:')===0){
      var lk=k.slice(5), mids2=list.map(function(it){return it.getAttribute('data-mid')}), m2=mids2.splice(from,1)[0]; mids2.splice(to,0,m2);
      var base=(T.S.lists&&T.S.lists[lk]&&T.S.lists[lk].length&&T.S.lists[lk][0]!=='_none')?T.S.lists[lk]:[];
      T.S.lists=Object.assign({},T.S.lists); T.S.lists[lk]=mids2.concat(base.filter(function(id){return mids2.indexOf(id)<0}));
    } else if(k==='deal'){
      var mids=list.map(function(it){return it.getAttribute('data-mid')}), mm=mids.splice(from,1)[0]; mids.splice(to,0,mm);
      T.S.deal=Object.assign({},T.S.deal,{items:mids.join('\n')});
    } else if(k==='models'){
      var ids=list.map(idOf), mv=ids.splice(from,1)[0]; ids.splice(to,0,mv);
      var rest=T.S.models.filter(function(m){ return ids.indexOf(m.id)<0; });
      T.S.models=ids.map(function(id){ return T.S.models.filter(function(m){return m.id===id})[0]; }).filter(Boolean).concat(rest);
    } else {
      var arr=T.S[k], fi=+idOf(d.hit.it), ti=+idOf(d.target), x=arr.splice(fi,1)[0]; arr.splice(ti,0,x);
    }
    commit('순서를 바꿨어요');
  }
  document.addEventListener('pointerdown',function(e){
    if(!T.isEditing()||e.button>0) return; var hit=zoneOf(e.target); if(!hit) return;
    var x=e.clientX, y=e.clientY;
    clearTimeout(timer); timer=setTimeout(function(){ start(hit,x,y); },280);
    var up=function(){ clearTimeout(timer); document.removeEventListener('pointerup',up); document.removeEventListener('pointercancel',up); };
    document.addEventListener('pointerup',up); document.addEventListener('pointercancel',up);
  });
  document.addEventListener('pointermove',function(e){
    if(D){ e.preventDefault(); move(e.clientX,e.clientY); }
  },{passive:false});
  document.addEventListener('pointerup',function(){ if(D) end(); });
  document.addEventListener('pointercancel',function(){ if(D) end(); });
  document.addEventListener('click',function(e){ if(justDragged){ e.preventDefault(); e.stopPropagation(); } },true);
  document.addEventListener('dragstart',function(e){ if(T.isEditing()&&zoneOf(e.target)) e.preventDefault(); });
})();

window.__stReady=function(){ LAST=T.clone(T.S); };
// 저장소를 이미 불러온 뒤에 이 스크립트가 붙은 경우에도 기준점을 잡아 둠
if(!LAST && T.S && T.S.updatedAt) LAST=T.clone(T.S);
})();
