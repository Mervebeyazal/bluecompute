'use strict';
const $=id=>document.getElementById(id),api=BlueCompute;
let lastResult;
api.sampleJobs.forEach((job,i)=>{
  const row=document.createElement('tr');
  const name=document.createElement('td');name.textContent=job.id;row.append(name);
  ['power','duration','release','deadline'].forEach(key=>{const cell=document.createElement('td'),input=document.createElement('input');input.type='number';input.value=job[key];input.min=key==='release'?0:1;input.max=key==='power'?1000:24;input.dataset.key=key;input.dataset.index=i;input.setAttribute('aria-label',job.id+' '+key);cell.append(input);row.append(cell);});
  $('jobs').append(row);
});
const money=n=>new Intl.NumberFormat('tr-TR',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
function run(){
  try{
    const seed=Number($('seed').value);if(!Number.isInteger(seed)||seed<0||seed>999999)throw Error('Tohum 0–999999 arası tam sayı olmalı.');
    const jobs=api.sampleJobs.map(j=>({...j}));document.querySelectorAll('#jobs input').forEach(i=>{if(i.value.trim()==='')throw Error('İş alanlarını doldurun.');jobs[Number(i.dataset.index)][i.dataset.key]=Number(i.value);});
    const env=api.environment(seed),scenario=$('scenario').value;
    env.forEach(e=>{if(scenario==='limited')e.capacity=Math.round(e.capacity*.65);if(scenario==='hot')e.cooling=Math.round(e.cooling*.65);});
    const fifo=api.schedule(env,jobs,'fifo'),smart=api.schedule(env,jobs,'smart');
    const same=smart.rejected.length===0&&fifo.rejected.length===0;
    const diff=fifo.cost?((fifo.cost-smart.cost)/fifo.cost*100):0;
    $('metrics').innerHTML=[['Akıllı plan maliyeti',money(smart.cost),'Varsayımsal elektrik bedeli'],['Başlangıç planı',money(fifo.cost),'İlk uygun saatte başlatma'],['Maliyet farkı',same?diff.toFixed(1)+'%':'Karşılaştırılamaz',same?'Negatif değer: akıllı plan daha pahalı':'Her iki plan tüm işleri tamamlamadı'],['Tamamlanan işler',smart.planned.length+'/'+jobs.length,'Başlangıç: '+fifo.planned.length+'/'+jobs.length]].map(([title,val,note])=>`<div class="card">${title}<strong>${val}</strong><span>${note}</span></div>`).join('');
    $('chart').innerHTML=env.map((e,h)=>`<div class="bar" title="Saat ${h}: kullanım ${smart.usage[h]} MW; sınır ${Math.min(e.capacity,e.cooling)} MW; fiyat ${e.price} USD/MWh"><div class="fill" style="height:${smart.usage[h]/140*100}%"></div><div class="limit" style="bottom:${Math.min(e.capacity,e.cooling)/140*100}%"></div><small>${h}</small></div>`).join('');
    $('plans').replaceChildren();const grid=document.createElement('div');grid.className='plan-grid';
    [['Başlangıç planı',fifo],['Akıllı plan',smart]].forEach(([title,result])=>{const block=document.createElement('div'),head=document.createElement('h3');head.textContent=title;block.append(head);result.planned.slice().sort((a,b)=>a.start-b.start).forEach(j=>{const p=document.createElement('p');p.className='pill';p.textContent=`${j.id}: ${String(j.start).padStart(2,'0')}:00–${String(j.end).padStart(2,'0')}:00 · ${j.power} MW`;block.append(p);});result.rejected.forEach(j=>{const p=document.createElement('p');p.className='reject';p.textContent=j.id+': Planlanamadı — '+j.reason;block.append(p);});grid.append(block);});$('plans').append(grid);
    lastResult={scenario,seed,environment:env,jobs,fifo,smart};$('error').textContent='';$('download').disabled=false;
  }catch(e){$('error').textContent=e.message;lastResult=null;$('download').disabled=true;}
}
$('run').addEventListener('click',run);
$('download').addEventListener('click',()=>{if(!lastResult)return;const url=URL.createObjectURL(new Blob([JSON.stringify(lastResult,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='bluecompute-results.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
run();
