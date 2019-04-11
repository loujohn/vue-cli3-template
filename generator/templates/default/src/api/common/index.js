import $http from "httpTool";
export default {
  login(user) {
    return $http.fetch({
      method: "post",
      url: "/login",
      data: user
    });
  }
};
