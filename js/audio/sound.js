// THE CATROOMS - sound effects and distance-aware character voices.
// All samples are user-provided, kept under assets/audio/ and also embedded in the standalone build.
// BLYSK (watcher) and SZEPT (listener) use the supplied voice lines with distance attenuation.
const SFX_FILES = {
  pickup: 'assets/audio/battery-charge.wav',
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
  hardSqueal:'assets/audio/hard/pig-squeal-horror.mp3'
};
const VOICE_LINES = Object.freeze({
  listener: ['szeptJadymy', 'szeptNieLubi', 'szeptVamos'],
  watcher: ['blyskOni', 'blyskKurwy', 'blyskPijany']
});
const sfxTemplates = Object.create(null);
const activeEnemySounds = [];
let walkingAudio = null, walkingPlaying = false, lossScreamAudio = null, hardHeartbeatAudio = null, hardHeartbeatPlaying = false;
const safeRoomTracks={music:null,fire:null};
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
 for(const node of ambientNodes)node.gain.gain.value=node.baseGain*audioMix('ambient');
}


// HTMLMediaElement playback works both in an offline ZIP opened as file://
// and in the self-contained HTML build (where these URLs become data: URIs).
function preloadGameSounds() {
  for (const [id, url] of Object.entries(SFX_FILES)) {
    if (sfxTemplates[id]) continue;
    const audio = new Audio();
    audio.preload = 'auto';
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
  // The earlier synthesized scare remains available for non-death scripted events.
  if (!lossScreamAudio) playScare();
}

function stopWalkingSound() {
  if (walkingAudio) walkingAudio.pause();
  walkingPlaying = false;
}

function stopGameSounds() {
  stopSafeRoomTracks();
  if(hardHeartbeatAudio){hardHeartbeatAudio.pause();hardHeartbeatPlaying=false;}
  stopEnemySounds();
  stopWalkingSound();
}

function initAudio() {
  if (muted) return;
  preloadGameSounds();
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const b = audioCtx.createBuffer(1, audioCtx.sampleRate * .4, audioCtx.sampleRate);
      const d = b.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 1.5);
      noiseBuffer = b;
    }
    audioCtx.resume();
    if (ambientNodes.length) return;
    for (const freq of (level === 3 ? [47.5, 71.5, 95.2] : level === 2 ? [41.2, 82.5, 125.1] : [59.9, 119.7, 60.3])) {
      const o = audioCtx.createOscillator(), gain = audioCtx.createGain(), filter = audioCtx.createBiquadFilter();
      o.type = 'sine'; o.frequency.value = freq;
      filter.type = 'lowpass'; filter.frequency.value = 200;
      const baseGain=level === 3 ? (freq < 60 ? .026 : .013) : level === 2 ? (freq < 50 ? .023 : .012) : (freq < 60 ? .018 : .01);
      gain.gain.value=baseGain*audioMix('ambient');
      o.connect(filter); filter.connect(gain); gain.connect(audioCtx.destination); o.start();
      ambientNodes.push({o,gain,baseGain});
    }
  } catch (e) { /* Browser may block WebAudio until another gesture. MP3/WAV still work. */ }
}

function stopHum() { for (const n of ambientNodes) { try { n.o.stop(); } catch (e) {} } ambientNodes = []; }

// Existing synthesized cues remain for door unlocks, wins, and the original events.
// No new jumpscare files or jumpscare triggers have been added.
function sound(freq = 320, dur = .13, type = 'sine', volume = .11, slide = 0) {
  if (muted || !audioCtx) return;
  const t = audioCtx.currentTime, o = audioCtx.createOscillator(), g = audioCtx.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(35, freq + slide), t + dur);
  g.gain.setValueAtTime(Math.max(.0001,volume*audioMix('effects')), t); g.gain.exponentialRampToValueAtTime(.001, t + dur);
  o.connect(g); g.connect(audioCtx.destination); o.start(t); o.stop(t + dur + .01);
}

// Footsteps are handled by syncWalkingAudio() each frame, not replayed as long 4s clips.
function playStep() {}

function syncWalkingAudio() {
  if (state !== 'playing' || muted || !player.moving || player.hidden) {
    stopWalkingSound(); return;
  }
  if (!walkingAudio) {
    if (!sfxTemplates.steps) return;
    walkingAudio = sfxTemplates.steps.cloneNode(true);
    walkingAudio.loop = true;
    walkingAudio.preload = 'auto';
  }
  const running = !crouching && !!(keys.ShiftLeft || keys.ShiftRight || touchRun);
  walkingAudio.playbackRate = crouching ? .72 : running ? 1.42 : 1;
  walkingAudio._baseVolume = crouching ? .16 : running ? .33 : .26;
  walkingAudio.volume = clamp(walkingAudio._baseVolume*audioMix('effects'),0,1);
  if (!walkingPlaying) {
    walkingPlaying = true;
    const attempt = walkingAudio.play();
    if (attempt && typeof attempt.catch === 'function') attempt.catch(() => { walkingPlaying = false; });
  }
}

function playPickup() {
  if (!createGameSample('pickup', .64)) sound(430, .18, 'triangle', .12, 260);
}
function playHurt(){ if(!createGameSample('hurt', .72, 1)) sound(180,.22,'square',.18,-70); }
function playUnlock() { sound(380, .6, 'sawtooth', .08, 500); }
function playSting(loud = true) { sound(loud ? 110 : 220, loud ? .8 : .2, 'sawtooth', loud ? .12 : .03, loud ? -60 : -30); }
function playScare() { sound(85, .8, 'sawtooth', .27, 800); sound(48, .65, 'square', .20, 240); }
function playWin() { sound(550, .25, 'triangle', .16, 200); setTimeout(() => sound(740, .4, 'triangle', .15, 300), 130); }

// Volume falls smoothly from near distance to silence beyond maxRange;
// a wall between player and monster dampens the sound further.
function enemyAudibility(monster, maxRange = 19) {
  const dx = monster.x - player.x, dy = monster.y - player.y;
  const dist = Math.hypot(dx, dy);
  if (dist >= maxRange) return 0;
  const normalized = clamp((maxRange - dist) / (maxRange - 1.5), 0, 1);
  let gain = Math.pow(normalized, 1.65);
  if (dist > 3 && !lineOfSight(monster.x, monster.y, player.x, player.y)) gain *= .57;
  return clamp(gain, 0, 1);
}

function playEnemySample(id, monster, volume, rate, maxRange = 19, isVoice = false) {
  if (!monster || muted || state !== 'playing') return false;
  if (isVoice && activeEnemySounds.some(s => s.monster === monster && s.isVoice && !s.audio.ended)) return false;
  const audibility = enemyAudibility(monster, maxRange);
  if (audibility < .012 || activeEnemySounds.length >= 8) return false;
  const audio = createGameSample(id, Math.min(.95, volume * audibility), rate);
  if (!audio) return false;
  activeEnemySounds.push({audio,monster,volume,maxRange,currentVolume:volume*audibility,category:audioCategory(id),isVoice});
  return true;
}

function updateEnemyAudio(dt) {
  if (muted || state !== 'playing') { stopGameSounds(); return; }
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
  const monsters = level === 1 ? (awake ? [cat] : []) : guards;
  for (const monster of monsters) {
    const lines = VOICE_LINES[monster.kind];
    if (lines) {
      // The three lines of each character play in a shuffled starting order,
      // then rotate. No doubling up while a longer line is still playing.
      if (monster._voiceCursor === undefined) monster._voiceCursor = Math.floor(Math.random() * lines.length);
      if (monster._nextVoiceAt === undefined) monster._nextVoiceAt = elapsed + 1.5 + Math.random() * 3;
      if (elapsed >= monster._nextVoiceAt) {
        const voiceId = lines[monster._voiceCursor % lines.length];
        const playing = activeEnemySounds.some(s => s.monster === monster && s.isVoice && !s.audio.ended);
        if (!playing) {
          if (playEnemySample(voiceId, monster, monster.kind === 'listener' ? .64 : .67, 1, 23, true)) {
            monster._voiceCursor++;
            monster._nextVoiceAt = elapsed + (monster.state === 'chase' ? 8.5 : 13) + Math.random() * 3.5;
          } else {
            // Retest soon after the player approaches the sound's radius.
            monster._nextVoiceAt = elapsed + 2;
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
        monster._nextVoiceAt = elapsed + (monster.kind === 'pig' ? 2.3 : 3.0);
      }
    }
    if (monster._nextVoiceAt === undefined) monster._nextVoiceAt = elapsed + 1.5 + Math.random() * 2.8;
    if (elapsed < monster._nextVoiceAt) continue;
    if (monster.kind === 'pig') {
      // Low grunts/oinks while patrolling; piercing squeal when hunting.
      if (chasing) playEnemySample('pigSqueal', monster, .61, .85, 18);
      else playEnemySample(Math.random() < .55 ? 'pigGrunt' : 'pigOink', monster, .57, .92, 15);
    } else {
      playEnemySample(chasing ? 'catVeryAngry' : 'catAngry', monster,
        chasing ? .58 : .41, chasing ? 1.06 : 1.12, chasing ? 19 : 14);
    }
    monster._nextVoiceAt = elapsed + (chasing ? 5.2 : 7.4) + Math.random() * 2.6;
  }
}

// Kept as an API for old level scripts, now uses the supplied pig recording.
function playPigSnort(monster) {
  if (monster && monster.kind === 'pig') playEnemySample('pigGrunt', monster, .54, .86, 15);
}


function syncHardHeartbeat(){
 const active=isHardMode()&&(guards.some(g=>g.state==='chase'&&!g.frozen)||!!hardEmergency);
 if(!active||muted||state!=='playing'){
  if(hardHeartbeatAudio){hardHeartbeatAudio.pause();hardHeartbeatPlaying=false;}return;
 }
 if(!hardHeartbeatAudio){
  if(!sfxTemplates.hardHeartbeat)return;
  hardHeartbeatAudio=sfxTemplates.hardHeartbeat.cloneNode(true);
  hardHeartbeatAudio.loop=true;hardHeartbeatAudio.preload='auto';
 }
 const chase=guards.some(g=>g.state==='chase'&&!g.frozen);
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
  if(!safeRoom||state!=='playing'||muted){stopSafeRoomTracks();return;}
  const room=safeRoom;
  const inside=player.x>room.left&&player.x<room.left+room.side-1&&player.y>room.top&&player.y<room.top+room.side-1;
  const doorDist=Math.hypot(player.x-room.doorX-.5,player.y-room.doorY-.5);
  const fireDist=Math.hypot(player.x-room.fireX,player.y-room.fireY);
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
  if (state !== 'playing' || muted) { stopGameSounds(); return; }
  syncWalkingAudio();
  updateEnemyAudio(dt);
  syncHardHeartbeat();
  syncSafeRoomAudio(dt);
}

function playCoinPickup(){createGameSample('coinPickup',.55,1);}
function playCoinSlot(){createGameSample('coinSlot',.70,1);}
