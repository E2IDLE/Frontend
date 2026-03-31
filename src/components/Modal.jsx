export default function Modal({ icon, title, sub, badge, onClose, children }) {
  return (
    <div onClick={onClose} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.72)",zIndex:8000,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(5px)",animation:"tIn .2s ease" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:10,padding:36,maxWidth:440,width:"90%",animation:"scIn .2s ease" }}>
        {icon && <div style={{ fontSize:42,textAlign:"center",marginBottom:16 }}>{icon}</div>}
        {badge && <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:6,fontFamily:"var(--mono)",fontSize:10,color:"var(--green)",border:"1px solid rgba(16,185,129,0.3)",padding:"4px 12px",borderRadius:2,background:"rgba(16,185,129,0.08)",marginBottom:18 }}><span style={{width:5,height:5,borderRadius:"50%",background:"var(--green)",display:"inline-block"}}/>{badge}</div>}
        <div style={{ fontFamily:"var(--display)",fontSize:22,fontWeight:800,letterSpacing:"-0.02em",textAlign:"center",marginBottom:8 }}>{title}</div>
        <div style={{ fontSize:13,color:"var(--text2)",textAlign:"center",lineHeight:1.6,marginBottom:24,whiteSpace:"pre-line" }}>{sub}</div>
        {children}
        <button onClick={onClose} style={{ width:"100%",fontFamily:"var(--mono)",fontSize:12,fontWeight:700,color:"#fff",background:"var(--accent)",border:"none",padding:13,borderRadius:4,letterSpacing:"0.08em",cursor:"pointer" }}>확인</button>
      </div>
    </div>
  );
}
