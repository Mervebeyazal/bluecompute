const assert=require('node:assert/strict');
const {environment,sampleJobs,schedule}=require('./engine');
for(let seed=0;seed<100;seed++)for(const factor of [1,.65])for(const mode of ['fifo','smart']){
  const env=environment(seed).map(e=>({...e,capacity:e.capacity*factor})),r=schedule(env,sampleJobs,mode);
  assert.equal(r.planned.length+r.rejected.length,sampleJobs.length);
  r.usage.forEach((p,h)=>assert.ok(p<=Math.min(env[h].capacity,env[h].cooling)+1e-9));
  r.planned.forEach(j=>{assert.ok(j.start>=j.release);assert.ok(j.end<=j.deadline);assert.equal(j.end-j.start,j.duration);});
  assert.equal(r.energy,r.planned.reduce((s,j)=>s+j.power*j.duration,0));
  assert.equal(r.cost,r.usage.reduce((s,p,h)=>s+p*env[h].price,0));
}
const flat=Array.from({length:24},(_,h)=>({capacity:10,cooling:10,price:h===5?1:10}));
assert.equal(schedule(flat,[{id:'x',power:10,duration:1,release:0,deadline:10}]).planned[0].start,5);
assert.equal(schedule(flat,[{id:'x',power:11,duration:1,release:0,deadline:10}]).rejected.length,1);
assert.throws(()=>schedule(flat,[{id:'x',power:1,duration:0,release:0,deadline:1}]));
assert.deepEqual(environment(42),environment(42));
console.log('Passed: 400 scenario/mode combinations, capacity/deadline/energy/cost invariants, cheapest slot, infeasible job, validation and reproducibility.');
