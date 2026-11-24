// Persistent runs. Admin-modified victories do not qualify for the win streak.
let winStreak=Math.max(0,Math.floor(+progressRead('catroomsWinStreak','0')||0));
let bestStreak=Math.max(winStreak,Math.floor(+progressRead('catroomsBestStreak','0')||0));
let runCheated=false,unlocked4=progressRead('catroomsUnlocked4')==='1';
function streakRender(){
  $('streakCount').textContent=winStreak;
  $('menuStreak').textContent=winStreak;
  $('menuBestStreak').textContent=bestStreak;
  setUIIconText($('endStreak'),'flame','WIN STREAK: '+winStreak+' · REKORD: '+bestStreak);
}
function streakResult(good){
  if(good&&!runCheated){winStreak++;bestStreak=Math.max(bestStreak,winStreak)}
  if(!good)winStreak=0;
  progressWrite('catroomsWinStreak',winStreak);
  progressWrite('catroomsBestStreak',bestStreak);
  streakRender();
}
function prepareRun(){runCheated=false;godMode=false;streakRender()}
