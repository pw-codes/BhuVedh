import {useState} from 'react'
import MapView from '../components/map/MapView'
import {useMapLayers} from '../hooks/useMapLayers'
import {sitesOf} from '../data/mock'
import type {Spring} from '../types'
export default function PlanIntervention({spring}:{spring:Spring}){
  const {layers,toggle}=useMapLayers(),sites=sitesOf(spring),[plan,setPlan]=useState<string[]>(sites.slice(0,3).map(x=>x.id))
  const flip=(id:string)=>setPlan(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id])
  return <><div className="flex-1 min-w-0"><MapView spring={spring} layers={{...layers,heat:false}} toggle={toggle}/></div>
    <aside className="w-[400px] shrink-0 overflow-y-auto card p-4 space-y-3"><div><h2 className="font-bold text-lg">Plan Intervention</h2><p className="text-xs text-slate-500">{spring.name} · candidate sites (demo)</p></div>
      {sites.map(x=><div key={x.id} className="border border-[#d5e0d2] rounded-lg p-3 text-xs space-y-1.5"><div className="flex justify-between"><b className="text-sm">Site {x.id}</b><span className={`px-2 rounded-full ${x.risk==='Low'?'bg-green-100 text-green-800':'bg-amber-100 text-amber-800'}`}>Risk: {x.risk}</span></div>
        <div className="grid grid-cols-2 gap-1"><span>Recharge suitability <b>{x.suitability}%</b></span><span>Confidence <b>{x.confidence}%</b></span></div><div>Recommended: <b>{x.type}</b></div><p className="text-slate-600">{x.reason}</p>
        <button onClick={()=>flip(x.id)} className={`btn w-full ${plan.includes(x.id)?'bg-lg text-g border border-g':'bg-g text-white'}`}>{plan.includes(x.id)?'✓ In intervention plan':'Add to intervention plan'}</button></div>)}
      <div className="bg-lg rounded-lg p-3 text-sm space-y-1"><b>Plan summary</b><div className="flex justify-between"><span>Selected intervention sites</span><b>{plan.length}</b></div><div className="flex justify-between"><span>Total priority area</span><b>{(plan.length*0.8).toFixed(1)} km²</b></div><div className="flex justify-between"><span>Field assessment</span><b>Required</b></div></div></aside></>}
