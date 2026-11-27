// Persistent runs. Admin-modified victories do not qualify for the win streak.
let winStreak=Math.floor(readNumber('catroomsWinStreak',0,0,Number.MAX_SAFE_INTEGER-1));
let bestStreak=Math.max(winStreak,Math.floor(readNumber('catroomsBestStreak',0,0,Number.MAX_SAFE_INTEGER)));
let unlocked4=progressRead('catroomsUnlocked4')==='1';
function streakRender(){
  $('streakCount').textContent=winStreak;
  $('menuStreak').textContent=winStreak;
  $('menuBestStreak').textContent=bestStreak;
  setUIIconText($('endStreak'),'flame','WIN STREAK: '+winStreak+' · REKORD: '+bestStreak);
}
function qualifiesForProgress(){return !gameSession.runCheated&&gameSession.level!==13;}
function streakResult(good){
  if(!qualifiesForProgress())return;
  if(good){winStreak=Math.min(Number.MAX_SAFE_INTEGER,winStreak+1);bestStreak=Math.max(bestStreak,winStreak)}
  if(!good)winStreak=0;
  progressWrite('catroomsWinStreak',winStreak);
  progressWrite('catroomsBestStreak',bestStreak);
  streakRender();
}
function prepareRun(){gameSession.runCheated=false;godMode=false;lastShieldToast=-100;streakRender()}
