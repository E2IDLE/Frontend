import { useState } from "react";
import AppNav from "../../components/AppNav";
import Sidebar from "../../components/Sidebar";
import Editor from "./Editor";
import TeamSettings from "./TeamSettings";
import SystemSettings from "./SystemSettings";
import Payment from "./Payment";
import ProfileEdit from "./ProfileEdit";

export default function AppShell({ setPage }) {
  const [tab, setTab] = useState("편집 툴");
  return (
    <div className="app-shell">
      <AppNav tab={tab} setTab={setTab} setPage={setPage} />
      <Sidebar tab={tab} setTab={setTab} />
      <div className="app-main">
        {tab==="편집 툴"    && <Editor />}
        {tab==="친구"   && <TeamSettings />}
        {tab==="시스템 설정" && <SystemSettings />}
        {tab==="구독 플랜"  && <Payment />}
        {tab==="프로필 편집" && <ProfileEdit />}
      </div>
    </div>
  );
}
