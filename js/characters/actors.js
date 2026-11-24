// Character definitions. Each portrait and gameplay sprite lives in assets/characters.
const ACTORS={
  cat:{id:'cat',name:'MARMUR',alias:'Kot z Level 1',image:CAT_PNG,img:catImg,skill:'Cichy tropiciel. Zapamietuje ostatni slad.',risk:'WYSOKIE',color:'#d8b4a0'},
  watcher:{id:'watcher',name:'BLYSK',alias:'Obserwator',image:PERSON_B_PNG,img:personBImg,skill:'Szerokie pole widzenia. Patroluje punkty obserwacyjne.',risk:'BARDZO WYSOKIE',color:'#9ee5f5'},
  listener:{id:'listener',name:'SZEPT',alias:'Nasluchiwacz',image:PERSON_A_PNG,img:personAImg,skill:'Slyszy kroki zza zakretow. Bada zrodla halasu.',risk:'BARDZO WYSOKIE',color:'#ef9e99'},
  stranger:{id:'stranger',name:'NIEZNAJOMY',alias:'Postac ze zdjecia / Sektor 05',image:STRANGER_PNG,img:strangerImg,skill:'Tropi ruch i szybko reaguje na halas.',risk:'EKSTREMALNE',color:'#b2b8c6'},
  pig:{id:'pig',name:'CHRUM',alias:'Wieprz z sektora 4',image:PIG_PNG,img:pigImg,skill:'Slyszy kroki i szarzuje, gdy Cie zobaczy.',risk:'WYSOKIE',color:'#dfac9a'},
  meltdown:{id:'meltdown',name:'AWARIA REAKTORA',alias:'Nie naprawiono urzadzenia w 45 sekund.',image:PERSON_B_PNG,img:personBImg,skill:'AWARIA ZASILANIA · CZAS MINAL',risk:'KRYTYCZNE',color:'#d74e41'},
  hazard:{id:'hazard',name:'TOKSYCZNY PLYN',alias:'radioaktywna ciecz',image:PIG_PNG,img:pigImg,skill:'Plyn poparzyl Cie. Unikaj zielonych kaluz.',risk:'SRODOWISKOWE',color:'#8ad95c'}
};
