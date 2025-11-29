import { Outlet } from "react-router";

import Footer from "./Footer";

const Main: React.FC = () => {
  return (
    <>
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Main;
