// THE CATROOMS - sound effects and distance-aware character voices.
// Recorded samples are kept under assets/audio/ and embedded by the standalone build.
// BLYSK (watcher) and SZEPT (listener) use the supplied voice lines with distance attenuation.
const SFX_FILES = {
  pickup: 'assets/audio/battery-charge.wav',
  metalCrack: 'assets/audio/metal-crack.mp3',
  coinPickup: 'assets/audio/coin-pickup.mp3',
  coinSlot: 'assets/audio/coin-slot.wav',
  safeMusic: 'assets/audio/safe-room/lift-music.mp3',
  safeCrackle: 'assets/audio/safe-room/campfire-crackle.mp3',
  steps: 'assets/audio/roblox-walking.mp3',
  pigOink: 'assets/audio/pig-oink.mp3',
  pigGrunt: 'assets/audio/pig-grunt.mp3',
  pigSqueal: 'assets/audio/pig-squeal.mp3',
  beast: 'assets/audio/angry-beast.mp3',
  catAngry: 'assets/audio/angry-cat.mp3',
  catVeryAngry: 'assets/audio/very-angry-cat.mp3',
  hurt: 'assets/audio/steve-old-hurt.mp3',
  szeptJadymy: 'assets/audio/voices/szept-jadymy-na-imielin.mp3',
  szeptNieLubi: 'assets/audio/voices/szept-nie-lubi-imielina.mp3',
  szeptVamos: 'assets/audio/voices/szept-vamos-polska.mp3',
  blyskOni: 'assets/audio/voices/blysk-oni-gadaja.mp3',
  blyskKurwy: 'assets/audio/voices/blysk-kurwy.mp3',
  blyskPijany: 'assets/audio/voices/blysk-pijany.mp3',
  appearScream: 'assets/audio/jumpscares/appear-scream-loud.wav',
  hardHeartbeat:'assets/audio/hard/heartbeat.mp3',
  hardSqueal:'assets/audio/hard/pig-squeal-horror.mp3',
  menuMusic:'assets/audio/music/menu-ambient.mp3',
  gameMusic:'assets/audio/music/game-ambient.mp3',
  chaseMusic:'assets/audio/music/chase-trailer.mp3'
};
// Missing replacements are set to null by the build, so their cues stay silent.
const REPLACEMENT_SFX_FILES = {
  unlock: 'assets/audio/replacements/unlock.mp3',
  warning: 'assets/audio/replacements/warning.mp3',
  roundStart: 'assets/audio/replacements/round-start.mp3',
  reactorWrongOrder: 'assets/audio/replacements/reactor-wrong-order.mp3',
  win: 'assets/audio/replacements/win.mp3',
  doorLocked: 'assets/audio/replacements/door-locked.mp3',
  eventSiren: 'assets/audio/replacements/event-siren.mp3',
  eventBlackout: 'assets/audio/replacements/event-blackout.mp3',
  yellowPulse: 'assets/audio/replacements/yellow-pulse.mp3',
  slotNoPrize: 'assets/audio/replacements/slot-no-prize.mp3',
  humDefault: 'assets/audio/replacements/hum-default.mp3',
  humFlooded: 'assets/audio/replacements/hum-flooded.mp3',
  humBloody: 'assets/audio/replacements/hum-bloody.mp3'
};
const VOICE_LINES = Object.freeze({
  listener: ['szeptJadymy', 'szeptNieLubi', 'szeptVamos'],
  watcher: ['blyskOni', 'blyskKurwy', 'blyskPijany']
});
const sfxTemplates = Object.create(null);
const activeEnemySounds = [];
let walkingAudio = null, walkingPlaying = false, lossScreamAudio = null, hardHeartbeatAudio = null, hardHeartbeatPlaying = false;
const safeRoomTracks={music:null,fire:null};
const bgTracks={menu:null,game:null,chase:null,hum:null};
let menuMusicUnlocked=false;
const activeOneShots=new Set();
function audioCategory(id){
 if(id==='appearScream')return 'jumpscare';
 if(id.startsWith('szept')||id.startsWith('blysk'))return 'voices';
 return 'effects';
}
function audioMix(category){
 if(muted)return 0;
 return (gameSettings.master/100)*(gameSettings[category]/100);
}
function refreshAudioMix(){
 for(const a of activeOneShots)a.volume=clamp((a._baseVolume||0)*audioMix(a._category||'effects'),0,1);
 for(const s of activeEnemySounds)s.audio.volume=clamp(s.currentVolume*audioMix(s.category||'effects'),0,1);
 if(walkingAudio)walkingAudio.volume=clamp((walkingAudio._baseVolume||0)*audioMix('effects'),0,1);
 if(hardHeartbeatAudio)hardHeartbeatAudio.volume=clamp((hardHeartbeatAudio._baseVolume||0)*audioMix('effects'),0,1);
 if(lossScreamAudio)lossScreamAudio.volume=clamp((lossScreamAudio._baseVolume||0)*audioMix('jumpscare'),0,1);
 for(const [kind,track] of Object.entries(safeRoomTracks))if(track){
   track.volume=clamp((track._baseVolume||0)*audioMix(kind==='music'?'ambient':'effects'),0,1);
 }
 for(const [id,a] of Object.entries(bgTracks))if(a)a.volume=clamp((a._baseVolume||0)*audioMix(id==='chase'?'effects':'ambient'),0,1);
}


// HTMLMediaElement playback works both in an offline ZIP opened as file://
// and in the self-contained HTML build (where these URLs become data: URIs).
function preloadGameSounds() {
  for (const [id, url] of Object.entries({...SFX_FILES,...REPLACEMENT_SFX_FILES})) {
    if (!url || sfxTemplates[id]) continue;
    const audio = new Audio();
    audio.preload = Object.hasOwn(REPLACEMENT_SFX_FILES,id)||['menuMusic','gameMusic','chaseMusic','safeMusic','safeCrackle'].includes(id)?'none':'auto';
    audio.src = url;
    sfxTemplates[id] = audio;
  }
}

function createGameSample(id, volume = 0.5, rate = 1) {
  if (muted || !sfxTemplates[id]) return null;
  const sound = sfxTemplates[id].cloneNode(true);
  sound._baseVolume=volume;
  sound._category=audioCategory(id);
  sound.volume=clamp(volume*audioMix(sound._category),0,1);
  activeOneShots.add(sound);
  sound.addEventListener('ended',()=>activeOneShots.delete(sound),{once:true});
  sound.addEventListener('error',()=>activeOneShots.delete(sound),{once:true});
  sound.playbackRate = rate;
  sound.preload = 'auto';
  // A failed asset never breaks the gameplay loop.
  const attempt = sound.play();
  if (attempt && typeof attempt.catch === 'function') attempt.catch(() => activeOneShots.delete(sound));
  return sound;
}

function stopEnemySounds() {
  for (const entry of activeEnemySounds) {
    entry.audio.pause();
    activeOneShots.delete(entry.audio);
    entry.audio.removeAttribute('src');
    entry.audio.load();
  }
  activeEnemySounds.length = 0;
}

function stopLossScream() {
  if (lossScreamAudio) {
    lossScreamAudio.pause();
    activeOneShots.delete(lossScreamAudio);
    lossScreamAudio.currentTime = 0;
    lossScreamAudio = null;
  }
}

// Played ONLY by lose(), never on alarms/panels. The supplied clip was
// normalized +10 dB with ~3 dB headroom: loud, but not hard clipped.
function playLossScream() {
  stopLossScream();
  if (muted) return;
  lossScreamAudio = createGameSample('appearScream', 1, 1);
}

function stopWalkingSound() {
  if (walkingAudio) walkingAudio.pause();
  walkingPlaying = false;
}

function stopGameSounds() {
  for(const id of ['game','chase','hum'])if(bgTracks[id])bgTracks[id].pause();
  stopSafeRoomTracks();
  if(hardHeartbeatAudio){hardHeartbeatAudio.pause();hardHeartbeatPlaying=false;}
  stopEnemySounds();
  stopWalkingSound();
}

function syncWalkingAudio() {
  if (gameSession.state !== 'playing' || muted || !gameSession.player.moving || gameSession.player.hidden) {
    stopWalkingSound(); return;
  }
  if (!walkingAudio) {
    if (!sfxTemplates.steps) return;
    walkingAudio = sfxTemplates.steps.cloneNode(true);
    walkingAudio.loop = true;
    walkingAudio.preload = 'auto';
  }
  const running = !gameSession.crouching && !!(keys.ShiftLeft || keys.ShiftRight || touchRun);
  walkingAudio.playbackRate = gameSession.crouching ? .72 : running ? 1.42 : 1;
  walkingAudio._baseVolume = gameSession.crouching ? .16 : running ? .33 : .26;
  walkingAudio.volume = clamp(walkingAudio._baseVolume*audioMix('effects'),0,1);
  if (!walkingPlaying) {
    walkingPlaying = true;
    const attempt = walkingAudio.play();
    if (attempt && typeof attempt.catch === 'function') attempt.catch(() => { walkingPlaying = false; });
  }
}

function playPickup(){createGameSample('pickup',.16);}
function playHurt(){createGameSample('hurt',.72);}
function playUnlock(){createGameSample('unlock',.32);}
function playSting(loud=true){createGameSample(loud?'warning':'roundStart',loud?.38:.25);}
function playWin(){createGameSample('win',.45);}

// Volume falls smoothly from near distance to silence beyond maxRange;
// a wall between player and monster dampens the sound further.
function enemyAudibility(monster, maxRange = 19) {
  const dx = monster.x - gameSession.player.x, dy = monster.y - gameSession.player.y;
  const dist = Math.hypot(dx, dy);
  if (dist >= maxRange) return 0;
  const normalized = clamp((maxRange - dist) / (maxRange - 1.5), 0, 1);
  let gain = Math.pow(normalized, 1.65);
  if (dist > 3 && !lineOfSight(monster.x, monster.y, gameSession.player.x, gameSession.player.y)) gain *= .57;
  return clamp(gain, 0, 1);
}

function playEnemySample(id, monster, volume, rate, maxRange = 19, isVoice = false) {
  if (!monster || muted || gameSession.state !== 'playing') return false;
  if (isVoice && activeEnemySounds.some(s => s.monster === monster && s.isVoice && !s.audio.ended)) return false;
  const audibility = enemyAudibility(monster, maxRange);
  if (audibility < .012 || activeEnemySounds.length >= 8) return false;
  const audio = createGameSample(id, Math.min(.95, volume * audibility), rate);
  if (!audio) return false;
  activeEnemySounds.push({audio,monster,volume,maxRange,currentVolume:volume*audibility,category:audioCategory(id),isVoice});
  return true;
}

function updateEnemyAudio(dt) {
  if (muted || gameSession.state !== 'playing') { stopGameSounds(); return; }
  for (let i = activeEnemySounds.length - 1; i >= 0; i--) {
    const s = activeEnemySounds[i];
    if (s.audio.ended || s.audio.error) { s.audio.pause(); activeOneShots.delete(s.audio); activeEnemySounds.splice(i, 1); continue; }
    const target = s.volume * enemyAudibility(s.monster, s.maxRange);
    s.currentVolume += (target - s.currentVolume) * Math.min(1, dt * 8);
    s.audio.volume = clamp(s.currentVolume*audioMix(s.category||'effects'),0,1);
    if (target <= .0001 && s.currentVolume < .003) {
      s.audio.pause(); activeOneShots.delete(s.audio); activeEnemySounds.splice(i, 1);
    }
  }
  const monsters = gameSession.level === 1 ? [...(gameSession.awake ? [gameSession.cat] : []),...gameSession.guards] : gameSession.guards;
  for (const monster of monsters) {
    const lines = VOICE_LINES[monster.kind];
    if (lines) {
      // The three lines of each character play in a shuffled starting order,
      // then rotate. No doubling up while a longer line is still playing.
      if (monster._voiceCursor === undefined) monster._voiceCursor = Math.floor(Math.random() * lines.length);
      if (monster._nextVoiceAt === undefined) monster._nextVoiceAt = gameSession.elapsed + 1.5 + Math.random() * 3;
      if (gameSession.elapsed >= monster._nextVoiceAt) {
        const voiceId = lines[monster._voiceCursor % lines.length];
        const playing = activeEnemySounds.some(s => s.monster === monster && s.isVoice && !s.audio.ended);
        if (!playing) {
          if (playEnemySample(voiceId, monster, monster.kind === 'listener' ? .64 : .67, 1, 23, true)) {
            monster._voiceCursor++;
            monster._nextVoiceAt = gameSession.elapsed + (monster.state === 'chase' ? 8.5 : 13) + Math.random() * 3.5;
          } else {
            // Retest soon after the player approaches the sound's radius.
            monster._nextVoiceAt = gameSession.elapsed + 2;
          }
        }
      }
      continue;
    }
    if (monster.kind !== 'cat' && monster.kind !== 'pig') continue;
    const chasing = monster.state === 'chase';
    if (monster._soundChasing !== chasing) {
      monster._soundChasing = chasing;
      if (chasing) {
        // One original angry-beast recording, differently pitched for each creature.
        if(isHardMode()&&monster.kind==='pig')playEnemySample('hardSqueal',monster,.68,1.0,32);
        playEnemySample('beast', monster, monster.kind === 'pig' ? .72 : .52,
          monster.kind === 'pig' ? .73 : 1.16, 22);
        monster._nextVoiceAt = gameSession.elapsed + (monster.kind === 'pig' ? 2.3 : 3.0);
      }
    }
    if (monster._nextVoiceAt === undefined) monster._nextVoiceAt = gameSession.elapsed + 1.5 + Math.random() * 2.8;
    if (gameSession.elapsed < monster._nextVoiceAt) continue;
    if (monster.kind === 'pig') {
      // Low grunts/oinks while patrolling; piercing squeal when hunting.
      if (chasing) playEnemySample('pigSqueal', monster, .61, .85, 18);
      else playEnemySample(Math.random() < .55 ? 'pigGrunt' : 'pigOink', monster, .57, .92, 15);
    } else {
      playEnemySample(chasing ? 'catVeryAngry' : 'catAngry', monster,
        chasing ? .58 : .41, chasing ? 1.06 : 1.12, chasing ? 19 : 14);
    }
    monster._nextVoiceAt = gameSession.elapsed + (chasing ? 5.2 : 7.4) + Math.random() * 2.6;
  }
}

// Kept as an API for old level scripts, now uses the supplied pig recording.
function playPigSnort(monster) {
  if (monster && monster.kind === 'pig') playEnemySample('pigGrunt', monster, .54, .86, 15);
}


function syncHardHeartbeat(){
 const active=isHardMode()&&(gameSession.guards.some(g=>g.state==='chase'&&!g.frozen&&(gameSession.level!==12||g.rushSector===gameSession.bossRush?.stage))||!!gameSession.hardEmergency);
 if(!active||muted||gameSession.state!=='playing'){
  if(hardHeartbeatAudio){hardHeartbeatAudio.pause();hardHeartbeatPlaying=false;}return;
 }
 if(!hardHeartbeatAudio){
  if(!sfxTemplates.hardHeartbeat)return;
  hardHeartbeatAudio=sfxTemplates.hardHeartbeat.cloneNode(true);
  hardHeartbeatAudio.loop=true;hardHeartbeatAudio.preload='auto';
 }
 const chase=gameSession.guards.some(g=>g.state==='chase'&&!g.frozen&&(gameSession.level!==12||g.rushSector===gameSession.bossRush?.stage));
 hardHeartbeatAudio._baseVolume=chase?.24:.15;
 hardHeartbeatAudio.volume=clamp(hardHeartbeatAudio._baseVolume*audioMix('effects'),0,1);
 if(!hardHeartbeatPlaying){
  hardHeartbeatPlaying=true;
  const attempt=hardHeartbeatAudio.play();
  attempt?.catch?.(()=>{hardHeartbeatPlaying=false});
 }
}


// Localized, continuous safe-room ambience. The lift tune can be heard inside
// the room; the crackle is strongest by the imported campfire mesh. Outside a
// locked room both are practically inaudible. No persistent audio after pause.
function stopSafeRoomTracks(){
  for(const track of Object.values(safeRoomTracks))if(track)track.pause();
}
function syncSafeRoomAudio(dt){
  const room=bossRushNearestRoom();
  if(!room||gameSession.state!=='playing'||muted){stopSafeRoomTracks();return;}
  const inside=gameSession.player.x>room.left&&gameSession.player.x<room.left+room.side-1&&gameSession.player.y>room.top&&gameSession.player.y<room.top+room.side-1;
  const doorDist=Math.hypot(gameSession.player.x-room.doorX-.5,gameSession.player.y-room.doorY-.5);
  const fireDist=Math.hypot(gameSession.player.x-room.fireX,gameSession.player.y-room.fireY);
  const musicTarget=inside?.20:room.open?.055*Math.max(0,1-doorDist/7):0;
  let fireTarget=.51*Math.pow(Math.max(0,1-fireDist/10),1.5);
  if(!inside&&!room.open)fireTarget*=.08;
  if(!inside&&room.open)fireTarget*=.55;
  for(const [kind,id,target,category] of [['music','safeMusic',musicTarget,'ambient'],['fire','safeCrackle',fireTarget,'effects']]){
    let track=safeRoomTracks[kind];
    if(!track&&target>.002&&sfxTemplates[id]){
      track=sfxTemplates[id].cloneNode(true);
      track.loop=true;track.preload='auto';track._baseVolume=0;
      safeRoomTracks[kind]=track;
    }
    if(!track)continue;
    track._baseVolume+=(target-track._baseVolume)*Math.min(1,dt*4);
    track.volume=clamp(track._baseVolume*audioMix(category),0,1);
    if(track._baseVolume>.004&&track.paused){
      const task=track.play();task?.catch?.(()=>{});
    }else if(track._baseVolume<.003&&!track.paused)track.pause();
  }
}

function syncGameAudio(dt) {
  syncBackgroundTracks(dt);
  if (gameSession.state !== 'playing' || muted) { stopGameSounds(); return; }
  syncWalkingAudio();
  updateEnemyAudio(dt);
  syncHardHeartbeat();
  syncSafeRoomAudio(dt);
}

function playCoinPickup(){createGameSample('coinPickup',.16,1);}
function playCoinSlot(){createGameSample('coinSlot',.49,1);}


function unlockMenuMusic(){
 menuMusicUnlocked=true;preloadGameSounds();
 for(const track of Object.values(bgTracks))if(track)track._autoplayBlocked=false;
 syncBackgroundTracks(.16);
}
function syncBackgroundTracks(dt=.04){
 if(!menuMusicUnlocked)return;
 const playing=gameSession.state==='playing';
 const chase=playing&&(gameSession.guards.some(g=>g.state==='chase'&&!g.frozen&&g.variant!=='gray'&&
   (gameSession.level!==12||g.rushSector===gameSession.bossRush?.stage))||(gameSession.level===1&&gameSession.awake&&gameSession.cat?.state==='chase'));
 const targets={
  menu:gameSession.state==='menu'?.25:0,
  game:playing?(chase?.055:.23):0,
  chase:chase?.35:0,
  hum:playing?.12:0
 };
 const hum=gameSession.level===2?'humFlooded':gameSession.level===3?'humBloody':'humDefault';
 for(const [id,key,category] of [['menu','menuMusic','ambient'],['game','gameMusic','ambient'],
   ['chase','chaseMusic','effects'],['hum',hum,'ambient']]){
   let a=bgTracks[id];
   if(a&&a._sampleKey!==key){a.pause();bgTracks[id]=a=null;}
   if(!a&&sfxTemplates[key]&&!muted&&targets[id]>.002){
     a=sfxTemplates[key].cloneNode(true);a.loop=true;a.preload='auto';a._baseVolume=0;
     a._sampleKey=key;bgTracks[id]=a;
   }
   if(!a)continue;
   const target=muted?0:targets[id];
   a._baseVolume+=(target-a._baseVolume)*Math.min(1,Math.max(dt,.016)*3.3);
   a.volume=clamp(a._baseVolume*audioMix(category),0,1);
   if(target>.002&&a.paused&&!a._playPending&&!a._autoplayBlocked){
     a._playPending=true;
     try{Promise.resolve(a.play()).catch(()=>{a._autoplayBlocked=true;}).finally(()=>{a._playPending=false;});}
     catch(e){a._playPending=false;a._autoplayBlocked=true;}
   }
   if(target<=.002&&a._baseVolume<.008&&!a.paused)a.pause();
 }
}
