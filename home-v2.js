(() => {
  'use strict';
  const search=document.getElementById('globalSearch');
  if(!search)return;
  const go=document.getElementById('gnSearchButton');
  if(go)go.addEventListener('click',()=>{
    search.focus();
    if(search.value.trim()){
      search.dispatchEvent(new Event('input',{bubbles:true}));
      document.getElementById('searchResults')?.scrollIntoView({block:'nearest',behavior:'smooth'});
    }
  });
  search.setAttribute('aria-keyshortcuts','Control+K Meta+K');
  document.addEventListener('keydown',e=>{
    if((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==='k'){
      e.preventDefault();
      search.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
      search.focus({preventScroll:true});
      search.select();
    }
  });
})();
