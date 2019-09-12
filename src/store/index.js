import Vue from 'vue';
import Vuex from 'vuex';
import { common } from 'api';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userInfo: JSON.parse(sessionStorage.getItem('userInfo') || '{}'),
    token: sessionStorage.getItem('token') || '',
  },
  mutations: {
    SET_USER_INFO(state, userInfo) {
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
      state.userInfo = userInfo;
    },
    SET_TOKEN(state, token) {
      sessionStorage.setItem('token', token);
      state.token = token;
    },
  },
  actions: {
    LOGIN({ commit }, { username, password }) {
      return common.login({ username, password }).then(res => {
        const { data } = res;
        const {
          referenceInfo: { token },
        } = data;
        commit('SET_USER_INFO', data);
        commit('SET_TOKEN', token);
        return data;
      });
    },
  },
  getters: {
    xzqh: state => state.userInfo.xzqh,
    userName: state => state.userInfo.userName,
    realName: state => state.userInfo.realName,
  },
});
