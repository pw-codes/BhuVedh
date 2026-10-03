import {useState} from 'react'
import type {Layers} from '../types'
export function useMapLayers(){
  const [layers,setLayers]=useState<Layers>({heat:true,shed:true,ws:true,springs:true,lin:true,risk:false,sites:true})
  return {layers,toggle:(k:keyof Layers)=>setLayers(l=>({...l,[k]:!l[k]})),show:(k:keyof Layers)=>setLayers(l=>({...l,[k]:true}))}
}
