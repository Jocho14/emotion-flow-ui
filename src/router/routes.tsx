import { lazy } from "react";

const Main = lazy(() => import("../layouts/Main"));
const LandingPage = lazy(() => import("../pages/LandingPage"));

const routes = [
  {
    path: "/",
    element: <Main />,
    children: [{ path: "", element: <LandingPage /> }],
  },

  //   { path: "*", element: <NotFoundPage /> },
];

export default routes;
