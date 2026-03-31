import Logo from "./Logo";
import { toast } from "../utils/toast";

export default function PubFooter({ setPage }) {
  return (
    <footer className="pub-footer">
      <Logo onClick={() => setPage("landing")} />
      <div style={{ fontFamily:"var(--mono)",fontSize:10,color:"var(--text3)",letterSpacing:"0.06em" }}>
        © 2024 DirectP2P. Precision Engineering for 8K Workflow.
      </div>
      <div style={{ display:"flex", gap:20 }}>
        {["Privacy Policy","Terms of Service","Documentation","Support"].map(l => (
          <button key={l} className="footer-link" onClick={() => toast(`${l} 페이지로 이동합니다.`, "info")}>{l}</button>
        ))}
      </div>
    </footer>
  );
}
