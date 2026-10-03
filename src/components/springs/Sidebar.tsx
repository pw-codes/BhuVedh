import {useState} from 'react'
import {Search,Filter,MapPin,Droplet,Map as MapIc,AlertTriangle,Info,ChevronRight} from 'lucide-react'
import {springs} from '../../data/mock'
export default function Sidebar({sel,onPick}:{sel:string;onPick:(id:string)=>void}){
  const [q,setQ]=useState(''),[pri,setPri]=useState(false)
  const list=springs.filter(s=>s.name.toLowerCase().includes(q.toLowerCase())&&(!pri||s.prob>=70))
  return <aside className="w-80 shrink-0 hidden lg:flex flex-col gap-2 min-h-0">
    <div className="flex gap-2"><div className="card flex-1 flex items-center gap-2 px-3"><Search size={15} className="text-slate-400"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search springs..." className="w-full py-2 text-sm outline-none bg-transparent"/></div>
    <button onClick={()=>setPri(!pri)} className={`card px-3 flex items-center gap-1.5 text-sm ${pri?'bg-lg border-g':''}`}><Filter size={14}/>Filter</button></div>
    <p className="text-xs text-slate-500">{list.length} of {springs.length} springs in study area{pri&&' · priority only'}</p>
    <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 pr-1">{list.map(s=>{const on=s.id===sel,warn=s.status.includes('validation')
      return <div key={s.id} className={`rounded-xl border p-3 transition-shadow hover:shadow-md ${on?'border-2 border-g bg-lg/60':'border-[#d5e0d2] bg-white'}`}>
        <div className="flex items-center gap-2"><MapPin size={16} className="text-wb"/><b className="text-sm flex-1">{s.name.toUpperCase()}</b><span className="text-[11px] text-slate-500">{on?'● Selected':s.prob>=70?'Priority':''}</span></div>
        <dl className="text-xs mt-2 space-y-1.5"><Row i={<Droplet size={13}/>} k="Recharge probability" v={s.prob+'%'}/><Row i={<MapIc size={13}/>} k="Springshed area" v={s.area+' km²'}/>
        <div className="flex items-center gap-2 text-slate-600"><span className="text-slate-400">{warn?<AlertTriangle size={13} className="text-warn"/>:<Info size={13}/>}</span>Status<span className={`ml-auto px-2 py-0.5 rounded text-[10px] font-medium ${warn?'bg-amber-100 text-amber-800':'bg-blue-50 text-blue-800'}`}>{s.status}</span></div></dl>
        <button onClick={()=>onPick(s.id)} className={`btn w-full mt-2.5 flex justify-center items-center gap-1 ${on?'bg-dg text-white':'border border-g text-g hover:bg-lg'}`}>View analysis<ChevronRight size={14}/></button></div>})}</div></aside>}
const Row=({i,k,v}:{i:JSX.Element;k:string;v:string})=><div className="flex items-center gap-2 text-slate-600"><span className="text-slate-400">{i}</span>{k}<b className="ml-auto text-[#18332D]">{v}</b></div>
