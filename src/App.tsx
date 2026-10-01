import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Battery, BookOpen, Check, ChevronRight, Compass, DoorOpen, Eye, Flashlight, Footprints, Headphones, KeyRound, Map, Moon, Play, RotateCcw, Smartphone, Sparkles, Volume2, VolumeX, X } from 'lucide-react';
import { GameScene } from './game/GameScene';
import { Item, ITEMS, KEY_COUNT, Phase, STORY_CHOICES } from './game/data';
import { canOpenDreamExit, getCatchOutcome, Point } from './game/rules';
import { SoundEngine } from './game/sound';
import portrait from './assets/isaiah-portrait.svg';

type Save={collected:string[];catches:number};
const STORAGE='isaiah-house-after-dark:chapter-1';
function readSave():Save{
 try{const raw=localStorage.getItem(STORAGE);if(!raw)return {collected:[],catches:0};
 const data=JSON.parse(raw) as Partial<Save>;
 return {collected:Array.isArray(data.collected)?data.collected.filter((x):x is string=>typeof x==='string'&&ITEMS.some(i=>i.id===x)):[],catches:Math.min(2,Math.max(0,Number(data.catches)||0))};
 }catch{return {collected:[],catches:0};}
}
const keyItems=ITEMS.filter(i=>i.kind==='key');
const noteItems=ITEMS.filter(i=>i.kind==='note');
const routeNames:Record<string,string>={exit_hall:'The Moonlit Hall',exit_mirror:'The Memory Mirror',exit_garden:'The Glass Garden'};
const openingLines=[
 'The clock stopped at 12:01. The house kept breathing.',
 'Six echoes are hiding somewhere inside. Find them before the dream repeats.',
 'Three doors remember three different endings.'
];

export default function App(){
 const [saved]=useState<Save>(()=>readSave());
 const [phase,setPhase]=useState<Phase>('menu');
 const [collected,setCollected]=useState<string[]>(saved.collected);
 const [catches,setCatches]=useState(saved.catches);
 const [battery,setBattery]=useState(100);
 const [flashlight,setFlashlight]=useState(false);
 const [audioEnabled,setAudioEnabled]=useState(true);
 const [showPhone,setShowPhone]=useState(false),[showJournal,setShowJournal]=useState(false);
 const [notice,setNotice]=useState(openingLines[0]),[proximity,setProximity]=useState<Item|null>(null);
 const [vitals,setVitals]=useState({x:-6.2,z:7.3,alert:0,moving:false,running:false,crouching:false});
 const [ending,setEnding]=useState(''),[dialogueChoice,setDialogueChoice]=useState(-1);
 const [sceneVersion,setSceneVersion]=useState(0),[interactTick,setInteractTick]=useState(0);
 const [touch,setTouch]=useState<Point>({x:0,z:0});
 const audio=useMemo(()=>new SoundEngine(),[]);
 const notificationTimer=useRef<number|null>(null);
 const collectedKeys=collected.filter(id=>id.startsWith('key'));
 const collectedNotes=collected.filter(id=>id.startsWith('note'));
 const notify=useCallback((message:string)=>{setNotice(message);if(notificationTimer.current)window.clearTimeout(notificationTimer.current);notificationTimer.current=window.setTimeout(()=>setNotice(''),5400);},[]);
 useEffect(()=>{if(phase==='menu'||phase==='playing'||phase==='caught')localStorage.setItem(STORAGE,JSON.stringify({collected,catches}));},[collected,catches,phase]);
 useEffect(()=>()=>{audio.dispose();if(notificationTimer.current)window.clearTimeout(notificationTimer.current);},[audio]);
 const start=()=>{audio.start();audio.setEnabled(audioEnabled);setShowJournal(false);setShowPhone(false);setPhase('playing');notify(openingLines[1]);};
 const restart=()=>{setCollected([]);setCatches(0);setBattery(100);setFlashlight(false);setEnding('');setProximity(null);setSceneVersion(n=>n+1);setPhase('menu');localStorage.removeItem(STORAGE);notify(openingLines[0]);};
 const pickup=useCallback((item:Item)=>{
   if(phase!=='playing')return;
   if(item.kind==='exit'){
     if(!canOpenDreamExit(collected)){audio.horror();notify(`The door needs all ${KEY_COUNT} dream keys. You have ${collectedKeys.length}.`);return;}
     audio.win();setEnding(item.id);setPhase('won');return;
   }
   if(item.kind==='power'){setBattery(100);audio.pickup();notify(item.description);return;}
   if(item.kind==='prop'){audio.click();notify(item.description);return;}
   if(collected.includes(item.id))return;
   setCollected(prev=>prev.includes(item.id)?prev:[...prev,item.id]);audio.pickup();notify(item.description);
 },[phase,collected,collectedKeys.length,audio,notify]);
 const capture=useCallback(()=>{
   if(phase!=='playing')return;
   audio.horror();audio.grunt();setFlashlight(false);setShowPhone(false);setShowJournal(false);
   const next=catches+1;setCatches(next);setDialogueChoice(-1);setProximity(null);
   setPhase(getCatchOutcome(catches));
 },[phase,catches,audio]);
 const resumeAfterCatch=()=>{setSceneVersion(n=>n+1);setBattery(Math.max(battery,28));setProximity(null);setPhase('playing');notify('The clock rewinds. Your discoveries remain in your memory.');};
 const toggleLight=()=>{if(battery<=0){notify('Your phone needs charging.');return;}setFlashlight(x=>!x);audio.click();};
 const toggleAudio=()=>{setAudioEnabled(x=>{audio.setEnabled(!x);return !x;});};
 useEffect(()=>{
   const key=(e:KeyboardEvent)=>{
     if(phase!=='playing')return;
     if(e.key==='Escape'){setShowPhone(false);setShowJournal(false);return;}
     if(e.repeat)return;
     switch(e.key.toLowerCase()){
       case 'p':setShowPhone(v=>!v);setShowJournal(false);break;
       case 'j':setShowJournal(v=>!v);setShowPhone(false);break;
       case 'f':toggleLight();break;
       case 'm':toggleAudio();break;
     }
   };window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);
 });
 const phoneHints=keyItems.map(item=>({item,found:collected.includes(item.id)}));
 const title=phase==='won'?routeNames[ending]??'Morning':phase==='loop'?'THE NIGHT REPEATS':phase==='caught'?'THE KEEPER FOUND YOU':'SIX ECHOES';
 const move=(x:number,z:number)=>setTouch({x,z});
 return <main className="shell">
  <div className="game-layer">
   {(phase==='playing')&&<GameScene key={sceneVersion} phase={phase} collected={collected} catches={catches} battery={battery} flashlight={flashlight}
      onBattery={setBattery} onPickup={pickup} onCapture={capture} onProximity={setProximity} onVitals={setVitals} sound={audio} touch={touch} interactTick={interactTick}/>} 
   {phase!=='playing'&&<div className="standby" style={{backgroundImage:`linear-gradient(90deg,rgba(11,12,21,.95),rgba(11,12,21,.60)),url(${portrait})`}}/>}
  </div>
  <div className="filmgrain" aria-hidden="true"/><div className="vignette" aria-hidden="true"/>
  {phase==='playing'&&<>
    <header className="hud-top">
      <div className="identity"><img src={portrait} alt="Isaiah's portrait"/><div><strong>ISAIAH</strong><span>CHAPTER 01 / SIX ECHOES</span></div></div>
      <div className="hud-objective"><small>OBJECTIVE</small><strong>{collectedKeys.length===KEY_COUNT?'CHOOSE YOUR ENDING':'FIND THE SIX DREAM KEYS'}</strong><div className="key-track">{keyItems.map((item,i)=><div key={item.id} className={collected.includes(item.id)?'has-key':''} title={item.label}>{collected.includes(item.id)?<Check size={13}/>:String(i+1).padStart(2,'0')}</div>)}</div></div>
      <div className="hud-toggles"><button onClick={()=>setShowJournal(v=>!v)} aria-label="Journal"><BookOpen size={19}/></button><button onClick={()=>setShowPhone(v=>!v)} aria-label="Phone"><Smartphone size={19}/></button><button onClick={toggleAudio} aria-label="Audio">{audioEnabled?<Volume2 size={19}/>:<VolumeX size={19}/>}</button></div>
    </header>
    <aside className="hud-left"><div className="mini-title"><Compass size={14}/> DREAM MAP</div><div className="mini-map"><div className="gridline gx"/><div className="gridline gz"/><div className="map-keeper" style={{left:'61%',top:'46%'}}/><div className="map-player" style={{left:`${(vitals.x+12)/24*100}%`,top:`${(vitals.z+9)/18*100}%`}}/><span>?</span></div><div className="mini-title"><Eye size={14}/> AWARENESS <b>{Math.round(vitals.alert*100)}%</b></div><div className="meter"><span style={{width:`${vitals.alert*100}%`}}/></div><div className="mini-meta"><Moon size={13}/> DREAM REWINDS: {catches}/3</div></aside>
    <aside className="hud-right"><div className="phone-meter"><Battery size={17}/><span>PHONE {Math.round(battery)}%</span><div className="battery-fill"><span style={{width:`${battery}%`}}/></div></div><div className="stance"><Footprints size={15}/>{vitals.crouching?'CROUCHING':vitals.running?'RUNNING':vitals.moving?'WALKING':'STILL'}</div></aside>
    {!!notice&&<div className="toast" role="status"><Sparkles size={18}/>{notice}</div>}
    {proximity&&<div className="interaction"><span className="interact-key">E</span><div><strong>{proximity.kind==='exit'?'OPEN':proximity.kind==='key'?'COLLECT':proximity.kind==='note'?'READ':'INTERACT'}</strong><small>{proximity.label}</small></div><button onClick={()=>setInteractTick(n=>n+1)}>USE <ChevronRight size={16}/></button></div>}
    <footer className="controls-hint">W A S D <span>MOVE</span> · SHIFT <span>RUN</span> · C <span>CROUCH</span> · E <span>INTERACT</span> · F <span>LIGHT</span> · P <span>PHONE</span></footer>
    <div className="touch-controls"><div className="dpad"><button className="up" onPointerDown={e=>{e.preventDefault();move(0,-1)}} onPointerUp={()=>move(0,0)} onPointerCancel={()=>move(0,0)}><ArrowUp/></button><button className="left" onPointerDown={e=>{e.preventDefault();move(-1,0)}} onPointerUp={()=>move(0,0)} onPointerCancel={()=>move(0,0)}><ArrowLeft/></button><button className="down" onPointerDown={e=>{e.preventDefault();move(0,1)}} onPointerUp={()=>move(0,0)} onPointerCancel={()=>move(0,0)}><ArrowDown/></button><button className="right" onPointerDown={e=>{e.preventDefault();move(1,0)}} onPointerUp={()=>move(0,0)} onPointerCancel={()=>move(0,0)}><ArrowRight/></button></div><div className="touch-actions"><button onClick={()=>setInteractTick(n=>n+1)}>E · USE</button><button onClick={toggleLight}><Flashlight size={18}/></button><button onClick={()=>setShowPhone(v=>!v)}><Smartphone size={18}/></button></div></div>
    {showPhone&&<section className="panel phone-panel"><div className="panel-head"><div><small>ISAIAH OS / 12:01 AM</small><h2><Smartphone size={21}/> Your phone</h2></div><button onClick={()=>setShowPhone(false)} aria-label="Close phone"><X/></button></div><div className="phone-app"><div className="app-top"><Battery size={17}/> {Math.round(battery)}% <span>NO SIGNAL</span></div><h3>Echo Finder</h3><p>Six mysteries, six keys. The clues refer to places in the dream.</p>{phoneHints.map(({item,found},i)=><div key={item.id} className={`hint ${found?'complete':''}`}><span className="hint-number">{i+1}</span><div><strong>{found?item.label:'UNRESOLVED ECHO'}</strong><small>{found?'DISCOVERED':item.hint}</small></div>{found&&<Check size={17}/>}</div>)}<button className="primary in-phone" onClick={toggleLight}><Flashlight size={17}/>{flashlight?'TURN OFF LIGHT':'TURN ON LIGHT'}</button></div></section>}
    {showJournal&&<section className="panel journal-panel"><div className="panel-head"><div><small>CHAPTER ONE / THE ECHOES</small><h2><BookOpen size={21}/> Field journal</h2></div><button onClick={()=>setShowJournal(false)} aria-label="Close journal"><X/></button></div><div className="journal-copy"><h3>The house after dark</h3><p>It's 12:01. A shadow roams the halls of a house that doesn't exist in daylight. Isaiah must assemble six keys to end the nightmare.</p><h3>Collected evidence — {collectedNotes.length}/{noteItems.length}</h3>{noteItems.map((i)=><article key={i.id}><strong>{collected.includes(i.id)?i.label:'???'}</strong><p>{collected.includes(i.id)?i.description:'An undiscovered memory.'}</p></article>)}<h3>Three possible endings</h3><p>Moonlit Hall · Memory Mirror · Glass Garden. Each door opens when the six echoes are collected.</p></div></section>}
   </>}
  {phase==='menu'&&<section className="screen menu-screen"><div className="eyebrow"><span className="line"/>AN ORIGINAL 3D HORROR STORY</div><div className="chapter">CHAPTER ONE <span>·</span> SIX ECHOES</div><h1>ISAIAH<span>THE HOUSE<br/>AFTER DARK</span></h1><p>Every dream has a door. This one has three. Find the six echoes, unravel the mystery, and make it to morning.</p><div className="menu-buttons"><button className="primary" onClick={start}><Play size={19} fill="currentColor"/>{collected.length?'CONTINUE NIGHT':'BEGIN THE NIGHT'}<ChevronRight size={17}/></button>{(collected.length>0||catches>0)&&<button className="secondary" onClick={restart}><RotateCcw size={17}/> NEW GAME</button>}</div><div className="menu-bottom"><span>THIRD PERSON</span><span>ADAPTIVE HORROR AI</span><span>THREE ENDINGS</span><span>ORIGINAL SOUND</span></div></section>}
  {(phase==='caught'||phase==='loop'||phase==='won')&&<section className="screen outcome-screen"><div className="eyebrow"><span className="line"/>{phase==='won'?'CHAPTER ONE COMPLETE':phase==='loop'?'DREAM OVER':'THE CLOCK REWINDS'}</div><div className="chapter">{phase==='caught'?`REWIND ${catches} / 3`:phase==='loop'?'MIDNIGHT · AGAIN':'SUNRISE · 06:00'}</div><h1 className="outcome-heading">{title}</h1><p>{phase==='won'?ITEMS.find(i=>i.id===ending)?.description:phase==='loop'?'The third chime pulls the dream back to its beginning. The Keeper wins this round — but the story can always be played again.':'The shadow fills the hall, and the clock starts turning backward. The Keeper speaks in riddles. What will Isaiah say?'}</p>
   {phase==='caught'&&<div className="choices">{STORY_CHOICES.map((ch,i)=><button key={ch} className={dialogueChoice===i?'chosen':''} onClick={()=>{setDialogueChoice(i);audio.click();}}><span>{i+1}</span>{ch}</button>)}{dialogueChoice!==-1&&<p className="answer">{['“The walls only remember what you fear,” it whispers.','The Keeper tilts its head. “Then find the last echo.”','The grandfather clock strikes, even though its hands never moved.'][dialogueChoice]}</p>}</div>}
   <div className="menu-buttons">{phase==='caught'?<button className="primary" onClick={resumeAfterCatch} disabled={dialogueChoice<0}><RotateCcw size={19}/> CONTINUE THE DREAM <ChevronRight size={17}/></button>:<button className="primary" onClick={restart}><RotateCcw size={19}/> PLAY AGAIN <ChevronRight size={17}/></button>}</div>
   <div className="menu-bottom"><span><KeyRound size={13}/> {collectedKeys.length} / {KEY_COUNT} KEYS</span><span><Map size={13}/> {collectedNotes.length} NOTES</span><span><DoorOpen size={13}/> {phase==='won'?'EXIT DISCOVERED':'UNFINISHED'}</span></div>
  </section>}
  <div className="bottom-brand"><Headphones size={13}/> AUDIO RECOMMENDED · A FICTIONAL DREAM STORY</div>
 </main>;
}
