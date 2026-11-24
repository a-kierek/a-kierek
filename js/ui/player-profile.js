// Local player identity and NORMAL/HARD menu switch. No networking required.
function updatePlayerNickname(name){
 playerNickname=String(name||'').replace(/[<>\u0000-\u001f]/g,'').trim().slice(0,22)||'GRACZ';
 progressWrite('catroomsNickname',playerNickname);
 if($('playerNameTag'))$('playerNameTag').textContent=playerNickname;
}
function chooseDifficulty(mode){
 selectedDifficulty=mode==='hard'?'hard':'normal';
 progressWrite('catroomsDifficulty',selectedDifficulty);
 $('difficultyNormal').setAttribute('aria-pressed',String(selectedDifficulty==='normal'));
 $('difficultyHard').setAttribute('aria-pressed',String(selectedDifficulty==='hard'));
 $('start').classList.toggle('hard-selected',selectedDifficulty==='hard');
 if($('startBtn'))$('startBtn').textContent='ZOLTE KORYTARZE';
 if(typeof refreshLevelButton==='function')refreshLevelButton();
 if(selectedDifficulty==='hard'){
  $('difficultyInfo').textContent='Hard: te same poziomy, wieksze proceduralne mapy, championy, awarie i agresywniejsze AI.';
 }else{
  $('difficultyInfo').textContent='Normal: standardowa kampania, klasyczni przeciwnicy i tryb proceduralny.';
 }
}
$('playerNameInput').value=playerNickname;
$('playerNameTag').textContent=playerNickname;
$('playerNameInput').addEventListener('input',e=>updatePlayerNickname(e.target.value));
$('difficultyNormal').addEventListener('click',()=>chooseDifficulty('normal'));
$('difficultyHard').addEventListener('click',()=>chooseDifficulty('hard'));
chooseDifficulty(selectedDifficulty);
