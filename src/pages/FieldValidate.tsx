import {useState} from 'react'
import type {ReactNode} from 'react'
import {CheckCircle2} from 'lucide-react'
import type {Spring,Site} from '../types'
const Seg=({o,v,on}:{o:string[];v:string;on:(x:string)=>void})=><div className="flex gap-1">{o.map(x=><button type="button" key={x} onClick={()=>on(x)} className={`btn border ${v===x?'bg-g text-white border-g':'border-[#d5e0d2]'}`}>{x}</button>)}</div>
const L=({t,children}:{t:string;children:ReactNode})=><label className="block text-xs font-medium text-slate-600 space-y-1"><span>{t}</span>{children}</label>
const inp='w-full border border-[#d5e0d2] rounded-md px-2.5 py-2 text-sm bg-white outline-none focus:border-g'
export default function FieldValidate({spring,site}:{spring:Spring;site:Site}){
  const [f,setF]=useState({lat:site.lat.toFixed(5),lng:site.lng.toFixed(5),rock:'Phyllite',frac:'Yes',seep:'No',slope:'Moderate',land:'Degraded forest',notes:''}),[photo,setPhoto]=useState(''),[saved,setSaved]=useState(false),[res,setRes]=useState('')
  const set=(k:string)=>(v:string)=>setF(x=>({...x,[k]:v}))
  const submit=()=>{const n=(f.frac==='Yes'?1:0)+(f.seep==='Yes'?1:0);setRes(n===2?'Confirmed':n===1?'Partially confirmed':'Requires review')}
  return <div className="flex-1 overflow-y-auto"><div className="card max-w-3xl mx-auto p-6 space-y-4"><div><h2 className="font-bold text-xl">Field Validation</h2><p className="text-sm text-slate-500">Selected site: {spring.name} / Site {site.id} · observations stay in this browser session (demo)</p></div>
    <div className="grid grid-cols-2 gap-4"><L t="Latitude"><input className={inp} value={f.lat} onChange={e=>set('lat')(e.target.value)}/></L><L t="Longitude"><input className={inp} value={f.lng} onChange={e=>set('lng')(e.target.value)}/></L>
    <L t="Rock type"><select className={inp} value={f.rock} onChange={e=>set('rock')(e.target.value)}>{['Phyllite','Quartzite','Schist','Limestone','Alluvium'].map(x=><option key={x}>{x}</option>)}</select></L>
    <L t="Land cover"><select className={inp} value={f.land} onChange={e=>set('land')(e.target.value)}>{['Degraded forest','Oak–pine forest','Cropland','Grassland','Barren'].map(x=><option key={x}>{x}</option>)}</select></L>
    <L t="Fractures observed"><Seg o={['Yes','No']} v={f.frac} on={set('frac')}/></L><L t="Seepage observed"><Seg o={['Yes','No']} v={f.seep} on={set('seep')}/></L>
    <L t="Slope"><Seg o={['Low','Moderate','High']} v={f.slope} on={set('slope')}/></L><L t="Photo"><input type="file" accept="image/*" className="text-xs" onChange={e=>setPhoto(e.target.files?.[0]?.name??'')}/>{photo&&<em className="text-[11px]">{photo}</em>}</L></div>
    <L t="Community observation"><textarea rows={3} className={inp} value={f.notes} onChange={e=>set('notes')(e.target.value)} placeholder="e.g. spring flow dropped in recent dry seasons..."/></L>
    <div className="flex gap-2"><button onClick={()=>setSaved(true)} className="btn border border-g text-g">Save observation</button><button onClick={()=>{setSaved(true);submit()}} className="btn bg-g text-white">Submit validation</button></div>
    {saved&&<div className="bg-lg rounded-lg p-3 text-sm flex items-center gap-2"><CheckCircle2 className="text-g" size={18}/><b>Observation recorded</b>{res&&<span className="ml-auto">Prediction status: <b>{res}</b></span>}</div>}</div></div>}
