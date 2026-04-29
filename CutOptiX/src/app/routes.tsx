import { createBrowserRouter } from "react-router";
import { DashboardLayout } from "./components/DashboardLayout";
import { Dashboard } from "./components/pages/Dashboard";
import { NewProject } from "./components/pages/NewProject";
import { DesignInput } from "./components/pages/DesignInput";
import { Optimization } from "./components/pages/Optimization";
import { Reports } from "./components/pages/Reports";
import { Analytics } from "./components/pages/Analytics";
import { Settings } from "./components/pages/Settings";
import { LoginPage } from "./components/pages/LoginPage";
import { PrintReport } from "./components/pages/PrintReport";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/print-report/:id",
    Component: PrintReport,
  },
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "new-project", Component: NewProject },
      { path: "design-input", Component: DesignInput },
      { path: "optimization", Component: Optimization },
      { path: "reports", Component: Reports },
      { path: "analytics", Component: Analytics },
      { path: "settings", Component: Settings },
    ],
  },
]);
