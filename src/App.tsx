import {useState} from 'react'
import Header from './components/layout/Header'
import Stepper from './components/layout/Stepper'
import SelectSpring from './pages/SelectSpring'
import AnalyzeRecharge from './pages/AnalyzeRecharge'
import PlanIntervention from './pages/PlanIntervention'
import FieldValidate from './pages/FieldValidate'
import {springs,sitesOf} from './data/mock'
import type {Site} from './types'
export default function App(){
  const [step,setStep]=useState(2),[sel,setSel]=useState('s1'),[site,setSite]=useState<Site>(sitesOf(springs[0])[0])
  const spring=springs.find(s=>s.id===sel)!
  const pick=(id:string)=>{setSel(id);setSite(sitesOf(springs.find(s=>s.id===id)!)[0]);setStep(2)}
  return <div className="h-screen flex flex-col bg-[#F6F8F3] text-[#18332D]"><Header/><Stepper step={step} setStep={setStep}/>
    <main className="flex-1 min-h-0 p-3 flex gap-3">
      {step===1&&<SelectSpring sel={sel} onPick={pick}/>}
      {step===2&&<AnalyzeRecharge spring={spring} onPick={pick} onAssess={s=>{setSite(s);setStep(4)}}/>}
      {step===3&&<PlanIntervention key={sel} spring={spring}/>}
      {step===4&&<FieldValidate key={site.id+sel} spring={spring} site={site}/>}
    </main></div>}
