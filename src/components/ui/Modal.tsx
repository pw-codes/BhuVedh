import {X} from 'lucide-react'
import type {ReactNode} from 'react'
export default function Modal({title,onClose,children}:{title:string;onClose:()=>void;children:ReactNode}){
  return <div className="fixed inset-0 z-[2000] bg-black/40 grid place-items-center p-4" onClick={onClose}><div className="card w-full max-w-lg p-5 shadow-xl" onClick={e=>e.stopPropagation()}><div className="flex justify-between items-center mb-3"><h3 className="font-bold text-lg">{title}</h3><button onClick={onClose}><X size={18}/></button></div>{children}</div></div>}
