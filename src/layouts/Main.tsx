import { Outlet } from "react-router";

const Main: React.FC = () => {
  return (
    <>
      <main className="min-h-screen">
        <Outlet />
      </main>
    </>
  );
};

export default Main;
