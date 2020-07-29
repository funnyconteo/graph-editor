<template>
  <aside class="graph-list">
    <v-block-header titleBold="Список графов" />
    <div class="search">
      <v-input
        class="search__input"
        placeholder="Искать..."
        :inputData="{ id: 1 }"
        v-model="search"
      />
    </div>
    <div class="graph-list__body">
      <template v-for="(name, i) in filteredList">
        <v-graph-select v-if="name"
                        :key="i"
                        :buttonData="name"
                        @selectGraph="selectGraph(name)"
                        :isActive="name === activeLink ? true : false"/>
      </template>
    </div>
    <v-preloader v-if="!graphList.length"></v-preloader>
  </aside>
</template>

<script>

  import VBlockHeader from "@/components/VBlockHeader.vue";
  import VGraphSelect from "@/components/VGraphSelect.vue";
  import VPreloader from "@/components/VPreloader.vue";
  import VInput from "@/components/VInput.vue";

  export default {
    name: "GraphList",
    components: {
      VBlockHeader,
      VGraphSelect,
      VPreloader,
      VInput
    },
    computed: {
      graphList() {
        return this.$store.state.graphList
      },
      activeLink() {
        return this.$store.state.activeLink
      },
      filteredList() {
        return this.graphList.filter(post => post.toLowerCase().includes(this.search.toLowerCase()))
      }
    },
    data:() => ({
      search: '',
    }),
    methods: {
      selectGraph(link) {
        this.$store.commit('SET_LOAD_GRAPH', true);
        this.$store.commit('SET_ACTIVE_NODE', null);
        this.$store.commit('SET_ACTIVE_LINK', link);
        this.$store.dispatch('getGraph', link)
          .then(() => this.$store.commit('SET_LOAD_GRAPH', false))
      }
    },
  }
</script>

<style lang="scss" scoped>

  .graph-list {
    width: 20%;
    height: calc(100vh - 160px);
    margin-top: 10px;
    background-color: #222222;
    border: 1px solid #383838;
    box-shadow: 3px 3px 5px -1px #000;
    overflow: hidden;
    z-index: 10;

    &__body {
      height: calc(100% - 78px);
      overflow: auto;
    }
  }

  .search {
    padding: 5px;
    background-color: #282828;
    display: flex;
    align-items: center;

    &__input {
      margin: 0;
    }
  }


</style>
