import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, PerspectiveCamera } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Isaiah, Keeper } from './Character';
import { ITEMS, Item, Phase, START } from './data';
import { clamp, detectionRadius, distance, legalPosition, Point } from './rules';
import { SoundEngine } from './sound';
import { useMovementKeys } from './input';
import { World } from './World';

type Props={
 phase:Phase; collected:string[]; catches:number; flashlight:boolean; battery:number;
 onBattery:(battery:number)=>void; onPickup:(item:Item)=>void; onCapture:()=>void;
 onProximity:(item:Item|null)=>void; onVitals:(data:{x:number;z:number;alert:number;moving:boolean;running:boolean;crouching:boolean})=>void;
 sound:SoundEngine; touch:Point; interactTick:number;
};
const PATROL:Point[]=[{x:3,z:-4},{x:6.8,z:-2.8},{x:7.5,z:2.4},{x:2.2,z:2.3},{x:0,z:-2.2},{x:-1,z:-5.5}];
const OBSTACLES=[
 {x:-9.2,z:6.65,w:3.15,d:2.52}, {x:-9.8,z:-5.7,w:1.9,d:.75},
 {x:-7.6,z:-7.6,w:.8,d:1.85}, {x:8.7,z:-7.8,w:.8,d:1.9},
 {x:-.8,z:3.5,w:2.8,d:1.65},{x:-7.8,z:4.4,w:2,d:1.2},
 {x:6.2,z:-5.6,w:2,d:1.15},{x:.5,z:-7.55,w:1,d:.8}
];
function hitFurniture(p:Point){return OBSTACLES.some(o=>Math.abs(p.x-o.x)<o.w/2+.22&&Math.abs(p.z-o.z)<o.d/2+.22)}

function Simulation(props:Props){
 const {phase,collected,catches,flashlight,battery,onBattery,onPickup,onCapture,onProximity,onVitals,sound,touch,interactTick}=props;
 const player=useRef<THREE.Group>(null),keeper=useRef<THREE.Group>(null),lamp=useRef<THREE.SpotLight>(null);
 const playerPos=useRef<Point>({...START});const keeperPos=useRef<Point>({x:2,z:-4});
 const lastDirection=useRef<Point>({x:0,z:-1});const keys=useMovementKeys(phase==='playing');
 const inputFlags=useRef({moving:false,running:false,crouching:false});const targetItem=useRef<Item|null>(null);
 const keeperBrain=useRef<{mode:'patrol'|'investigate'|'chase'|'return';index:number;dest:Point;timer:number;lastSight:Point}>
 ({mode:'patrol',index:0,dest:PATROL[0],timer:0,lastSight:{...START}});
 const {camera}=useThree();const statsTime=useRef(0);const captureCooldown=useRef(0);
 const collectedRef=useRef(collected);collectedRef.current=collected;
 const batteryRef=useRef(battery);batteryRef.current=battery;
 const [moving,setMoving]=useState(false),[running,setRunning]=useState(false),[crouching,setCrouching]=useState(false),[alert,setAlert]=useState(false);
 useEffect(()=>{camera.position.set(START.x,3.4,START.z+5.3);camera.lookAt(START.x,1,START.z);},[camera]);
 const doInteract=()=>{if(phase!=='playing')return;const current=targetItem.current;if(current)onPickup(current);else sound.click();};
 // Stable event listener for keyboard interactions; current callback is refreshed on render.
 const doInteractRef=useRef(doInteract);doInteractRef.current=doInteract;
 useEffect(()=>{const onKey=(e:KeyboardEvent)=>{if(e.key.toLowerCase()==='e'&&!e.repeat)doInteractRef.current();};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey);},[]);
 const previousTick=useRef(interactTick);
 useEffect(()=>{if(previousTick.current!==interactTick){previousTick.current=interactTick;doInteractRef.current();}},[interactTick]);
 useFrame((state,rawDt)=>{
   if(phase!=='playing')return;
   const dt=Math.min(rawDt,.045), pressed=keys.current;
   const horizontal=Number(pressed.has('d')||pressed.has('arrowright'))-Number(pressed.has('a')||pressed.has('arrowleft'))+touch.x;
   const vertical=Number(pressed.has('s')||pressed.has('arrowdown'))-Number(pressed.has('w')||pressed.has('arrowup'))+touch.z;
   const length=Math.hypot(horizontal,vertical),isMoving=length>.01,crouch=pressed.has('c')||pressed.has('control'),run=pressed.has('shift')&&!crouch;
   inputFlags.current={moving:isMoving,running:run,crouching:crouch};
   if(isMoving){
     const vx=horizontal/length,vz=vertical/length;lastDirection.current={x:vx,z:vz};
     const velocity=(crouch?1.28:run?4.5:2.35)*dt;
     const trial=legalPosition({x:playerPos.current.x+vx*velocity,z:playerPos.current.z+vz*velocity});
     if(!hitFurniture(trial))playerPos.current=trial;
     else{
       const dx=legalPosition({x:playerPos.current.x+vx*velocity,z:playerPos.current.z});
       const dz=legalPosition({x:playerPos.current.x,z:playerPos.current.z+vz*velocity});
       if(!hitFurniture(dx))playerPos.current=dx;else if(!hitFurniture(dz))playerPos.current=dz;
     }
     sound.step(run);
   }
   if(player.current){player.current.position.set(playerPos.current.x,0,playerPos.current.z);
     if(isMoving){const yaw=Math.atan2(lastDirection.current.x,lastDirection.current.z);player.current.rotation.y=THREE.MathUtils.damp(player.current.rotation.y,yaw,13,dt);}
   }
   const desired=new THREE.Vector3(playerPos.current.x,3.65+(crouch?-.1:0),playerPos.current.z+5.25);
   camera.position.lerp(desired,1-Math.exp(-dt*3.9));camera.lookAt(playerPos.current.x,1.25,playerPos.current.z);
   if(lamp.current){lamp.current.position.set(playerPos.current.x,1.3,playerPos.current.z);
     lampTarget.position.set(playerPos.current.x+lastDirection.current.x*4,1,playerPos.current.z+lastDirection.current.z*4);
     lampTarget.updateMatrixWorld();}
   const near=ITEMS.filter(i=>(!['key','note'].includes(i.kind)||!collectedRef.current.includes(i.id))&&distance(i,playerPos.current)<1.88)
     .sort((a,b)=>distance(a,playerPos.current)-distance(b,playerPos.current))[0]??null;
   if(near?.id!==targetItem.current?.id){targetItem.current=near;onProximity(near);}
   const brain=keeperBrain.current,k=keeperPos.current,p=playerPos.current;
   const radius=detectionRadius(run,crouch,flashlight&&batteryRef.current>0,catches);
   const d=distance(k,p),inRange=d<radius,noiseRange=run&&d<7.5;
   if(inRange){brain.mode='chase';brain.lastSight={...p};brain.timer=2.3;}
   else if(noiseRange&&brain.mode==='patrol'){brain.mode='investigate';brain.lastSight={...p};brain.timer=2.8;}
   if(brain.mode==='chase'){
     if(inRange)brain.timer=2.3;else brain.timer-=dt;
     if(brain.timer<=0){brain.mode='return';brain.timer=0;}
     brain.dest={...brain.lastSight};
   }else if(brain.mode==='investigate'){
     brain.timer-=dt;brain.dest={...brain.lastSight};
     if(brain.timer<=0||distance(k,brain.dest)<.4){brain.mode='return';}
   }else if(brain.mode==='return'){
     brain.dest=PATROL[brain.index];if(distance(k,brain.dest)<.6)brain.mode='patrol';
   }else{brain.dest=PATROL[brain.index];if(distance(k,brain.dest)<.45)brain.index=(brain.index+1)%PATROL.length;}
   const dToTarget=distance(k,brain.dest);
   if(dToTarget>.05){const v=(brain.mode==='chase'?3.0+catches*.18:brain.mode==='investigate'?2.15:1.23)*dt;
     const dx=(brain.dest.x-k.x)/dToTarget,dz=(brain.dest.z-k.z)/dToTarget;k.x+=dx*Math.min(v,dToTarget);k.z+=dz*Math.min(v,dToTarget);
     if(keeper.current){keeper.current.position.set(k.x,0,k.z);keeper.current.rotation.y=THREE.MathUtils.damp(keeper.current.rotation.y,Math.atan2(dx,dz),5,dt);}
   }
   const onAlert=brain.mode==='chase'||brain.mode==='investigate';if(onAlert!==alert)setAlert(onAlert);
   captureCooldown.current=Math.max(0,captureCooldown.current-dt);
   if(d<.77&&captureCooldown.current<=0){captureCooldown.current=2;onCapture();return;}
   statsTime.current+=dt;
   if(statsTime.current>.14){statsTime.current=0;
     onVitals({x:p.x,z:p.z,alert:clamp(1-d/8,0,1),...inputFlags.current});
     if(moving!==isMoving)setMoving(isMoving);if(running!==run)setRunning(run);if(crouching!==crouch)setCrouching(crouch);
     if(flashlight&&batteryRef.current>0)onBattery(Math.max(0,batteryRef.current-.14));
   }
   if(state.clock.elapsedTime%24<dt)sound.grunt();
 });
 return <>
  <PerspectiveCamera makeDefault fov={54} near={.09} far={62} position={[START.x,3.5,START.z+6]}/>
  <World collected={collected}/>
  <ContactShadows position={[0,.018,0]} scale={22} opacity={.3} blur={2.5} far={2.5}/>
  <group ref={player} position={[START.x,0,START.z]}><Isaiah moving={moving} running={running} crouching={crouching} speed={running?2:1}/></group>
  <group ref={keeper} position={[2,0,-4]}><Keeper suspicious={alert}/></group>
  {flashlight&&battery>0&&<spotLight ref={lamp} position={[START.x,1.3,START.z]} target={lampTarget} color="#e5eaf4" intensity={11} angle={.48} penumbra={.69} distance={10} decay={1.8} castShadow shadow-mapSize={[512,512]}/>}
  {flashlight&&battery>0&&<primitive object={lampTarget} />}
 </>;
}
// A target must be in the scene for three.js spotlights to follow their animated direction.
const lampTarget=new THREE.Object3D();
export function GameScene(props:Props){return <Canvas shadows gl={{antialias:true,alpha:false,powerPreference:'high-performance'}} dpr={[1,1.7]} onCreated={({gl})=>{gl.setPixelRatio(Math.min(window.devicePixelRatio,1.7));gl.toneMapping=THREE.ACESFilmicToneMapping;gl.toneMappingExposure=1.2;}}>
 <Suspense fallback={null}><Simulation {...props}/></Suspense>
 </Canvas>}
