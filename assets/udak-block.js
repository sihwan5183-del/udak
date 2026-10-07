/* v20261007: 신청 차단 (공통) — 랜딩 소스에 전화번호가 그대로 보이지 않게 해시로만 비교
   · udakBlocked('01012345678') → 차단 번호면 true (갤럭시·아이폰·상세 화면 신청 버튼에서 사용)
   · 차단 고객이 예전에 신청했던 브라우저(메타 픽셀 _fbp 쿠키)로 다시 들어오면 랜딩 대신 안내 한 줄만 보여 줌
   · 차단 추가: 숫자만 11자리 번호 또는 _fbp 값을 cyrb53(seed 7)로 바꿔 아래 목록에 넣기 */
(function(){
  function cyrb53(str, seed){
    var h1=0xdeadbeef^seed, h2=0x41c6ce57^seed;
    for(var i=0,ch;i<str.length;i++){ ch=str.charCodeAt(i); h1=Math.imul(h1^ch,2654435761); h2=Math.imul(h2^ch,1597334677); }
    h1=Math.imul(h1^(h1>>>16),2246822507); h1^=Math.imul(h2^(h2>>>13),3266489909);
    h2=Math.imul(h2^(h2>>>16),2246822507); h2^=Math.imul(h1^(h1>>>13),3266489909);
    return (4294967296*(2097151&h2)+(h1>>>0)).toString(36);
  }
  var PHONE=['1cvrjvx4x47','185f1rvsi5e'];   // 차단 번호 2개 (2026-10-07 기준)
  var FBP=['1iowvp8txp'];                    // 차단 고객 브라우저 1개 (10/5~6 갤럭시 신청 3건)
  window.udakBlocked=function(p){ try{ return PHONE.indexOf(cyrb53(String(p||'').replace(/\D/g,''),7))>-1; }catch(e){ return false; } };
  try{
    var m=document.cookie.match(/(?:^|;\s*)_fbp=([^;]+)/);
    if(m && FBP.indexOf(cyrb53(decodeURIComponent(m[1]),7))>-1){
      window.UDAK_BLOCKED=true;
      var d=document.documentElement; d.className+=(d.className?' ':'')+'udak-blocked';
      var st=document.createElement('style');
      st.textContent='html.udak-blocked body>*{display:none!important}html.udak-blocked body{background:#fff!important;padding:0!important;margin:0!important}'
        +'html.udak-blocked body::before{content:"현재 신청이 제한되어 있습니다.\\A문의사항은 고객센터로 연락해 주세요.";white-space:pre-line;display:block;padding:38vh 24px 0;text-align:center;'
        +'font:600 16px/1.7 -apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Noto Sans KR",sans-serif;color:#555}';
      (document.head||d).appendChild(st);
    }
  }catch(e){}
})();
