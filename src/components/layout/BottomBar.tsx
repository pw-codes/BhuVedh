import {useState} from 'react'
import {Info} from 'lucide-react'
const T:Record<string,[string,string][]>={
Terrain:[['Source','DEM 30 m (demo)'],['Mean slope','24°'],['Aspect','East-facing'],['Drainage density','Medium']],
Geology:[['Formation','Phyllite / quartzite (demo)'],['Lineaments','2 mapped'],['Contacts','1 inferred'],['Dip','32° NE']],
Hydrology:[['Streams','3 first-order'],['Runoff trend','Stable'],['Discharge record','24 months'],['Seasonality','Monsoon-fed']],
Soil:[['Texture','Loam'],['Infiltration','Moderate–high'],['Depth','0.6–1.2 m'],['Source','Soil map (demo)']],
'Land Cover':[['Dominant','Oak–pine forest'],['Degraded patch','18%'],['Cropland','22%'],['Source','LULC (demo)']],
Risk:[['Landslide','Moderate'],['Steep slopes','>35° in 12%'],['Unsuitable area','0.9 km²'],['Source','Screening (demo)']],
Model:[['Model','Random Forest'],['Model version','RF-v1.2'],['Spatial validation','5 regions'],['Training cells','24,381'],['Validation status','Preliminary']]}
export default function BottomBar(){const [t,setT]=useState('Model')
  return <div className="card px-3 py-2 shrink-0"><div className="flex gap-1 mb-2 text-xs overflow-x-auto">{Object.keys(T).map(k=><button key={k} onClick={()=>setT(k)} className={`px-3 py-1 rounded-md whitespace-nowrap ${t===k?'bg-dg text-white font-semibold':'text-slate-500 hover:bg-lg'}`}>{k}</button>)}</div>
    <div className="flex items-center gap-4"><div className="flex flex-1 gap-6">{T[t].map(([k,v])=><div key={k} className="text-xs"><div className="text-slate-500">{k}</div><b>{v}</b></div>)}</div><div className="hidden md:flex items-center gap-2 bg-lg rounded-lg px-3 py-2 text-[11px] max-w-xs"><Info size={16} className="text-g shrink-0"/>Recharge zone is a model-generated hypothesis requiring field validation.</div></div></div>}
