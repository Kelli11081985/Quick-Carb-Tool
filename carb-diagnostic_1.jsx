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
