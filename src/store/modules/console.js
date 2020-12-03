const type = {
  SET_CONSOLE: 'SET_CONSOLE'
};

const state = {
  con: true
};

const getters = {
  con: state => state.con
};

const mutations = {
  [type.SET_CONSOLE](state, con) {
    state.con = con;
  }
};

const actions = {
  setConsole: ({commit}, con) => {
    commit(type.SET_CONSOLE, con)
  }
};

export default {
  state,
  getters,
  mutations,
  actions
}
