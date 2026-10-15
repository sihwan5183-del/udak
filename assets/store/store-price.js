/* =========================================================
   💰 가격표 — 애플(관리자) 전용
   · 엑셀처럼 기기·용량별 출고가 / 공시지원금 / 유플러스 다이렉트 지원금을 고치면 오른쪽 계산이 바로 바뀜
   · [저장] → 갤럭시(고객 화면)에 바로 반영
   · 정책은 '적용 시작일'로 관리 — 미리 등록해 두면 그날 0시부터 자동 적용, 지난 정책은 기록으로 남음
   · 엑셀 업로드(영업기획팀 단가표 양식 그대로) → 미리보기 → 새 정책 또는 덮어쓰기
   ========================================================= */
(function(){
'use strict';
var T=window.STORE; if(!T) return;
var esc=T.esc, num=T.num;
function $(s,el){return (el||document).querySelector(s)}
function $$(s,el){return Array.prototype.slice.call((el||document).querySelectorAll(s))}
var XLSX_URL='https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
// 단가표 모델코드 → 홈페이지 상품 (처음 보는 코드가 엑셀로 들어올 때 자동 연결)
var CODEMAP={'S942N':'s26','S947N':'s26plus','S948N':'s26ultra','F776N':'flip8','F971N':'fold8','F976N':'fold8ultra','UIP18PR':'iphone18pro','UIP18PM':'iphone18promax','UIP17':'iphone17'};
var W=null, VI=0, TAB='phone', DIRTY=false, FOCUS=null, PEND=null;

function toast(m){ if(window.__stToast) window.__stToast(m); }
function fmt(n){ return (n==null||n==='')?'':Number(n).toLocaleString('ko-KR'); }
function md(d){ if(!d) return '-'; var p=String(d).split('-'); return (+p[1])+'/'+(+p[2]); }
function addDays(d,n){ var t=new Date(d+'T00:00:00Z'); t.setUTCDate(t.getUTCDate()+n); return t.toISOString().slice(0,10); }
function ncode(c){ return String(c==null?'':c).toUpperCase().replace(/\s/g,'').replace(/^SM-/,''); }
function ncap(c){
  c=String(c==null?'':c).toUpperCase().replace(/\s/g,'');
  if(!c||/공통|전체|^ALL$|^-$/.test(c)) return '*';
  var m=c.match(/^(\d+)(GB|G|TB|T|MM)?$/);
  if(m){ var u=m[2]||'GB'; if(u==='G')u='GB'; if(u==='T')u='TB'; if(u==='MM')u='mm'; return m[1]+u; }
  return c.replace(/MM$/,'mm');
}
function ver(){ return W.vers[VI]; }
function sortVers(){ var cur=ver(); W.vers.sort(function(a,b){ a=a.from||''; b=b.from||''; return a<b?-1:a>b?1:0; }); if(cur) VI=W.vers.indexOf(cur); }
// Q = 가격표 묶음(W 또는 엑셀 미리보기용 사본) — plans: 지원금 구간(군), tiers: 실제 요금제
function plans(g, Q){ return (Q||W).plans[g]; }
function tiers(g, Q){ return (Q||W).tiers[g]; }
function tierName(t){ return t.fee?t.nm+' 요금제':t.nm; }
function escRe(x){ return String(x).replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); }
// 표 칸 순서: [번호이동: 공시(요금제별) | 다이렉트(구간별)] [기기변경: 공시 | 다이렉트]
function grpNm(g,k,Q){ return (plans(g,Q).filter(function(p){return p.k===k})[0]||{}).nm||''; }
function cols(g, Q){ var out=[];
  T.TYPES[g].forEach(function(t){
    tiers(g,Q).forEach(function(x,i){ out.push({b:t[0], bn:t[1], kind:'pub', f:'pub.'+t[0]+'_'+x.k, nm:x.nm, sub:g==='phone'?grpNm(g,x.grp,Q):'', bl:i===0, i:i}); });
    plans(g,Q).forEach(function(p,i){ out.push({b:t[0], bn:t[1], kind:'our', f:'our.'+t[0]+'_'+p.k, nm:p.nm, i:i}); });
  }); return out; }
function status(v){ var t=T.todayKST(), a=T.verAt(t,W); if(v===a) return {txt:'적용 중',cls:'now'}; if((v.from||'')>t) return {txt:'예정',cls:'next'}; return {txt:'지난 정책',cls:'old'}; }
function mName(id){ var m=T.byId(id); return m?m.nm:''; }
function fieldName(f,g,Q){
  if(f==='out') return '출고가'; if(f==='so') return '품절';
  var x=f.slice(4).split('_'), t=x[0], k=x.slice(1).join('_'), tn=(T.TYPES[g].filter(function(y){return y[0]===t})[0]||[t,''])[1], pre=g==='phone'?tn+' ':'';
  if(f.indexOf('pub.')===0){ var tt=tiers(g,Q).filter(function(y){return y.k===k})[0]; return pre+(g==='phone'?'공시 ':'이통사 지원금 ')+(tt?tierName(tt):k); }
  if(f.indexOf('our.')===0) return pre+'다이렉트 지원금 '+(grpNm(g,k,Q)||k);
  return f;
}
function getF(r,f){ if(f.indexOf('pub.')===0) return r.pub[f.slice(4)]; if(f.indexOf('our.')===0) return r.our[f.slice(4)]; return r[f]; }
function setF(r,f,v){
  if(f.indexOf('pub.')===0||f.indexOf('our.')===0){ var o=f.indexOf('pub.')===0?r.pub:r.our, k=f.slice(4); if(v==null) delete o[k]; else o[k]=v; return; }
  r[f]=v;
}

/* ---------------- 화면 ---------------- */
var pz=document.createElement('div'); pz.className='pz'; pz.hidden=true; document.body.appendChild(pz);

function render(){
  var v=ver(), st=status(v), today=T.todayKST(), act=T.verAt(today,W);
  var idx=W.vers.map(function(_,i){return i}).reverse();
  var vopts=idx.map(function(i){ var x=W.vers[i], s=status(x); return '<option value="'+i+'"'+(i===VI?' selected':'')+'>'+esc((x.from?md(x.from)+' 부터':'시작일 없음')+' · '+s.txt+(x.memo?' · '+x.memo:''))+'</option>'; }).join('');
  var cnt={phone:0,second:0}, list=[];
  v.rows.forEach(function(r,i){ cnt[r.g]=(cnt[r.g]||0)+1; if(r.g===TAB) list.push(i); });
  pz.innerHTML=
    '<div class="pz-h"><div><b>💰 가격표</b><small>오늘('+md(today)+') 홈페이지에 적용 중: <b>'+esc(act?md(act.from)+' 부터 정책':'-')+'</b></small></div>'+
      '<button type="button" class="pz-x" data-pz="close" aria-label="닫기">×</button></div>'+
    '<div class="pz-body">'+
    '<div class="pz-v">'+
      '<label class="pz-f grow"><span>정책 고르기</span><select data-pzv="ver">'+vopts+'</select></label>'+
      '<span class="pz-st '+st.cls+'">'+st.txt+'</span>'+
      '<label class="pz-f"><span>적용 시작일</span><input type="date" data-pzv="from" value="'+esc(v.from||'')+'"></label>'+
      '<label class="pz-f grow"><span>메모</span><input type="text" data-pzv="memo" value="'+esc(v.memo||'')+'" placeholder="예: 영업기획팀 10/03 단가표"></label>'+
      '<div class="pz-vb"><button type="button" class="pz-b" data-pz="newver">＋ 새 정책</button><button type="button" class="pz-b del" data-pz="delver">정책 삭제</button></div>'+
    '</div>'+
    '<label class="pz-pub'+(W.show?' on':'')+'"><input type="checkbox" data-pzv="show"'+(W.show?' checked':'')+'> 고객 화면(갤럭시)에 가격 공개 <small>'+(W.show?'켜짐 — 고객에게 가격이 보여요':'꺼짐 — 고객 화면은 "상담 시 안내"로 보이고, 관리자 화면에서만 가격이 보여요')+'</small></label>'+
    '<div class="pz-new" id="pzNew" hidden><span>지금 보고 있는 정책을 그대로 복사해서 새 정책을 만듭니다. 적용 시작일</span>'+
      '<input type="date" id="pzNewDate" value="'+addDays(today,1)+'"><button type="button" class="pz-b pri" data-pz="mkver">만들기</button></div>'+
    '<div class="pz-tabs">'+['phone','second'].map(function(g){ return '<button type="button" data-pztab="'+g+'" class="'+(g===TAB?'on':'')+'">'+(g==='phone'?'휴대폰':'워치·태블릿·TV')+' <i>'+(cnt[g]||0)+'</i></button>'; }).join('')+'</div>'+
    '<div class="pz-tools">'+
      '<button type="button" class="pz-b pri" data-pz="up">⬆ 엑셀 업로드</button><input type="file" id="pzFile" accept=".xlsx,.xls,.csv" hidden>'+
      '<button type="button" class="pz-b" data-pz="down">⬇ 엑셀 다운로드</button>'+
      '<button type="button" class="pz-b" data-pz="addrow">＋ 모델 추가</button>'+
      '<button type="button" class="pz-b" data-pz="plans">요금제 설정</button></div>'+
    '<div class="pz-plans" id="pzPlans" hidden>'+
      '<div class="pz-pl2"><div><div class="pz-lb">지원금 구간 (단가표의 "군")</div><div class="pz-help" style="margin-top:2px">한 줄에 하나씩 · 예: 115군</div>'+
        '<textarea id="pzGrpTxt" rows="5">'+esc(plans(TAB).map(function(p){return p.nm}).join('\n'))+'</textarea></div>'+
      '<div><div class="pz-lb">요금제</div><div class="pz-help" style="margin-top:2px">한 줄에 하나씩 <b>요금제 | 월 요금 | 지원금 구간</b> · 예: 130 | 130000 | 115군</div>'+
        '<textarea id="pzTierTxt" rows="5">'+esc(tiers(TAB).map(function(t){ return [t.nm, t.fee||'', (plans(TAB).filter(function(p){return p.k===t.grp})[0]||{}).nm||''].join(' | '); }).join('\n'))+'</textarea></div></div>'+
      '<label class="pz-f" style="max-width:260px"><span>홈페이지 카드에 보일 기준 요금제</span><select id="pzBase">'+tiers(TAB).map(function(t){ return '<option value="'+esc(t.nm)+'"'+(t.k===W.base[TAB]?' selected':'')+'>'+esc(tierName(t))+'</option>'; }).join('')+'</select></label>'+
      '<div class="pz-help">공시지원금·선택약정(월 요금 25%)은 요금제마다, 유플러스 다이렉트 지원금은 구간마다 넣습니다. 이름을 바꾸면 그 칸 숫자는 비워져요.</div>'+
      '<button type="button" class="pz-b pri" data-pz="plansave" style="margin-top:8px">요금제 적용</button></div>'+
    '<div class="pz-help">'+(TAB==='phone'
      ? '실구매가 = 출고가 − (공시지원금 + 유플러스 다이렉트 지원금) · 선택약정이면 출고가 − 유플러스 다이렉트 지원금 (월 요금 25% 할인) · 홈페이지 카드는 <b>'+esc(tierName(T.baseTier('phone',W)||{nm:''}))+' 최저가</b> 기준으로 보이고 (상세에서 요금제별로 볼 수 있어요) 고객이 번호이동/기기변경을 바꿔 볼 수 있어요.'
      : '구매가 = 출고가 − (이통사 지원금 + 유플러스 다이렉트 지원금) · 홈페이지는 <b>'+esc(tierName(T.baseTier('second',W)||{nm:''}))+'</b> 기준으로 보여요.')+
      ' 엑셀에서 여러 칸을 복사해 붙여넣어도 됩니다. <b>[저장]</b>을 눌러야 홈페이지에 반영돼요.</div>'+
    table(list)+
    '</div>'+
    '<div class="pz-foot"><span id="pzDirty">'+(DIRTY?'저장하지 않은 수정이 있어요':'')+'</span><button type="button" class="pz-save" data-pz="save">저장 (홈페이지 반영)</button></div>'+
    (PEND?previewHtml():'');
}
var VIEW='all';   // 칸 보기: all | mnp | chg
function groupsOf(list){ // 같은 모델코드가 이어진 줄끼리 한 묶음
  var gs=[]; list.forEach(function(i){ var r=ver().rows[i], last=gs[gs.length-1];
    if(last && ncode(ver().rows[last[0]].code)===ncode(r.code) && r.code) last.push(i); else gs.push([i]); }); return gs; }
function table(list){
  var g=TAB, C=cols(g), types=T.TYPES[g], bt=T.baseTier(g,W)||{nm:''}, nT=tiers(g).length, nP=plans(g).length;
  var h1='<tr><th rowspan="3" class="c-so">품절</th><th rowspan="3" class="c-code">모델</th><th rowspan="3">'+(g==='phone'?'용량':'사이즈')+'</th>'+(g==='second'?'<th rowspan="3" class="c-split">요금제별<br>지원금<small>TV프리·아이패드만</small></th>':'')+'<th rowspan="3" class="c-out">출고가</th>'+
    types.map(function(t){ return '<th colspan="'+(nT+nP)+'" class="blk b-'+t[0]+' bl">'+(g==='phone'?t[1]:'지원금')+'</th>'; }).join('')+
    '<th rowspan="3" class="cc bl">'+(g==='phone'?'번호이동 '+esc(bt.nm)+'<br>최저 기기값':esc(bt.nm)+'<br>구매가')+'</th><th rowspan="3" class="cc">할인율</th><th rowspan="3"></th></tr>';
  var h2='<tr>'+types.map(function(t){ return '<th colspan="'+nT+'" class="gh pub b-'+t[0]+' bl">'+(g==='phone'?'공시지원금 (요금제별)':'이통사 지원금')+'</th><th colspan="'+nP+'" class="gh our b-'+t[0]+' bl2">유플러스 다이렉트 지원금'+(g==='phone'?' (구간별)':'')+'</th>'; }).join('')+'</tr>';
  var h3='<tr>'+C.map(function(c){ return '<th class="'+c.kind+' b-'+c.b+(c.bl?' bl':'')+(c.kind==='our'&&c.f===C.filter(function(x){return x.b===c.b&&x.kind==='our'})[0].f?' bl2':'')+'">'+esc(c.nm)+(c.sub?'<small>'+esc(c.sub)+'</small>':'')+'</th>'; }).join('')+'</tr>';
  var gs=groupsOf(list), body=gs.map(function(gr,gi){ return gr.map(function(i,j){ return rowHtml(ver().rows[i], i, j===0?gr:null, gi); }).join(''); }).join('')
    || '<tr><td colspan="99" class="pz-empty">줄이 없습니다. ＋ 모델 추가 또는 엑셀 업로드로 넣어주세요.</td></tr>';
  return '<div class="pz-view">칸 보기 '+[['all','전체'],['mnp','번호이동만'],['chg','기기변경만']].map(function(x){ return '<button type="button" data-pzview="'+x[0]+'" class="'+(VIEW===x[0]?'on':'')+'">'+x[1]+'</button>'; }).join('')+'</div>'+
    '<div class="pz-tw"><table class="pz-t v-'+VIEW+'"><thead>'+h1+h2+h3+'</thead><tbody>'+body+'</tbody></table></div>';
}
function modelSel(r){
  return '<select data-f="model" title="홈페이지 상품 연결"><option value="">— 홈페이지 연결 안 함 —</option>'+T.S.models.map(function(m){ return '<option value="'+esc(m.id)+'"'+(m.id===r.model?' selected':'')+'>'+esc(m.nm)+'</option>'; }).join('')+'</select>';
}
function ni(f,v,cls){ return '<input type="text" inputmode="numeric" class="n'+(cls?' '+cls:'')+'" data-f="'+f+'" value="'+fmt(v)+'">'; }
function rowHtml(r,i,gr,gi){
  var g=r.g, C=cols(g), C0=null;
  var mcell = gr ? '<td class="c-code" rowspan="'+gr.length+'"><div class="mc">'+
      '<input type="text" class="w7" data-f="code" value="'+esc(r.code||'')+'" placeholder="모델코드">'+modelSel(r)+
      '<div class="mc-b"><button type="button" data-pz="gup" title="모델 위로">↑</button><button type="button" data-pz="gdn" title="모델 아래로">↓</button>'+
      '<button type="button" data-pz="gcap">＋ 용량</button><button type="button" data-pz="gdel" class="del">모델 삭제</button></div></div></td>' : '';
  return '<tr data-ri="'+i+'" class="'+(gr?'gstart ':'')+(gi%2?'godd ':'')+(r.so?'is-so ':'')+(FOCUS&&r.model===FOCUS?'focus':'')+'">'+
    '<td class="c-so"><input type="checkbox" data-f="so"'+(r.so?' checked':'')+'></td>'+mcell+
    '<td class="c-cap"><input type="text" class="w4" data-f="cap" value="'+esc(r.cap||'')+'" placeholder="공통"></td>'+
    (g==='second'?'<td class="c-split"><label><input type="checkbox" data-f="split"'+(r.split?' checked':'')+'> 1GB/500MB</label></td>':'')+
    '<td class="c-out">'+ni('out',r.out,num(r.out)==null?'need':'')+'</td>'+
    C.map(function(c){ var first=c.kind==='our'&&(!C0||C0.b!==c.b); if(c.kind==='our') C0=c;
      var off=(g==='second' && !r.split && c.i>0);   // 요금제 구분 없는 줄(워치·탭)은 첫 칸만
      return '<td class="'+c.kind+' b-'+c.b+(c.bl?' bl':'')+(first?' bl2':'')+'">'+(off?'<span class="off">—</span>':ni(c.f,getF(r,c.f)))+'</td>'; }).join('')+
    ccHtml(r)+
    '<td class="act"><button type="button" data-pz="rdel" class="del" title="이 용량 삭제">✕</button></td></tr>';
}
function calcTxt(r){
  var g=r.g, t=T.TYPES[g][0][0], c=T.rowCalc(r,t,T.baseTier(g,W));
  if(!c) return ['<span class="mute">출고가 입력 필요</span>','—'];
  var pct=c.out?Math.round((c.out-c.v)/c.out*100):0;
  return ['<b>'+(c.v===0?'0원':fmt(c.v)+'원')+'</b>', pct+'%'];
}
function ccHtml(r){ var c=calcTxt(r); return '<td class="cc bl" data-cc>'+c[0]+'</td><td class="cc" data-cc2>'+c[1]+'</td>'; }
function updCC(tr,r){ var c=calcTxt(r); $('[data-cc]',tr).innerHTML=c[0]; $('[data-cc2]',tr).innerHTML=c[1]; tr.classList.toggle('is-so',!!r.so); }
function dirty(){ DIRTY=true; var d=$('#pzDirty'); if(d) d.textContent='저장하지 않은 수정이 있어요'; }
function rowOf(el){ var tr=el.closest('tr[data-ri]'); return tr?{tr:tr, i:+tr.getAttribute('data-ri'), r:ver().rows[+tr.getAttribute('data-ri')]}:null; }
// 모델코드·홈페이지 상품은 묶음(같은 모델의 모든 용량)에 같이 적용
function groupIdx(i){ var rows=ver().rows, c=ncode(rows[i].code), a=i, b=i; if(!rows[i].code) return [i];
  while(a>0 && rows[a-1].g===rows[i].g && ncode(rows[a-1].code)===c) a--; while(b<rows.length-1 && rows[b+1].g===rows[i].g && ncode(rows[b+1].code)===c) b++;
  var out=[]; for(var k=a;k<=b;k++) out.push(k); return out; }
function readInput(el, r, i){
  var f=el.getAttribute('data-f');
  if(f==='so') r.so=el.checked;
  else if(f==='split'){ r.split=el.checked; setTimeout(render,0); }
  else if(f==='code'||f==='model'){ var v=el.value.trim(); (i!=null?groupIdx(i):[]).forEach(function(k){ ver().rows[k][f]=v; }); r[f]=v; }
  else if(f==='mk'||f==='cap') r[f]=el.value.trim();
  else setF(r,f,num(el.value));
}

/* ---------------- 열기 / 닫기 ---------------- */
function open(modelId){
  W=T.normPricing(T.clone(T.S.pricing)); VI=0; sortVers();
  var a=T.verAt(T.todayKST(),W); VI=Math.max(0,W.vers.indexOf(a));
  FOCUS=modelId||null; PEND=null; DIRTY=false; TAB='phone';
  if(FOCUS){ var fr=ver().rows.filter(function(r){return r.model===FOCUS})[0]; if(fr) TAB=fr.g; }
  render(); pz.hidden=false; document.body.classList.add('pz-open');
  if(FOCUS){ var f=$('tr.focus',pz); if(f&&f.scrollIntoView) f.scrollIntoView({block:'center'}); }
}
function close(){
  if(DIRTY && !confirm('저장하지 않은 수정이 있어요. 저장하지 않고 닫을까요?')) return;
  pz.hidden=true; document.body.classList.remove('pz-open'); W=null; PEND=null;
}
window.__stPriceOpen=open;

/* ---------------- 입력 ---------------- */
pz.addEventListener('input',function(e){
  var t=e.target;
  if(t.hasAttribute('data-f')){ var o=rowOf(t); if(!o) return; if(t.getAttribute('data-f')==='code') return; readInput(t,o.r,o.i); dirty(); updCC(o.tr,o.r); if(t.getAttribute('data-f')==='out') t.classList.toggle('need', num(t.value)==null); return; }
  if(t.getAttribute('data-pzv')==='memo'){ ver().memo=t.value; dirty(); }
});
pz.addEventListener('change',function(e){
  var t=e.target, k=t.getAttribute('data-pzv');
  if(t.hasAttribute('data-f')){ var o=rowOf(t); if(o){ var gi=groupIdx(o.i); readInput(t,o.r,o.i); dirty(); updCC(o.tr,o.r); if(t.getAttribute('data-f')==='code'&&gi.length>1) render(); } return; }
  if(k==='ver'){ VI=+t.value; FOCUS=null; render(); return; }
  if(k==='show'){ W.show=t.checked; dirty(); render(); return; }
  if(k==='from'){
    if(!t.value){ t.value=ver().from||''; return; }
    if(W.vers.some(function(x){return x!==ver() && x.from===t.value})){ alert('같은 시작일의 정책이 이미 있어요. 다른 날짜를 골라 주세요.'); t.value=ver().from||''; return; }
    ver().from=t.value; sortVers(); dirty(); render(); return;
  }
  if(t.id==='pzFile' && t.files && t.files[0]){ readFile(t.files[0]); t.value=''; }
});
pz.addEventListener('focusout',function(e){ var t=e.target; if(t.classList&&t.classList.contains('n')){ var n=num(t.value); t.value=fmt(n); } });
pz.addEventListener('keydown',function(e){
  var t=e.target; if(e.key!=='Enter'||!t.hasAttribute||!t.hasAttribute('data-f')||t.tagName==='SELECT') return;
  e.preventDefault(); var tr=t.closest('tr'), nx=tr&&tr.nextElementSibling; if(!nx) return;
  var el=$('[data-f="'+t.getAttribute('data-f')+'"]',nx); if(el){ el.focus(); if(el.select) el.select(); }
});
// 엑셀에서 여러 칸 복사 → 붙여넣기
pz.addEventListener('paste',function(e){
  var t=e.target; if(!t.hasAttribute||!t.hasAttribute('data-f')||t.type==='checkbox') return;
  var txt=(e.clipboardData||window.clipboardData).getData('text'); if(!/[\t\n]/.test(String(txt).trim())) return;
  e.preventDefault();
  var grid=String(txt).replace(/\r/g,'').replace(/\n$/,'').split('\n').map(function(l){return l.split('\t')});
  var tr=t.closest('tr'), fields=function(row){ return $$('input[data-f].n, input[data-f="cap"]',row); }, start=fields(tr).indexOf(t); if(start<0) return;
  grid.forEach(function(line,i){
    if(!tr) return; var ins=fields(tr), o=rowOf(tr); if(!o) return;
    line.forEach(function(val,j){ var el=ins[start+j]; if(!el) return; el.value=val.trim(); readInput(el,o.r,o.i); if(el.classList.contains('n')) el.value=fmt(num(el.value)); });
    updCC(tr,o.r); tr=tr.nextElementSibling;
  });
  dirty(); toast('붙여넣었어요');
});

/* ---------------- 버튼 ---------------- */
pz.addEventListener('click',function(e){
  var b=e.target.closest('[data-pz],[data-pztab],[data-pzview]'); if(!b) return;
  var tb=b.getAttribute('data-pztab'); if(tb){ TAB=tb; render(); return; }
  var vw=b.getAttribute('data-pzview'); if(vw){ VIEW=vw; render(); return; }
  var a=b.getAttribute('data-pz'), v=ver(), o;
  if(a==='close'){ close(); return; }
  if(a==='newver'){ var n=$('#pzNew'); n.hidden=!n.hidden; return; }
  if(a==='mkver'){
    var d=$('#pzNewDate').value; if(!d){ alert('적용 시작일을 골라 주세요.'); return; }
    if(W.vers.some(function(x){return x.from===d})){ alert('같은 시작일의 정책이 이미 있어요. 그 정책을 골라서 고치거나 다른 날짜를 골라 주세요.'); return; }
    var nv=T.clone(v); nv.id='v'+Date.now(); nv.from=d; nv.memo=''; W.vers.push(nv); VI=W.vers.length-1; sortVers(); dirty(); render();
    toast(md(d)+' 부터 적용할 새 정책을 만들었어요 · 고친 뒤 [저장]'); return;
  }
  if(a==='delver'){
    if(W.vers.length<2){ alert('정책이 하나뿐이라 삭제할 수 없어요.'); return; }
    if(!confirm(md(v.from)+' 부터 정책을 삭제할까요?')) return;
    W.vers.splice(VI,1); VI=Math.max(0,W.vers.indexOf(T.verAt(T.todayKST(),W))); dirty(); render(); return;
  }
  if(a==='addrow'){
    v.rows.push({g:TAB, mk:'', code:'', cap:TAB==='phone'?'256GB':'', model:'', out:null, so:false, pub:{}, our:{}}); dirty(); render();
    var last=$$('tr[data-ri]',pz).pop(); if(last){ last.scrollIntoView({block:'center'}); var c=$('[data-f="code"]',last); if(c) c.focus(); } return;
  }
  if(a==='plans'){ var p=$('#pzPlans'); p.hidden=!p.hidden; return; }
  if(a==='plansave'){ savePlans(); return; }
  if(a==='save'){ save(); return; }
  if(a==='up'){ $('#pzFile').click(); return; }
  if(a==='down'){ exportXlsx(); return; }
  if(a==='pv-cancel'){ PEND=null; render(); return; }
  if(a==='pv-apply'){ applyPending(); return; }
  if((o=rowOf(b))){
    var rows=v.rows, i=o.i, gi=groupIdx(i), nm=(o.r.code||'이 모델');
    if(a==='rdel'){ if(!confirm(nm+' '+(o.r.cap||'공통')+' 줄을 삭제할까요?')) return; rows.splice(i,1); dirty(); render(); return; }
    if(a==='gdel'){ if(!confirm(nm+' ('+gi.length+'줄)을 통째로 삭제할까요?')) return; rows.splice(gi[0],gi.length); dirty(); render(); return; }
    if(a==='gcap'){ var src=rows[gi[gi.length-1]], nr=T.clone(src); nr.cap=''; nr.out=null; nr.so=false; rows.splice(gi[gi.length-1]+1,0,nr); dirty(); render();
      var tr=$('tr[data-ri="'+(gi[gi.length-1]+1)+'"]',pz); if(tr){ var c=$('[data-f="cap"]',tr); if(c) c.focus(); } return; }
    if(a==='gup'||a==='gdn'){ // 같은 탭의 이웃 모델 묶음과 자리 바꾸기
      var bs=[]; rows.forEach(function(r,k){ var l=bs[bs.length-1]; if(l && rows[l[0]].g===r.g && r.code && ncode(rows[l[0]].code)===ncode(r.code)) l.push(k); else bs.push([k]); });
      var bi=-1; bs.forEach(function(x,k){ if(x.indexOf(i)>-1) bi=k; }); var step=a==='gup'?-1:1, j=bi+step;
      while(j>=0 && j<bs.length && rows[bs[j][0]].g!==o.r.g) j+=step;
      if(bi<0||j<0||j>=bs.length) return; var tmp=bs[bi]; bs[bi]=bs[j]; bs[j]=tmp;
      v.rows=[].concat.apply([],bs).map(function(k){return rows[k]}); dirty(); render(); return;
    }
  }
});
function planKey(nm, used){
  var base='p'+String(nm).replace(/군|요금제|\s/g,'').replace(/[^0-9A-Za-z가-힣_]/g,'');
  if(base==='p') base='p'+Date.now().toString(36);
  var k=base, n=2; while(used[k]){ k=base+'_'+n; n++; } used[k]=1; return k;
}
function savePlans(){
  var oldP=plans(TAB), oldT=tiers(TAB), used={}, P=[], TS=[], byNm={};
  $('#pzGrpTxt').value.split('\n').forEach(function(l){ var nm=l.split('|')[0].trim(); if(!nm||byNm[nm]) return;
    var same=oldP.filter(function(o){return o.nm===nm})[0], k=same&&!used[same.k]?same.k:null; if(k) used[k]=1; else k=planKey(nm,used);
    var it={k:k, nm:nm}; P.push(it); byNm[nm]=it; });
  if(!P.length){ alert('지원금 구간이 최소 1개는 있어야 해요.'); return; }
  var tused={}, bad=[];
  $('#pzTierTxt').value.split('\n').forEach(function(l){ var x=l.split('|').map(function(y){return y.trim()}); if(!x[0]) return;
    var g=byNm[x[2]]||null; if(!g){ bad.push(x[0]); g=P[0]; }
    var same=oldT.filter(function(o){return o.nm===x[0]})[0], k=same&&!tused[same.k]?same.k:null;
    if(k) tused[k]=1; else { k='t'+x[0].replace(/요금제|\s/g,'').replace(/[^0-9A-Za-z가-힣_]/g,''); if(k==='t'||tused[k]) k='t'+Date.now().toString(36)+TS.length; tused[k]=1; }
    var it={k:k, nm:x[0], grp:g.k}; var fee=num(x[1]); if(fee) it.fee=fee; TS.push(it); });
  if(!TS.length){ alert('요금제가 최소 1개는 있어야 해요.'); return; }
  if(bad.length && !confirm('지원금 구간을 못 찾은 요금제가 있어요: '+bad.join(', ')+'\n"'+P[0].nm+'" 구간으로 넣을까요?')) return;
  var bn=$('#pzBase').value, bt=TS.filter(function(t){return t.nm===bn})[0]||TS[0];
  W.plans[TAB]=P; W.tiers[TAB]=TS; W.base[TAB]=bt.k; dirty(); render(); toast('요금제를 바꿨어요 · [저장]을 눌러야 반영돼요');
}
function save(){
  var froms={}, dup=null; W.vers.forEach(function(x){ if(froms[x.from]) dup=x.from; froms[x.from]=1; });
  if(dup){ alert(md(dup)+' 시작일 정책이 2개 있어요. 하나를 지우거나 날짜를 바꿔 주세요.'); return; }
  if(W.vers.some(function(x){return !x.from})){ alert('적용 시작일이 비어 있는 정책이 있어요.'); return; }
  T.S.pricing=T.clone(W);
  var p=window.__stCommit?window.__stCommit('가격표를 저장했어요 · 홈페이지에 반영됐어요'):Promise.resolve();
  p.then(function(){ DIRTY=false; var d=$('#pzDirty'); if(d) d.textContent='저장 완료 · '+new Date().toLocaleTimeString('ko-KR'); });
}

/* ---------------- 엑셀 ---------------- */
function loadXLSX(){
  if(window.XLSX) return Promise.resolve(window.XLSX);
  return new Promise(function(ok,no){ var s=document.createElement('script'); s.src=XLSX_URL; s.onload=function(){ ok(window.XLSX); }; s.onerror=function(){ no(new Error('엑셀 도구를 불러오지 못했어요. 인터넷 연결을 확인해 주세요.')); }; document.head.appendChild(s); });
}
var CODE_HEAD=/^(모델명|모델코드|모델|코드|기종명|펫네임)$/;
function isNum(v){ return typeof v==='number' || /^\s*[\d,]{3,}\s*원?\s*$/.test(String(v)); }
function toNum(v){ return typeof v==='number'?Math.round(v):num(v); }
// 엑셀 한 장 → 줄 목록 (병합 칸은 펼쳐서 읽음)
function parseSheet(X, ws, name){
  if(!ws||!ws['!ref']) return null;
  var rg=X.utils.decode_range(ws['!ref']);
  var aoa=X.utils.sheet_to_json(ws,{header:1, raw:true, defval:'', blankrows:true});
  (ws['!merges']||[]).forEach(function(m){
    var r0=m.s.r-rg.s.r, c0=m.s.c-rg.s.c, val=(aoa[r0]||[])[c0];
    for(var r=r0;r<=m.e.r-rg.s.r;r++){ aoa[r]=aoa[r]||[]; for(var c=c0;c<=m.e.c-rg.s.c;c++){ if(r===r0&&c===c0) continue; aoa[r][c]=val; } }
  });
  var cell=function(r,c){ var v=(aoa[r]||[])[c]; return v==null?'':v; };
  var hRow=-1, codeCol=-1;
  for(var r=0;r<aoa.length && hRow<0;r++) for(var c=0;c<(aoa[r]||[]).length;c++){ if(CODE_HEAD.test(String(cell(r,c)).replace(/\s/g,''))){ hRow=r; codeCol=c; break; } }
  if(hRow<0) return {name:name, err:'"모델명" 또는 "모델코드" 제목 칸을 찾지 못했어요'};
  var first=-1;
  for(r=hRow+1;r<aoa.length;r++){ var cv=String(cell(r,codeCol)).trim(); if(cv && !CODE_HEAD.test(cv.replace(/\s/g,'')) && (aoa[r]||[]).some(isNum)){ first=r; break; } }
  if(first<0) return {name:name, err:'숫자가 들어 있는 줄을 찾지 못했어요'};
  var width=0; aoa.forEach(function(x){ if(x&&x.length>width) width=x.length; });
  var labels=[]; for(c=0;c<width;c++){ var parts=[]; for(r=0;r<first;r++){ var t=String(cell(r,c)).replace(/\s+/g,' ').trim(); if(t && parts[parts.length-1]!==t) parts.push(t); } labels.push(parts.join(' ')); }
  var hcell=function(c){ var parts=[]; for(r=hRow;r<first;r++) parts.push(String(cell(r,c))); return parts.join(' ').replace(/\s/g,''); };
  var capCol=-1, mkCol=-1, soCol=-1, linkCol=-1;
  for(c=0;c<width;c++){ if(c===codeCol) continue; var hc=hcell(c);
    if(capCol<0 && /기가|용량|사이즈|GB/i.test(hc)) capCol=c;
    else if(mkCol<0 && /제조사/.test(hc)) mkCol=c;
    else if(soCol<0 && /품절/.test(labels[c])) soCol=c;
    else if(linkCol<0 && /홈페이지/.test(labels[c])) linkCol=c; }
  var date=null, top=[]; for(r=0;r<first;r++) top=top.concat((aoa[r]||[]).map(String));
  var dm=top.join(' ').match(/(20\d{2})\s*[.\-\/년]\s*(\d{1,2})\s*[.\-\/월]\s*(\d{1,2})/);
  if(dm) date=dm[1]+'-'+('0'+dm[2]).slice(-2)+'-'+('0'+dm[3]).slice(-2);
  var g=/워치|태블릿|TV|티비|세컨|패드/i.test(name)?'second':null, recs=[];
  for(r=first;r<aoa.length;r++){
    var code=String(cell(r,codeCol)).trim(); if(!code || CODE_HEAD.test(code.replace(/\s/g,'')) || code.length>24) continue;
    var vals=[]; for(c=0;c<width;c++){ if(c===codeCol||c===capCol||c===mkCol||c===soCol||c===linkCol) continue; var x=cell(r,c); if(x!==''&&isNum(x)) vals.push({label:labels[c], v:toNum(x)}); }
    var so=soCol>=0?/품절|^Y$|^O$|^1$|TRUE/i.test(String(cell(r,soCol)).trim()):null;
    if(!vals.length && so==null) continue;
    recs.push({row:r+1, code:code, cap:capCol>=0?ncap(cell(r,capCol)):'*', capRaw:capCol>=0?String(cell(r,capCol)).trim():'', mk:mkCol>=0?String(cell(r,mkCol)).trim():'', so:so,
      link:linkCol>=0?String(cell(r,linkCol)).trim():'', vals:vals, g:g});
  }
  return {name:name, recs:recs, date:date};
}
// 칸 제목 → 어느 칸인지 (요금제는 이름으로 찾고, 없는 'OO군'은 새 칸으로 추가)
function classify(label, g, ctx){
  var L=String(label||''), Lc=L.replace(/\s/g,'');
  if(/출고/.test(Lc)) return {fs:['out']};
  if(/공시|이통사/.test(Lc)){
    var hit=null; tiers(g,ctx).slice().sort(function(a,b){return String(b.nm).length-String(a.nm).length}).forEach(function(t){
      if(hit) return; var nm=String(t.nm).replace(/요금제|\s/g,''); if(new RegExp('(^|[^0-9])'+escRe(nm)+'([^0-9]|$)').test(Lc.replace(/요금제/g,''))) hit=t; });
    if(!hit){ ctx.skip[L||'(제목 없음)']=1; return null; }
    var pt=g==='second'?['all']:(/MNP|번호이동|번이/i.test(Lc)?['mnp']:/기기변경|기변/.test(Lc)?['chg']:['mnp','chg']);
    return {fs:pt.map(function(x){return 'pub.'+x+'_'+hit.k})};
  }
  var pl=plans(g,ctx), plan=null;
  pl.forEach(function(p){ if(!plan && Lc.indexOf(String(p.nm).replace(/\s/g,''))>-1) plan=p; });
  if(!plan){ var m=Lc.match(/(\d+)군/); if(m && g==='phone'){ var nm=m[1]+'군', used={}; pl.forEach(function(p){used[p.k]=1}); plan={k:planKey(nm,used), nm:nm}; pl.push(plan); ctx.newPlans.push(nm); } }
  if(!plan){ ctx.skip[L||'(제목 없음)']=1; return null; }
  var t=null;
  if(g==='second') t='all';
  else if(/MNP|번호이동|번이/i.test(Lc)) t='mnp';
  else if(/기기변경|기변/.test(Lc)) t='chg';
  if(!t){ ctx.skip[L]=1; return null; }
  return {fs:['our.'+t+'_'+plan.k]};
}
function applyRecs(recs, v, ctx){
  var res={changes:[], added:[], touched:0};
  recs.forEach(function(rec){
    var nc=ncode(rec.code), same=v.rows.filter(function(r){return ncode(r.code)===nc});
    var g=same.length?same[0].g:(rec.g||'phone');
    var targets=rec.cap==='*'?same:same.filter(function(r){return ncap(r.cap)===rec.cap});
    if(!targets.length){
      var base=same[0], link=base?base.model:(CODEMAP[nc]||'');
      if(!link && rec.link){ var lm=T.S.models.filter(function(m){return m.nm===rec.link})[0]; if(lm) link=lm.id; }
      var nr={g:g, mk:rec.mk||(base&&base.mk)||'', code:base?base.code:rec.code, cap:rec.cap==='*'?'':(rec.capRaw&&!/공통/.test(rec.capRaw)?rec.cap:''), model:link, out:null, so:false, pub:{}, our:{}};
      var at=-1; v.rows.forEach(function(r,i){ if(ncode(r.code)===nc) at=i; });
      if(at>-1) v.rows.splice(at+1,0,nr); else v.rows.push(nr);
      targets=[nr]; res.added.push(nr);
    }
    targets.forEach(function(r){
      res.touched++;
      rec.vals.forEach(function(cv){
        var cl=classify(cv.label, r.g, ctx); if(!cl) return;
        cl.fs.forEach(function(f){ var old=getF(r,f); if(old===cv.v) return;
          setF(r,f,cv.v); res.changes.push({code:r.code, cap:r.cap||'공통', f:f, g:r.g, old:old, nv:cv.v}); });
      });
      if(rec.so!=null && !!r.so!==rec.so){ res.changes.push({code:r.code, cap:r.cap||'공통', f:'so', g:r.g, old:!!r.so, nv:rec.so}); r.so=rec.so; }
    });
  });
  return res;
}
function readFile(file){
  loadXLSX().then(function(X){
    return file.arrayBuffer().then(function(buf){
      var wb=X.read(buf,{type:'array'}), sheets=wb.SheetNames.map(function(n){ return parseSheet(X, wb.Sheets[n], n); }).filter(Boolean);
      var ok=sheets.filter(function(s){return s.recs&&s.recs.length});
      if(!ok.length){ alert('엑셀에서 가격 줄을 찾지 못했어요.\n'+sheets.map(function(s){return '· '+s.name+': '+(s.err||'가격 줄 없음')}).join('\n')+'\n\n"모델명"(또는 모델코드) 제목 칸 아래에 모델코드와 숫자가 있어야 해요.'); return; }
      var recs=[]; ok.forEach(function(s){ recs=recs.concat(s.recs); });
      var date=(ok.filter(function(s){return s.date})[0]||{}).date||null;
      PEND={file:file.name, recs:recs, date:date, mode:(date&&date===ver().from)?'over':'new', newDate:date||T.todayKST(), sheets:sheets};
      preview(); render();
    });
  }).catch(function(e){ alert(e.message||String(e)); });
}
function preview(){
  var ctx={plans:T.clone(W.plans), tiers:T.clone(W.tiers), newPlans:[], skip:{}}, v=T.clone(ver());
  PEND.res=applyRecs(PEND.recs, v, ctx); PEND.ctx=ctx; PEND.ver=v;
}
function previewHtml(){
  var P=PEND, res=P.res, ch=res.changes, sk=Object.keys(P.ctx.skip);
  var exist=W.vers.filter(function(x){return x.from===P.newDate})[0];
  return '<div class="pz-modal"><div class="pz-mb">'+
    '<h4>엑셀 불러오기 미리보기</h4><div class="pz-file">'+esc(P.file)+(P.date?' · 파일에 적힌 정책 시작일 <b>'+md(P.date)+'</b>':'')+'</div>'+
    '<div class="pz-sum"><span>읽은 줄 <b>'+P.recs.length+'</b></span><span>바뀌는 칸 <b>'+ch.length+'</b></span><span>새로 생기는 줄 <b>'+res.added.length+'</b></span></div>'+
    (P.ctx.newPlans.length?'<div class="pz-warn">새 지원금 구간이 추가됩니다 (요금제 설정에서 어느 요금제가 속하는지 정해 주세요): '+esc(P.ctx.newPlans.join(', '))+'</div>':'')+
    (res.added.length?'<div class="pz-warn">새 줄: '+res.added.map(function(r){return esc(r.code+' '+(r.cap||'공통'))+(r.model?'':' <small>(홈페이지 상품 연결 안 됨)</small>')}).join(', ')+' — 출고가는 표에서 넣어 주세요</div>':'')+
    (sk.length?'<div class="pz-warn mute">읽지 않은 칸: '+esc(sk.join(' / '))+'</div>':'')+
    '<div class="pz-chg">'+(ch.length?'<table><thead><tr><th>모델</th><th>항목</th><th>지금</th><th></th><th>바뀔 값</th></tr></thead><tbody>'+
      ch.slice(0,300).map(function(c){ var f=function(x){ return c.f==='so'?(x?'품절':'판매'):(x==null?'—':fmt(x)); };
        return '<tr><td>'+esc(c.code+' '+c.cap)+'</td><td>'+esc(fieldName(c.f,c.g,P.ctx))+'</td><td class="o">'+f(c.old)+'</td><td>→</td><td class="nw">'+f(c.nv)+'</td></tr>'; }).join('')+
      '</tbody></table>':'<div class="pz-help">지금 정책과 다른 숫자가 없어요.</div>')+'</div>'+
    '<div class="pz-mode">'+
      '<label><input type="radio" name="pvmode" value="new"'+(P.mode==='new'?' checked':'')+'> 새 정책으로 만들기 — 적용 시작일 <input type="date" id="pvDate" value="'+esc(P.newDate)+'"></label>'+
      (exist&&P.mode==='new'?'<div class="pz-warn">'+md(P.newDate)+' 시작 정책이 이미 있어서, 그 정책에 덮어씁니다.</div>':'')+
      '<label><input type="radio" name="pvmode" value="over"'+(P.mode==='over'?' checked':'')+'> 지금 보고 있는 정책('+md(ver().from)+' 부터)에 덮어쓰기</label>'+
    '</div>'+
    '<div class="pz-mbtn"><button type="button" class="pz-b" data-pz="pv-cancel">취소</button><button type="button" class="pz-b pri" data-pz="pv-apply">표에 반영하기</button></div>'+
    '<div class="pz-help" style="margin-top:6px">반영한 뒤 표를 확인하고 <b>[저장]</b>을 눌러야 홈페이지에 적용돼요.</div>'+
  '</div></div>';
}
pz.addEventListener('change',function(e){
  if(!PEND) return; var t=e.target;
  if(t.name==='pvmode'){ PEND.mode=t.value; render(); }
  else if(t.id==='pvDate'){ PEND.newDate=t.value||T.todayKST(); render(); }
});
function applyPending(){
  var P=PEND; if(!P) return;
  var target;
  if(P.mode==='over'){ target=ver(); }
  else {
    target=W.vers.filter(function(x){return x.from===P.newDate})[0];
    if(!target){ target=T.clone(ver()); target.id='v'+Date.now(); target.from=P.newDate; target.memo=P.file.replace(/\.(xlsx|xls|csv)$/i,''); W.vers.push(target); }
  }
  var ctx={plans:W.plans, tiers:W.tiers, newPlans:[], skip:{}};
  var res=applyRecs(P.recs, target, ctx);
  VI=W.vers.indexOf(target); sortVers(); PEND=null; dirty(); render();
  toast('표에 반영했어요 ('+res.changes.length+'칸) · 확인 후 [저장]');
}
function exportXlsx(){
  loadXLSX().then(function(X){
    var wb=X.utils.book_new(), v=ver();
    ['phone','second'].forEach(function(g){
      var C=cols(g), types=T.TYPES[g], nT=tiers(g).length, nP=plans(g).length;
      var r0=['제조사','모델코드',g==='phone'?'용량':'사이즈','홈페이지 상품','출고가'], r1=['','','','',''], r2=['','','','',''], mg=[];
      for(var c=0;c<5;c++) mg.push({s:{r:0,c:c},e:{r:2,c:c}});
      var col=5;
      types.forEach(function(t){
        mg.push({s:{r:0,c:col},e:{r:0,c:col+nT+nP-1}});
        if(nT>1) mg.push({s:{r:1,c:col},e:{r:1,c:col+nT-1}}); if(nP>1) mg.push({s:{r:1,c:col+nT},e:{r:1,c:col+nT+nP-1}});
        C.filter(function(x){return x.b===t[0]}).forEach(function(x,i){
          r0.push(i===0?(g==='phone'?t[1]:'지원금'):''); r1.push(x.kind==='pub'&&i===0?(g==='phone'?'공시지원금':'이통사 지원금'):(x.kind==='our'&&i===nT?'유플러스 다이렉트 지원금':''));
          r2.push(x.kind==='pub'?tierName(tiers(g).filter(function(y){return 'pub.'+t[0]+'_'+y.k===x.f})[0]||{nm:x.nm}):x.nm); });
        col+=nT+nP;
      });
      r0.push('품절'); r1.push(''); r2.push(''); mg.push({s:{r:0,c:col},e:{r:2,c:col}});
      var data=[r0,r1,r2];
      v.rows.filter(function(r){return r.g===g}).forEach(function(r){
        var line=[r.mk||'', r.code||'', r.cap||'공통', mName(r.model), num(r.out)==null?'':num(r.out)];
        C.forEach(function(x){ var n=num(getF(r,x.f)); line.push(n==null?'':n); });
        line.push(r.so?'품절':''); data.push(line);
      });
      var ws=X.utils.aoa_to_sheet(data); ws['!merges']=mg; ws['!cols']=data[0].map(function(_,i){ return {wch:i<4?14:12}; });
      X.utils.book_append_sheet(wb, ws, g==='phone'?'휴대폰':'워치태블릿TV');
    });
    var out=X.write(wb,{bookType:'xlsx',type:'array'}), blob=new Blob([out],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    var a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='유플러스다이렉트_가격표_'+(v.from||'')+'.xlsx';
    pz.appendChild(a); a.click(); setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); },5000);
  }).catch(function(e){ alert(e.message||String(e)); });
}
})();
