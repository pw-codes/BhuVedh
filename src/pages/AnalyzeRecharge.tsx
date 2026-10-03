import {useState} from 'react'
import Sidebar from '../components/springs/Sidebar'
import MapView from '../components/map/MapView'
import AnalysisPanel from '../components/analysis/AnalysisPanel'
import BottomBar from '../components/layout/BottomBar'
import Modal from '../components/ui/Modal'
import {Factors,Evidence} from '../components/analysis/Explain'
import {useMapLayers} from '../hooks/useMapLayers'
import type {Spring,Site} from '../types'
export default function AnalyzeRecharge({spring,onPick,onAssess}:{spring:Spring;onPick:(id:string)=>void;onAssess:(x:Site)=>void}){
  const {layers,toggle,show}=useMapLayers(),[m,setM]=useState<'why'|'evidence'|null>(null)
  return <><Sidebar sel={spring.id} onPick={onPick}/>
    <div className="flex-1 min-w-0 flex flex-col gap-3"><div className="flex-1 min-h-0"><MapView spring={spring} layers={layers} toggle={toggle}/></div><BottomBar/></div>
    <AnalysisPanel s={spring} onModal={setM} onAssess={onAssess} onRisk={()=>show('risk')}/>
    {m==='why'&&<Modal title="Why this prediction?" onClose={()=>setM(null)}><Factors p={spring.prob}/><p className="text-xs text-slate-600 mt-3">The model combines terrain, lineament proximity, rainfall, soil and land cover into a recharge-suitability score. It outputs a probable springshed hypothesis, not an exact underground boundary. Values shown are demo placeholders.</p></Modal>}
    {m==='evidence'&&<Modal title="Supporting evidence" onClose={()=>setM(null)}><Evidence s={spring}/></Modal>}</>}
