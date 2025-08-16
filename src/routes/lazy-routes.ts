import React from "react";

const LazyLandingLayout = React.lazy(
  () => import("../layouts/landing-page-layout/landing-page-layout")
);
const LazyLandingPage = React.lazy(
  () => import("../pages/landing-page/landing-page")
);

const LazyViewLeaguePage = React.lazy(
  () => import("../pages/view-league/view-league")
);

export { LazyLandingLayout, LazyLandingPage, LazyViewLeaguePage };
