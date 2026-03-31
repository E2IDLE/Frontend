import { useState } from "react";
import globalCss from "./styles/globalCss";
import { useToasts } from "./utils/toast";
import Toasts from "./components/Toasts";
import Landing from "./pages/Landing";
import Pricing from "./pages/Pricing";
import Auth from "./pages/Auth";
import AppShell from "./pages/app/AppShell";

export default function App() {
  const [page, setPageState] = useState("landing");
  const toasts = useToasts();

  const setPage = (p) => { window.scrollTo(0, 0); setPageState(p); };

  
  return (
    <>
      <style>{globalCss}</style>
      {page==="landing" && <Landing setPage={setPage} />}
      {page==="pricing" && <Pricing setPage={setPage} />}
      {page==="login"   && <Auth mode="login"  setPage={setPage} />}
      {page==="signup"  && <Auth mode="signup" setPage={setPage} />}
      {page==="editor"  && <AppShell setPage={setPage} />}
      <Toasts list={toasts} />
    </>
  );
}
