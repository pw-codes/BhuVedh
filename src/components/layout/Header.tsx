import {MapPin,ChevronDown,Bell,Settings,UserCircle2} from 'lucide-react'
export default function Header(){
  return <header className="bg-dg text-white h-14 px-4 flex items-center gap-4 shrink-0">
    <svg width="34" height="34" viewBox="0 0 34 34"><path d="M2 28 13 8l6 10 3-5 10 15z" fill="#EAF3E7"/><path d="M17 15c3 4 5 6 5 9a5 5 0 0 1-10 0c0-3 2-5 5-9z" fill="#168AAD"/></svg>
    <span className="text-xl font-bold">BhuVedh</span><span className="h-6 w-px bg-white/30"/><span className="text-sm text-white/80 hidden md:block">Spring Recharge Decision Support</span>
    <div className="flex-1"/>
    <div className="flex items-center gap-2 border border-white/30 rounded-lg px-3 py-1.5 text-sm"><MapPin size={15}/>Kumaon Himalaya<ChevronDown size={15}/></div>
    <span className="bg-lg text-g text-[11px] font-bold px-2.5 py-1 rounded-full">DEMO DATA</span>
    <Bell size={18}/><Settings size={18}/><UserCircle2 size={24}/>
  </header>}
