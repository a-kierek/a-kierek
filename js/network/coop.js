// Solo-only adapter. Original CO-OP implementation is in the developer archive.
const COOP_ENABLED=false;
const coop=Object.freeze({
 role:'solo',active:false,hostPaused:false,remotes:new Map(),
 openLobby(){},send(){return false;},sendAction(){return false;},
 guestFrame(){},hostFrame(){},roundEnd(){},guestEnd(){},avatarSprites(){return [];}
});
