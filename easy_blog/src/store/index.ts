import { createStore } from "vuex";

export default createStore({
  state: {
    isLogin: false,
    username: ""
  },
  mutations: {
    setIsLogin(state, log) {
      state.isLogin = log;
    },
    setUsername(state, username) {
      state.username = username;
    }
  },
  actions: {},
  modules: {}
});
