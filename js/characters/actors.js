// Character definitions. Each portrait and gameplay sprite lives in assets/characters.
const ACTORS={
  cat:{id:'cat',name:'MARMUR',alias:'Kot z Level 1',image:CAT_PNG,img:catImg,skill:'Silent tracker. Remembers your last position.',risk:'HIGH',color:'#d8b4a0'},
  watcher:{id:'watcher',name:'BLYSK',alias:'Obserwator',image:PERSON_B_PNG,img:personBImg,skill:'Szerokie pole widzenia. Patroluje punkty obserwacyjne.',risk:'VERY HIGH',color:'#9ee5f5'},
  listener:{id:'listener',name:'SZEPT',alias:'Nasluchiwacz',image:PERSON_A_PNG,img:personAImg,skill:'Slyszy kroki zza zakretow. Bada zrodla halasu.',risk:'VERY HIGH',color:'#ef9e99'},
  stranger:{id:'stranger',name:'NIEZNAJOMY',alias:'Figure from the photograph / Sector 05',image:STRANGER_PNG,img:strangerImg,skill:'Tracks movement and reacts quickly to noise.',risk:'EKSTREMALNE',color:'#b2b8c6'},
  pig:{id:'pig',name:'CHRUM',alias:'Pig from sector 4',image:PIG_PNG,img:pigImg,skill:'Slyszy kroki i szarzuje, gdy Cie zobaczy.',risk:'HIGH',color:'#dfac9a'},
  meltdown:{id:'meltdown',name:'REACTOR FAILURE',alias:'The repair deadline expired.',image:PERSON_B_PNG,img:personBImg,skill:'POWER FAILURE · TIME EXPIRED',risk:'KRYTYCZNE',color:'#d74e41'},
  hazard:{id:'hazard',name:'TOKSYCZNY PLYN',alias:'radioaktywna ciecz',image:PIG_PNG,img:pigImg,skill:'The liquid burned you. Avoid green puddles.',risk:'SRODOWISKOWE',color:'#8ad95c'}
};
