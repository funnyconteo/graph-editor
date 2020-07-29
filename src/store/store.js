import Vue from "vue";
import Vuex from "vuex";
import ajax, { portGraph, urlGraph } from "./api";
import jwtDecode from "jwt-decode";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    activeNode: null,
    nameBackUp: "",
    loadedGraph: false,
    showModal: false,
    validError: false,
    graphType: "literal",
    token: localStorage.getItem('id_token') !== null ? localStorage.getItem('id_token') : null,
    auth: localStorage.getItem('id_token') !== null ? jwtDecode(localStorage.getItem('id_token')) : null,
    activeLink: "",
    mainItem: {},
    graphData: [],
    graphList: [],
    settings: [],
    algorithms: [],
    yargyRules: []
  },
  mutations: {
    SET_ACTIVE_NODE(state, node) {
      state.activeNode = node;
    },
    SET_MAIN_ITEM(state, item) {
      state.mainItem = item;
    },
    SET_NAME_BACKUP(state, name) {
      state.nameBackUp = name;
    },
    SET_GRAPH_LIST(state, list) {
      state.graphList = list;
    },
    SET_GRAPH(state, graph) {
      state.graphData = graph;
    },
    SET_LOAD_GRAPH(state, bool) {
      state.loadedGraph = bool;
    },
    SET_ACTIVE_LINK(state, link) {
      state.activeLink = link;
    },
    SET_SHOW_MODAL(state, bool) {
      state.showModal = bool;
    },
    SET_SETTINGS(state, settings) {
      state.settings = settings;
    },
    SET_ALGORITHMS(state, algorithms) {
      state.algorithms = algorithms;
    },
    SET_GRAPH_TYPE(state, type) {
      state.graphType = type;
    },
    SET_VALID_ERROR(state, bool) {
      state.validError = bool;
    },
    SET_YARGY_RULES(state, yargyRules) {
      state.yargyRules = yargyRules;
    }
  },
  actions: {
    getGraphList({ commit }) {
      return ajax().get(`api/get_graph_names/`).then(response => {
        commit("SET_GRAPH_LIST", response.data);
      });
    },

    getGraph({ commit }, link) {
      return ajax().get(`api/get_graph?doc_type=${link}`).then(response => {
        commit("SET_GRAPH", response.data);
      });
    },

    fetchEditGraph({ commit }, graph) {
      return ajax().post("api/post_graph/", graph);
    },

    deleteGraph({ commit }, graph) {
      const formData = new FormData();
      formData.append("doc_type", `${urlGraph}${portGraph}/lego/data/${graph}`);
      return ajax().post("api/delete_graph/", formData);
    },

    getSettings({ commit }) {
      return ajax().get("api/settings/");
    },

    fetchSettings({ commit }, settings) {
      return ajax().put("api/settings/", settings);
    },

    getAlgorithms({ commit }) {
      return ajax().get("api/oidc_algorithms/")
        .then(response => commit("SET_ALGORITHMS", response.data));
    },

    getYargyRules({ commit }) {
      return ajax().get("api/yargy_rules/")
        .then(response => commit("SET_YARGY_RULES", response.data));
    }
  }
});
