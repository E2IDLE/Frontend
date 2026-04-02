import Logo from "./Logo";
import { toast } from "../utils/toast";

export default function PubNav({ setPage }) {
  return (
    <nav className="pub-nav">
      <Logo onClick={() => setPage("landing")} />
      <div style={{ display:"flex", gap:32 }}>
        <button className="nav-link" onClick={() => setPage("landing")}>Features</button>
        <button className="nav-link" onClick={() => setPage("pricing")}>Pricing</button>
        <button className="nav-link" onClick={() => setPage("install")}>Download</button>
        <button className="nav-link" onClick={() => toast("문의 이메일: support@directp2p.com", "info")}>문의하기</button>
      </div>
      <div style={{ display:"flex", gap:12 }}>
        <button className="btn-ghost" onClick={() => setPage("login")}>Login</button>
        <button className="btn-primary" onClick={() => setPage("signup")}>Get Started</button>
      </div>
    </nav>
  );
}
