import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';
import { ITEMS } from './data';

const colors={cream:'#b6a38d',floor:'#594539',wood:'#453129',trim:'#241f27',metal:'#b5a077'};

function Wall({x,z,w,d=0.24,h=3.5,transparent=false}:{x:number;z:number;w:number;d?:number;h?:number;transparent?:boolean}){
 return <group position={[x,0,z]}>
  <mesh position={[0,h/2,0]} receiveShadow castShadow={!transparent}><boxGeometry args={[w,h,d]}/><meshStandardMaterial color={colors.cream} roughness={.97} transparent={transparent} opacity={transparent?.13:1} depthWrite={!transparent}/></mesh>
  {!transparent&&<><mesh position={[0,.14,d/2+.021]}><boxGeometry args={[w,.28,.047]}/><meshStandardMaterial color={colors.trim}/></mesh><mesh position={[0,3.05,d/2+.03]}><boxGeometry args={[w,.07,.09]}/><meshStandardMaterial color="#665344"/></mesh></>}
 </group>;
}
function Picture({position,title}:{position:[number,number,number],title:string}){
 return <group position={position}>
  <mesh><boxGeometry args={[1.1,.92,.08]}/><meshStandardMaterial color="#322a29" metalness={.2}/></mesh>
  <mesh position={[0,0,.05]}><planeGeometry args={[.9,.71]}/><meshStandardMaterial color="#665d5a" roughness={.98}/></mesh>
  <mesh position={[0,-.14,.064]}><circleGeometry args={[.21,20]}/><meshStandardMaterial color="#d2a989"/></mesh>
  <Text position={[0,.17,.065]} fontSize={.095} color="#ddd2c1" maxWidth={.78}>{title}</Text>
 </group>;
}
function Bookcase({position,rotation=0}:{position:[number,number,number],rotation?:number}){
 const books=useMemo(()=>Array.from({length:30},(_,i)=>({x:(i%10)*.145-.67,y:Math.floor(i/10)*.78+.56,h:.32+((i*13)%7)*.045,c:['#79614d','#767364','#6e5254','#333b4b','#9b8170'][i%5]})),[]);
 return <group position={position} rotation={[0,rotation,0]}>
  <mesh position={[0,1.3,0]} castShadow><boxGeometry args={[1.7,2.6,.55]}/><meshStandardMaterial color={colors.wood} roughness={.88}/></mesh>
  {[.2,.91,1.7,2.47].map(y=><mesh key={y} position={[0,y,.32]}><boxGeometry args={[1.62,.085,.69]}/><meshStandardMaterial color="#201c1e"/></mesh>)}
  {books.map((b,i)=><mesh key={i} position={[b.x,b.y,.37]} castShadow><boxGeometry args={[.11,b.h,.19]}/><meshStandardMaterial color={b.c} roughness={.9}/></mesh>)}
 </group>;
}
function Table({position,scale=1}:{position:[number,number,number];scale?:number}){
 return <group position={position} scale={scale}>
  <RoundedBox args={[2.5,.16,1.35]} radius={.065} position={[0,1.08,0]} castShadow receiveShadow><meshStandardMaterial color={colors.wood} roughness={.77}/></RoundedBox>
  {[-1,1].flatMap(x=>[-1,1].map(z=><mesh key={`${x}${z}`} position={[x*1.07,.53,z*.5]} castShadow><boxGeometry args={[.14,1.07,.14]}/><meshStandardMaterial color="#342521"/></mesh>))}
 </group>;
}
function Chair({position,rotation=0}:{position:[number,number,number],rotation?:number}){
 return <group position={position} rotation={[0,rotation,0]}>
  <mesh position={[0,.52,0]} castShadow><boxGeometry args={[.7,.12,.67]}/><meshStandardMaterial color="#594139"/></mesh>
  <mesh position={[0,1.01,-.29]} castShadow><boxGeometry args={[.7,.94,.11]}/><meshStandardMaterial color="#594139"/></mesh>
  {[-1,1].flatMap(x=>[-1,1].map(z=><mesh key={`${x}${z}`} position={[x*.27,.26,z*.26]}><boxGeometry args={[.1,.55,.1]}/><meshStandardMaterial color="#43322c"/></mesh>))}
 </group>;
}
function Clock(){const pointer=useRef<THREE.Group>(null);useFrame(({clock})=>{if(pointer.current)pointer.current.rotation.z=Math.sin(clock.elapsedTime*.3)*.08;});return <group position={[.5,0,-7.55]}>
 <RoundedBox args={[.9,2.95,.5]} radius={.07} position={[0,1.48,0]} castShadow><meshStandardMaterial color="#4e3227" metalness={.12} roughness={.8}/></RoundedBox>
 <mesh position={[0,2.32,.26]}><circleGeometry args={[.35,40]}/><meshStandardMaterial color="#cdbd9b" roughness={.85}/></mesh>
 <group ref={pointer} position={[0,2.32,.29]}><mesh position={[0,.1,0]}><boxGeometry args={[.024,.21,.028]}/><meshStandardMaterial color="#241e1f"/></mesh><mesh position={[.09,0,0]} rotation={[0,0,Math.PI/2]}><boxGeometry args={[.025,.19,.028]}/><meshStandardMaterial color="#241e1f"/></mesh></group>
 <mesh position={[0,1.15,.28]}><sphereGeometry args={[.14,20,20]}/><meshStandardMaterial color="#ba9a62" metalness={.9} roughness={.21}/></mesh>
 </group>}
function Bed(){return <group position={[-9.2,0,6.65]}>
 <RoundedBox args={[2.8,.35,2.15]} radius={.07} position={[0,.45,0]} castShadow><meshStandardMaterial color="#3e3033"/></RoundedBox>
 <RoundedBox args={[2.6,.2,1.93]} radius={.07} position={[0,.7,0]} castShadow><meshStandardMaterial color="#9b9292" roughness={.98}/></RoundedBox>
 <RoundedBox args={[2.4,.13,1.25]} radius={.03} position={[0,.83,.27]} castShadow><meshStandardMaterial color="#494e62" roughness={.95}/></RoundedBox>
 <RoundedBox args={[.8,.17,.45]} radius={.075} position={[-.7,.87,-.59]} castShadow><meshStandardMaterial color="#ddd3c7"/></RoundedBox>
 <mesh position={[0,1.04,-1.04]}><boxGeometry args={[2.8,1.4,.16]}/><meshStandardMaterial color="#32282a"/></mesh>
 </group>}
function Rug({x,z,w,d,color}:{x:number;z:number;w:number;d:number;color:string}){return <group position={[x,.014,z]}>
 <mesh rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[w,d]}/><meshStandardMaterial color={color} roughness={1}/></mesh>
 <mesh rotation={[-Math.PI/2,0,0]} position={[0,.003,0]}><ringGeometry args={[.44,.47,30]}/><meshBasicMaterial color="#aa937b"/></mesh>
 </group>}
function Plants({x,z}:{x:number;z:number}){return <group position={[x,0,z]}>
 <mesh position={[0,.28,0]} castShadow><cylinderGeometry args={[.34,.25,.58,11]}/><meshStandardMaterial color="#746052" roughness={.85}/></mesh>
 {Array.from({length:7},(_,i)=>{const a=i*Math.PI*2/7;return <mesh key={i} position={[Math.cos(a)*.22,.82+Math.sin(i*4)*.15,Math.sin(a)*.2]} rotation={[.24*Math.sin(a),a,.4*Math.cos(a)]} castShadow><sphereGeometry args={[.11,.33,.11,7,7]}/><meshStandardMaterial color={i%2?'#4d624e':'#66785b'} roughness={.8}/></mesh>})}
 </group>}
function Lamp({position,shade='#bb9475'}:{position:[number,number,number],shade?:string}){return <group position={position}>
 <mesh position={[0,.72,0]}><cylinderGeometry args={[.06,.12,1.42,10]}/><meshStandardMaterial color="#6e6358" metalness={.7} roughness={.28}/></mesh>
 <mesh position={[0,1.53,0]}><coneGeometry args={[.43,.52,16,1,true]}/><meshStandardMaterial color={shade} side={THREE.DoubleSide} emissive="#9a704b" emissiveIntensity={.36}/></mesh>
 <pointLight position={[0,1.55,0]} color="#e8ae78" intensity={3.2} distance={7} decay={2} castShadow shadow-mapSize={[512,512]}/>
 </group>}
function KeyModel({x,z,color,visible}:{x:number;z:number;color:string;visible:boolean}){
 const group=useRef<THREE.Group>(null);
 useFrame(({clock})=>{if(group.current){group.current.rotation.y=clock.elapsedTime*.9;group.current.position.y=.88+Math.sin(clock.elapsedTime*2+z)*.11;}});
 if(!visible)return null;
 return <group position={[x,0,z]}>
  <group ref={group}>
   <mesh rotation={[Math.PI/2,0,0]}><torusGeometry args={[.17,.046,9,24]}/><meshStandardMaterial color={color} metalness={.79} roughness={.21} emissive={color} emissiveIntensity={.55}/></mesh>
   <mesh position={[0,-.33,0]}><boxGeometry args={[.075,.4,.07]}/><meshStandardMaterial color={color} metalness={.86} roughness={.21} emissive={color} emissiveIntensity={.4}/></mesh>
   <mesh position={[.08,-.48,0]}><boxGeometry args={[.17,.07,.07]}/><meshStandardMaterial color={color} metalness={.86} roughness={.21} emissive={color} emissiveIntensity={.4}/></mesh>
   <pointLight intensity={.7} distance={2.2} color={color}/>
  </group>
 </group>;
}
function FloatingNote({x,z}:{x:number;z:number}){const ref=useRef<THREE.Group>(null);useFrame(({clock})=>{if(ref.current)ref.current.rotation.y=Math.sin(clock.elapsedTime)*.12;});return <group ref={ref} position={[x,.83,z]}><mesh rotation={[-.32,0,.1]} castShadow><boxGeometry args={[.43,.045,.55]}/><meshStandardMaterial color="#e0cc9f" emissive="#987447" emissiveIntensity={.18}/></mesh><pointLight color="#c5a278" intensity={.25} distance={1.2}/></group>}
function Exit({x,z,name,color,rotation=0}:{x:number;z:number;name:string;color:string;rotation?:number}){
 return <group position={[x,0,z]} rotation={[0,rotation,0]}>
  <mesh position={[0,1.45,0]} castShadow><boxGeometry args={[1.8,2.9,.26]}/><meshStandardMaterial color="#2b2b35" roughness={.83}/></mesh>
  <mesh position={[0,1.46,.145]}><boxGeometry args={[1.42,2.52,.06]}/><meshStandardMaterial color={color} emissive={color} emissiveIntensity={.2} metalness={.35} roughness={.45}/></mesh>
  <mesh position={[.52,1.44,.19]}><sphereGeometry args={[.068,12,12]}/><meshStandardMaterial color="#dbc7a1" metalness={.85} roughness={.19}/></mesh>
  <Text position={[0,3.1,.15]} fontSize={.17} color="#dfd9cb" anchorX="center" outlineColor="#11111b" outlineWidth={.009}>{name}</Text>
  <pointLight position={[0,1.55,1.2]} color={color} intensity={.75} distance={3.8} decay={2}/>
 </group>;
}
function Dust(){const cloud=useMemo(()=>{
 const out=new Float32Array(180*3);for(let i=0;i<180;i++){out[i*3]=Math.sin(i*39.34)*10.8;out[i*3+1]=.4+(i*7%32)/10;out[i*3+2]=Math.sin(i*97.1)*7.5;}
 return out;
},[]);const m=useRef<THREE.Points>(null);useFrame(({clock})=>{if(m.current)m.current.rotation.y=Math.sin(clock.elapsedTime*.06)*.018;});return <points ref={m}><bufferGeometry><bufferAttribute attach="attributes-position" args={[cloud,3]}/></bufferGeometry><pointsMaterial color="#dfc7a1" size={.024} sizeAttenuation transparent opacity={.48} depthWrite={false}/></points>}
const keyColors=['#f6b65b','#f0e6c6','#5cacde','#b27de5','#8fac79','#d8d9e3'];
export function World({collected}:{collected:string[]}){
 return <group>
  <color attach="background" args={['#15151e']}/><fog attach="fog" args={['#191922',10,27]}/>
  <ambientLight intensity={.26} color="#afbdd5"/><hemisphereLight args={['#b5c6ed','#2b1f1d',.78]}/>
  <directionalLight position={[-5,9,-4]} color="#b7c8f4" intensity={1.1} castShadow shadow-mapSize={[2048,2048]} shadow-camera-left={-15} shadow-camera-right={15} shadow-camera-top={15} shadow-camera-bottom={-15} shadow-bias={-.0004}/>
  <mesh rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[24,18]}/><meshStandardMaterial color={colors.floor} roughness={.9}/></mesh>
  {Array.from({length:46},(_,i)=><mesh key={`plank${i}`} position={[-11.9+(i%23)*1.05,.007,-8.9+Math.floor(i/23)*8.9]} rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[1.035,8.8]}/><meshStandardMaterial color={['#544033','#5d4539','#61483a','#4e392f'][i%4]} roughness={.88}/></mesh>)}
  {Array.from({length:16},(_,i)=><mesh key={`groove${i}`} position={[0,.013,-8.7+i*1.13]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[23.6,.013]}/><meshBasicMaterial color="#2b2527"/></mesh>)}
  <Wall x={0} z={-9} w={24}/>
  <group rotation={[0,Math.PI/2,0]}><Wall x={0} z={-12} w={18}/><Wall x={0} z={12} w={18}/></group>
  <Wall x={0} z={9} w={24} transparent/>
  <Wall x={-5.2} z={-3.15} w={5.9} h={3.12}/><Wall x={6} z={-.4} w={4.4} h={3.1}/>
  <Wall x={-5.2} z={2} w={3.5} h={2.65} transparent/>
  <Rug x={-.3} z={1.1} w={6.5} d={3.5} color="#5b3e45"/><Rug x={-8.65} z={5.7} w={6} d={4.8} color="#323e4a"/><Rug x={7.8} z={-4.2} w={5} d={3} color="#42413e"/>
  <Bed/><Bookcase position={[-9.8,0,-5.7]}/><Bookcase position={[-7.6,0,-7.6]} rotation={Math.PI/2}/><Bookcase position={[8.7,0,-7.8]} rotation={Math.PI/2}/>
  <Table position={[-7.8,0,4.4]} scale={.7}/><Chair position={[-7.7,0,3.3]} rotation={Math.PI}/>
  <Table position={[-.8,0,3.5]}/><Chair position={[-2.4,0,3.5]} rotation={Math.PI/2}/><Chair position={[.7,0,3.5]} rotation={-Math.PI/2}/>
  <Table position={[6.2,0,-5.6]} scale={.64}/><Lamp position={[7.25,0,-6.7]}/><Lamp position={[-3.5,0,5.1]} shade="#9f8d7a"/>
  <Clock/><Plants x={9.6} z={5.9}/><Plants x={7.4} z={5.3}/><Plants x={-10.7} z={-1.3}/>
  <Picture position={[-8,2,-8.83]} title="THE FIRST NIGHT"/><Picture position={[4,2.1,-8.83]} title="SIX ECHOES"/>
  <mesh position={[-3.1,3.43,.9]}><boxGeometry args={[.55,.14,.55]}/><meshStandardMaterial color="#2f2930"/></mesh>
  <pointLight position={[-3.1,3.1,.9]} color="#f1ce9b" intensity={5} distance={8} decay={2}/>
  <mesh position={[3.6,3.42,4.8]}><boxGeometry args={[.55,.14,.55]}/><meshStandardMaterial color="#2f2930"/></mesh>
  <pointLight position={[3.6,3.1,4.8]} color="#cfb7a2" intensity={4} distance={7} decay={2}/>
  <mesh position={[-9.7,2.3,-8.87]}><planeGeometry args={[1.1,1.4]}/><meshBasicMaterial color="#a0b9d7" transparent opacity={.5}/></mesh>
  <pointLight position={[-9.7,2.3,-7.8]} color="#88a9df" distance={5} intensity={.85}/>
  <Dust/>
  {ITEMS.filter(i=>i.kind==='key').map((i,index)=><KeyModel key={i.id} x={i.x} z={i.z} color={keyColors[index]} visible={!collected.includes(i.id)}/>)}
  {ITEMS.filter(i=>i.kind==='note'&&!collected.includes(i.id)).map(i=><FloatingNote key={i.id} x={i.x} z={i.z}/>)}
  <Exit x={0} z={-8.5} name="MOONLIT HALL" color="#697891"/><Exit x={-10.8} z={-8.45} name="MEMORY MIRROR" color="#5a7489"/><Exit x={11.4} z={5.6} name="GLASS GARDEN" color="#618b74" rotation={-Math.PI/2}/>
 </group>;
}
