import Vue from 'vue'
import Vuex from 'vuex'
// DECODIFICAR 
import decode from 'jwt-decode'
import router from '../store'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: "",
    usuarioLogged: ""
  },
  mutations: {
    getUser(state, payload) {
      console.log("payload", payload);
      state.token = payload;
      if (payload == '') {
        state.usuarioLogged = ""
      } else {
        state.usuarioLogged = decode(payload);
        // lo mando a notas
        router.push({ name: 'notas' })
      }
    }
  },
  actions: {
    authUser({ commit }, payload) {
      localStorage.setItem('token', payload);
      commit('getUser', payload);
    },

    readToken({ commit }) {
      const token = localStorage.getItem('token');
      if (token) {
        commit('getUser', token);
      } else {
        commit('getUser', '');

      }
    },

    loggout({ commit }) {
      // payload vacio
      commit('getUser', '');
      localStorage.removeItem('token');
      router.push({ name: 'login' })
    },
  },
  get: {
    // !! SIEMPRE QUE EXISTA
    estaActivo: state => !!state.token
  }
})
