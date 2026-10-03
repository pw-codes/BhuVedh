import {Check} from 'lucide-react'
const S=['Select Spring','Analyze Recharge','Plan Intervention','Field Validate']
export default function Stepper({step,setStep}:{step:number;setStep:(n:number)=>void}){
  return <nav className="bg-white border-b border-[#d5e0d2] flex px-4 shrink-0">{S.map((t,i)=>{const n=i+1,done=n<step,act=n===step
    return <button key={t} onClick={()=>setStep(n)} className={`flex-1 flex items-center justify-center gap-3 py-2.5 border-b-[3px] transition-all ${act?'border-g text-dg font-bold':'border-transparent text-slate-400 font-medium'}`}>
      <span className={`w-8 h-8 rounded-full grid place-items-center text-xs font-bold ${done?'bg-g text-white':act?'bg-dg text-white':'bg-slate-100 text-slate-400 border'}`}>{done?<Check size={16}/>:String(n).padStart(2,'0')}</span><span className="text-sm">{t}</span></button>})}</nav>}
