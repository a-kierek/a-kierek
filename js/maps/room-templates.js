// All templates use the existing material and model libraries. Each list is
// ordered from entrance-side rooms through the sector's deeper areas.
const ROOM_TEMPLATES = Object.freeze({
 reception:['Reception',['OFFICE','STANDARD'],[5,8],[5,8],['rectangle'],['desk','officeChair','yellowClock'],'fluorescent','carpet'],
 office:['Abandoned Office',['OFFICE','STANDARD'],[5,8],[5,9],['rectangle','l'],['desk','officeChair','cabinet','yellowClock'],'fluorescent','carpet'],
 conference:['Conference Room',['OFFICE','LANDMARK'],[7,10],[6,10],['rectangle','t'],['desk','officeChair','yellowClock'],'fluorescent','carpet'],
 empty:['Empty Hall',['STANDARD','LANDMARK'],[8,12],[7,11],['rectangle','oval','courtyard'],[],'dim','hall'],
 archive:['Records Storage',['STORAGE','OFFICE'],[5,8],[5,8],['rectangle','l'],['cabinet','box'],'dim','carpet'],
 service:['Service Room',['TECHNICAL','STORAGE'],[5,8],[5,8],['rectangle','l'],['box','cabinet','serverRack'],'flicker','hard'],
 intake:['Flooded Intake',['INDUSTRIAL','STANDARD'],[7,11],[6,9],['rectangle','l','polygon'],['bench','lifebuoy','pipe'],'cold','tile'],
 pump:['Pump Station',['TECHNICAL','INDUSTRIAL','OBJECTIVE'],[7,11],[6,10],['rectangle','t'],['pump','pipe','lifebuoy','waterTank'],'cold','tile'],
 pool:['Pool Room',['LANDMARK','SANITARY'],[7,9],[7,9],['rectangle'],['lifebuoy','bench'],'cold','tile'],
 reservoir:['Reservoir Walkway',['HAZARD','INDUSTRIAL','LANDMARK'],[8,11],[7,11],['rectangle','u','oval'],['pipe','lifebuoy'],'dim','hall'],
 filtration:['Filtration Room',['TECHNICAL','SANITARY'],[5,8],[6,9],['rectangle','l'],['pipe','pump','waterTank','emergencyShower'],'flicker','tile'],
 reactor:['Reactor Hall',['INDUSTRIAL','LANDMARK','OBJECTIVE'],[7,12],[7,11],['rectangle','polygon','t'],['barrel','metalTable','reactorUnit','turbine'],'emergency','hall'],
 workshop:['Maintenance Workshop',['TECHNICAL','INDUSTRIAL'],[6,9],[5,9],['rectangle','l'],['metalTable','barrel','generatorUnit','turbine'],'flicker','hard'],
 containment:['Containment Bay',['HAZARD','INDUSTRIAL'],[6,10],[6,9],['rectangle','u'],['barrel'],'emergency','hard'],
 cargo:['Cargo Store',['STORAGE','INDUSTRIAL'],[7,11],[6,10],['rectangle','t'],['barrel','metalTable'],'dim','hall'],
 checkpoint:['Security Checkpoint',['TECHNICAL','LANDMARK'],[5,8],[5,8],['rectangle','l'],['camera','crt'],'flicker','hard'],
 serviceHall:['Service Hall',['STANDARD','LANDMARK'],[7,11],[6,9],['rectangle','u'],['camera'],'dim','hall'],
 shop:['Abandoned Store',['COMMERCIAL','STANDARD'],[6,10],[6,10],['rectangle','l','t'],['mannequin','lastClock'],'cold','hard'],
 residence:['Empty Apartment',['RESIDENTIAL','STANDARD'],[5,8],[6,8],['rectangle','l'],['desk','wardrobe','windowFrame','lastClock'],'dim','carpet'],
 clinic:['Abandoned Clinic',['MEDICAL','STANDARD'],[5,9],[6,9],['rectangle','l'],['metalTable','cabinet','hospitalBed','windowFrame'],'cold','tile'],
 anomaly:['Distorted Gallery',['ANOMALOUS','LANDMARK'],[7,11],[6,10],['oval','polygon','courtyard'],['mannequin','lastClock'],'flicker','hall'],
 secret:['Hidden Stockroom',['SECRET','STORAGE'],[5,7],[5,7],['rectangle','l'],['box','cabinet'],'dim','carpet'],
 safe:['Safe Room',['SAFE'],[5,11],[5,11],['rectangle'],[],'fluorescent','carpet'],
 transition:['Sector Transfer',['TRANSITION'],[5,8],[5,8],['rectangle'],[],'emergency','hard']
});
const ROOM_SECTORS = {
 1:[['Office',['reception','office','conference']],['Storage',['archive','office','empty']],['Service',['service','archive','empty']]],
 2:[['Intake',['intake','filtration']],['Drainage',['pump','intake']],['Reservoir',['reservoir','filtration','pump']]],
 3:[['Maintenance',['workshop','cargo']],['Power',['reactor','workshop']],['Containment',['containment','reactor','cargo']]],
 4:[['Security',['checkpoint','serviceHall']],['Service',['serviceHall','checkpoint']],['Storage',['cargo','checkpoint']]],
 5:[['Retail',['shop','residence']],['Abandoned',['clinic','residence','shop']],['Anomaly',['anomaly','shop']]]
};
const ROOM_LIGHTS = {fluorescent:0,dim:1,cold:2,emergency:3,flicker:4,dark:5};
const ROOM_ACOUSTICS = {carpet:.78,hard:1,tile:1.12,hall:1.18};
