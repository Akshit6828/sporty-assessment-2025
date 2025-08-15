import AppHeader from "../../components/app-header/app-header";

import "./landing-page-layout.scss";

import { Outlet } from "react-router-dom";

export default function LandingPageLayout() {
  return (
    <>
      <AppHeader />
      <div className="outlet-wrapper">
        <Outlet />
      </div>
    </>
  );
}
