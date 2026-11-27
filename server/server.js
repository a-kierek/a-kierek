#!/usr/bin/env node
// THE CATROOMS: small, dependency-free room relay and static game server.
// The host browser is authoritative for game logic; this server forwards verified room messages.
'use strict';
const http = require('node:http');
const crypto = require('node:crypto');
const path = require('node:path');
const fs = require('node:fs');
const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT || 8765);
const HOST = process.env.HOST || '0.0.0.0';
const MAX_CLIENTS = 4;
const ROOMS = new Map();
const CLIENTS = new Set();
const TYPES = {'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.wav':'audio/wav','.ogg':'audio/ogg','.mp3':'audio/mpeg','.ico':'image/x-icon','.json':'application/json; charset=utf-8','.mesh':'application/octet-stream'};
const ALPHABET='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const sanitizeName = value => typeof value==='string' ? value.replace(/[<>\r\n\x00-\x1F]/g,'').trim().slice(0,22) || 'Gracz' : 'Gracz';
function code(){for(let k=0;k<50;k++){let out='';for(let j=0;j<6;j++)out+=ALPHABET[crypto.randomInt(ALPHABET.length)];if(!ROOMS.has(out))return out;}throw Error('Room collision');}
function safeJSON(ws,obj){if(ws.socket.destroyed)return;const payload=Buffer.from(JSON.stringify(obj));if(payload.length>160000)return;const h=payload.length<126?Buffer.from([0x81,payload.length]):payload.length<=65535?Buffer.from([0x81,126,payload.length>>8,payload.length&255]):Buffer.from([0x81,127,0,0,0,0,(payload.length/16777216)&255,(payload.length>>16)&255,(payload.length>>8)&255,payload.length&255]);try{ws.socket.write(Buffer.concat([h,payload]));}catch(e){disconnect(ws)}}
function sendFrame(ws,opcode,data=Buffer.alloc(0)){if(ws.socket.destroyed)return;const len=data.length;const h=len<126?Buffer.from([0x80|opcode,len]):Buffer.from([0x80|opcode,126,len>>8,len&255]);try{ws.socket.write(Buffer.concat([h,data]));}catch(e){disconnect(ws)}}
function roomMembers(room){return [{id:'host',name:room.host.name},...Array.from(room.guests.values()).map(g=>({id:g.id,name:g.name}))];}
function roster(room){const players=roomMembers(room);for(const ws of [room.host,...room.guests.values()])safeJSON(ws,{type:'roster',players,started:room.started});}
function disconnect(ws){if(ws.closed)return;ws.closed=true;CLIENTS.delete(ws);const room=ROOMS.get(ws.room);ws.room=null;
 if(room){if(room.host===ws){ROOMS.delete(room.code);for(const other of room.guests.values()){other.room=null;safeJSON(other,{type:'host-left'});}}
 else if(room.guests.get(ws.id)===ws){room.guests.delete(ws.id);safeJSON(room.host,{type:'peer-left',id:ws.id});roster(room);}}
 try{ws.socket.destroy()}catch(e){}
}
function relaySnapshot(room,msg){if(!room.started)return;if(!msg||typeof msg!=='object')return;for(const guest of room.guests.values())safeJSON(guest,msg);}
function onMessage(ws,msg){
 if(!msg||typeof msg!=='object'||typeof msg.type!=='string')return;
 if(msg.type==='create'){
  if(ws.room)return safeJSON(ws,{type:'error',message:'Najpierw opusc poprzedni pokoj.'});
  const room={code:code(),host:ws,guests:new Map(),started:false};ROOMS.set(room.code,room);
  ws.id='host';ws.room=room.code;ws.name=sanitizeName(msg.name);safeJSON(ws,{type:'created',code:room.code,id:'host'});roster(room);return;
 }
 if(msg.type==='join'){
  if(ws.room)return safeJSON(ws,{type:'error',message:'Najpierw opusc poprzedni pokoj.'});
  const room=ROOMS.get(String(msg.code||'').trim().toUpperCase());if(!room)return safeJSON(ws,{type:'error',message:'Nie ma takiego pokoju.'});
  if(room.started)return safeJSON(ws,{type:'error',message:'Runda juz trwa. Poczekaj na kolejna.'});
  if(room.guests.size>=MAX_CLIENTS-1)return safeJSON(ws,{type:'error',message:'Pokoj jest pelny (maksymalnie 4 osoby).'});
  ws.id='p'+crypto.randomBytes(5).toString('hex');ws.name=sanitizeName(msg.name);ws.room=room.code;room.guests.set(ws.id,ws);
  safeJSON(ws,{type:'joined',code:room.code,id:ws.id});safeJSON(room.host,{type:'peer-joined',id:ws.id,name:ws.name});roster(room);return;
 }
 if(msg.type==='leave'){const room=ROOMS.get(ws.room);if(room){const previous=ws.room;ws.room=null;if(room.host===ws){ROOMS.delete(previous);for(const guest of room.guests.values()){guest.room=null;safeJSON(guest,{type:'host-left'});}}else{room.guests.delete(ws.id);safeJSON(room.host,{type:'peer-left',id:ws.id});roster(room);}}return}
 const room=ROOMS.get(ws.room);if(!room)return;
 if(msg.type==='pause'&&room.host===ws&&room.started){for(const guest of room.guests.values())safeJSON(guest,{type:'pause',paused:!!msg.paused});return;}
 if(msg.type==='start'&&room.host===ws&&Number.isInteger(msg.level)&&msg.level>=1&&msg.level<=5){room.started=true;for(const guest of room.guests.values())safeJSON(guest,{type:'start',level:msg.level});roster(room);return;}
 if(msg.type==='snapshot'&&room.host===ws&&room.started){relaySnapshot(room,{type:'snapshot',frame:msg.frame});return;}
 if(msg.type==='round-end'&&room.host===ws&&room.started){relaySnapshot(room,{type:'round-end',win:!!msg.win,killer:typeof msg.killer==='string'?msg.killer.slice(0,24):'cat'});room.started=false;roster(room);return;}
 if(msg.type==='input'&&room.guests.get(ws.id)===ws&&room.started){
  const data=msg.data;if(!data||typeof data!=='object')return;
  const fields=['forward','strafe','angle','pitch','sprint','crouch','flash'];const clean={};
  for(const k of fields){const v=Number(data[k]);if(!Number.isFinite(v))return;clean[k]=['forward','strafe'].includes(k)?Math.min(1,Math.max(-1,v)):['sprint','crouch','flash'].includes(k)?Boolean(v):Math.min(10,Math.max(-10,v));}
  safeJSON(room.host,{type:'input',id:ws.id,data:clean});return;
 }
 if(msg.type==='action'&&room.guests.get(ws.id)===ws&&room.started){if(msg.action==='interact')safeJSON(room.host,{type:'action',id:ws.id,action:msg.action});return;}
 if(msg.type==='chat'&&typeof msg.text==='string'){
  const text=msg.text.trim().slice(0,120);if(!text)return;
  for(const peer of [room.host,...room.guests.values()])safeJSON(peer,{type:'chat',from:ws.name,text});
 }
}
function parseFrames(ws,chunk){ws.buffer=Buffer.concat([ws.buffer,chunk]);if(ws.buffer.length>350000){disconnect(ws);return;}while(ws.buffer.length>=2){const b=ws.buffer;const opcode=b[0]&15;const masked=(b[1]&128)!==0;let len=b[1]&127,off=2;if(!masked){disconnect(ws);return;}if(len===126){if(b.length<4)return;len=b.readUInt16BE(2);off=4;}else if(len===127){if(b.length<10)return;const hi=b.readUInt32BE(2),lo=b.readUInt32BE(6);if(hi>0||lo>160000){disconnect(ws);return;}len=lo;off=10;}if(len>160000){disconnect(ws);return;}if(b.length<off+4+len)return;const mask=b.subarray(off,off+4);off+=4;const payload=Buffer.from(b.subarray(off,off+len));ws.buffer=b.subarray(off+len);for(let i=0;i<len;i++)payload[i]^=mask[i%4];if(opcode===0x8){disconnect(ws);return;}if(opcode===0x9){sendFrame(ws,0xa,payload);continue;}if(opcode===0xa){ws.pong=Date.now();continue;}if(opcode!==1){disconnect(ws);return;}try{onMessage(ws,JSON.parse(payload.toString('utf8')));}catch(e){safeJSON(ws,{type:'error',message:'Nieprawidlowe dane.'});}}}
const server=http.createServer((req,res)=>{
 let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch(e){res.writeHead(400);res.end();return;}
 if(pathname==='/favicon.ico'){res.writeHead(204,{'Cache-Control':'no-cache'});res.end();return;}
 if(pathname==='/health'){res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify({ok:true,version:'1.6.2.4',rooms:ROOMS.size,clients:CLIENTS.size}));return;}
 if(pathname==='/')pathname='/index.html';
 const filepath=path.resolve(ROOT,'.'+pathname);
 if(!filepath.startsWith(ROOT+path.sep)||!fs.existsSync(filepath)||!fs.statSync(filepath).isFile()){res.writeHead(404);res.end('Not found');return;}
 const mime=TYPES[path.extname(filepath).toLowerCase()];if(!mime){res.writeHead(403);res.end('Forbidden');return;}
 res.writeHead(200,{'Content-Type':mime,'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});fs.createReadStream(filepath).pipe(res);
});
server.on('upgrade',(req,socket,head)=>{
 let pathname;try{pathname=new URL(req.url,'http://localhost').pathname}catch(e){socket.destroy();return}
 if(pathname!=='/ws'||req.headers.upgrade?.toLowerCase()!=='websocket'||!req.headers['sec-websocket-key']){socket.destroy();return;}
 const accept=crypto.createHash('sha1').update(req.headers['sec-websocket-key']+'258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64');
 socket.write('HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: '+accept+'\r\n\r\n');
 const ws={socket,buffer:Buffer.alloc(0),closed:false,room:null,id:null,name:'Gracz',pong:Date.now()};CLIENTS.add(ws);
 socket.on('data',chunk=>parseFrames(ws,chunk));socket.on('error',()=>disconnect(ws));socket.on('end',()=>disconnect(ws));socket.on('close',()=>disconnect(ws));
 if(head.length)parseFrames(ws,head);
});
setInterval(()=>{const now=Date.now();for(const ws of CLIENTS){if(now-ws.pong>65000){disconnect(ws);continue;}sendFrame(ws,0x9);}},25000).unref();
server.listen(PORT,HOST,()=>{
 console.log('THE CATROOMS v1.6.2.4 REFORGED • host server');
 console.log('LAN / host browser: http://localhost:'+PORT);
 console.log('Others on same Wi-Fi: http://YOUR-LAN-IP:'+PORT);
 console.log('For internet and GitHub Pages: expose this server over HTTPS/WSS (e.g. Cloudflare Tunnel).');
});
