import {useEffect,useRef,useState} from 'react'
import {MapContainer,TileLayer,Polygon,Polyline,Circle,Marker,Tooltip,useMap} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {Plus,Minus,Layers as LyIcon,LocateFixed,RotateCcw} from 'lucide-react'
import {springs,radius,ring,heat,heatColor,sitesOf} from '../../data/mock'
import type {Spring,Layers} from '../../types'
const pin=(c:string,t:string)=>L.divIcon({className:'',html:`<div style="background:${c};width:22px;height:22px;border-radius:50%;border:2px solid #fff;box-shadow:0 1px 4px #0006;display:grid;place-items:center;color:#fff;font:700 11px Inter">${t}</div>`,iconSize:[22,22],iconAnchor:[11,11]})
const SC:Record<string,[string,string]>={'Contour trench':['#D9722B','T'],'Recharge structure':['#168AAD','W'],'Vegetation treatment':['#0F6B57','V']}
const LABELS:[keyof Layers,string][]=[['heat','Recharge probability'],['shed','Probable springshed'],['ws','Surface watershed'],['springs','Springs'],['lin','Lineaments'],['risk','Risk zones'],['sites','Intervention sites']]
type P={spring:Spring;layers:Layers;toggle:(k:keyof Layers)=>void;overview?:boolean;onPick?:(id:string)=>void}
function Fly({c,z}:{c:[number,number];z:number}){const m=useMap();useEffect(()=>{m.flyTo(c,z,{duration:.8})},[c[0],c[1],z]);return null}
function Controls({c,z,layers,toggle}:{c:[number,number];z:number;layers:Layers;toggle:P['toggle']}){
  const m=useMap(),[o,setO]=useState(false),r=useRef<HTMLDivElement>(null)
  useEffect(()=>{if(r.current){L.DomEvent.disableClickPropagation(r.current);L.DomEvent.disableScrollPropagation(r.current)}},[])
  const b='w-9 h-9 grid place-items-center bg-white hover:bg-lg border-b last:border-0 border-[#d5e0d2]',box='rounded-lg overflow-hidden border border-[#d5e0d2] shadow bg-white'
  return <div ref={r} className="absolute top-3 right-3 z-[1000] flex flex-col gap-2 items-end">
    <div className={box}><button className={b} onClick={()=>m.zoomIn()}><Plus size={16}/></button><button className={b} onClick={()=>m.zoomOut()}><Minus size={16}/></button></div>
    <div className={box}><button className={b} title="Layers" onClick={()=>setO(!o)}><LyIcon size={16}/></button><button className={b} title="Center" onClick={()=>m.flyTo(c,z)}><LocateFixed size={16}/></button><button className={b} title="Reset" onClick={()=>m.setView(c,z)}><RotateCcw size={16}/></button></div>
    {o&&<div className={box+' p-3 text-xs w-48 space-y-1.5'}><b className="text-[11px] tracking-wide text-slate-500">MAP LAYERS</b>{LABELS.map(([k,t])=><label key={k} className="flex gap-2 items-center cursor-pointer"><input type="checkbox" checked={layers[k]} onChange={()=>toggle(k)} className="accent-[#0F6B57]"/>{t}</label>)}</div>}</div>}
function Legend(){const it:[string,string][]=[['#168AAD','Spring'],['#2E9E5B','Probable springshed'],['#168AAD','Surface watershed'],['#111','Lineament (dashed)'],['#D9722B','Contour trench'],['#168AAD','Recharge structure'],['#0F6B57','Vegetation treatment']]
  return <div className="absolute bottom-6 left-3 z-[1000] bg-white/95 rounded-lg border border-[#d5e0d2] shadow p-3 w-56 text-[11px]"><b className="text-xs">Recharge probability</b><div className="h-2 rounded my-1.5" style={{background:'linear-gradient(90deg,#f4e27a,#f0a43a,#3f9b4f)'}}/><div className="flex justify-between text-slate-500 mb-2"><span>Low</span><span>Medium</span><span>High</span></div>{it.map(([c,t])=><div key={t} className="flex items-center gap-2 py-0.5"><span className="w-3 h-3 rounded-sm" style={{background:c}}/>{t}</div>)}</div>}
export default function MapView({spring:s,layers:ly,toggle,overview,onPick}:P){
  const R=radius(s),z=overview?9:12,c:[number,number]=overview?[29.8,80.0]:[s.lat,s.lng]
  return <div className="relative h-full rounded-xl overflow-hidden border border-[#d5e0d2]">
    <MapContainer center={c} zoom={z} zoomControl={false} className="h-full w-full">
      <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution="Esri, Maxar, Earthstar Geographics"/>
      <Fly c={c} z={z}/>
      {overview?springs.map(p=><Marker key={p.id} position={[p.lat,p.lng]} icon={pin('#168AAD','●')} eventHandlers={{click:()=>onPick?.(p.id)}}><Tooltip direction="right" offset={[12,0]}>{p.name} · {p.prob}%</Tooltip></Marker>):<>
        {ly.ws&&<Polygon positions={ring(s.lat,s.lng,R*1.9,2)} pathOptions={{color:'#168AAD',weight:2,fillOpacity:0}}/>}
        {ly.heat&&heat(s).map((h,i)=><Circle key={i} center={[h.la,h.ln]} radius={R*2.4/5*111000*0.8} pathOptions={{stroke:false,fillColor:heatColor(h.v),fillOpacity:.38}}/>)}
        {ly.shed&&<Polygon positions={ring(s.lat,s.lng,R,1)} pathOptions={{color:'#0F6B57',weight:2.5,fillColor:'#2E9E5B',fillOpacity:.3}}><Tooltip permanent direction="top">{`Probable springshed · ${s.area} km²`}</Tooltip></Polygon>}
        {ly.lin&&[[-1.6,-1.4,1.5,1.2],[-1.5,1.2,1.4,-1.3]].map((l,i)=><Polyline key={i} positions={[[s.lat+l[0]*R,s.lng+l[1]*R],[s.lat+l[2]*R,s.lng+l[3]*R]] as [number,number][]} pathOptions={{color:'#111',weight:1.6,dashArray:'6 6'}}/>)}
        {ly.risk&&[[0.9,0.7,.5],[-0.8,-1.1,.4]].map((q,i)=><Polygon key={i} positions={ring(s.lat+q[0]*R,s.lng+q[1]*R,q[2]*R,i+3)} pathOptions={{color:'#C94A45',weight:1.5,fillColor:'#C94A45',fillOpacity:.35}}><Tooltip>Steep-slope / geological risk (demo)</Tooltip></Polygon>)}
        {ly.sites&&sitesOf(s).map(x=><Marker key={x.id} position={[x.lat,x.lng]} icon={pin(SC[x.type][0],SC[x.type][1])}><Tooltip>{x.id} · {x.type}</Tooltip></Marker>)}
        {ly.springs&&<Marker position={[s.lat,s.lng]} icon={pin('#168AAD','●')}><Tooltip permanent direction="right" offset={[12,0]}>{s.name}</Tooltip></Marker>}</>}
      <Controls c={c} z={z} layers={ly} toggle={toggle}/>
    </MapContainer>
    {!overview&&<Legend/>}<span className="absolute top-3 left-3 z-[1000] bg-white/90 text-[10px] font-bold text-g px-2 py-1 rounded">DEMO LAYERS · NOT VALIDATED</span></div>}
