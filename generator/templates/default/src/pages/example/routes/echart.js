import homeLayout from "../components/layout";

export default {
  path: "/",
  component: homeLayout,
  redirect: "echart",
  children: [
    {
      path: "echart",
      component: () => import("../views/echart")
    }
  ]
};
