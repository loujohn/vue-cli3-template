import homeLayout from "../components/layout";

const childRoutesName = ["project", "echart"];

const childRoutesConf = childRoutesName.map(
  name => require(`./${name}`).default
);

export default [
  {
    path: "/login",
    component: () => import("@/components/login")
  },
  {
    path: "/",
    component: homeLayout,
    redirect: "home",
    children: [
      {
        path: "home",
        component: () => import("../views/home")
      }
    ]
  }
]
  .concat(childRoutesConf)
  .concat({
    path: "*",
    name: "404",
    component: () => import("../views/404")
  });
