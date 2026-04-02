import Logo from "./Logo";
import { toast } from "../utils/toast";

export default function PubFooter({ setPage }) {
  return (
    <footer className="pub-footer">
      <Logo onClick={() => setPage("landing")} />
      <div style={{ fontFamily:"var(--mono)",fontSize:10,color:"var(--text3)",letterSpacing:"0.06em" }}>
        © 2026 DirectP2P. Precision Engineering for 8K Workflow.
      </div>
      
    </footer>
  );
}
