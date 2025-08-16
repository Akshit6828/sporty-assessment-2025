import { createBrowserRouter } from "react-router-dom";
import {
  LazyLandingLayout,
  LazyLandingPage,
  LazyViewLeaguePage,
} from "./lazy-routes";

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
      {
        path: "view-league/:id",
        Component: LazyViewLeaguePage, // Assuming you want to render the same component for viewing a league
      },
    ],
  },
]);
