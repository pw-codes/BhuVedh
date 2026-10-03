export type Spring={id:string;name:string;lat:number;lng:number;elevation:number;discharge:number;seasonality:string;prob:number;area:number;evidence:'Low'|'Medium'|'High';status:string}
export type Site={id:string;lat:number;lng:number;type:'Contour trench'|'Recharge structure'|'Vegetation treatment';suitability:number;risk:'Low'|'Moderate'|'High';confidence:number;reason:string}
export type Layers={heat:boolean;shed:boolean;ws:boolean;springs:boolean;lin:boolean;risk:boolean;sites:boolean}
export type Observation={siteId:string;lat:string;lng:string;rock:string;fractures:string;seepage:string;slope:string;landCover:string;photo:string;notes:string}
