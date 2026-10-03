import Sidebar from '../components/springs/Sidebar'
import MapView from '../components/map/MapView'
import {useMapLayers} from '../hooks/useMapLayers'
import {springs} from '../data/mock'
export default function SelectSpring({sel,onPick}:{sel:string;onPick:(id:string)=>void}){const {layers,toggle}=useMapLayers()
  return <><Sidebar sel={sel} onPick={onPick}/><div className="flex-1 min-w-0"><MapView overview spring={springs[0]} layers={layers} toggle={toggle} onPick={onPick}/></div></>}
