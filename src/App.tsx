import "./App.css";
import { BrowserRouter } from "react-router";
import AppRouter from "./router/AppRouter";
import { ThemeProvider } from "@/components/theme-provider";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </QueryClientProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
