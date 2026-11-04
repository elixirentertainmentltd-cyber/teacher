export type NoiseState = { pressure: number; recovery: number; retreatClock: number; tooLoud: boolean };
export const calmNoise = (): NoiseState => ({pressure:0,recovery:0,retreatClock:0,tooLoud:false});
/** A knock is tolerated; sustained noise triggers a retreat, then another retreat signal every five noisy seconds. */
export function advanceNoise(previous:NoiseState,level:number,goal:number,seconds:number,retreatMode:boolean){
 const state={...previous};let retreat=false;
 const delta=Math.max(0,Math.min(seconds,1));const excessive=level>goal;
 if(!state.tooLoud){
  state.pressure=Math.max(0,Math.min(6,state.pressure+(excessive?(1+Math.pow((level-goal)/12,2))*delta:-1.4*delta)));
  if(state.pressure>=6){state.tooLoud=true;state.recovery=0;state.retreatClock=0;retreat=retreatMode;}
 }else{
  state.recovery=excessive?0:state.recovery+delta;
  state.retreatClock=excessive?state.retreatClock+delta:0;
  if(retreatMode&&state.retreatClock>=5){retreat=true;state.retreatClock=0;}
  if(state.recovery>=3)return {state:calmNoise(),retreat:false};
 }
 return {state,retreat};
}
