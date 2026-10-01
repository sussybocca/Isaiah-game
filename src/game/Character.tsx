import { useFrame, useLoader } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import faceUrl from '../assets/isaiah-face.jpg';

type AvatarProps={moving:boolean;running:boolean;crouching:boolean;speed:number;};
const dark='#171b23', jacket='#d8d6d0', skin='#ab795c', pants='#202b3b';

export function Isaiah({moving,running,crouching,speed}:AvatarProps){
  const face=useLoader(THREE.TextureLoader,faceUrl);
  face.colorSpace=THREE.SRGBColorSpace;
  const hips=useRef<THREE.Group>(null), torso=useRef<THREE.Group>(null),leftLeg=useRef<THREE.Group>(null),rightLeg=useRef<THREE.Group>(null),leftArm=useRef<THREE.Group>(null),rightArm=useRef<THREE.Group>(null),head=useRef<THREE.Group>(null);
  useFrame(({clock},dt)=>{
    const t=clock.getElapsedTime(),pace=running?9+speed:7.5, amplitude=moving?(running?.68:.38):.015;
    const cycle=Math.sin(t*pace), bob=moving?Math.abs(cycle)*.062:Math.sin(t*1.5)*.012;
    if(hips.current){hips.current.position.y=THREE.MathUtils.damp(hips.current.position.y,(crouching?-.48:0)+bob,8,dt);hips.current.rotation.z=THREE.MathUtils.damp(hips.current.rotation.z,moving?cycle*.015:0,9,dt);}
    if(torso.current)torso.current.rotation.x=THREE.MathUtils.damp(torso.current.rotation.x,crouching?.23:running?.12:0,8,dt);
    if(leftLeg.current)leftLeg.current.rotation.x=THREE.MathUtils.damp(leftLeg.current.rotation.x,cycle*amplitude,14,dt);
    if(rightLeg.current)rightLeg.current.rotation.x=THREE.MathUtils.damp(rightLeg.current.rotation.x,-cycle*amplitude,14,dt);
    if(leftArm.current)leftArm.current.rotation.x=THREE.MathUtils.damp(leftArm.current.rotation.x,-cycle*amplitude*.74-.13,13,dt);
    if(rightArm.current)rightArm.current.rotation.x=THREE.MathUtils.damp(rightArm.current.rotation.x,cycle*amplitude*.74-.13,13,dt);
    if(head.current)head.current.rotation.y=Math.sin(t*1.2)*.025;
  });
  const curls=useMemo(()=>Array.from({length:35},(_,i)=>{
    const a=(i/35)*Math.PI*2,r=.18+.14*((i*19%13)/13),h=.1+.1*Math.sin(i*6.1);
    return {p:[Math.cos(a)*r,.25+h,Math.sin(a)*r] as [number,number,number],s:.066+.036*((i*7%11)/11)};
  }),[]);
  return <group scale={.9}>
    <group ref={hips}>
      <group ref={leftLeg} position={[-.13,.78,0]}><mesh position={[0,-.36,0]} castShadow><capsuleGeometry args={[.115,.48,6,10]}/><meshStandardMaterial color={pants} roughness={.85}/></mesh><mesh position={[0,-.75,.08]} castShadow><boxGeometry args={[.23,.14,.42]}/><meshStandardMaterial color="#101115" roughness={.72}/></mesh></group>
      <group ref={rightLeg} position={[.13,.78,0]}><mesh position={[0,-.36,0]} castShadow><capsuleGeometry args={[.115,.48,6,10]}/><meshStandardMaterial color={pants} roughness={.85}/></mesh><mesh position={[0,-.75,.08]} castShadow><boxGeometry args={[.23,.14,.42]}/><meshStandardMaterial color="#101115" roughness={.72}/></mesh></group>
      <group ref={torso} position={[0,1.04,0]}>
        <RoundedBox args={[.65,.77,.36]} radius={.17} smoothness={5} castShadow><meshStandardMaterial color={jacket} roughness={.94}/></RoundedBox>
        <mesh position={[0,.02,.193]}><planeGeometry args={[.5,.58]}/><meshStandardMaterial color="#343a44" roughness={.88}/></mesh>
        <mesh position={[0,.12,.198]}><planeGeometry args={[.49,.018]}/><meshStandardMaterial color="#dedbd7"/></mesh>
        <group ref={leftArm} position={[-.42,.23,0]}><mesh position={[0,-.34,0]} castShadow><capsuleGeometry args={[.102,.39,6,10]}/><meshStandardMaterial color={jacket} roughness={.9}/></mesh><mesh position={[0,-.71,0]} castShadow><sphereGeometry args={[.106,12,12]}/><meshStandardMaterial color={skin} roughness={.88}/></mesh></group>
        <group ref={rightArm} position={[.42,.23,0]}><mesh position={[0,-.34,0]} castShadow><capsuleGeometry args={[.102,.39,6,10]}/><meshStandardMaterial color={jacket} roughness={.9}/></mesh><mesh position={[0,-.71,0]} castShadow><sphereGeometry args={[.106,12,12]}/><meshStandardMaterial color={skin} roughness={.88}/></mesh></group>
        <group ref={head} position={[0,.65,0]}>
          <mesh castShadow><sphereGeometry args={[.29,28,24]}/><meshStandardMaterial color={skin} roughness={.91}/></mesh>
          {/* Portrait-based face decal; the head and hair remain true 3D geometry. */}
          <mesh position={[0,-.005,.244]}><planeGeometry args={[.465,.5]}/><meshStandardMaterial map={face} roughness={.91} side={THREE.DoubleSide} polygonOffset polygonOffsetFactor={-1}/></mesh>
          {curls.map((c,i)=><mesh key={i} position={c.p} castShadow><icosahedronGeometry args={[c.s,1]}/><meshStandardMaterial color={dark} roughness={.99}/></mesh>)}
          <mesh position={[-.267,-.005,0]}><sphereGeometry args={[.07,9,9]}/><meshStandardMaterial color={skin}/></mesh>
          <mesh position={[.267,-.005,0]}><sphereGeometry args={[.07,9,9]}/><meshStandardMaterial color={skin}/></mesh>
        </group>
      </group>
    </group>
    <Text position={[0,2.35,0]} fontSize={.15} color="#edf1fa" anchorX="center" anchorY="middle" outlineColor="#1a1723" outlineWidth={.015}>ISAIAH</Text>
  </group>;
}

export function Keeper({suspicious}:{suspicious:boolean}){
  const body=useRef<THREE.Group>(null), arm=useRef<THREE.Group>(null),glow=useRef<THREE.PointLight>(null);
  useFrame(({clock})=>{
    const t=clock.getElapsedTime();if(body.current){body.current.position.y=Math.sin(t*2.3)*.085;body.current.rotation.z=Math.sin(t*1.6)*.03;}
    if(arm.current)arm.current.rotation.x=Math.sin(t*2.3)*.18;
    if(glow.current)glow.current.intensity=suspicious?2+Math.sin(t*9)*.6:.64+Math.sin(t*2)*.14;
  });
  return <group ref={body}>
    <mesh position={[0,1.15,0]} castShadow><coneGeometry args={[.57,2.15,12,1,true]}/><meshStandardMaterial color="#1b1b2b" metalness={.12} roughness={.91} side={THREE.DoubleSide}/></mesh>
    <mesh position={[0,2.3,0]} castShadow><sphereGeometry args={[.31,18,18]}/><meshStandardMaterial color="#171320" roughness={.95}/></mesh>
    <mesh position={[-.11,2.33,.285]}><sphereGeometry args={[.045,8,8]}/><meshBasicMaterial color={suspicious?'#ff405a':'#d3c0b6'}/></mesh>
    <mesh position={[.11,2.33,.285]}><sphereGeometry args={[.045,8,8]}/><meshBasicMaterial color={suspicious?'#ff405a':'#d3c0b6'}/></mesh>
    <group ref={arm} position={[-.42,1.88,0]}><mesh position={[0,-.52,0]}><capsuleGeometry args={[.12,.75,5,8]}/><meshStandardMaterial color="#1b1823"/></mesh></group>
    <mesh position={[.42,1.38,.0]} rotation={[0,0,-.24]}><capsuleGeometry args={[.12,.86,5,8]}/><meshStandardMaterial color="#1b1823"/></mesh>
    <pointLight ref={glow} color={suspicious?'#f34764':'#8973aa'} position={[0,2.1,0]} distance={4.1} decay={2} intensity={.75}/>
    <mesh position={[0,.08,0]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.45,.65,40]}/><meshBasicMaterial color={suspicious?'#e65665':'#8b7296'} transparent opacity={.58} side={THREE.DoubleSide}/></mesh>
  </group>;
}
