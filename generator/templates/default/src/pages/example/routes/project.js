import homeLayout from "../components/layout";
export default {
  path: "/project",
  component: homeLayout,
  redirect: "/project/directory-structure",
  children: [
    {
      path: "directory-structure",
      component: () => import("../views/project/directory-structure"),
      children: []
    }
  ]
};
