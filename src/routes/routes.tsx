import { createBrowserRouter } from "react-router-dom";
import { LazyLandingLayout, LazyLandingPage } from "./lazy-routes";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LazyLandingLayout,
    children: [
      {
        path: "/",
        index: true,
        Component: LazyLandingPage,
      },
    ],
  },
]);
