import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";

import { updateConfig } from "./utils/helpers.ts";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/routes.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";

const queryClient = new QueryClient();

const getEnvironmentConfig = async () => {
  const response = await fetch(`/config/environment.json`);
  if (!response.ok) {
    throw new Error("Failed to load app enviroment");
  }
  const envData = await response.json();

  updateConfig(envData);
};

await getEnvironmentConfig();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <App />
    </QueryClientProvider>
  </StrictMode>
);
