(function(root){
  'use strict';
  const horizon=24;
  function environment(seed=42){
    let s=seed>>>0; const rand=()=>{s=(1664525*s+1013904223)>>>0;return s/4294967296;};
    return Array.from({length:horizon},(_,hour)=>({hour,capacity:Math.round(95+15*Math.sin(hour/24*Math.PI*2)+rand()*10),cooling:Math.round(90+18*Math.cos(hour/24*Math.PI*2)),price:Math.round(70+40*(hour>=16&&hour<=21)+rand()*25)}));
  }
  const sampleJobs=[
    {id:'Eğitim A',power:35,duration:4,release:0,deadline:12},
    {id:'Eğitim B',power:45,duration:5,release:2,deadline:22},
    {id:'Analiz C',power:25,duration:3,release:4,deadline:10},
    {id:'İşleme D',power:40,duration:4,release:8,deadline:20},
    {id:'Eğitim E',power:50,duration:4,release:10,deadline:24},
    {id:'Analiz F',power:20,duration:2,release:16,deadline:21}
  ];
  function validate(env,jobs){
    if(!Array.isArray(env)||env.length!==24)throw Error('24 saatlik ortam gerekir.');
    env.forEach(x=>{if(![x.capacity,x.cooling,x.price].every(Number.isFinite)||x.capacity<0||x.cooling<0||x.price<0)throw Error('Geçersiz ortam verisi.');});
    const ids=new Set();
    jobs.forEach(j=>{if(!j.id||ids.has(j.id)||!Number.isFinite(j.power)||j.power<=0||![j.duration,j.release,j.deadline].every(Number.isInteger)||j.duration<1||j.release<0||j.deadline>24||j.release+j.duration>j.deadline)throw Error('Geçersiz iş verisi.');ids.add(j.id);});
  }
  function schedule(env,jobs,mode='smart'){
    validate(env,jobs); if(!['smart','fifo'].includes(mode))throw Error('Geçersiz planlama modu.');
    const usage=Array(24).fill(0), planned=[],rejected=[];
    const queue=jobs.map((j,index)=>({...j,index}));
    queue.sort(mode==='smart'?(a,b)=>a.deadline-b.deadline||a.release-b.release||a.index-b.index:(a,b)=>a.release-b.release||a.index-b.index);
    for(const j of queue){
      const candidates=[];
      for(let start=j.release;start+j.duration<=j.deadline;start++){
        let cost=0,feasible=true;
        for(let h=start;h<start+j.duration;h++){
          if(usage[h]+j.power>Math.min(env[h].capacity,env[h].cooling)){feasible=false;break;}
          cost+=j.power*env[h].price;
        }
        if(feasible)candidates.push({start,cost});
      }
      if(!candidates.length){rejected.push({...j,reason:'Süre ve kapasite sınırları içinde uygun aralık yok.'});continue;}
      if(mode==='smart')candidates.sort((a,b)=>a.cost-b.cost||a.start-b.start);
      const chosen=candidates[0];
      for(let h=chosen.start;h<chosen.start+j.duration;h++)usage[h]+=j.power;
      planned.push({...j,...chosen,end:chosen.start+j.duration});
    }
    return {planned,rejected,usage,cost:planned.reduce((s,j)=>s+j.cost,0),energy:usage.reduce((a,b)=>a+b,0),peak:Math.max(...usage)};
  }
  const api={environment,sampleJobs,schedule,validate};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.BlueCompute=api;
})(typeof globalThis!=='undefined'?globalThis:this);
