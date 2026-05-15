import { useState, useEffect } from "react";

const C = {
  bg:"#09090F", surface:"#0F0F1A", card:"#141422", border:"#1C1C2E",
  ink:"#EEEEF8", muted:"#5A5A7A", dim:"#3A3A55",
  amber:"#F5B944", amberSoft:"#F5B94420",
  green:"#22D99A", greenSoft:"#22D99A18",
  red:"#F04A2A", redSoft:"#F04A2A18",
  teal:"#2DD4F0",
  white:"#FFFFFF",
};
const FH="'Barlow Condensed','Impact','Arial Narrow',sans-serif";
const FB="'DM Sans','Trebuchet MS',sans-serif";
const FM="'DM Mono','Courier New',monospace";

const GOALS = {
  performance:{ label:"Performance", icon:"⚡", desc:"Fuel to go harder",   mult:1.00 },
  maintain:   { label:"Maintain",    icon:"⚖️", desc:"Sustain body weight", mult:0.82 },
  fat_loss:   { label:"Fat Loss",    icon:"🔥", desc:"Lean while training", mult:0.67 },
};

const SESSIONS = {
  hyrox_comp: { label:"Hyrox Comp",   icon:"🥇", sub:"Race day",           carbPer:[1.10,1.50,1.90], badge:"COMPETITION" },
  hyrox:      { label:"Hyrox Train",  icon:"🏋️", sub:"~60–90 min hybrid",  carbPer:[0.80,1.20,1.55] },
  crossfit:   { label:"CrossFit",     icon:"⚡", sub:"~60 min WOD",        carbPer:[0.70,1.05,1.35] },
  pt_session: { label:"PT Session",   icon:"💪", sub:"~45–60 min",         carbPer:[0.60,1.00,1.30] },
  cardio45:   { label:"Cardio",       icon:"🏃", sub:"~45 min",            carbPer:[0.55,0.90,1.15] },
  cardio30:   { label:"Cardio",       icon:"🚴", sub:"~30 min",            carbPer:[0.38,0.65,0.90] },
  run5k:      { label:"5K Run",       icon:"👟", sub:"~20–35 min",         carbPer:[0.32,0.58,0.78] },
  run10k:     { label:"10K Run",      icon:"🏅", sub:"~45–70 min",         carbPer:[0.55,0.90,1.15] },
  run15k:     { label:"15K Run",      icon:"🏃", sub:"~75–110 min",        carbPer:[0.80,1.15,1.50] },
  run20k:     { label:"20K Run",      icon:"🎽", sub:"~100–140 min",       carbPer:[1.00,1.40,1.80] },
};

const TIMING = {
  t30: { label:"30 min away",  icon:"🔴", type:"fast",  note:"Fast carbs only"  },
  t90: { label:"1–2 hrs away", icon:"🟡", type:"mixed", note:"Fast & moderate"  },
  t180:{ label:"2–3 hrs away", icon:"🟢", type:"slow",  note:"Full meal window" },
};

const TIMEOFDAY = {
  morning: { label:"Morning",   icon:"🌅", sub:"Before 10am",  note:"Quick & easy, minimal prep" },
  midday:  { label:"Lunchtime", icon:"☀️", sub:"10am – 3pm",   note:"More time & options available" },
  evening: { label:"Evening",   icon:"🌙", sub:"After 3pm",    note:"Full flexibility, bigger meals ok" },
};

const ALREADY_EATEN = {
  good:  { label:"Yes, a good amount", icon:"✅", desc:"Meals with rice, pasta, oats or bread today",  topup:0.30 },
  little:{ label:"Yes, a little",      icon:"🟡", desc:"A snack or light meal but not much",           topup:0.60 },
  none:  { label:"Not yet",            icon:"❌", desc:"Haven't really eaten carbs today",              topup:1.00 },
};

const INTENSITY = {
  easy:  { label:"Easy",     icon:"😌", desc:"Comfortable, could hold a conversation", mod:-0.10 },
  mod:   { label:"Moderate", icon:"😤", desc:"Working hard, breathing heavily",        mod: 0    },
  hard:  { label:"Hard",     icon:"🔥", desc:"Max effort, competition level",          mod:+0.12 },
};

const ALL_FOODS = [
  { id:"banana",      name:"Banana",                emoji:"🍌", carbs:27, type:"fast",    cal:105, note:"Medium banana · easy on the gut" },
  { id:"dates",       name:"Medjool Dates",          emoji:"🫐", carbs:18, type:"fast",    cal:66,  note:"3 dates · natural quick energy" },
  { id:"ricecakes",   name:"Rice Cakes",             emoji:"🍘", carbs:28, type:"fast",    cal:114, note:"4 cakes · low fibre, pre-session staple" },
  { id:"whitebread",  name:"White Bread",            emoji:"🍞", carbs:30, type:"fast",    cal:160, note:"2 slices · fast-digesting" },
  { id:"sportsgel",   name:"Energy Gel",             emoji:"🧃", carbs:22, type:"fast",    cal:85,  note:"1 gel · pure race fuel" },
  { id:"sportsdrink", name:"Sports Drink",           emoji:"🥤", carbs:30, type:"fast",    cal:120, note:"500ml · carbs + electrolytes" },
  { id:"raisins",     name:"Raisins",                emoji:"🍇", carbs:32, type:"fast",    cal:130, note:"40g handful · portable & quick" },
  { id:"honey",       name:"Honey on Toast",         emoji:"🍯", carbs:35, type:"fast",    cal:155, note:"1 slice + tbsp honey" },
  { id:"fruitjuice",  name:"Orange Juice",           emoji:"🍊", carbs:26, type:"fast",    cal:110, note:"250ml · quick glucose hit" },
  { id:"malt_loaf",   name:"Malt Loaf",              emoji:"🍫", carbs:40, type:"fast",    cal:175, note:"2 slices · classic runner's fuel" },
  { id:"toast_jam",   name:"Toast & Jam",            emoji:"🍞", carbs:52, type:"both",    cal:230, note:"2 slices · fast + moderate" },
  { id:"banana_oat",  name:"Banana + Oats",          emoji:"🍌", carbs:81, type:"both",    cal:405, note:"Classic pre-workout combo" },
  { id:"wrap",        name:"Tortilla Wrap",           emoji:"🌯", carbs:45, type:"both",    cal:220, note:"1 large · versatile, easy to prep" },
  { id:"cereal",      name:"Sugary Cereal",           emoji:"🥣", carbs:50, type:"both",    cal:210, note:"60g · quick, low fibre" },
  { id:"pancakes",    name:"Pancakes",               emoji:"🥞", carbs:48, type:"both",    cal:250, note:"2 medium · great 1–2 hrs before" },
  { id:"oats",        name:"Porridge Oats",           emoji:"🥣", carbs:54, type:"slow",    cal:300, note:"100g dry · sustained release" },
  { id:"rice",        name:"White Rice",              emoji:"🍚", carbs:56, type:"slow",    cal:260, note:"200g cooked · steady fuel" },
  { id:"pasta",       name:"Pasta",                  emoji:"🍝", carbs:60, type:"slow",    cal:280, note:"100g dry · classic carb load" },
  { id:"sweetpot",    name:"Sweet Potato",           emoji:"🍠", carbs:30, type:"slow",    cal:130, note:"150g · nutrient-dense" },
  { id:"bagel",       name:"Bagel",                  emoji:"🥯", carbs:55, type:"slow",    cal:270, note:"1 large · high carb, low fibre" },
  { id:"warb_bagel",  name:"Warburtons Thick Bagel", emoji:"🥯", carbs:65, type:"slow",    cal:310, note:"1 thick bagel · extra carbs, great pre-session" },
  { id:"noodles",     name:"Rice Noodles",           emoji:"🍜", carbs:50, type:"slow",    cal:220, note:"100g dry · easy on digestion" },
  { id:"sourdough",   name:"Sourdough Bread",        emoji:"🍞", carbs:46, type:"slow",    cal:230, note:"2 thick slices · slower release" },
  { id:"risotto",     name:"Risotto Rice",           emoji:"🍚", carbs:58, type:"slow",    cal:270, note:"200g cooked · creamy carb load" },
  { id:"soreen",      name:"Soreen Malt Loaf",       emoji:"🍫", carbs:38, type:"morning", cal:165, note:"2 slices · no prep needed, great on the go" },
  { id:"jam_ricecake",name:"Jam on Rice Cakes",      emoji:"🍘", carbs:36, type:"morning", cal:145, note:"4 cakes + jam · dead simple, fast carbs" },
  { id:"cereal_bar",  name:"Cereal Bar",             emoji:"🍬", carbs:30, type:"morning", cal:135, note:"1 bar · grab & go, no fuss" },
  { id:"honey_bagel", name:"Bagel with Honey",       emoji:"🥯", carbs:62, type:"morning", cal:280, note:"1 bagel + tbsp honey · quick & high carb" },
  { id:"fruit_pouch", name:"Fruit Pouch",            emoji:"🍓", carbs:20, type:"morning", cal:80,  note:"1 pouch · pure quick carbs, zero effort" },
];

function getFoods(timingKey, todKey) {
  const { type } = TIMING[timingKey];
  if (todKey === "morning") return ALL_FOODS.filter(f => f.type === "morning" || f.type === "fast");
  if (type==="fast")  return ALL_FOODS.filter(f=>f.type==="fast");
  if (type==="slow")  return ALL_FOODS.filter(f=>f.type==="slow"||f.type==="both");
  return ALL_FOODS.filter(f=>f.type==="fast"||f.type==="both");
}

function calcCarbs(weightKg, sessionKey, goalKey, intensityKey, topupMult=1.0) {
  const [lo,mid,hi] = SESSIONS[sessionKey].carbPer;
  const gm = GOALS[goalKey].mult;
  const im = INTENSITY[intensityKey].mod;
  return {
    low:  Math.round(lo  * weightKg * gm * topupMult),
    med:  Math.round(mid * weightKg * Math.max(gm + im, 0.3) * topupMult),
    high: Math.round(hi  * weightKg * Math.max(gm + im, 0.3) * topupMult),
  };
}

const STEPS = [
  { id:"unit",        title:"What unit do you use?",             type:"choice2",
    options:[{val:"kg",label:"Kilograms",icon:"🇬🇧",sub:"kg"},{val:"lbs",label:"Pounds",icon:"🇺🇸",sub:"lbs"}] },
  { id:"weight",      title:"What's your bodyweight?",           type:"number" },
  { id:"session",     title:"What's today's session?",           type:"sgrid" },
  { id:"intensity",   title:"How hard is today's session?",      type:"igrid" },
  { id:"timing",      title:"How long until you train?",         type:"tgrid" },
  { id:"timeofday",   title:"What time of day is your session?", type:"todgrid" },
  { id:"alreadyeaten",title:"Have you eaten carbs today?",       type:"aegrid", skipIf:"morning" },
];

function AnimCount({ to, duration=700 }) {
  const [val,setVal]=useState(0);
  useEffect(()=>{
    let start;
    const tick=ts=>{
      if(!start)start=ts;
      const p=Math.min((ts-start)/duration,1);
      const e=1-Math.pow(1-p,4);
      setVal(Math.round(to*e));
      if(p<1)requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  },[to]);
  return <>{val}</>;
}

function TCMLogo() {
  return (
    <div style={{display:"flex",alignItems:"center",gap:8,userSelect:"none"}}>
      <div style={{width:30,height:30,borderRadius:7,background:`linear-gradient(135deg,${C.amber},${C.red})`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
          <path d="M3 8L8 3L13 8L8 13Z" fill="white" opacity="0.9"/>
          <circle cx="8" cy="8" r="2.2" fill="white"/>
        </svg>
      </div>
      <div style={{lineHeight:1}}>
        <div style={{fontFamily:FH,fontSize:13,fontWeight:700,color:C.ink,letterSpacing:2.5,textTransform:"uppercase"}}>The Consistency</div>
        <div style={{fontFamily:FM,fontSize:9,color:C.amber,letterSpacing:3,textTransform:"uppercase",marginTop:1}}>Method</div>
      </div>
    </div>
  );
}

function Dots({step,total}) {
  return (
    <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:26}}>
      {Array.from({length:total}).map((_,i)=>(
        <div key={i} style={{height:3,borderRadius:2,width:i===step?24:8,background:i<=step?C.amber:C.border,transition:"all .35s cubic-bezier(.4,0,.2,1)",opacity:i>step?0.4:1}}/>
      ))}
      <span style={{marginLeft:6,fontSize:11,color:C.muted,fontFamily:FM}}>{step+1}/{total}</span>
    </div>
  );
}

function MealBuilder({ target, foods, accentColor }) {
  const [selected, setSelected] = useState({});
  const total = Object.entries(selected).reduce((sum,[id,qty])=>{
    const f = foods.find(x=>x.id===id);
    return f ? sum + f.carbs*qty : sum;
  }, 0);
  const pct = Math.min(total/target,1);
  const over = total > target;
  const remaining = target - total;

  function toggle(id) {
    setSelected(s=>{ if(s[id]){const n={...s};delete n[id];return n;} return {...s,[id]:1}; });
  }
  function changeQty(id, delta) {
    setSelected(s=>{ const cur=s[id]||0; const next=cur+delta; if(next<=0){const n={...s};delete n[id];return n;} return {...s,[id]:next}; });
  }

  return (
    <div>
      <div style={{marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:8}}>
          <div style={{fontFamily:FH,fontSize:18,fontWeight:800,color:C.ink}}>Build Your Meal</div>
          <div style={{fontFamily:FM,fontSize:11,color:over?C.red:C.muted}}>
            {over?`+${total-target}g over`:remaining===0?"✓ On target!":`${remaining}g to go`}
          </div>
        </div>
        <div style={{height:8,background:C.border,borderRadius:4,overflow:"hidden"}}>
          <div style={{height:"100%",borderRadius:4,width:`${pct*100}%`,background:over?C.red:pct>=0.9?C.green:accentColor,transition:"width .3s ease"}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:5}}>
          <div style={{fontFamily:FM,fontSize:11,color:accentColor,fontWeight:700}}>{total}g selected</div>
          <div style={{fontFamily:FM,fontSize:11,color:C.muted}}>target: {target}g</div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
        {foods.map(f=>{
          const qty=selected[f.id]||0;
          const isOn=qty>0;
          return (
            <div key={f.id} onClick={()=>!isOn&&toggle(f.id)}
              style={{background:isOn?`${accentColor}15`:C.card,border:`1.5px solid ${isOn?accentColor:C.border}`,borderRadius:14,padding:"12px",cursor:isOn?"default":"pointer",transition:"all .18s"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                <span style={{fontSize:22}}>{f.emoji}</span>
                <span style={{fontFamily:FH,fontSize:20,fontWeight:800,color:isOn?accentColor:C.muted,lineHeight:1}}>{f.carbs*qty||f.carbs}g</span>
              </div>
              <div style={{fontFamily:FH,fontSize:13,fontWeight:700,color:C.ink,marginBottom:2}}>{f.name}</div>
              <div style={{fontFamily:FM,fontSize:9,color:C.muted,lineHeight:1.3,marginBottom:8}}>{f.note}</div>
              {isOn?(
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <button onClick={e=>{e.stopPropagation();changeQty(f.id,-1);}} style={{width:28,height:28,borderRadius:8,border:`1px solid ${accentColor}`,background:"transparent",color:accentColor,fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>−</button>
                  <span style={{fontFamily:FH,fontSize:16,fontWeight:700,color:C.ink}}>×{qty}</span>
                  <button onClick={e=>{e.stopPropagation();changeQty(f.id,+1);}} style={{width:28,height:28,borderRadius:8,border:`1px solid ${accentColor}`,background:accentColor,color:C.white,fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>+</button>
                </div>
              ):(
                <div style={{fontFamily:FM,fontSize:9,color:accentColor,letterSpacing:1,textTransform:"uppercase"}}>+ Add</div>
              )}
            </div>
          );
        })}
      </div>
      {Object.keys(selected).length>0&&(
        <button onClick={()=>setSelected({})} style={{background:"none",border:"none",color:C.muted,fontSize:11,cursor:"pointer",fontFamily:FM,letterSpacing:1,textTransform:"uppercase",padding:"4px 0"}}>✕ Clear all</button>
      )}
    </div>
  );
}

export default function App() {
  const [step,setStep]       = useState(0);
  const [answers,setAnswers] = useState({});
  const [numVal,setNumVal]   = useState("");
  const [err,setErr]         = useState("");
  const [goal,setGoal]       = useState("performance");
  const [level,setLevel]     = useState("med");
  const [done,setDone]       = useState(false);

  const cur = STEPS[step];

  function advance(key,val) {
    const next={...answers,[key]:val};
    setAnswers(next);
    let nextStep = step + 1;
    if (nextStep < STEPS.length && STEPS[nextStep].id === "alreadyeaten" && next.timeofday === "morning") {
      nextStep++;
    }
    if(nextStep < STEPS.length) setStep(nextStep);
    else setDone(true);
  }

  function handleNum() {
    const raw=Number(numVal);
    const unit=answers.unit||"kg";
    const weightKg=unit==="lbs"?Math.round(raw/2.205):raw;
    const min=unit==="lbs"?77:35, max=unit==="lbs"?440:200;
    if(!numVal||isNaN(raw)||raw<min||raw>max){setErr(`Enter a value between ${min}–${max} ${unit}`);return;}
    setErr(""); setNumVal(""); advance("weight",weightKg);
  }

  function restart() {
    setStep(0);setAnswers({});setNumVal("");setErr("");
    setGoal("performance");setLevel("med");setDone(false);
  }

  const weightKg   = answers.weight||70;
  const sessionKey = answers.session||"crossfit";
  const intensKey  = answers.intensity||"mod";
  const isMorning  = answers.timeofday === "morning";
  const topupMult  = (!isMorning && answers.alreadyeaten && ALREADY_EATEN[answers.alreadyeaten]) ? ALREADY_EATEN[answers.alreadyeaten].topup : 1.0;
  const carbs      = done ? calcCarbs(weightKg,sessionKey,goal,intensKey,topupMult) : null;
  const LC={low:C.amber,med:C.green,high:C.red};
  const LL={low:"LOW",med:"MEDIUM",high:"HIGH"};
  const LD={
    low:"Lighter days or easing into pre-session fuelling",
    med:"Your everyday baseline — start here",
    high:"Hard sessions, back-to-back training or competition prep",
  };
  const foods=done?getFoods(answers.timing||"t90",answers.timeofday||"midday"):[];
  const sess=done?SESSIONS[sessionKey]:null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html,body{background:${C.bg};min-height:100vh;}
        input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;}
        input[type=number]{-moz-appearance:textfield;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .si{animation:fadeUp .32s ease both;}
        .bg:hover{border-color:${C.amber} !important;background:${C.amberSoft} !important;}
        button{font-family:${FB};}
      `}</style>

      <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",fontFamily:FB,padding:"0 16px 64px"}}>
        <div style={{width:"100%",maxWidth:580,display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 0 22px",borderBottom:`1px solid ${C.border}`,marginBottom:32}}>
          <TCMLogo/>
          <div style={{fontFamily:FM,fontSize:9,color:C.muted,letterSpacing:2.5,textTransform:"uppercase"}}>Pre-Session Carb Tool</div>
        </div>

        <div style={{width:"100%",maxWidth:580}}>
          {!done?(
            <div className="si" key={step}>
              <Dots step={step} total={STEPS.length}/>
              <div style={{fontFamily:FH,fontSize:36,fontWeight:800,color:C.ink,lineHeight:1.1,marginBottom:28,letterSpacing:-0.5}}>{cur.title}</div>

              {cur.type==="choice2"&&(
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  {cur.options.map(opt=>(
                    <button key={opt.val} className="bg" onClick={()=>advance(cur.id,opt.val)}
                      style={{padding:"24px 16px",borderRadius:16,border:`1.5px solid ${C.border}`,background:C.surface,color:C.ink,cursor:"pointer",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
                      <span style={{fontSize:32}}>{opt.icon}</span>
                      <span style={{fontFamily:FH,fontSize:20,fontWeight:800}}>{opt.label}</span>
                      <span style={{fontFamily:FM,fontSize:11,color:C.muted}}>{opt.sub}</span>
                    </button>
                  ))}
                </div>
              )}

              {cur.type==="number"&&(
                <>
                  <div style={{position:"relative",marginBottom:err?8:20}}>
                    <input autoFocus type="number" value={numVal} placeholder={answers.unit==="lbs"?"e.g. 165":"e.g. 75"}
                      onChange={e=>{setNumVal(e.target.value);setErr("");}}
                      onKeyDown={e=>e.key==="Enter"&&handleNum()}
                      style={{width:"100%",background:C.surface,border:`1.5px solid ${err?C.red:C.border}`,borderRadius:14,color:C.ink,fontSize:38,fontWeight:700,fontFamily:FH,padding:"18px 80px 18px 22px",outline:"none",transition:"border-color .2s"}}
                      onFocus={e=>e.target.style.borderColor=C.amber}
                      onBlur={e=>e.target.style.borderColor=err?C.red:C.border}
                    />
                    <span style={{position:"absolute",right:20,top:"50%",transform:"translateY(-50%)",color:C.muted,fontFamily:FM,fontSize:14}}>{answers.unit||"kg"}</span>
                  </div>
                  {err&&<div style={{color:C.red,fontSize:12,marginBottom:12,fontFamily:FM}}>{err}</div>}
                  <button onClick={handleNum} style={{width:"100%",padding:"17px",borderRadius:14,border:"none",background:`linear-gradient(135deg,${C.amber},${C.red})`,color:C.white,fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:FH,letterSpacing:2,textTransform:"uppercase"}}
                    onMouseEnter={e=>e.currentTarget.style.opacity=".85"}
                    onMouseLeave={e=>e.currentTarget.style.opacity="1"}
                  >Continue →</button>
                </>
              )}

              {cur.type==="sgrid"&&(
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:9}}>
                  {Object.entries(SESSIONS).map(([val,s])=>(
                    <button key={val} className="bg" onClick={()=>advance(cur.id,val)}
                      style={{padding:"14px 10px",borderRadius:14,border:`1.5px solid ${s.badge?C.amber:C.border}`,background:s.badge?C.amberSoft:C.surface,color:C.ink,cursor:"pointer",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:5,position:"relative"}}>
                      {s.badge&&<div style={{position:"absolute",top:-1,right:-1,background:C.amber,color:C.bg,fontFamily:FM,fontSize:7,fontWeight:700,letterSpacing:1,padding:"2px 5px",borderRadius:"0 13px 0 6px",textTransform:"uppercase"}}>{s.badge}</div>}
                      <span style={{fontSize:22}}>{s.icon}</span>
                      <span style={{fontFamily:FH,fontSize:14,fontWeight:700,lineHeight:1.1}}>{s.label}</span>
                      <span style={{fontSize:10,color:C.muted,fontFamily:FM}}>{s.sub}</span>
                    </button>
                  ))}
                </div>
              )}

              {cur.type==="igrid"&&(
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {Object.entries(INTENSITY).map(([val,i])=>(
                    <button key={val} className="bg" onClick={()=>advance(cur.id,val)}
                      style={{padding:"18px 20px",borderRadius:14,border:`1.5px solid ${C.border}`,background:C.surface,color:C.ink,cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:16}}>
                      <span style={{fontSize:30}}>{i.icon}</span>
                      <div>
                        <div style={{fontFamily:FH,fontSize:18,fontWeight:700}}>{i.label}</div>
                        <div style={{fontFamily:FB,fontSize:12,color:C.muted,marginTop:2}}>{i.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {cur.type==="tgrid"&&(
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
                  {Object.entries(TIMING).map(([val,t])=>(
                    <button key={val} className="bg" onClick={()=>advance(cur.id,val)}
                      style={{padding:"20px 12px",borderRadius:14,border:`1.5px solid ${C.border}`,background:C.surface,color:C.ink,cursor:"pointer",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
                      <span style={{fontSize:28}}>{t.icon}</span>
                      <span style={{fontFamily:FH,fontSize:15,fontWeight:700}}>{t.label}</span>
                      <span style={{fontFamily:FM,fontSize:10,color:C.muted}}>{t.note}</span>
                    </button>
                  ))}
                </div>
              )}

              {cur.type==="todgrid"&&(
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
                  {Object.entries(TIMEOFDAY).map(([val,t])=>(
                    <button key={val} className="bg" onClick={()=>advance(cur.id,val)}
                      style={{padding:"20px 12px",borderRadius:14,border:`1.5px solid ${C.border}`,background:C.surface,color:C.ink,cursor:"pointer",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
                      <span style={{fontSize:28}}>{t.icon}</span>
                      <span style={{fontFamily:FH,fontSize:15,fontWeight:700}}>{t.label}</span>
                      <span style={{fontFamily:FM,fontSize:10,color:C.muted}}>{t.sub}</span>
                      <span style={{fontFamily:FM,fontSize:9,color:C.amber,marginTop:2}}>{t.note}</span>
                    </button>
                  ))}
                </div>
              )}

              {cur.type==="aegrid"&&(
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {Object.entries(ALREADY_EATEN).map(([val,a])=>(
                    <button key={val} className="bg" onClick={()=>advance(cur.id,val)}
                      style={{padding:"18px 20px",borderRadius:14,border:`1.5px solid ${C.border}`,background:C.surface,color:C.ink,cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:16}}>
                      <span style={{fontSize:30}}>{a.icon}</span>
                      <div>
                        <div style={{fontFamily:FH,fontSize:18,fontWeight:700}}>{a.label}</div>
                        <div style={{fontFamily:FB,fontSize:12,color:C.muted,marginTop:2}}>{a.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {step>0&&(
                <button onClick={()=>{setStep(s=>s-1);setErr("");setNumVal("");}}
                  style={{background:"none",border:"none",color:C.muted,fontSize:11,marginTop:22,cursor:"pointer",fontFamily:FM,letterSpacing:2,textTransform:"uppercase"}}>← back</button>
              )}
            </div>
          ):(
            <div className="si">
              <div style={{marginBottom:22}}>
                <div style={{fontFamily:FM,fontSize:10,color:C.muted,letterSpacing:3,textTransform:"uppercase",marginBottom:10}}>Your goal</div>
                <div style={{display:"flex",gap:8}}>
                  {Object.entries(GOALS).map(([key,g])=>(
                    <button key={key} onClick={()=>setGoal(key)}
                      style={{flex:1,padding:"11px 8px",borderRadius:12,border:`1.5px solid ${goal===key?C.amber:C.border}`,background:goal===key?C.amberSoft:C.surface,color:goal===key?C.amber:C.muted,cursor:"pointer",transition:"all .2s",textAlign:"center"}}>
                      <div style={{fontSize:18,marginBottom:3}}>{g.icon}</div>
                      <div style={{fontFamily:FH,fontSize:13,fontWeight:700}}>{g.label}</div>
                      <div style={{fontFamily:FM,fontSize:9,opacity:.7,marginTop:2}}>{g.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{display:"flex",gap:6,marginBottom:14}}>
                {["low","med","high"].map(lvl=>(
                  <button key={lvl} onClick={()=>setLevel(lvl)}
                    style={{flex:1,padding:"9px 0",borderRadius:10,border:`1.5px solid ${level===lvl?LC[lvl]:C.border}`,background:level===lvl?`${LC[lvl]}18`:C.surface,color:level===lvl?LC[lvl]:C.muted,fontFamily:FM,fontSize:10,letterSpacing:3,textTransform:"uppercase",cursor:"pointer",transition:"all .2s",fontWeight:700}}>{LL[lvl]}</button>
                ))}
              </div>

              <div style={{background:C.surface,border:`1.5px solid ${LC[level]}44`,borderRadius:20,padding:"28px 24px 22px",marginBottom:14,textAlign:"center",position:"relative",overflow:"hidden",boxShadow:`0 0 40px ${LC[level]}12`}}>
                <div style={{position:"absolute",top:-40,left:"50%",transform:"translateX(-50%)",width:220,height:130,background:`radial-gradient(ellipse,${LC[level]}20,transparent 70%)`,pointerEvents:"none"}}/>
                {sess?.badge&&<div style={{display:"inline-block",background:C.amber,color:C.bg,fontFamily:FM,fontSize:9,fontWeight:700,letterSpacing:2,padding:"3px 10px",borderRadius:100,marginBottom:8,textTransform:"uppercase"}}>🥇 {sess.badge}</div>}
                <div style={{fontFamily:FM,fontSize:10,color:C.muted,letterSpacing:3,textTransform:"uppercase",marginBottom:4}}>
                  {isMorning?"eat this before your":answers.alreadyeaten==="good"?"top up with this before your":answers.alreadyeaten==="little"?"add this before your":"eat this before your"} {sess?.label}
                </div>
                <div style={{fontFamily:FH,fontSize:92,fontWeight:800,color:LC[level],lineHeight:1,letterSpacing:-3,marginBottom:2}}>
                  <AnimCount to={carbs[level]} key={`${level}-${goal}-${intensKey}`}/>
                </div>
                <div style={{fontFamily:FM,fontSize:12,color:C.muted,letterSpacing:3,textTransform:"uppercase"}}>grams of carbs</div>
                <div style={{marginTop:14,padding:"10px 16px",background:`${LC[level]}0E`,borderRadius:10,fontFamily:FB,fontSize:12.5,color:C.ink,opacity:.85,lineHeight:1.5}}>{LD[level]}</div>
                <div style={{marginTop:10,display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
                  <div style={{display:"inline-flex",gap:5,alignItems:"center",padding:"4px 10px",borderRadius:100,background:C.card,border:`1px solid ${C.border}`,fontFamily:FM,fontSize:10,color:C.muted}}>
                    {TIMING[answers.timing].icon} {TIMING[answers.timing].label}
                  </div>
                  <div style={{display:"inline-flex",gap:5,alignItems:"center",padding:"4px 10px",borderRadius:100,background:C.card,border:`1px solid ${C.border}`,fontFamily:FM,fontSize:10,color:C.muted}}>
                    {INTENSITY[answers.intensity].icon} {INTENSITY[answers.intensity].label} intensity
                  </div>
                  <div style={{display:"inline-flex",gap:5,alignItems:"center",padding:"4px 10px",borderRadius:100,background:C.card,border:`1px solid ${C.border}`,fontFamily:FM,fontSize:10,color:C.muted}}>
                    ⚖️ {weightKg}kg
                  </div>
                  {answers.timeofday&&(
                    <div style={{display:"inline-flex",gap:5,alignItems:"center",padding:"4px 10px",borderRadius:100,background:C.card,border:`1px solid ${C.border}`,fontFamily:FM,fontSize:10,color:C.muted}}>
                      {TIMEOFDAY[answers.timeofday].icon} {TIMEOFDAY[answers.timeofday].label} session
                    </div>
                  )}
                  {answers.alreadyeaten&&!isMorning&&(
                    <div style={{display:"inline-flex",gap:5,alignItems:"center",padding:"4px 10px",borderRadius:100,background:C.card,border:`1px solid ${C.border}`,fontFamily:FM,fontSize:10,color:C.muted}}>
                      {ALREADY_EATEN[answers.alreadyeaten].icon} {ALREADY_EATEN[answers.alreadyeaten].label}
                    </div>
                  )}
                </div>
              </div>

              {!isMorning&&answers.alreadyeaten&&(
                <div style={{background:answers.alreadyeaten==="good"?C.greenSoft:answers.alreadyeaten==="little"?C.amberSoft:C.redSoft,border:`1px solid ${answers.alreadyeaten==="good"?C.green:answers.alreadyeaten==="little"?C.amber:C.red}30`,borderRadius:14,padding:"12px 16px",marginBottom:16}}>
                  <div style={{fontFamily:FH,fontSize:15,fontWeight:700,color:answers.alreadyeaten==="good"?C.green:answers.alreadyeaten==="little"?C.amber:C.red,marginBottom:4}}>
                    {answers.alreadyeaten==="good"&&"✅ You're well fuelled — just top up"}
                    {answers.alreadyeaten==="little"&&"🟡 You've had a little — add a solid top-up"}
                    {answers.alreadyeaten==="none"&&"❌ You haven't fuelled yet — treat this like a full pre-session meal"}
                  </div>
                  <div style={{fontFamily:FB,fontSize:12,color:C.muted,lineHeight:1.5}}>
                    {answers.alreadyeaten==="good"&&"Your carb target below reflects what you still need. Keep it light and easy to digest."}
                    {answers.alreadyeaten==="little"&&"You need a decent top-up. Aim for the medium target and pick foods with a bit more substance."}
                    {answers.alreadyeaten==="none"&&"Eat the full target below. Don't skip it — going into this session under-fuelled will hurt your performance."}
                  </div>
                </div>
              )}

              <div style={{display:"flex",gap:8,marginBottom:28}}>
                {["low","med","high"].map(lvl=>(
                  <button key={lvl} onClick={()=>setLevel(lvl)}
                    style={{flex:1,padding:"12px 8px",borderRadius:12,textAlign:"center",background:`${LC[lvl]}0C`,border:`1px solid ${LC[lvl]}30`,cursor:"pointer",transition:"all .2s"}}>
                    <div style={{fontFamily:FM,fontSize:9,color:LC[lvl],letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>{LL[lvl]}</div>
                    <div style={{fontFamily:FH,fontSize:26,fontWeight:800,color:LC[lvl],lineHeight:1}}>{carbs[lvl]}g</div>
                  </button>
                ))}
              </div>

              <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:18,padding:"20px 18px",marginBottom:24}}>
                <div style={{fontFamily:FM,fontSize:10,color:LC[level],letterSpacing:3,textTransform:"uppercase",marginBottom:16}}>
                  {isMorning?"🌅 Quick morning options":TIMING[answers.timing].type==="fast"?"⚡ Fast-release options":TIMING[answers.timing].type==="slow"?"🍽 Full meal options":"🔀 Fast & moderate options"}
                </div>
                <MealBuilder target={carbs[level]} foods={foods} accentColor={LC[level]}/>
              </div>

              <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,padding:"16px 18px",marginBottom:20}}>
                <div style={{fontFamily:FM,fontSize:10,color:C.teal,letterSpacing:3,textTransform:"uppercase",marginBottom:10}}>When to eat it</div>
                {[
                  {time:"2–3 hrs before",tip:"Full meal — oats, rice, pasta, potato. Time to digest properly.",col:C.green},
                  {time:"1–2 hrs before",tip:"Moderate portion — toast, bagel, banana + oats combo.",col:C.amber},
                  {time:"30 min before", tip:"Small & fast only — banana, rice cakes, dates, or a gel.",col:C.red},
                ].map((row,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"flex-start",gap:14,padding:"9px 0",borderBottom:i<2?`1px solid ${C.border}`:"none"}}>
                    <div style={{fontFamily:FH,fontSize:13,fontWeight:700,color:row.col,minWidth:96,paddingTop:1}}>{row.time}</div>
                    <div style={{fontFamily:FB,fontSize:12,color:C.muted,lineHeight:1.5}}>{row.tip}</div>
                  </div>
                ))}
              </div>

              <div style={{background:C.redSoft,border:`1px solid ${C.red}28`,borderRadius:14,padding:"14px 16px",marginBottom:24}}>
                <div style={{fontFamily:FM,fontSize:10,color:C.red,letterSpacing:3,textTransform:"uppercase",marginBottom:8}}>Signs you're underfuelling</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"5px 12px"}}>
                  {["Flat during warm-up","Wall mid-session","Brain fog near training","Poor 48h+ recovery"].map(s=>(
                    <div key={s} style={{fontFamily:FB,fontSize:11.5,color:C.ink,opacity:.8,lineHeight:1.5}}><span style={{color:C.red,marginRight:5}}>●</span>{s}</div>
                  ))}
                </div>
              </div>

              <button onClick={restart}
                style={{width:"100%",padding:"15px",borderRadius:14,background:"none",border:`1.5px solid ${C.border}`,color:C.muted,fontSize:13,cursor:"pointer",fontFamily:FH,letterSpacing:3,textTransform:"uppercase",transition:"all .2s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=C.ink;e.currentTarget.style.color=C.ink;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.muted;}}
              >↺ Start Over</button>
            </div>
          )}

          <div style={{marginTop:36,textAlign:"center",fontFamily:FM,fontSize:10,color:C.dim,lineHeight:1.9,letterSpacing:.5}}>
            Based on ISSN &amp; ACSM sports nutrition guidelines.<br/>
            Targets are pre-session fuelling only — not total daily intake.<br/>
            <span style={{color:C.amber}}>The Consistency Method</span> · For a personalised plan, speak to your coach.
          </div>
        </div>
      </div>
    </>
  );
}
