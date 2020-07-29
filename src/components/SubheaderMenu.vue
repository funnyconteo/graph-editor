<template>
  <div class="subheader-menu">
    <button class="subheader-menu__button"
            @click="$emit('showCreateGraph')">
      <v-icons iconName="new" />
      <p>Создать</p>
    </button>
    <button class="subheader-menu__button"
            @click="$emit('deleteGraph')"
            :disabled="!activeLink">
      <v-icons iconName="delete" />
      <p>Удалить</p>
    </button>
    <button class="subheader-menu__button">
      <input class="subheader-menu__button-upload"
             type="file"
             @change="getJSON($event)"
             accept="json, json-ld">
      <v-icons iconName="import" />
      <p>Импорт</p>
    </button>
    <a :class="['subheader-menu__button', {'subheader-menu__button--disabled' : !Object.keys(mainItem).length}]"
       :href="'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(graphData))"
       :download="activeLink + '.json-ld'"
       target="_blank">
      <v-icons iconName="export" />
      <p>Экспорт</p>
    </a>
    <button class="subheader-menu__button"
            @click="$emit('showCloneGraph')"
            :disabled="!activeLink">
      <v-icons iconName="clone" />
      <p>Клонировать</p>
    </button>

    <v-modal
      v-if="showModalGraphImport"
      isConfirmed
      modalTitle="Импортирование"
      @confirmModal="importGraph()"
      @closeModal="showModalGraphImport = false"
    >
      Граф с таким названием уже существует, заменить?
    </v-modal>

    <v-modal
      v-if="importSuccess"
      modalTitle="Импортирование"
      @confirmModal="importGraph()"
      @closeModal="importSuccess = false"
    >
      Граф успешно добавлен
    </v-modal>
  </div>
</template>

<script>
  import VIcons from '@/components/VIcons'
  import VModal from "@/components/VModal.vue";

  export default {
    name: "SubheaderMenu",
    components: {
      VIcons,
      VModal
    },
    data: () => ({
      showModalGraphImport: false,
      importSuccess: false,
      importData: {}
    }),
    computed: {
      activeLink() {
        return this.$store.state.activeLink
      },
      graphList() {
        return this.$store.state.graphList
      },
      mainItem: {
        cache: false,
        get() {
          return this.$store.state.mainItem
        }
      },
      graphData: {
        cache: false,
        get() {
          return this.$store.state.graphData
        }
      },
    },
    methods: {
      getJSON(e) {
        let graph = null;
        const file = e.target.files[0];
        let reader = new FileReader();
        reader.onload = (event) => {
          this.importData = JSON.parse(event.target.result);
          graph = this.graphList.find(item => item === this.importData[0]['@id'].split('/')[this.importData[0]['@id'].split('/').length -1]);
          if(graph) {
              this.showModalGraphImport = true
          } else {
            this.$store.commit('SET_LOAD_GRAPH', true);
            this.$store.dispatch('fetchEditGraph', this.importData)
              .then(() => {
                this.$store.dispatch('getGraphList');
                this.$store.commit('SET_LOAD_GRAPH', false);
                this.importSuccess = true
              })
          }
        };
        reader.readAsText(file);
      },
      importGraph() {
        this.showModalGraphImport = false;
        this.$store.dispatch("deleteGraph", this.importData[0]['@id'].split('/')[this.importData[0]['@id'].split('/').length -1])
          .then(() => {
            this.$store.commit('SET_LOAD_GRAPH', true);
            this.$store.dispatch('fetchEditGraph', this.importData)
              .then(() => {
                this.$store.dispatch('getGraphList');
                this.$store.commit('SET_LOAD_GRAPH', false);
                this.importSuccess = true
              })
          })
      }
    }
  }
</script>

<style lang="scss" scoped>

  .subheader-menu {
    display: flex;
    align-items: center;
    background-color: #282828;

    &__button {
      background-color: transparent;
      position: relative;
      border: none;
      display: flex;
      align-items: center;
      overflow: hidden;
      cursor: pointer;
      outline: none;
      padding: 10px;
      z-index: 10;
      font-size: 13px;
      text-decoration: none;
      user-select: none;
      transition: background-color .3s ease,
                  opacity .2s ease;

      &-upload {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        opacity: 0;
        cursor: pointer;
        width: 100%;
      }

      &--disabled {
        opacity: .7;
        pointer-events: none;
      }

      &:disabled {
        opacity: 0.7;
        pointer-events: none;
      }

      &:hover {
        background: #444444;
      }

      &:active {
        opacity: .7;
      }
    }
  }

</style>
