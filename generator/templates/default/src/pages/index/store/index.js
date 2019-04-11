import generateStore from "@/store";
import actions from "./actions";
import mutations from "./mutations";
import modules from "./modules";
import state from "./state";

const store = generateStore({
  state,
  actions,
  mutations,
  modules
});

export default store;
