import { useState, useEffect } from "react";

const C = {
  bg:"#09090F", surface:"#0F0F1A", card:"#141422", border:"#1C1C2E",
  ink:"#EEEEF8", muted:"#5A5A7A", dim:"#3A3A55",
  amber:"#F5B944", amberSoft:"#F5B94420",
  green:"#22D99A",
  red:"#F04A2A", redSoft:"#F04A2A18",
  teal:"#2DD4F0",
  white:"#FFFFFF",
};
const FH = "'Barlow Condensed','Impact','Arial Narrow',sans-serif";
const FB = "'DM Sans','Trebuchet MS',sans-serif";
const FM = "'DM Mono','Courier New',monospace";

const GOALS = {
  performance:{ label:"Performance", icon:"⚡", desc:"Fuel to go harder",   mult:1.0  },
  maintain:   { label:"Maintain",    icon:"⚖️", desc:"Sustain body weight", mult:0.85 },
  fat_loss:   { label:"Fat Loss",    icon:"🔥", desc:"Lean while training", mult:0.70 },
};

const SESSIONS = {
  hyrox:   { label:"Hyrox",      icon:"🏋️", sub:"~60–90 min hybrid", carbPer:[0.75,1.1,1.4]  },
  crossfit:{ label:"CrossFit",   icon:"⚡", sub:"~60 min WOD",       carbPer:[0.65,1.0,1.3]  },
  cardio45:{ label:"Cardio 45",  icon:"🏃", sub:"~45 min",           carbPer:[0.50,0.8,1.1]  },
  cardio30:{ label:"Cardio 30",  icon:"🚴", sub:"~30 min",           carbPer:[0.35,0.6,0.85] },
  run5k:   { label:"5K Run",     icon:"👟", sub:"~20–35 min",        carbPer:[0.30,0.55,0.75]},
  run10k:  { label:"10K Run",    icon:"🏅", sub:"~45–70 min",        carbPer:[0.50,0.80,1.05]},
};

const TIMING = {
  t30: { label:"30 min away",  icon:"🔴", type:"fast",  note:"Fast carbs only" },
  t90: { label:"1–2 hrs away", icon:"🟡", type:"mixed", note:"Fast & moderate" },
  t180:{ label:"2–3 hrs away", icon:"🟢", type:"slow",  note:"Full meal window" },
};

const ALL_FOODS = [
  { id:"banana",     name:"Banana",         emoji:"🍌", carbs:27, type:"fast",  cal:105, note:"Easy on the gut, great last-minute" },
  { id:"dates",      name:"Medjool Dates",  emoji:"🫐", carbs:18, type:"fast",  cal:66,  note:"3 dates · natural quick energy" },
  { id:"ricecakes",  name:"Rice Cakes",     emoji:"🍘", carbs:28, type:"fast",  cal:114, note:"4 cakes · low fibre, easy pre-session" },
  { id:"whitebread", name:"White Bread",    emoji:"🍞", carbs:30, type:"fast",  cal:160, note:"2 slices · fast-digesting" },
  { id:"sportsgel",  name:"Energy Gel",     emoji:"🧃", carbs:22, type:"fast",  cal:85,  note:"1 gel · pure race fuel" },
  { id:"oats",       name:"Porridge Oats",  emoji:"🥣", carbs:54, type:"slow",  cal:300, note:"100g dry · sustained release" },
  { id:"rice",       name:"White Rice",     emoji:"🍚", carbs:56, type:"slow",  cal:260, note:"200g cooked · steady fuel" },
  { id:"pasta",      name:"Pasta",          emoji:"🍝", carbs:60, type:"slow",  cal:280, note:"100g dry · classic carb load" },
  { id:"sweetpot",   name:"Sweet Potato",   emoji:"🍠", carbs:30, type:"slow",  cal:130, note:"150g · nutrient-dense" },
  { id:"bagel",      name:"Bagel",          emoji:"🥯", carbs:55, type:"slow",  cal:270, note:"1 large · high carb, low fibre" },
  { id:"toast_jam",  name:"Toast & Jam",    emoji:"🍞", carbs:52, type:"both",  cal:230, note:"2 slices · fast + moderate" },
  { id:"banana_oat", name:"Banana + Oats",  emoji:"🍌", carbs:81, type:"both",  cal:405, note:"Classic pre-workout combo" },
];

function getFoods(timingKey) {
  const { type } = TIMING[timingKey];
  if (type === "fast") return ALL_FOODS.filter(f => f.type === "fast");
  if (type === "slow") return ALL_FOODS.filter(f => f.type === "slow" || f.type === "both");
  return ALL_FOODS.filter(f => f.type === "fast" || f.type === "both");
}

function calcCarbs(weight, sessionKey, goalKey) {
  const [lo, mid, hi] = SESSIONS[sessionKey].carbPer;
  const m = GOALS[goalKey].mult;
  return {
    low:  Math.round(lo  * weight * m),
    med:  Math.round(mid * weight * m),
    high: Math.round(hi  * weight * m),
  };
}

const STEPS = [
  { id:"weight",  title:"What's your bodyweight?",      type:"number", unit:"kg", min:35, max:200, placeholder:"e.g. 75" },
  { id:"session", title:"What's today's session?",      type:"grid",
    options: Object.entries(SESSIONS).map(([v,d]) => ({ val:v, label:d.label, icon:d.icon, sub:d.sub })) },
  { id:"timing",  title:"How long until you train?",    type:"grid",
    options: Object.entries(TIMING).map(([v,d])   => ({ val:v, label:d.label, icon:d.icon, note:d.note })) },
];

function AnimCount({ to, duration=700 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start;
    const tick = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const e = 1 - Math.pow(1 - p, 4);
      setVal(Math.round(to * e));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [to]);
  return <>{val}</>;
}

function TCMLogo() {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, userSelect:"none" }}>
      <div style={{ width:30, height:30, borderRadius:7, background:`linear-gradient(135deg,${C.amber},${C.red})`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
          <path d="M3 8L8 3L13 8L8 13Z" fill="white" opacity="0.9"/>
          <circle cx="8" cy="8" r="2.2" fill="white"/>
        </svg>
      </div>
      <div style={{ lineHeight:1 }}>
        <div style={{ fontFamily:FH, fontSize:13, fontWeight:700, color:C.ink, letterSpacing:2.5, textTransform:"uppercase" }}>The Consistency</div>
        <div style={{ fontFamily:FM, fontSize:9, color:C.amber, letterSpacing:3, textTransform:"uppercase", marginTop:1 }}>Method</div>
      </div>
    </div>
  );
}

function Dots({ step, total }) {
  return (
    <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:26 }}>
      {Array.from({ length:total }).map((_,i) => (
        <div key={i} style={{ height:3, borderRadius:2, width:i===step?24:8, background:i<=step?C.amber:C.border, transition:"all .35s cubic-bezier(.4,0,.2,1)", opacity:i>step?0.4:1 }}/>
      ))}
      <span style={{ marginLeft:6, fontSize:11, color:C.muted, fontFamily:FM }}>{step+1}/{total}</span>
    </div>
  );
}

export default function App() {
  const [step, setStep]       = useState(0);
  const [answers, setAnswers] = useState({});
  const [numVal, setNumVal]   = useState("");
  const [err, setErr]         = useState("");
  const [goal, setGoal]       = useState("performance");
  const [level, setLevel]     = useState("med");
  const [done, setDone]       = useState(false);

  const cur = STEPS[step];

  function advance(key, val) {
    const next = { ...answers, [key]: val };
    setAnswers(next);
    if (step + 1 < STEPS.length) setStep(s => s + 1);
    else setDone(true);
  }

  function handleNum() {
    const v = Number(numVal);
    if (!numVal || isNaN(v) || v < cur.min || v > cur.max) { setErr(`Enter a value between ${cur.min}–${cur.max}`); return; }
    setErr(""); setNumVal(""); advance(cur.id, v);
  }

  function restart() {
    setStep(0); setAnswers({}); setNumVal(""); setErr("");
    setGoal("performance"); setLevel("med"); setDone(false);
  }

  const carbs = done ? calcCarbs(answers.weight, answers.session, goal) : null;
  const LC = { low:C.amber, med:C.green, high:C.red };
  const LL = { low:"LOW", med:"MEDIUM", high:"HIGH" };
  const LD = {
    low: "Lighter days or if new to pre-session fuelling",
    med: "Your everyday baseline — start here",
    high:"Hard sessions, back-to-back days, competition prep",
  };
  const foods = done ? getFoods(answers.timing) : [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html, body { background:${C.bg}; min-height:100vh; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance:none; }
        input[type=number] { -moz-appearance:textfield; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:${C.border}; border-radius:2px; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .si  { animation:fadeUp .32s ease both; }
        .fc  { transition:all .18s; }
        .fc:hover  { border-color:${C.amber}88 !important; transform:translateY(-2px); }
        .bg:hover  { border-color:${C.amber} !important; background:${C.amberSoft} !important; }
        button { font-family:${FB}; }
      `}</style>

      <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column", alignItems:"center", fontFamily:FB, padding:"0 16px 56px" }}>

        {/* Header */}
        <div style={{ width:"100%", maxWidth:560, display:"flex", justifyContent:"space-between", alignItems:"center", padding:"20px 0 24px", borderBottom:`1px solid ${C.border}`, marginBottom:32 }}>
          <TCMLogo/>
          <div style={{ fontFamily:FM, fontSize:9, color:C.muted, letterSpacing:2.5, textTransform:"uppercase" }}>Pre-Session Carb Tool</div>
        </div>

        <div style={{ width:"100%", maxWidth:560 }}>
          {!done ? (
            <div className="si" key={step}>
              <Dots step={step} total={STEPS.length}/>
              <div style={{ fontFamily:FH, fontSize:36, fontWeight:800, color:C.ink, lineHeight:1.1, marginBottom:28, letterSpacing:-0.5 }}>{cur.title}</div>

              {/* Number */}
              {cur.type === "number" && (
                <>
                  <div style={{ position:"relative", marginBottom:err?8:20 }}>
                    <input autoFocus type="number" value={numVal} placeholder={cur.placeholder}
                      onChange={e => { setNumVal(e.target.value); setErr(""); }}
                      onKeyDown={e => e.key === "Enter" && handleNum()}
                      style={{ width:"100%", background:C.surface, border:`1.5px solid ${err?C.red:C.border}`, borderRadius:14, color:C.ink, fontSize:38, fontWeight:700, fontFamily:FH, padding:"18px 72px 18px 22px", outline:"none", transition:"border-color .2s", letterSpacing:-0.5 }}
                      onFocus={e => e.target.style.borderColor = C.amber}
                      onBlur={e  => e.target.style.borderColor = err ? C.red : C.border}
                    />
                    <span style={{ position:"absolute", right:20, top:"50%", transform:"translateY(-50%)", color:C.muted, fontFamily:FM, fontSize:14 }}>{cur.unit}</span>
                  </div>
                  {err && <div style={{ color:C.red, fontSize:12, marginBottom:12, fontFamily:FM }}>{err}</div>}
                  <button onClick={handleNum} style={{ width:"100%", padding:"17px", borderRadius:14, border:"none", background:`linear-gradient(135deg,${C.amber},${C.red})`, color:C.white, fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:FH, letterSpacing:2, textTransform:"uppercase" }}
                    onMouseEnter={e => e.currentTarget.style.opacity = ".85"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                  >Continue →</button>
                </>
              )}

              {/* Grid */}
              {cur.type === "grid" && (
                <div style={{ display:"grid", gridTemplateColumns: cur.options.length === 6 ? "1fr 1fr 1fr" : cur.options.length === 3 ? "1fr 1fr 1fr" : "1fr 1fr", gap:10 }}>
                  {cur.options.map(opt => (
                    <button key={opt.val} className="bg" onClick={() => advance(cur.id, opt.val)}
                      style={{ padding:"18px 12px", borderRadius:14, border:`1.5px solid ${C.border}`, background:C.surface, color:C.ink, cursor:"pointer", textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                      <span style={{ fontSize:26 }}>{opt.icon}</span>
                      <span style={{ fontFamily:FH, fontSize:16, fontWeight:700 }}>{opt.label}</span>
                      {opt.sub  && <span style={{ fontSize:11, color:C.muted, fontFamily:FM }}>{opt.sub}</span>}
                      {opt.note && <span style={{ fontSize:10, color:C.muted, fontFamily:FM, lineHeight:1.3, marginTop:2 }}>{opt.note}</span>}
                    </button>
                  ))}
                </div>
              )}

              {step > 0 && (
                <button onClick={() => { setStep(s => s-1); setErr(""); setNumVal(""); }}
                  style={{ background:"none", border:"none", color:C.muted, fontSize:11, marginTop:20, cursor:"pointer", fontFamily:FM, letterSpacing:2, textTransform:"uppercase" }}>← back</button>
              )}
            </div>

          ) : (
            <div className="si">

              {/* Goal toggle */}
              <div style={{ marginBottom:22 }}>
                <div style={{ fontFamily:FM, fontSize:10, color:C.muted, letterSpacing:3, textTransform:"uppercase", marginBottom:10 }}>Your goal</div>
                <div style={{ display:"flex", gap:8 }}>
                  {Object.entries(GOALS).map(([key,g]) => (
                    <button key={key} onClick={() => setGoal(key)}
                      style={{ flex:1, padding:"11px 8px", borderRadius:12, border:`1.5px solid ${goal===key?C.amber:C.border}`, background:goal===key?C.amberSoft:C.surface, color:goal===key?C.amber:C.muted, cursor:"pointer", transition:"all .2s", textAlign:"center" }}>
                      <div style={{ fontSize:18, marginBottom:3 }}>{g.icon}</div>
                      <div style={{ fontFamily:FH, fontSize:13, fontWeight:700, letterSpacing:0.5 }}>{g.label}</div>
                      <div style={{ fontFamily:FM, fontSize:9, opacity:.7, marginTop:2 }}>{g.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Level tabs */}
              <div style={{ display:"flex", gap:6, marginBottom:14 }}>
                {["low","med","high"].map(lvl => (
                  <button key={lvl} onClick={() => setLevel(lvl)}
                    style={{ flex:1, padding:"9px 0", borderRadius:10, border:`1.5px solid ${level===lvl?LC[lvl]:C.border}`, background:level===lvl?`${LC[lvl]}18`:C.surface, color:level===lvl?LC[lvl]:C.muted, fontFamily:FM, fontSize:10, letterSpacing:3, textTransform:"uppercase", cursor:"pointer", transition:"all .2s", fontWeight:700 }}>{LL[lvl]}</button>
                ))}
              </div>

              {/* Big number card */}
              <div style={{ background:C.surface, border:`1.5px solid ${LC[level]}44`, borderRadius:20, padding:"28px 24px 22px", marginBottom:14, textAlign:"center", position:"relative", overflow:"hidden", boxShadow:`0 0 40px ${LC[level]}12` }}>
                <div style={{ position:"absolute", top:-40, left:"50%", transform:"translateX(-50%)", width:220, height:130, background:`radial-gradient(ellipse,${LC[level]}20,transparent 70%)`, pointerEvents:"none" }}/>
                <div style={{ fontFamily:FM, fontSize:10, color:C.muted, letterSpacing:3, textTransform:"uppercase", marginBottom:4 }}>
                  eat this before your {SESSIONS[answers.session].label}
                </div>
                <div style={{ fontFamily:FH, fontSize:92, fontWeight:800, color:LC[level], lineHeight:1, letterSpacing:-3, marginBottom:2 }}>
                  <AnimCount to={carbs[level]} key={`${level}-${goal}`}/>
                </div>
                <div style={{ fontFamily:FM, fontSize:12, color:C.muted, letterSpacing:3, textTransform:"uppercase" }}>grams of carbs</div>
                <div style={{ marginTop:14, padding:"10px 16px", background:`${LC[level]}0E`, borderRadius:10, fontFamily:FB, fontSize:12.5, color:C.ink, opacity:.85, lineHeight:1.5 }}>{LD[level]}</div>
                <div style={{ marginTop:10, display:"inline-flex", gap:6, alignItems:"center", padding:"5px 12px", borderRadius:100, background:C.card, border:`1px solid ${C.border}`, fontFamily:FM, fontSize:10, color:C.muted, letterSpacing:1 }}>
                  {TIMING[answers.timing].icon} <span>{TIMING[answers.timing].label} · {TIMING[answers.timing].note}</span>
                </div>
              </div>

              {/* Quick range */}
              <div style={{ display:"flex", gap:8, marginBottom:24 }}>
                {["low","med","high"].map(lvl => (
                  <button key={lvl} onClick={() => setLevel(lvl)}
                    style={{ flex:1, padding:"12px 8px", borderRadius:12, textAlign:"center", background:`${LC[lvl]}0C`, border:`1px solid ${LC[lvl]}30`, cursor:"pointer", transition:"all .2s" }}>
                    <div style={{ fontFamily:FM, fontSize:9, color:LC[lvl], letterSpacing:2, textTransform:"uppercase", marginBottom:4 }}>{LL[lvl]}</div>
                    <div style={{ fontFamily:FH, fontSize:26, fontWeight:800, color:LC[lvl], lineHeight:1 }}>{carbs[lvl]}g</div>
                  </button>
                ))}
              </div>

              {/* Food cards */}
              <div style={{ marginBottom:24 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:10 }}>
                  <div style={{ fontFamily:FH, fontSize:20, fontWeight:700, color:C.ink }}>What to eat</div>
                  <div style={{ fontFamily:FM, fontSize:9, color:C.muted, letterSpacing:2, textTransform:"uppercase" }}>
                    {TIMING[answers.timing].type==="fast"?"Fast-release":TIMING[answers.timing].type==="slow"?"Slow + mixed":"Fast & moderate"}
                  </div>
                </div>
                <div style={{ fontSize:12, color:C.muted, fontFamily:FB, marginBottom:12, lineHeight:1.5 }}>
                  Pick 1–3 options to hit your <b style={{ color:LC[level] }}>{carbs[level]}g</b> target. Combine and add them up.
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  {foods.map(f => (
                    <div key={f.id} className="fc" style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"14px" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                        <span style={{ fontSize:24 }}>{f.emoji}</span>
                        <span style={{ fontFamily:FH, fontSize:22, fontWeight:800, color:LC[level], lineHeight:1 }}>{f.carbs}g</span>
                      </div>
                      <div style={{ fontFamily:FH, fontSize:14, fontWeight:700, color:C.ink, marginBottom:3 }}>{f.name}</div>
                      <div style={{ fontFamily:FM, fontSize:9.5, color:C.muted, lineHeight:1.4 }}>{f.note}</div>
                      <div style={{ marginTop:8, display:"inline-block", background:`${LC[level]}18`, borderRadius:6, padding:"2px 8px", fontFamily:FM, fontSize:9, color:LC[level], letterSpacing:1 }}>{f.cal} kcal</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* When to eat */}
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:"16px 18px", marginBottom:20 }}>
                <div style={{ fontFamily:FM, fontSize:10, color:C.teal, letterSpacing:3, textTransform:"uppercase", marginBottom:10 }}>When to eat it</div>
                {[
                  { time:"2–3 hrs before", tip:"Full meal — oats, rice, pasta, potato. Time to digest properly.",  col:C.green },
                  { time:"1–2 hrs before", tip:"Moderate portion — toast, bagel, banana + oats combo.",           col:C.amber },
                  { time:"30 min before",  tip:"Small & fast only — banana, rice cakes, dates, or a gel.",        col:C.red   },
                ].map((row,i) => (
                  <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:14, padding:"9px 0", borderBottom:i<2?`1px solid ${C.border}`:"none" }}>
                    <div style={{ fontFamily:FH, fontSize:13, fontWeight:700, color:row.col, minWidth:96, paddingTop:1 }}>{row.time}</div>
                    <div style={{ fontFamily:FB, fontSize:12, color:C.muted, lineHeight:1.5 }}>{row.tip}</div>
                  </div>
                ))}
              </div>

              {/* Signs */}
              <div style={{ background:C.redSoft, border:`1px solid ${C.red}28`, borderRadius:14, padding:"14px 16px", marginBottom:24 }}>
                <div style={{ fontFamily:FM, fontSize:10, color:C.red, letterSpacing:3, textTransform:"uppercase", marginBottom:8 }}>Signs you're underfuelling</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"5px 12px" }}>
                  {["Flat during warm-up","Wall mid-session","Brain fog near training","Poor 48h+ recovery"].map(s => (
                    <div key={s} style={{ fontFamily:FB, fontSize:11.5, color:C.ink, opacity:.8, lineHeight:1.5 }}><span style={{ color:C.red, marginRight:5 }}>●</span>{s}</div>
                  ))}
                </div>
              </div>

              <button onClick={restart}
                style={{ width:"100%", padding:"15px", borderRadius:14, background:"none", border:`1.5px solid ${C.border}`, color:C.muted, fontSize:13, cursor:"pointer", fontFamily:FH, letterSpacing:3, textTransform:"uppercase", transition:"all .2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.ink; e.currentTarget.style.color = C.ink; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}
              >↺ Start Over</button>

            </div>
          )}

          <div style={{ marginTop:36, textAlign:"center", fontFamily:FM, fontSize:10, color:C.dim, lineHeight:1.9, letterSpacing:.5 }}>
            Based on ISSN &amp; ACSM sports nutrition guidelines.<br/>
            Targets are pre-session fuelling only — not total daily intake.<br/>
            <span style={{ color:C.amber }}>The Consistency Method</span> · For a personalised plan, speak to your coach.
          </div>
        </div>
      </div>
    </>
  );
}
