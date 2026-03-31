export default function Toasts({ list }) {
  return (
    <div style={{ position:"fixed", bottom:28, right:28, zIndex:9999, display:"flex", flexDirection:"column", gap:10, pointerEvents:"none" }}>
      {list.map(t => (
        <div key={t.id} style={{
          display:"flex", alignItems:"center", gap:10,
          background:"var(--surface2)", border:"1px solid var(--border2)", borderRadius:6,
          padding:"12px 18px", fontFamily:"var(--mono)", fontSize:11, color:"var(--text)",
          letterSpacing:"0.04em", boxShadow:"0 8px 32px rgba(0,0,0,0.4)", minWidth:270,
          animation: t.out ? "tOut .22s ease forwards" : "tIn .25s ease",
        }}>
          <span style={{ width:6, height:6, borderRadius:"50%", flexShrink:0,
            background: t.type==="ok"?"var(--green)":t.type==="err"?"var(--red)":t.type==="warn"?"var(--yellow)":"var(--accent2)",
            boxShadow: t.type==="ok"?"0 0 6px var(--green)":"none"
          }}/>
          {t.msg}
        </div>
      ))}
    </div>
  );
}
