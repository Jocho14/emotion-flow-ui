import { lazy } from "react";

const Main = lazy(() => import("../layouts/Main"));
const LandingPage = lazy(() => import("../pages/LandingPage"));
const AnalyzePage = lazy(() => import("../pages/AnalyzePage"));

const routes = [
  {
    path: "/",
    element: <Main />,
    children: [
      { path: "", element: <LandingPage /> },
      { path: "analyze", element: <AnalyzePage /> },
    ],
  },

  //   { path: "*", element: <NotFoundPage /> },
];

export default routes;
