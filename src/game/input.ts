import { useEffect, useRef } from 'react';
export function useMovementKeys(enabled:boolean) {
  const keys=useRef<Set<string>>(new Set());
  useEffect(()=>{
    if(!enabled){keys.current.clear();return;}
    const down=(ev:KeyboardEvent)=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(ev.key))ev.preventDefault();keys.current.add(ev.key.toLowerCase());};
    const up=(ev:KeyboardEvent)=>{keys.current.delete(ev.key.toLowerCase());};
    const blur=()=>keys.current.clear();window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',blur);
    return()=>{window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',blur);keys.current.clear();};
  },[enabled]);
  return keys;
}
