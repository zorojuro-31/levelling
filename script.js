
const KEY='soloSystemV2';
const quests=[['Shadow Pull','Back + Biceps + Grip'],['Iron Push','Chest + Triceps + Shoulders'],['Recovery Quest','20–40 min walk + 10–20 min mobility'],['Iron Legs','Legs + Abs'],['Hunter Upper','Upper Body + V-Taper'],['Recovery Quest','20–40 min walk + 10–20 min mobility'],['Shadow Legs','Lower Body + Core + Athletic work'],['Shadow Upper','Back + Shoulders + Arms'],['Recovery Quest','20–30 min walk + 15–20 min mobility']];
const exerciseData={
'Shadow Pull':[['One-arm DB Row','4 × 8–12 / side','15 kg'],['DB Romanian Deadlift','3 × 8–12','15 kg each'],['DB Pullover','3 × 10–15','10 kg'],['Chest-supported Row','3 × 10–12','10–15 kg'],['Reverse Fly','3 × 12–15','5 kg'],['Alternating Curl','3 × 8–12','10 kg'],['Hammer Curl','3 × 10–12','10 kg'],['Farmer Carry','3 × 30–60 sec','15–20 kg each']],
'Iron Push':[['DB Floor Press','4 × 8–12','15 kg each'],['Push-ups','3 × 8–20','Bodyweight'],['DB Squeeze Press','3 × 10–15','10 kg each'],['DB Floor Fly','2 × 10–15','5 kg each'],['Overhead Triceps Extension','3 × 10–15','10 kg'],['DB Skull Crusher','3 × 8–12','5–10 kg each'],['Close-grip Push-ups','2 × near-failure','Bodyweight']],
'Iron Legs':[['Goblet Squat','4 × 8–15','20 kg'],['Bulgarian Split Squat','3 × 8–12 / leg','10 kg each'],['DB Romanian Deadlift','3 × 8–12','15 kg each'],['Reverse Lunge','3 × 8–12 / leg','10 kg each'],['Standing Calf Raise','4 × 12–20','15–20 kg each'],['Reverse Crunch','3 × 12–20','Bodyweight'],['Weighted Crunch','3 × 10–15','5–10 kg'],['Plank','3 × 30–60 sec','Bodyweight']],
'Hunter Upper':[['One-arm DB Row','3 × 10–12','15 kg'],['DB Floor Press','3 × 8–12','15 kg each'],['DB Pullover','3 × 12–15','10 kg'],['Lateral Raise','3 × 12–20','5 kg'],['Hammer Curl','3 × 10–15','10 kg'],['Overhead Triceps Extension','3 × 10–15','10 kg'],['Push-ups','2 × near-failure','Bodyweight'],['Farmer Carry','2 × 45–60 sec','15–20 kg each']],
'Shadow Legs':[['Bulgarian Split Squat','3 × 10 / leg','10 kg each'],['DB Sumo Squat','3 × 12–15','15–20 kg'],['Single-leg RDL','3 × 8–12 / leg','10 kg'],['Walking Lunge','3 × 10 / leg','10 kg each'],['Calf Raise','3 × 15–20','15–20 kg each'],['Suitcase Carry','3 × 30–60 sec / side','15–20 kg'],['Dead Bug','3 × 8–12 / side','Bodyweight'],['Side Plank','3 × 30–60 sec / side','Bodyweight'],['Bird Dog','2 × 10 / side','Bodyweight']],
'Shadow Upper':[['One-arm DB Row','4 × 8–12','15–20 kg'],['DB Overhead Press','4 × 6–10','10–15 kg each'],['DB Pullover','3 × 10–15','10 kg'],['Lateral Raise','4 × 12–20','5 kg'],['Rear-delt Fly','3 × 12–20','5 kg'],['Hammer Curl','3 × 10–15','10 kg'],['Overhead Triceps Extension','3 × 10–15','10 kg'],['Farmer Carry','2 × 45–60 sec','15–20 kg each']]
};
const ranks=[['E','Awakened',0],['D','Initiate',20],['C','Hunter',30],['B','Elite Hunter',40],['A','Advanced Hunter',50],['S','Shadow Hunter',50]];
function state(){return JSON.parse(localStorage.getItem(KEY)||'{"logs":[],"trial":{},"profile":{"name":"Shadow Hunter"}}')}
function save(s){localStorage.setItem(KEY,JSON.stringify(s));render()}
function xp(){return state().logs.reduce((a,x)=>a+(x.xp||0),0)}
function level(){return Math.floor(xp()/500)+1}
function getRank(t){if(!t)return'E';if(t.push>=50&&t.plank>=180&&t.squat>=40&&t.row>=20&&t.carry>=180)return'S';if(t.push>=40&&t.plank>=150&&t.squat>=30&&t.row>=15&&t.carry>=120)return'A';if(t.push>=30&&t.plank>=120&&t.squat>=25&&t.row>=12&&t.carry>=90)return'C';if(t.push>=20&&t.plank>=90&&t.squat>=20&&t.row>=15&&t.carry>=60)return'D';return'E'}
function streak(s){if(!s.logs.length)return 0;let dates=[...new Set(s.logs.map(x=>x.date))].sort().reverse(),n=1;for(let i=1;i<dates.length;i++){let a=new Date(dates[i-1]),b=new Date(dates[i]);if((a-b)/86400000===1)n++;else break}return n}
function currentDay(s){return s.logs.length%9+1}
function toast(msg){let e=document.getElementById('toast');e.textContent=msg;e.classList.add('show');clearTimeout(window._toast);window._toast=setTimeout(()=>e.classList.remove('show'),2400)}
function syncStepQuest(){
  const steps=+document.getElementById('logSteps').value||0;
  const box=document.getElementById('logStepsQuest');
  if(box) box.checked=steps>=10000;
  updateXpPreview();
}
function updateXpPreview(){
  const workout=document.getElementById('logWorkout')?.checked;
  const mobility=document.getElementById('logMobility')?.checked;
  const stepsQuest=document.getElementById('logStepsQuest')?.checked;
  const progress=document.getElementById('logProgressCheck')?.checked;
  const weight=document.getElementById('logWeightCheck')?.checked;
  const total=(workout?100:0)+(mobility?20:0)+(stepsQuest?20:0)+(progress?25:0)+(weight?50:0);
  const el=document.getElementById('xpPreview');
  if(el) el.textContent=`+${total} XP`;
}
function wireQuestCheckboxes(){
  ['logWorkout','logMobility','logStepsQuest','logProgressCheck','logWeightCheck'].forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.addEventListener('change',updateXpPreview);
  });
  updateXpPreview();
}
function notify(title,text){document.getElementById('noticeTitle').textContent=title;document.getElementById('noticeText').textContent=text;let e=document.getElementById('systemNotice');e.classList.add('show');setTimeout(()=>e.classList.remove('show'),1800)}
function floatXp(amount){let e=document.createElement('div');e.className='xp-float';e.textContent='+'+amount+' XP';e.style.right=(80+Math.random()*100)+'px';e.style.bottom=(90+Math.random()*90)+'px';document.body.appendChild(e);setTimeout(()=>e.remove(),1600)}
function levelUpCheck(oldLevel,newLevel){if(newLevel>oldLevel){let f=document.createElement('div');f.className='level-flash';document.body.appendChild(f);setTimeout(()=>f.remove(),900);notify('LEVEL UP',`Level ${newLevel} unlocked. The System recognizes your growth.`)}}
function rankUpCheck(oldRank,newRank){const order=['E','D','C','B','A','S'];if(order.indexOf(newRank)>order.indexOf(oldRank))notify('RANK UP',`${oldRank} → ${newRank}. New Hunter rank unlocked.`)}
function go(page){document.querySelectorAll('.nav button,.mobile-nav button').forEach(x=>x.classList.toggle('active',x.dataset.page===page));document.querySelectorAll('.page').forEach(p=>p.classList.add('hidden'));document.getElementById('page-'+page).classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'})}
document.querySelectorAll('.nav button,.mobile-nav button').forEach(b=>b.onclick=()=>go(b.dataset.page));
function render(){let s=state(),total=xp(),lvl=level(),r=getRank(s.trial),oldRank=window._rank||r;window._rank=r;document.getElementById('rankTop').textContent=r;document.getElementById('levelTop').textContent=lvl;document.getElementById('xpTop').textContent=total;document.getElementById('xpCard').textContent=total;document.getElementById('nextXp').textContent=(500-total%500)+' XP';document.getElementById('xpBar').style.width=((total%500)/500*100)+'%';document.getElementById('stepDays').textContent=s.logs.filter(x=>x.steps>=10000).length;document.getElementById('streak').textContent=streak(s)+' days';document.getElementById('streakBig').textContent=streak(s)+' days';renderStats(s);renderQuest(s);renderLogs(s);renderQuestList(s);renderStatsDetail(s);renderProgress();renderAchievements(s);renderProfile(s);renderGuide();if(oldRank!==r)rankUpCheck(oldRank,r)}
function renderStats(s){let vals={STR:Math.min(100,Math.round((s.trial.row||0)/20*100)),VIT:Math.min(100,Math.round((s.trial.squat||0)/40*100)),AGI:Math.min(100,Math.round((s.trial.carry||0)/180*100)),DEX:Math.min(100,Math.round((s.trial.mob||0)/100*100)),END:Math.min(100,Math.round((s.trial.push||0)/50*100)),CORE:Math.min(100,Math.round((s.trial.plank||0)/180*100))};document.getElementById('statCards').innerHTML=Object.entries(vals).map(([k,v])=>`<div class="card stat"><div class="label">${k}</div><div class="big">${v}</div><div class="bar"><i style="width:${v}%"></i></div></div>`).join('')}
function renderQuest(s){let d=currentDay(s),[name,focus]=quests[d-1];document.getElementById('currentQuest').innerHTML=`<div class="quest"><div class="day">${d}</div><div class="quest-main"><b>Day ${d} — ${name}</b><small>${focus}</small></div><span class="pill">+100 XP</span></div>`;document.getElementById('systemStatus').innerHTML=`<div class="mini-grid"><div><span class="label">Training Days</span><br><b>${s.logs.filter(x=>x.workout==='Yes'&&x.type!=='Recovery Quest').length}</b></div><div><span class="label">10K Days</span><br><b>${s.logs.filter(x=>x.steps>=10000).length}</b></div><div><span class="label">Streak</span><br><b>${streak(s)} days</b></div><div><span class="label">Cycle</span><br><b>Day ${d}/9</b></div></div><div class="notice" style="margin-top:12px">Next: <b>${name}</b>. Recovery days count as quests too.</div>`;document.getElementById('recentActivity').innerHTML=s.logs.length?s.logs.slice(-6).reverse().map(x=>`<div class="quest done"><div class="day">✓</div><div class="quest-main"><b>${x.date} — Day ${x.day}: ${x.type}</b><small>${Number(x.steps).toLocaleString()} steps · ${x.xp} XP${x.notes?' · '+escapeHtml(x.notes):''}</small></div><span class="pill green">CLEARED</span></div>`).join(''):'<div class="empty">No quests logged yet. Your awakening begins with Day 1.</div>';let next={E:'D',D:'C',C:'B',B:'A',A:'S',S:'S'}[getRank(s.trial)];document.getElementById('nextRank').innerHTML=`<b>${getRank(s.trial)} → ${next}</b><div class="muted small">Update your Rank Trial after every 3 cycles.</div>`}
function renderQuestList(s){let current=currentDay(s);document.getElementById('questList').innerHTML=quests.map((q,i)=>`<div class="quest ${i+1===current?'done':''}"><div class="day">${i+1}</div><div class="quest-main"><b>${q[0]}</b><small>${q[1]}</small></div><span class="pill ${i+1===current?'green':''}">${i+1===current?'NEXT':'+100 XP'}</span></div>`).join('')}
function renderLogs(s){document.getElementById('logTable').innerHTML=s.logs.length?s.logs.slice().reverse().map(x=>`<tr><td>${x.date}</td><td>${x.day}</td><td>${x.type}</td><td>${x.workout}</td><td>${Number(x.steps).toLocaleString()}</td><td><b>${x.xp}</b></td><td>${escapeHtml(x.notes||'')}</td></tr>`).join(''):'<tr><td colspan="7" class="empty">No logs yet.</td></tr>'}
function renderStatsDetail(s){let t=s.trial||{},r=getRank(t);document.getElementById('rankBig').textContent=r;[['rPush','push'],['rPlank','plank'],['rSquat','squat'],['rRow','row'],['rCarry','carry'],['rBulg','bulg'],['rSide','side'],['rMob','mob']].forEach(([id,k])=>document.getElementById(id).value=t[k]||0);let target={push:50,plank:180,squat:40,row:20,carry:180};let avg=Object.entries(target).reduce((a,[k,v])=>a+Math.min(100,(t[k]||0)/v*100),0)/5;document.getElementById('rankRing').style.setProperty('--progress',avg+'%');document.getElementById('rankMessage').textContent=r==='S'?'Shadow Hunter. The final rank is yours.':`Progress toward S-Rank: ${Math.round(avg)}%`;document.getElementById('statsDetail').innerHTML=Object.entries(target).map(([k,v])=>`<div style="margin:12px 0"><div style="display:flex;justify-content:space-between"><b>${k.toUpperCase()}</b><span>${t[k]||0} / ${v}</span></div><div class="bar"><i style="width:${Math.min(100,(t[k]||0)/v*100)}%"></i></div></div>`).join('');document.getElementById('rankRequirements').innerHTML=[['D',20,90,20,15,60],['C',30,120,25,12,90],['B',40,150,30,15,120],['A',50,180,40,20,180],['S',50,180,40,20,180]].map(x=>`<div class="quest"><div class="day">${x[0]}</div><div class="quest-main"><b>${x[0]} Rank</b><small>Push ${x[1]} · Plank ${x[2]}s · Squat ${x[3]} · Row ${x[4]} · Carry ${x[5]}s</small></div></div>`).join('')}
function renderProgress(){let s=state(),sel=document.getElementById('exerciseSelect');if(!sel)return;let all=[];Object.values(exerciseData).forEach(a=>a.forEach(x=>{if(!all.includes(x[0]))all.push(x[0])}));if(!sel.options.length)all.forEach(x=>{let o=document.createElement('option');o.value=x;o.textContent=x;sel.appendChild(o)});let ex=sel.value||all[0], records=s.logs.flatMap(l=>(l.exercises||[]).filter(e=>e.name===ex).map(e=>({...e,date:l.date})));document.getElementById('exerciseProgress').innerHTML=records.length?`<div class="table-wrap"><table class="table"><thead><tr><th>Date</th><th>Weight</th><th>Reps</th><th>RIR</th></tr></thead><tbody>${records.slice(-12).reverse().map(x=>`<tr><td>${x.date}</td><td>${x.weight||'—'}</td><td>${x.reps||'—'}</td><td>${x.rir||'—'}</td></tr>`).join('')}</tbody></table></div>`:`<div class="empty">No exercise-level records yet. Use the quick progression log below to start tracking a movement.</div><div class="actions"><button class="btn primary" onclick="openExerciseLogger()">+ Log Exercise</button></div>`;let hist=s.logs.slice(-14).map(x=>`<div class="quest"><div class="day">+${x.xp}</div><div class="quest-main"><b>${x.date}</b><small>Day ${x.day} · ${x.type}</small></div></div>`).join('');document.getElementById('xpHistory').innerHTML=hist||'<div class="empty">No XP history yet.</div>'}
function achievements(s){let total=xp(),logs=s.logs,stepDays=logs.filter(x=>x.steps>=10000).length,arr=[['🌑','Awakening','Complete your first quest',logs.length>=1],['⚔','First Blood','Complete 5 quests',logs.length>=5],['🔥','Unbroken','Maintain a 3-day streak',streak(s)>=3],['🚶','Walker of Worlds','Hit 10K steps on 7 logged days',stepDays>=7],['⭐','Level 5','Reach Level 5',level()>=5],['👑','Hunter','Reach C Rank',getRank(s.trial)==='C'||['B','A','S'].includes(getRank(s.trial))],['💜','Elite','Reach B Rank',getRank(s.trial)==='B'||['A','S'].includes(getRank(s.trial))],['🌌','Shadow Monarch','Reach S Rank',getRank(s.trial)==='S']];return arr}
function renderAchievements(s){let arr=achievements(s),html=arr.map(a=>`<div class="achievement ${a[3]?'unlocked':'locked'}"><div class="icon">${a[0]}</div><div><b>${a[1]}</b><div class="muted small">${a[2]}</div></div><span class="pill ${a[3]?'green':''}" style="margin-left:auto">${a[3]?'UNLOCKED':'LOCKED'}</span></div>`).join('');document.getElementById('achievements').innerHTML=html;document.getElementById('achievementMini').innerHTML=arr.filter(a=>a[3]).slice(-2).map(a=>`<div class="achievement unlocked"><div class="icon">${a[0]}</div><div><b>${a[1]}</b><div class="muted small">Unlocked</div></div></div>`).join('')||'<div class="muted small">Your first achievement awaits.</div>'}
function renderProfile(s){document.getElementById('profileName').textContent=s.profile?.name||'Shadow Hunter';document.getElementById('profileLevel').textContent=level();document.getElementById('profileRank').textContent=getRank(s.trial);document.getElementById('profileXp').textContent=xp();document.getElementById('profileTraining').textContent=s.logs.filter(x=>x.workout==='Yes'&&x.type!=='Recovery Quest').length}
function renderGuide(){let html='';quests.forEach(([name,focus],i)=>{if(name==='Recovery Quest'){html+=`<h3>Day ${i+1} — ${name}</h3><p class="muted">${focus}. No hard resistance training.</p>`;return}html+=`<h3>Day ${i+1} — ${name}</h3><p class="muted">${focus}</p><div class="table-wrap"><table class="table"><thead><tr><th>Exercise</th><th>Sets × Reps</th><th>Starting Load</th></tr></thead><tbody>${exerciseData[name].map(x=>`<tr><td>${x[0]}</td><td>${x[1]}</td><td>${x[2]}</td></tr>`).join('')}</tbody></table></div>`});document.getElementById('guide').innerHTML=html}
function addLog(){
  let s=state(),oldLvl=level(),oldRank=getRank(s.trial);
  let day=+document.getElementById('logDay').value,date=document.getElementById('logDate').value||today();
  let workout=document.getElementById('logWorkout').checked?'Yes':'No';
  let mobility=document.getElementById('logMobility').checked?'Yes':'No';
  let steps=+document.getElementById('logSteps').value||0;
  let stepsQuest=document.getElementById('logStepsQuest').checked;
  let progress=document.getElementById('logProgressCheck').checked?25:0;
  let weight=document.getElementById('logWeightCheck').checked?50:0;
  let notes=document.getElementById('logNotes').value;
  let type=quests[day-1][0];
  let base=workout==='Yes'?100:0;
  if(type==='Recovery Quest' && workout==='Yes') base=100;
  let stepXp=stepsQuest?20:0;
  let mobilityXp=mobility==='Yes'?20:0;
  let total=base+stepXp+mobilityXp+progress+weight;
  s.logs.push({date,day,type,workout,mobility,steps,stepsQuest,xp:total,progress,weight,notes});
  save(s);
  floatXp(total);
  notify('QUEST LOGGED',`Day ${day} — ${type} · +${total} XP`);
  if(stepsQuest) toast('10K STEPS QUEST CLEARED · +20 XP');
  setTimeout(()=>levelUpCheck(oldLvl,level()),450);
  setTimeout(()=>rankUpCheck(oldRank,getRank(s.trial)),650);
  resetLogForm(false)
}
function saveTrial(){let s=state(),old=getRank(s.trial);s.trial={push:+rPush.value||0,plank:+rPlank.value||0,squat:+rSquat.value||0,row:+rRow.value||0,carry:+rCarry.value||0,bulg:+rBulg.value||0,side:+rSide.value||0,mob:+rMob.value||0};let r=getRank(s.trial);save(s);toast('Rank Trial saved. System recalculated.');if(r!==old)rankUpCheck(old,r)}
function resetLogForm(clearDay=true){
  logDate.value=today();
  if(clearDay) logDay.value=currentDay(state());
  logWorkout.checked=true;
  logMobility.checked=true;
  logStepsQuest.checked=false;
  logProgressCheck.checked=false;
  logWeightCheck.checked=false;
  logSteps.value=0;
  logNotes.value='';
  updateXpPreview();
}
function openExerciseLogger(){let name=document.getElementById('exerciseSelect').value||'One-arm DB Row';let reps=prompt(`Reps for ${name}:`);if(reps===null)return;let weight=prompt(`Weight/load for ${name}:`);if(weight===null)return;let s=state();let d=currentDay(s);let l=s.logs[s.logs.length-1];if(!l||l.date!==today()){toast('Log the daily quest first, then add exercise details.');return}l.exercises=l.exercises||[];l.exercises.push({name,reps,weight,rir:''});save(s);toast(`${name} progression saved.`)}
function resetAll(){if(confirm('Reset all Solo System data? This cannot be undone.')){localStorage.removeItem(KEY);location.reload()}}
function today(){return new Date().toISOString().slice(0,10)}
function escapeHtml(v){return String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
for(let i=1;i<=9;i++){let o=document.createElement('option');o.value=i;o.textContent=`Day ${i} — ${quests[i-1][0]}`;logDay.appendChild(o)}
logDate.value=today();logDay.value=currentDay(state());wireQuestCheckboxes();render();
