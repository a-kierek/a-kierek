// Two-stage, purely visual main menu. Gameplay and menu IDs are intentionally unchanged.
(function setupPixelMenu(){
  const splash=document.getElementById('pixelSplash');
  const hub=document.getElementById('pixelHub');
  const start=document.getElementById('pixelPressStart');
  const panels={play:document.getElementById('pixelPlayPanel'),settings:document.getElementById('pixelSettingsPanel'),player:document.getElementById('pixelPlayerPanel')};
  const tabs={play:document.getElementById('pixelNavPlay'),settings:document.getElementById('pixelNavSettings'),player:document.getElementById('pixelNavPlayer')};
  const selectBeep=new Audio('assets/audio/menu-beep.mp3');selectBeep.preload='auto';
  function select(name){
    if(hub&&!hub.hidden){const clip=selectBeep.cloneNode();clip.volume=.35*(gameSettings?.master??100)/100;clip.play().catch(()=>{});}
    for(const [key,panel] of Object.entries(panels)){
      panel.hidden=key!==name;
      tabs[key].classList.toggle('selected',key===name);
      if(key===name) tabs[key].setAttribute('aria-current','page');
      else tabs[key].removeAttribute('aria-current');
    }
    document.getElementById('pixelLiveStatus').textContent={play:'WYBIERZ POZIOM',settings:'KONFIGURACJA',player:'TWOJ PROFIL'}[name];
  }
  function open(){splash.hidden=true;hub.hidden=false;select('play');}
  const blood=document.getElementById('pixelBloodDecals');
  if(blood){
    for(let i=0;i<13;i++){
      const img=new Image();img.src='assets/ui/menu-blood-splatter.png';img.alt='';
      img.style.left=(4+Math.random()*88)+'%';img.style.top=(2+Math.random()*86)+'%';
      img.style.width=(45+Math.random()*95)+'px';
      img.style.transform='rotate('+(-115+Math.random()*230)+'deg)';img.style.opacity=(.35+Math.random()*.42).toFixed(2);
      blood.appendChild(img);
    }
    const hand=new Image();hand.src='assets/ui/menu-blood-handprint.png';hand.alt='';
    hand.style.left='74%';hand.style.top='56%';hand.style.width='min(22vw,250px)';hand.style.opacity='.40';
    blood.appendChild(hand);
  }
  const beep=()=>{const clip=selectBeep.cloneNode();clip.volume=.26*(gameSettings?.master??100)/100;clip.play().catch(()=>{});};
  start.addEventListener('click',open);
  for(const id of ['difficultyNormal','difficultyHard','startBtn','level2Btn','finalBtn','pigLevelBtn','level5Btn','proceduralBtn']){
    const element=document.getElementById(id);if(element)element.addEventListener('click',beep,{capture:true});
  }
  const playerInput=document.getElementById('playerNameInput');if(playerInput)playerInput.addEventListener('change',beep);
  for(const input of document.querySelectorAll('#pixelSettingsPanel input,#pixelSettingsPanel select')){
    input.addEventListener('change',beep);
  }
  start.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();open();}});
  for(const [name,button] of Object.entries(tabs))button.addEventListener('click',()=>select(name));
  // Allow using the existing settings overlay, but keep the menu section selected.
  window.CatroomsPixelMenu={open,select};
})();
