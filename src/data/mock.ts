// DEMO DATA ONLY — replace with FastAPI/GeoJSON responses later.
import type {Spring,Site} from '../types'
type T=[string,string,number,number,number,number,string,number,number,Spring['evidence'],string]
const raw:T[]=[
['s1','Chaukori Naula 25',29.832,80.001,1840,4.2,'Perennial',82,12.4,'Medium','Field validation required'],
['s2','Bhatkot Naula 34',29.781,79.931,1620,3.1,'Perennial',76,9.8,'Medium','Analysis complete'],
['s3','Kafalta Naula 11',29.742,80.052,1510,1.8,'Seasonal',61,7.2,'Low','Analysis complete'],
['s4','Dhaula Naula 6',29.885,79.962,1730,1.4,'Seasonal',58,6.5,'Low','Analysis complete'],
['s5','Thal Dhara 18',29.912,80.083,1950,2.9,'Perennial',71,8.9,'Medium','Analysis complete'],
['s6','Berinag Naula 9',29.796,80.058,1580,2.2,'Seasonal',67,8.1,'Medium','Analysis complete'],
['s7','Jhuni Dhara 14',29.704,79.902,1390,0.9,'Seasonal',54,5.9,'Low','Analysis complete'],
['s8','Sarmoli Naula 2',29.868,80.131,2010,3.6,'Perennial',79,10.6,'High','Field validation required'],
['s9','Munsiari Dhara 21',29.953,80.021,2180,2.5,'Perennial',69,8.4,'Medium','Analysis complete'],
['s10','Gangolihat Naula 8',29.654,79.987,1470,1.1,'Seasonal',49,5.2,'Low','Analysis complete']]
export const springs:Spring[]=raw.map(r=>({id:r[0],name:r[1],lat:r[2],lng:r[3],elevation:r[4],discharge:r[5],seasonality:r[6],prob:r[7],area:r[8],evidence:r[9],status:r[10]}))
export const radius=(s:Spring)=>Math.sqrt(s.area/Math.PI)/111
export const ring=(lat:number,lng:number,r:number,seed=1):[number,number][]=>Array.from({length:16},(_,i)=>{const a=i/16*2*Math.PI;const k=r*(1+0.25*Math.sin(a*3+seed)+0.15*Math.cos(a*2+seed*2));return [lat+k*Math.sin(a),lng+k*Math.cos(a)*1.1] as [number,number]})
export const heat=(s:Spring)=>{const R=radius(s)*2.4,out:{la:number;ln:number;v:number}[]=[];for(let i=-5;i<=5;i++)for(let j=-5;j<=5;j++){const d=Math.hypot(i,j)/7;out.push({la:s.lat+i*R/5,ln:s.lng+j*R/5*1.1,v:Math.max(0.05,Math.min(1,s.prob/100*(1.1-d)+0.12*Math.sin(i*1.7+j*1.3)))})}return out}
export const heatColor=(v:number)=>v<0.4?'#f4e27a':v<0.65?'#f0a43a':'#3f9b4f'
export const factors=(p:number):[string,number][]=>[['Terrain',p+8],['Lineament proximity',p-3],['Rainfall',p-18],['Soil',p-26],['Land cover',p-40]]
export const level=(v:number)=>(v>=70?'High':v>=50?'Moderate':'Lower')+' contribution'
export const sitesOf=(s:Spring):Site[]=>{const R=radius(s),T:Site['type'][]=['Contour trench','Recharge structure','Vegetation treatment','Contour trench'],K:Site['risk'][]=['Low','Low','Moderate','Moderate'],W=['Moderate slope + favorable infiltration conditions + location inside probable recharge area.','Runoff concentration area with permeable soil close to a lineament.','Degraded cover on upper slope; vegetation can improve infiltration.','Gentle bench near springshed edge; slope needs field check.'];return T.map((type,i)=>{const a=i*1.6+0.7;return{id:`R-${String(7+i).padStart(2,'0')}`,lat:s.lat+R*0.7*Math.sin(a),lng:s.lng+R*0.8*Math.cos(a),type,suitability:s.prob+5-i*4,risk:K[i],confidence:s.prob-1-i*3,reason:W[i]}})}
