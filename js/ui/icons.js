/* THE CATROOMS : vector icon system. No icon fonts or network dependencies.
   Every icon is a tiny, accessible decorative SVG, shared by menus,
   mobile controls, HUD, pop-ups, and gameplay-generated labels. */
const CatroomIconPaths = Object.freeze({
  battery: '<rect x="6.5" y="4.5" width="11" height="16" rx="1.6"/><path d="M10 2.5h4M11.5 8l-2.5 5h3l-1 3.5 4-6h-3z"/>',
  flame: '<path d="M12 22c-4.5 0-7-2.9-7-6.5 0-2.7 1.6-4.7 3-6 .2 2.2 1 3 1.8 3.3C10 8.7 13.9 4.6 15 2c.5 3.2 1.4 4.2 2.8 6.1 1.5 2.1 2.2 4.1 2.2 7.4 0 3.6-2.7 6.5-8 6.5z"/><path d="M12.4 21c-2.1 0-3.2-1.1-3.2-2.9 0-1.5 1.1-2.7 2.2-4.6.6 1.6 3.4 2.9 3.4 4.6 0 1.8-.8 2.9-2.4 2.9z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  map: '<path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/>',
  sound: '<path d="M4 10v4h4l5 4V6l-5 4H4zM17 9c1 1 1.5 2 1.5 3s-.5 2-1.5 3M19.5 6c2 1.7 3 3.8 3 6s-1 4.3-3 6"/>',
  mute: '<path d="M4 10v4h4l5 4V6l-5 4H4zM17 9l5 6m0-6l-5 6"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M9.7 2.7l.7 2.1a7.5 7.5 0 0 1 3.2 0l.7-2.1 3 1.6-.8 2.1c.8.7 1.5 1.5 2 2.5l2.2-.2.8 3.2-2.1 1a7.8 7.8 0 0 1-.8 3l1.5 1.8-2.4 2.4-1.8-1.5c-1 .6-2 .9-3 1l-1 2.1-3.2-.8.2-2.2c-1-.5-1.8-1.2-2.5-2l-2.1.8-1.6-3 .2-2.3a7.5 7.5 0 0 1 0-3.1l-.2-2.3 3-1.6 2.1.8a9 9 0 0 1 2.5-2z" transform="translate(0 -1) scale(.95)"/>',
  alert: '<path d="M12 3L2 21h20L12 3z"/><path d="M12 9v5M12 17v.5"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 1 1 8 0v3M12 15v2"/>',
  unlock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0M12 15v2"/>',
  pig: '<path d="M4.5 9V5l4 2a9 9 0 0 1 7 0l4-2v4c1.5 1.7 2 3.7 2 5.5a9.5 9.5 0 0 1-19 0c0-2 .7-3.8 2-5.5z"/><ellipse cx="12" cy="16" rx="4.3" ry="3"/><path d="M10.4 16h.1m3 0h.1M8 12h.1m8 0h.1" stroke-width="2.6"/>',
  headphones: '<path d="M4 14v-3a8 8 0 0 1 16 0v3M4 14h3v7H5a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2zM17 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3z"/>',
  play: '<path d="M8 4l12 8-12 8V4z"/>',
  refresh: '<path d="M20 8a8 8 0 1 0 1 7M20 3v5h-5"/>',
  home: '<path d="M3 11.5L12 4l9 7.5M5.5 10.5V21h13V10.5M10 21v-7h4v7"/>',
  terminal: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9l3 3-3 3M12 15h5"/>',
  file: '<path d="M6 2h8l4 4v16H6zM14 2v5h4M9 12h6M9 16h6"/>',
  reticle: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2"/><path d="M12 1v4M12 19v4M1 12h4M19 12h4"/>',
  spark: '<path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z"/>',
  toxic: '<circle cx="12" cy="12" r="2.2"/><circle cx="12" cy="12" r="9"/><path d="M12 9.8l-3-5M14 12h5.5M10 13l-3 5.4"/>',
  key: '<circle cx="8" cy="14.5" r="4"/><path d="M11.4 11l8-8 2 2-3 3 1.5 1.5-2.5 2.5-1.5-1.5-2.5 2.5"/>',
  door: '<path d="M6 3h12v18H6zM6 3l9 2v14l-9 2z"/><path d="M12 12h.1" stroke-width="2.5"/>',
  decoy: '<circle cx="12" cy="12" r="4"/><path d="M5.4 5.4a9.2 9.2 0 0 0 0 13.2m13.2-13.2a9.2 9.2 0 0 1 0 13.2M2 2l2.4 2.4M22 2l-2.4 2.4M2 22l2.4-2.4M22 22l-2.4-2.4"/>',
  up: '<path d="M12 20V4M5 11l7-7 7 7"/>',
  right: '<path d="M4 12h16M13 5l7 7-7 7"/>',
  left: '<path d="M20 12H4M11 5l-7 7 7 7"/>',
  horizontal: '<path d="M2 12h20M7 7l-5 5 5 5M17 7l5 5-5 5"/>',
  vertical: '<path d="M12 2v20M7 7l5-5 5 5M7 17l5 5 5-5"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  pause: '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
  flashlight: '<path d="M7 3h10l-2 6-2 3v9h-2v-9L9 9zM5 1v2M12 1v2M19 1v2"/>',
  run: '<circle cx="15.5" cy="4" r="2"/><path d="M11 9l4 1 2 5M11 9l-3 4-4 1M13 10l-2 5-4 6M11 15l5 2 4 4"/>',
  sneak: '<circle cx="13" cy="5" r="2"/><path d="M10 9l4 2-2 4-5 2M14 11l5 1M12 15l4 5M7 17l-3 3M3 22h18"/>',
  hand: '<path d="M7 11V6a1.5 1.5 0 0 1 3 0v5-7a1.5 1.5 0 0 1 3 0v7-5a1.5 1.5 0 0 1 3 0v6-4a1.5 1.5 0 0 1 3 0v7c0 4-3 6-7 6-3 0-5-1-6-3l-3-5c-.5-1.4.7-2.5 2-2 1 .2 1.5 1 2 1.5z"/>',
  wifi: '<path d="M2 8a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0M8 16a5 5 0 0 1 8 0M12 21h.1"/>',
  plus: '<path d="M12 4v16M4 12h16"/>',
  check: '<path d="M4 12l5.5 5.5L20 6"/>',
  skull: '<path d="M12 2a8 8 0 0 0-8 8c0 3 1.5 5.2 4 6v4h8v-4c2.5-.8 4-3 4-6a8 8 0 0 0-8-8z"/><path d="M9 11h.1m6 0h.1" stroke-width="2.6"/><path d="M10 17v3M14 17v3"/>',
  signal: '<path d="M3 20h2v-4H3zM8 20h2v-8H8zM13 20h2V8h-2zM18 20h2V4h-2z"/>',
  close: '<path d="M5 5l14 14M19 5L5 19"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 10v6M12 7v.5"/>',
  shield: '<path d="M12 2l8 3v6c0 6-3.5 9-8 11-4.5-2-8-5-8-11V5z"/><path d="M9 12l2 2 4-4"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="M16.5 7.5l-2 7-7 2 2-7z"/>',
  droplet: '<path d="M12 2C9 7 5 11 5 15a7 7 0 0 0 14 0c0-4-4-8-7-13z"/><path d="M9 16c0 1.5 1 2.5 2.5 3"/>',
  monitor: '<rect x="3" y="4" width="18" height="14" rx="1.6"/><path d="M9 21h6M12 18v3M7 9h5M7 12h9"/>',
  sliders: '<path d="M4 6h16M4 12h16M4 18h16"/><circle cx="9" cy="6" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="10" cy="18" r="2"/>',
  dot: '<circle cx="12" cy="12" r="4" fill="currentColor" stroke="none"/>',
  chevron: '<path d="M7 10l5 5 5-5"/>',
  exit: '<path d="M4 3h10v18H4zM14 12h8M18 8l4 4-4 4M11 12h.1"/>',
  heart: '<path d="M20.8 9.5c0 4.7-8.8 11-8.8 11S3.2 14.2 3.2 9.5a4.8 4.8 0 0 1 8.8-2.6 4.8 4.8 0 0 1 8.8 2.6z"/>',
  mouse: '<rect x="7" y="2" width="10" height="20" rx="5"/><path d="M12 2v8"/>',
  warning: '<path d="M12 2l10 18H2L12 2z"/><path d="M12 9v5M12 17v.5"/>',
  feed: '<rect x="7" y="4" width="10" height="16" rx="1.5"/><path d="M7 7h10M7 17h10M10 11h4"/>',
  archive: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M4 8h16M8 13h8M8 17h4"/>'
});
const _iconAliases=Object.freeze({
 '⚡':'battery','🔥':'flame','🌽':'feed','🐖':'pig','🎧':'headphones',
 '🔒':'lock','🔓':'unlock','☣':'toxic','⚠':'warning','⛔':'alert',
 '🔑':'key','☠':'skull','🌐':'wifi','⚙':'settings','▦':'map',
 '♫':'sound','♪̸':'mute','◷':'clock','▣':'archive','✦':'spark',
 '✧':'spark','◈':'archive','⛨':'door','⌘':'terminal','⌂':'home',
 '↻':'refresh','↔':'horizontal','↕':'vertical','↑':'up',
 '←':'left','→':'right','▶':'play','✓':'check','✕':'close',
 '☀':'flashlight','Ⅱ':'pause','⊕':'plus','●':'dot'
});
const _iconTokenPattern=new RegExp(Object.keys(_iconAliases).sort((a,b)=>b.length-a.length).map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'gu');
const SVG_NS='http://www.w3.org/2000/svg';
function makeUIIcon(id,klass=''){
 const svg=document.createElementNS(SVG_NS,'svg');
 svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('fill','none');
 svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','1.7');
 svg.setAttribute('stroke-linecap','round');svg.setAttribute('stroke-linejoin','round');
 svg.setAttribute('aria-hidden','true');svg.classList.add('ui-icon');
 if(klass)svg.classList.add(klass);
 svg.innerHTML=CatroomIconPaths[id]||CatroomIconPaths.info;
 return svg;
}
function uiIcon(id,klass='') {return makeUIIcon(id,klass).outerHTML;}
function setUIIcon(el,id){
 if(!el)return;
 el.replaceChildren(makeUIIcon(id));
 el.dataset.uiIcon=id;
}
function setUIIconText(el,id,txt){
 if(!el)return;
 el.replaceChildren(makeUIIcon(id),document.createTextNode(String(txt)));
 el.dataset.uiIcon=id;
}
function _iconizeText(node){
 if(!node || !node.parentNode || node.parentNode.closest('svg,script,style,textarea,option,code,pre'))return;
 const v=node.nodeValue;
 if(!v || !_iconTokenPattern.test(v)){_iconTokenPattern.lastIndex=0;return;}
 _iconTokenPattern.lastIndex=0;
 const fragment=document.createDocumentFragment();let last=0,m;
 while((m=_iconTokenPattern.exec(v))){
  if(m.index>last)fragment.append(document.createTextNode(v.slice(last,m.index)));
  fragment.append(makeUIIcon(_iconAliases[m[0]]));last=m.index+m[0].length;
 }
 if(last<v.length)fragment.append(document.createTextNode(v.slice(last)));
 node.replaceWith(fragment);
}
function iconizeUI(root){
 if(root.nodeType===Node.TEXT_NODE){_iconizeText(root);return;}
 if(root.nodeType!==Node.ELEMENT_NODE&&root.nodeType!==Node.DOCUMENT_NODE)return;
 if(root.nodeType===Node.ELEMENT_NODE&&root.closest('svg,script,style,textarea,option,code,pre'))return;
 if(root.matches?.('[data-icon]')){
  const icon=root.getAttribute('data-icon');root.replaceChildren(makeUIIcon(icon));return;
 }
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];
 while(walker.nextNode())nodes.push(walker.currentNode);
 for(const n of nodes)_iconizeText(n);
 for(const el of root.querySelectorAll?.('[data-icon]')||[])el.replaceChildren(makeUIIcon(el.getAttribute('data-icon')));
}
iconizeUI(document.body);
const catroomsIconObserver=new MutationObserver(records=>{
 for(const r of records){
  if(r.type==='characterData')_iconizeText(r.target);
  else for(const n of r.addedNodes)iconizeUI(n);
 }
});
catroomsIconObserver.observe(document.body,{childList:true,characterData:true,subtree:true});
