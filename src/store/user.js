import Cookie from 'js-cookie'
export default {
  state: {
    token: '',
    username:''
  },
  mutations: {
    setToken(state, val) {
      state.token = val
      Cookie.set('token', val)
    },
    clearToken(state) {
      state.token = ''
      Cookie.remove('token')
    },
    getToken(state) {
      state.token = Cookie.get('token')
    },
    setUserName(state, val) {
      state.username = val
      Cookie.set('username', val)
    },
    clearUserName(state) {
      state.username = ''
      Cookie.remove('username')
    },
    getUserName(state) {
      state.username = Cookie.get('username')
    },
  },
  actions: {}
}
