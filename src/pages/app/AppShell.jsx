import { useState } from "react";
import AppNav from "../../components/AppNav";
import Sidebar from "../../components/Sidebar";
import Editor from "./Editor";
import TeamSettings from "./TeamSettings";
import SystemSettings from "./SystemSettings";
import Payment from "./Payment";
import ProfileEdit from "./ProfileEdit";
import { LangProvider } from "../../i18n";

function loadAvatar() {
  try {
    const raw = localStorage.getItem("profile_form");
    if (!raw) return "ML";
    const { data } = JSON.parse(raw);
    return data?.avatar || "ML";
  } catch { return "ML"; }
}

function loadLang() {
  try {
    const raw = localStorage.getItem("profile_form");
    if (!raw) return "ko";
    const { data } = JSON.parse(raw);
    return data?.language || "ko";
  } catch { return "ko"; }
}

export default function AppShell({ setPage }) {
  const [tab, setTab] = useState("editor");
  const [avatar, setAvatar] = useState(loadAvatar);
  const [lang, setLang] = useState(loadLang);

  return (
    <LangProvider lang={lang}>
      <div className="app-shell">
        <AppNav tab={tab} setTab={setTab} setPage={setPage} avatar={avatar} />
        <Sidebar tab={tab} setTab={setTab} />
        <div className="app-main">
          {tab === "editor"  && <Editor />}
          {tab === "friends" && <TeamSettings />}
          {tab === "system"  && <SystemSettings />}
          {tab === "payment" && <Payment />}
          {tab === "profile" && <ProfileEdit onAvatarChange={setAvatar} onLangChange={setLang} />}
        </div>
      </div>
    </LangProvider>
  );
}
