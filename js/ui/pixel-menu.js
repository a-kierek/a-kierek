// Landing menu + level selection. Legacy engine-facing IDs are preserved.
let selectedSector=1;
const sectorButtonIds=['','startBtn','level2Btn','finalBtn','pigLevelBtn','level5Btn'];
const descriptions=['','The beginning of the nightmare. Find the batteries and escape.','A flooded facility. Collect cards and activate the panels.','A hostile zone of cores, reactors and dangerous encounters.','CHRUM is waiting. Collect food and reach the exit.','The final encounter: two threats and one way out.'];
function chosenSectorId(){return selectedSector===12?12:selectedDifficulty==='hard'?(selectedSector===5?11:selectedSector+5):selectedSector===5?10:selectedSector;}
function syncSectorSelection(){const b=$(selectedSector===12?'bossRushBtn':sectorButtonIds[selectedSector]);if(!b||b.hidden){selectedSector=1;return syncSectorSelection();}for(const id of [...sectorButtonIds.slice(1),'bossRushBtn']){$(id).classList.toggle('sector-selected',$(id)===b);$(id).setAttribute('aria-pressed',String($(id)===b));}const open=selectedSector===12?bossRushVisible():!b.disabled;$('sectorNumber').textContent=selectedSector===12?'EX / CHALLENGE':'SECTOR '+String(selectedSector).padStart(2,'0');$('sectorName').textContent=selectedSector===12?'BOSS RUSH':sectorNames[selectedSector].toUpperCase();$('sectorDescription').textContent=selectedSector===12?'Five sectors. Eighteen bosses. One run.':descriptions[selectedSector];$('sectorAccess').textContent=open?'AVAILABLE':'LOCKED · COMPLETE PREVIOUS SECTOR';$('enterSector').disabled=!open;$('difficultySwitcher').hidden=selectedSector===12;}
function startSectorTransition(id){if(!graphicsReadyForPlay()||$('transition').classList.contains('active'))return;transit(()=>begin(id),'GENERATING LABYRINTH...');}
(function setupPixelMenu(){
 const splash=$('pixelSplash'),hub=$('pixelHub'),start=$('pixelPressStart');
 const panels={play:$('pixelPlayPanel'),settings:$('pixelSettingsPanel'),player:$('pixelPlayerPanel'),custom:$('pixelCustomPanel'),credits:$('pixelCreditsPanel')};
 const tabs={play:$('pixelNavPlay'),settings:$('pixelNavSettings'),player:$('pixelNavPlayer'),custom:$('pixelNavCustom'),credits:$('pixelNavCredits')};
 const sound=new Audio('assets/audio/menu-beep.mp3');sound.preload='auto';let lastBeep=-Infinity;
 function beep(){const now=performance.now();if(muted||now-lastBeep<85)return;lastBeep=now;sound.pause();sound.currentTime=0;sound.volume=.11*(gameSettings.master/100)*(gameSettings.effects/100);sound.play().catch(()=>{});}
 function select(name){if(!panels[name])return;for(const [key,panel] of Object.entries(panels)){panel.hidden=key!==name;tabs[key].classList.toggle('selected',key===name);if(key===name)tabs[key].setAttribute('aria-current','page');else tabs[key].removeAttribute('aria-current');}$('pixelLiveStatus').textContent={play:'SELECT LEVEL',settings:'SETTINGS',player:'PLAYER PROFILE',custom:'CUSTOM GAME',credits:'CREDITS'}[name];if(name==='play')syncSectorSelection();if(name==='player')renderPlayerProfile();}
 const notes=$('releaseNotes'),notesButton=$('releaseNotesOpen'),notesClose=$('releaseNotesClose'),notesKey='catroomsReleaseNotesSeen_1.7.0-alpha.1';let notesSeen=progressRead(notesKey,'0')==='1';
 function showNotes(){notes.hidden=false;notesButton.hidden=true;hub.inert=true;splash.inert=true;notesClose.focus();}
 function closeNotes(){notes.hidden=true;notesSeen=true;progressWrite(notesKey,'1');notesButton.hidden=false;hub.inert=false;splash.inert=false;notesButton.focus();}
 function onReady(){if(!notesSeen)showNotes();else notesButton.hidden=false;}
 notesButton.hidden=!notesSeen;notesButton.addEventListener('click',showNotes);notesClose.addEventListener('click',closeNotes);notes.addEventListener('keydown',e=>{if(e.key==='Escape'||e.key==='Tab'){e.preventDefault();e.stopPropagation();if(e.key==='Escape')closeNotes();else notesClose.focus();}});
 function open(name='play'){unlockMenuMusic();splash.hidden=true;hub.hidden=false;select(name);}
 function backToTitle(){hub.hidden=true;splash.hidden=false;if(typeof gpuRenderer!=='undefined'&&gpuRenderer)gpuRenderer.needsRender=true;}
 $('pixelBackToTitle').addEventListener('click',backToTitle);$('hubBack').addEventListener('click',backToTitle);start.addEventListener('click',()=>open('play'));$('continueCampaign').addEventListener('click',continueCampaign);
 for(const b of splash.querySelectorAll('[data-menu]'))b.addEventListener('click',()=>open(b.dataset.menu));
 for(const [name,button] of Object.entries(tabs))button.addEventListener('click',()=>select(name));
 for(const n of [1,2,3,4,5,12]){const b=$(n===12?'bossRushBtn':sectorButtonIds[n]);b.addEventListener('click',e=>{e.stopImmediatePropagation();selectedSector=n;syncSectorSelection();beep();},true);}
 for(const id of ['difficultyNormal','difficultyHard'])$(id).addEventListener('click',syncSectorSelection);
 $('graphicsDemoBtn').addEventListener('click',beginGraphicsDemo);
 $('enterSector').addEventListener('click',()=>startSectorTransition(chosenSectorId()));
 // Preserve the existing custom form handler's validation, but present loading before generation.
 $('customStartBtn').addEventListener('click',e=>{e.stopImmediatePropagation();readCustomGameForm();startSectorTransition(13);},true);
 $('start').addEventListener('click',e=>{if(e.target.closest('button,select'))beep();});
 const blood=$('pixelBloodDecals');if(blood){const hand=new Image();hand.src='assets/ui/menu-blood-handprint.png';hand.alt='';blood.appendChild(hand);}
 window.CatroomsPixelMenu={open,select,backToTitle,onReady};
})();
// User-named presets store only validated form inputs, never code or DOM markup.
(function customPresets(){
 const key='catroomsCustomPresets_v1',fields=['customTheme','customSize','customDifficulty','customSeed','customSafeRooms','customDrinks','customLoot','customDark','customEmergency'];
 function load(){try{const a=JSON.parse(progressRead(key,'[]'));return Array.isArray(a)?a.filter(x=>x&&typeof x.name==='string'&&x.name.length<=32&&x.values&&typeof x.values==='object').slice(0,20):[]}catch{return[]}}
 let entries=load();const list=$('presetList'),msg=$('presetMessage');
 function refresh(name=''){list.replaceChildren(new Option('Choose preset',''),...entries.map(x=>new Option(x.name,x.name)));list.value=name;}
 function snapshot(){const values={};for(const id of fields){const e=$(id);values[id]=e.type==='checkbox'?e.checked:e.value;}values.enemies=Object.fromEntries([...$('customEnemyGrid').querySelectorAll('select')].map(e=>[e.dataset.enemy,e.value]));return values;}
 function store(){progressWrite(key,JSON.stringify(entries));}
 $('presetSave').addEventListener('click',()=>{const name=$('presetName').value.trim().slice(0,32);if(!name){msg.textContent='Enter a preset name.';return;}const i=entries.findIndex(x=>x.name===name);if(i<0&&entries.length>=20){msg.textContent='Maximum 20 presets.';return;}const entry={name,values:snapshot()};if(i<0)entries.push(entry);else entries[i]=entry;store();refresh(name);msg.textContent='Preset saved.';});
 $('presetLoad').addEventListener('click',()=>{const entry=entries.find(x=>x.name===list.value);if(!entry)return;for(const id of fields){const e=$(id),v=entry.values[id];if(e.type==='checkbox'){if(typeof v==='boolean')e.checked=v;}else if(e.tagName==='SELECT'){if([...e.options].some(o=>o.value===String(v)))e.value=String(v);}else if(typeof v==='string')e.value=v;}for(const e of $('customEnemyGrid').querySelectorAll('select')){const v=entry.values.enemies?.[e.dataset.enemy];if(['0','1','2','3'].includes(String(v)))e.value=String(v);}$('presetName').value=entry.name;msg.textContent='Preset loaded.';});
 $('presetDelete').addEventListener('click',()=>{if(!list.value)return;entries=entries.filter(x=>x.name!==list.value);store();refresh();msg.textContent='Preset deleted.';});refresh();
})();
