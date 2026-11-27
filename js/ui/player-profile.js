// Local player identity and NORMAL/HARD menu switch. No networking required.
function updatePlayerNickname(name){
 playerNickname=String(name||'').replace(/[<>\u0000-\u001f]/g,'').trim().slice(0,22)||'PLAYER';
 progressWrite('catroomsNickname',playerNickname);
 if($('playerNameTag'))$('playerNameTag').textContent=playerNickname;
}
function chooseDifficulty(mode){
 selectedDifficulty=mode==='hard'?'hard':'normal';
 progressWrite('catroomsDifficulty',selectedDifficulty);
 $('difficultyNormal').setAttribute('aria-pressed',String(selectedDifficulty==='normal'));
 $('difficultyHard').setAttribute('aria-pressed',String(selectedDifficulty==='hard'));
 $('start').classList.toggle('hard-selected',selectedDifficulty==='hard');
 if($('startBtn'))$('startBtn').textContent='YELLOW CORRIDORS';
 if(typeof refreshLevelButton==='function')refreshLevelButton();
 if(selectedDifficulty==='hard'){
  $('difficultyInfo').textContent='Hard: the same levels, larger procedural maps, champions, emergencies and more aggressive AI.';
 }else{
  $('difficultyInfo').textContent='Normal: standard campaign and classic enemies.';
 }
}
$('playerNameInput').value=playerNickname;
$('playerNameTag').textContent=playerNickname;
$('playerNameInput').addEventListener('input',e=>updatePlayerNickname(e.target.value));
$('difficultyNormal').addEventListener('click',()=>chooseDifficulty('normal'));
$('difficultyHard').addEventListener('click',()=>chooseDifficulty('hard'));
// Initial difficulty is applied by boot.js after every game script has loaded.
