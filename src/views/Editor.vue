<template>
  <div class="editor">
    <header>
      <v-block-header titleBold="Редактор Rdf-графов" iconName="editor-white"/>
      <subheader-menu
        @showCreateGraph="createNewGraph = true"
        @deleteGraph="showModalGraphDelete = true"
        @showCloneGraph="showModalGraphClone = true"
      />
    </header>
    <div class="editor__content">
      <graph :graphData="graphData">
        <graph-list class="graph-list"/>
        <edit
          class="edit"
          v-if="activeNode"
          :titleBold="activeLink"
          @deleteElem="showModalConfirmed = true"
          @saveChanges="saveChanges()"
        >
          <template
            v-if="
              (activeNode.predicate === 'lego:AttrName') ||
                activeNode.predicate === 'lego:cardinality' ||
                activeNode.predicate === 'lego:hasAttribute' ||
                activeNode.predicate === 'lego:default' ||
                !activeNode.predicate
            "
          >
            <v-input
              :inputData="{ label: 'название атрибута', id: 1 }"
              v-model="activeNode.name"
              :disabled="
                activeNode.predicate === 'lego:cardinality' ? true : false
              "
              :changed="isChanged(activeNode.name, activeNode.fullName)"
            />
          </template>
          <v-textarea
            v-if="activeNode.predicate === 'lego:GetElementsRule'"
            :inputData="{ id: 1, label: 'Выражение' }"
            :changed="isChanged(activeNode.name, activeNode.fullName)"
            v-model="activeNode.name"
          />
          <div
            class="add__body--textareas"
            v-if="
              activeNode.predicate === 'lego:YargyRegExpFilter' ||
                activeNode.predicate === 'lego:RegExpRule'
            "
          >
            <template v-if="Array.isArray(activeNode.name)">
              <v-textarea
                v-for="(name, i) in activeNode.name"
                isDeleted
                @roundButtonAction="textAreaDelete(i)"
                :key="i"
                :changed="isChanged(activeNode.name, activeNode.fullName, i)"
                :inputData="{ id: i, label: `Выражение ${i + 1}` }"
                v-model="activeNode.name[i]"
              />
            </template>
            <v-textarea
              v-if="!Array.isArray(activeNode.name)"
              isDeleted
              @roundButtonAction="textAreaDelete(i)"
              :changed="isChanged(activeNode.name, activeNode.fullName)"
              :inputData="{ id: 1, label: 'Выражение' }"
              v-model="activeNode.name"
            />
          </div>

          <div class="add__body--yargy" v-if="activeNode.predicate === 'lego:YargyRule'">
            <div class="add__body--yargy-wrap">
              <v-radio-button v-model="radioButtonValue" value="1"/>

              <div class="select">
                <label class="select__label">Yargy правило</label>
                <select class="select__input"
                        :disabled="radioButtonValue === '2'"
                        v-model="activeNode.name">
                  <option class="select__option"
                          v-for="select in yargyRules"
                          :key="select.id"
                          :value="select.yargy_rule">
                    {{select.ufn}}
                  </option>
                </select>
              </div>

            </div>
            <div class="add__body--yargy-wrap">
              <v-radio-button v-model="radioButtonValue" value="2"/>
              <v-textarea :inputData="{id: 1, label: 'Yargy правило'}"
                          v-model="activeNode.name"
                          :disabled="radioButtonValue === '1'"/>
            </div>
          </div>

          <div
            class="add__body--number"
            v-if="activeNode.predicate === 'lego:Span'"
          >
            <span>От</span>
            <v-input
              :inputData="{ id: 1 }"
              v-model="activeNode.name[0]"
              :disabled="checkboxValue"
              :changed="isChanged(activeNode.name, activeNode.fullName, 0)"
              type="number"
            />
            <span>до</span>
            <v-input
              :inputData="{ id: 2 }"
              v-model="activeNode.name[1]"
              :disabled="checkboxValue"
              :changed="isChanged(activeNode.name, activeNode.fullName, 1)"
              type="number"
            />
          </div>
          <v-check-box
            v-model="checkboxValue"
            v-if="activeNode.predicate === 'lego:Span'"
            label="По всему документу"
          />
          <v-round-button
            v-if="
              (activeNode.svgIcon &&
                activeNode.predicate === 'lego:YargyRegExpFilter') ||
                activeNode.predicate === 'lego:RegExpRule'
            "
            @roundButtonAction="addNewAttribute()"
            opacity
          />
        </edit>
        <div :class="['button-wrapper', {'button-wrapper--indent' : activeNode}]"
             v-if="activeLink">
          <v-round-button
            v-if="activeNode"
            @roundButtonAction="addNode = true"
            :disabled="activeNode.svgIcon ? true : false"
          />
          <v-round-button
            v-if="activeNode"
            @roundButtonAction="addLiteral = true"
            green
            :disabled="activeNode.svgIcon ? true : false"
          />
          <v-round-button
            @roundButtonAction="changeGraph()"
            :iconName="graphType"
          />
        </div>
        <v-preloader v-if="loadedGraph"></v-preloader>
      </graph>
    </div>
    <add-menu
      titleBold="Добавление узла"
      v-if="addNode"
      @hideNodeMenu="addNode = false"
      @addNewNode="addNewNode()"
      :selectAddData="selectAddNodeData"
      :isNode="true"
      ref="addNode"
    />
    <add-menu
      titleBold="Добавление литерала"
      v-if="addLiteral"
      @hideNodeMenu="addLiteral = false"
      @addNewNode="addNewLiteral()"
      :selectAddData="selectAddLiteralData"
      ref="addLiteral"
    />
    <add-menu
      titleBold="Создание графа"
      v-if="createNewGraph"
      @hideNodeMenu="createNewGraph = false"
      @addNewNode="createGraph()"
      :selectAddData="selectAddLiteralData"
      :isCreateGraph="true"
      ref="createNewGraph"
    />
    <v-modal v-if="showModal" @closeModal="modalClose()">
      {{ modalNotification }}
    </v-modal>
    <v-modal
      v-if="showModalConfirmed"
      isConfirmed
      modalTitle="Удаление"
      @confirmModal="deleteElem()"
      @closeModal="showModalConfirmed = false"
    >
      {{ modalConfirmNotification }}
    </v-modal>
    <v-modal
      v-if="showModalGraphDelete"
      isConfirmed
      modalTitle="Удаление"
      @confirmModal="deleteGraph()"
      @closeModal="showModalGraphDelete = false"
    >
      Уверены, что хотите удалить граф {{ activeLink }}?
    </v-modal>
    <v-modal
      v-if="showModalGraphClone"
      isConfirmed
      modalTitle="Клонирование графа"
      @confirmModal="cloneGraph()"
      @closeModal="showModalGraphClone = false"
    >
      <span>Введите новое название графа</span>
      <v-input class="modal-input" :inputData="{ id: 1 }" v-model="cloneName"/>
      <span class="modal__error" v-if="validError">
        Название графа может содержать только цифры, латинские буквы и символ
        "_"
      </span>
    </v-modal>
    <v-modal
      v-if="showModalGraphCreate"
      isConfirmed
      modalTitle="Удаление"
      @confirmModal="delCreateGraph()"
      @closeModal="showModalGraphCreate = false"
    >
      Граф с таким названием уже существует, заменить?
    </v-modal>
  </div>
</template>

<script>
  import GraphList from "@/components/GraphList.vue";
  import Graph from "@/components/Graph.vue";
  import Edit from "@/components/Edit.vue";
  import VBlockHeader from "@/components/VBlockHeader.vue";
  import SubheaderMenu from "@/components/SubheaderMenu.vue";
  import VRoundButton from "@/components/VRoundButton.vue";
  import AddMenu from "@/components/AddMenu.vue";
  import VInput from "@/components/VInput.vue";
  import VTextarea from "@/components/VTextarea.vue";
  import VCheckBox from "@/components/VCheckBox.vue";
  import VPreloader from "@/components/VPreloader.vue";
  import VModal from "@/components/VModal.vue";
  import VRadioButton from "@/components/VRadioButton";
  import {urlGraph, portGraph} from "@/store/api.js";

  import jsonld from "jsonld";

  export default {
    name: "Editor",
    components: {
      Graph,
      Edit,
      GraphList,
      VBlockHeader,
      SubheaderMenu,
      VRoundButton,
      AddMenu,
      VInput,
      VTextarea,
      VCheckBox,
      VPreloader,
      VRadioButton,
      VModal
    },
    data: () => ({
      addNode: false,
      addLiteral: false,
      createNewGraph: false,
      showModalConfirmed: false,
      showModalGraphDelete: false,
      showModalGraphClone: false,
      checkboxValue: false,
      showModalGraphCreate: false,
      cloneName: "",
      radioButtonValue: "2",
      modalNotification: "Некорректные данные",
      modalConfirmNotification: "Вы увренеы, что хотите удалить элемент?",
      mainFetchItem: {},
      selectAddNodeData: [{value: "lego:hasAttribute", id: 1}],
      selectAddLiteralData: [
        {value: "lego:AttrName", id: 1},
        {value: "lego:GetElementsRule", id: 2},
        {value: "lego:YargyRegExpFilter", id: 3},
        {value: "lego:RegExpRule", id: 4},
        {value: "lego:YargyRule", id: 5},
        {value: "lego:Span", id: 6},
        {value: "lego:cardinality", id: 7},
        {value: "lego:default", id: 8}
      ]
    }),
    computed: {
      graphData() {
        return this.$store.state.graphData;
      },
      activeLink() {
        return this.$store.state.activeLink;
      },
      showModal() {
        return this.$store.state.showModal;
      },
      activeNode() {
        return this.$store.state.activeNode;
      },
      mainItem() {
        return this.$store.state.mainItem;
      },
      loadedGraph() {
        return this.$store.state.loadedGraph;
      },
      graphType() {
        return this.$store.state.graphType;
      },
      validError() {
        return this.$store.state.validError;
      },
      yargyRules() {
        return this.$store.state.yargyRules;
      },
      graphList() {
        return this.$store.state.graphList
      },
      inputNodeValue: {
        cache: false,
        get() {
          return this.$refs.addNode.inputValue;
        }
      },
      selectNodeValue: {
        cache: false,
        get() {
          return this.$refs.addNode.nodeAttribute;
        }
      },
      inputLiteralValue: {
        cache: false,
        get() {
          return this.$refs.addLiteral.inputValue;
        }
      },
      selectLiteralValue: {
        cache: false,
        get() {
          return this.$refs.addLiteral.selectValue;
        }
      },
      inputNewGraphValue: {
        cache: false,
        get() {
          return this.$refs.createNewGraph.inputValue;
        }
      }
    },
    mounted() {
      this.getGraphList();
      this.getYargyRules();
    },
    methods: {
      async addNewNode() {
        this.$store.commit("SET_LOAD_GRAPH", true);
        this.mainFetchItem = JSON.parse(JSON.stringify(this.mainItem));
        for (let fKey in this.mainFetchItem) {
          if (
            this.mainFetchItem[fKey] === this.activeNode.fullName &&
            this.selectNodeValue &&
            this.inputNodeValue
          ) {
            if (
              this.mainFetchItem[this.selectNodeValue] &&
              Object.getPrototypeOf(this.mainFetchItem[this.selectNodeValue]) ===
              Object.prototype
            ) {
              const obj = JSON.parse(
                JSON.stringify(this.mainFetchItem[this.selectNodeValue])
              );
              this.mainFetchItem[this.selectNodeValue] = [obj];
              this.mainFetchItem[this.selectNodeValue].push({
                "@id": this.inputNodeValue
              });
            } else if (
              this.mainFetchItem[this.selectNodeValue] &&
              Array.isArray(this.mainFetchItem[this.selectNodeValue])
            ) {
              this.mainFetchItem[this.selectNodeValue].push({
                "@id": this.inputNodeValue
              });
            } else {
              this.mainFetchItem[this.selectNodeValue] = {
                "@id": this.inputNodeValue
              };
            }
            this.$store.commit("SET_MAIN_ITEM", this.mainFetchItem);
            this.addNode = false;
          } else {
            this.findNode(this.mainFetchItem[fKey]);
          }
        }
        const flattened = await jsonld.flatten(this.mainFetchItem);
        let id;
        await this.graphData.forEach(item => (id = item));
        const fetchLD = [{"@graph": flattened, "@id": id["@id"]}];
        this.$store
          .dispatch("fetchEditGraph", fetchLD)
          .then(() => this.$store.commit("SET_LOAD_GRAPH", false))
          .catch(() => {
            this.modalNotification = "Введено некорректное имя";
            this.$store.commit("SET_SHOW_MODAL", true);
            this.$store.dispatch("getGraph", this.activeLink);
          });
      },

      async addNewLiteral() {
        this.$store.commit("SET_LOAD_GRAPH", true);
        this.mainFetchItem = JSON.parse(JSON.stringify(this.mainItem));
        for (let fKey in this.mainFetchItem) {
          if (
            this.mainFetchItem[fKey] === this.activeNode.fullName &&
            this.selectLiteralValue &&
            this.inputLiteralValue
          ) {
            this.mainFetchItem[this.selectLiteralValue] = this.inputLiteralValue;
            this.$store.commit("SET_MAIN_ITEM", this.mainFetchItem);
            this.addLiteral = false;
          } else {
            this.findLiteral(this.mainFetchItem[fKey]);
          }
        }
        const flattened = await jsonld.flatten(this.mainFetchItem);
        let id;
        await this.graphData.forEach(item => (id = item));
        const fetchLD = [{"@graph": flattened, "@id": id["@id"]}];
        this.$store
          .dispatch("fetchEditGraph", fetchLD)
          .then(() => this.$store.commit("SET_LOAD_GRAPH", false));
      },

      findNode(item) {
        for (let sKey in item) {
          const tItem = item[sKey];
          if (Object.getPrototypeOf(tItem) === Object.prototype) {
            for (let tKey in tItem) {
              if (
                tItem[tKey] === this.activeNode.fullName &&
                this.selectNodeValue &&
                this.inputNodeValue
              ) {
                if (
                  tItem[this.selectNodeValue] &&
                  Object.getPrototypeOf(tItem[this.selectNodeValue]) ===
                  Object.prototype
                ) {
                  const obj = tItem[this.selectNodeValue];
                  tItem[this.selectNodeValue] = [obj];
                  tItem[this.selectNodeValue].push({
                    "@id": this.inputNodeValue
                  });
                } else if (
                  tItem[this.selectNodeValue] &&
                  Array.isArray(tItem[this.selectNodeValue])
                ) {
                  tItem[this.selectNodeValue].push({
                    "@id": this.inputNodeValue
                  });
                } else {
                  tItem[this.selectNodeValue] = {"@id": this.inputNodeValue};
                }
                this.$store.commit("SET_MAIN_ITEM", this.mainFetchItem);
                this.addNode = false;
              } else if (
                Object.getPrototypeOf(tItem[tKey]) === Object.prototype ||
                Array.isArray(tItem[tKey])
              ) {
                this.findNode(tItem[tKey]);
              }
            }
          } else if (Array.isArray(tItem)) {
            tItem.forEach(q => {
              for (let tKey in q) {
                if (
                  q[tKey] === this.activeNode.fullName &&
                  this.selectNodeValue &&
                  this.inputNodeValue
                ) {
                  if (
                    q[this.selectNodeValue] &&
                    Object.getPrototypeOf(q[this.selectNodeValue]) ===
                    Object.prototype
                  ) {
                    const obj = q[this.selectNodeValue];
                    q[this.selectNodeValue] = [obj];
                    q[this.selectNodeValue].push({"@id": this.inputNodeValue});
                  } else if (
                    q[this.selectNodeValue] &&
                    Array.isArray(q[this.selectNodeValue])
                  ) {
                    q[this.selectNodeValue].push({"@id": this.inputNodeValue});
                  } else {
                    q[this.selectNodeValue] = {"@id": this.inputNodeValue};
                  }
                  this.$store.commit("SET_MAIN_ITEM", this.mainFetchItem);
                  this.addNode = false;
                } else if (
                  Object.getPrototypeOf(q[tKey]) === Object.prototype ||
                  Array.isArray(q[tKey])
                ) {
                  this.findNode(q[tKey]);
                }
              }
            });
          } else if (
            item[sKey] === this.activeNode.fullName &&
            this.selectNodeValue &&
            this.inputNodeValue
          ) {
            if (
              item[this.selectNodeValue] &&
              Object.getPrototypeOf(item[this.selectNodeValue]) ===
              Object.prototype
            ) {
              const obj = item[this.selectNodeValue];
              item[this.selectNodeValue] = [obj];
              item[this.selectNodeValue].push({"@id": this.inputNodeValue});
            } else if (
              item[this.selectNodeValue] &&
              Array.isArray(item[this.selectNodeValue])
            ) {
              item[this.selectNodeValue].push({"@id": this.inputNodeValue});
            } else {
              item[this.selectNodeValue] = {"@id": this.inputNodeValue};
            }
            this.$store.commit("SET_MAIN_ITEM", this.mainFetchItem);
            this.addNode = false;
          }
        }
      },

      findLiteral(item) {
        for (let sKey in item) {
          const tItem = item[sKey];
          if (Object.getPrototypeOf(tItem) === Object.prototype) {
            for (let tKey in tItem) {
              if (
                tItem[tKey] === this.activeNode.fullName &&
                this.selectLiteralValue &&
                this.inputLiteralValue
              ) {
                tItem[this.selectLiteralValue] = this.inputLiteralValue;
                this.$store.commit("SET_MAIN_ITEM", this.mainFetchItem);
                this.addLiteral = false;
              } else if (
                Object.getPrototypeOf(tItem[tKey]) === Object.prototype ||
                Array.isArray(tItem[tKey])
              ) {
                this.findLiteral(tItem[tKey]);
              }
            }
          } else if (Array.isArray(tItem)) {
            tItem.forEach(q => {
              for (let tKey in q) {
                if (
                  q[tKey] === this.activeNode.fullName &&
                  this.selectLiteralValue &&
                  this.inputLiteralValue
                ) {
                  q[this.selectLiteralValue] = this.inputLiteralValue;
                  this.$store.commit("SET_MAIN_ITEM", this.mainFetchItem);
                  this.addLiteral = false;
                } else if (
                  Object.getPrototypeOf(q[tKey]) === Object.prototype ||
                  Array.isArray(q[tKey])
                ) {
                  this.findLiteral(q[tKey]);
                }
              }
            });
          } else if (
            item[sKey] === this.activeNode.fullName &&
            this.selectLiteralValue &&
            this.inputLiteralValue
          ) {
            item[this.selectLiteralValue] = this.inputLiteralValue;
            this.$store.commit("SET_MAIN_ITEM", this.mainFetchItem);
            this.addLiteral = false;
          }
        }
      },

      async deleteElem() {
        this.$store.commit("SET_LOAD_GRAPH", true);
        this.showModalConfirmed = false;
        this.mainFetchItem = JSON.parse(JSON.stringify(this.mainItem));
        for (let fKey in this.mainFetchItem) {
          if (this.mainFetchItem[fKey] === this.activeNode.fullName) {
            if (fKey === "@id") {
              this.mainFetchItem = {};
              this.$store.commit("SET_MAIN_ITEM", this.mainFetchItem);
            } else if (
              this.mainFetchItem["@id"] === this.activeNode.tid &&
              fKey === this.activeNode.predicate
            ) {
              delete this.mainFetchItem[fKey];
              this.$store.commit("SET_MAIN_ITEM", this.mainFetchItem);
            }
          } else {
            this.findDelElem(this.mainFetchItem, fKey);
          }
        }
        const flattened = await jsonld.flatten(this.mainFetchItem);
        let id;
        await this.graphData.forEach(item => (id = item));
        const fetchLD = [{"@graph": flattened, "@id": id["@id"]}];
        this.$store.dispatch("fetchEditGraph", fetchLD).then(() => {
          this.$store.commit("SET_LOAD_GRAPH", false);
          this.$store.commit("SET_ACTIVE_NODE", null);
        });
      },

      findDelElem(node, key) {
        const item = node[key];
        for (let sKey in item) {
          let tItem = item[sKey];
          if (tItem && Object.getPrototypeOf(tItem) === Object.prototype) {
            for (let tKey in tItem) {
              if (String(tItem[tKey]) === String(this.activeNode.fullName)) {
                if (tKey === "@id") {
                  delete item[sKey];
                  this.$store.commit("SET_MAIN_ITEM", this.mainFetchItem);
                } else if (
                  tItem["@id"] === this.activeNode.tid &&
                  tKey === this.activeNode.predicate
                ) {
                  delete tItem[tKey];
                  this.$store.commit("SET_MAIN_ITEM", this.mainFetchItem);
                }
              } else {
                this.findDelElem(tItem, tKey);
              }
            }
          } else if (tItem && Array.isArray(tItem)) {
            tItem.forEach(q => {
              for (let tKey in q) {
                if (String(q[tKey]) === String(this.activeNode.fullName)) {
                  if (tKey === "@id") {
                    tItem.splice([tItem.indexOf(q)], 1);
                    this.$store.commit("SET_MAIN_ITEM", this.mainFetchItem);
                  } else if (
                    q["@id"] === this.activeNode.tid &&
                    tKey === this.activeNode.predicate
                  ) {
                    delete q[tKey];
                    this.$store.commit("SET_MAIN_ITEM", this.mainFetchItem);
                  }
                } else {
                  this.findDelElem(q, tKey);
                }
              }
            });
          } else if (String(item[sKey]) === String(this.activeNode.fullName)) {
            if (sKey === "@id") {
              delete node[key];
              this.$store.commit("SET_MAIN_ITEM", this.mainFetchItem);
            } else if (
              item["@id"] === this.activeNode.tid &&
              sKey === this.activeNode.predicate
            ) {
              delete item[sKey];
              this.$store.commit("SET_MAIN_ITEM", this.mainFetchItem);
            }
          }
        }
      },

      async saveChanges() {
        this.$store.commit("SET_LOAD_GRAPH", true);
        this.mainFetchItem = JSON.parse(JSON.stringify(this.mainItem));
        for (let fKey in this.mainFetchItem) {
          if (this.mainFetchItem[fKey] === this.activeNode.fullName) {
            if (fKey === "@id") {
              this.mainFetchItem[fKey] = this.activeNode.name;
              this.$store.commit("SET_MAIN_ITEM", this.mainFetchItem);
            } else {
              if (
                Array.isArray(this.activeNode.name) &&
                this.mainFetchItem["@id"] === this.activeNode.tid
              ) {
                this.mainFetchItem[fKey] = this.activeNode.name.join(";");
                this.$store.commit("SET_MAIN_ITEM", this.mainFetchItem);
              } else if (this.mainFetchItem["@id"] === this.activeNode.tid) {
                this.mainFetchItem[fKey] = this.activeNode.name;
                this.$store.commit("SET_MAIN_ITEM", this.mainFetchItem);
              }
            }
          } else {
            this.findChangedElement(this.mainFetchItem[fKey]);
          }
        }
        const flattened = await jsonld.flatten(this.mainFetchItem);
        let id;
        await this.graphData.forEach(item => (id = item));
        const fetchLD = [{"@graph": flattened, "@id": id["@id"]}];
        this.$store.dispatch("fetchEditGraph", fetchLD).then(() => {
          this.$store.commit("SET_LOAD_GRAPH", false);
          this.$store.commit("SET_ACTIVE_NODE", null);
        });
      },

      findChangedElement(item) {
        for (let sKey in item) {
          let tItem = item[sKey];
          if (Object.getPrototypeOf(tItem) === Object.prototype) {
            for (let tKey in tItem) {
              if (tItem[tKey] === this.activeNode.fullName) {
                if (tKey === "@id") {
                  tItem[tKey] = this.activeNode.name;
                  this.$store.commit("SET_MAIN_ITEM", this.mainFetchItem);
                } else {
                  if (
                    Array.isArray(this.activeNode.name) &&
                    item["@id"] === this.activeNode.tid
                  ) {
                    tItem[tKey] = this.activeNode.name.join(";");
                    this.$store.commit("SET_MAIN_ITEM", this.mainFetchItem);
                  } else if (tItem["@id"] === this.activeNode.tid) {
                    tItem[tKey] = this.activeNode.name;
                    this.$store.commit("SET_MAIN_ITEM", this.mainFetchItem);
                  }
                }
              } else if (
                Object.getPrototypeOf(tItem[tKey]) === Object.prototype ||
                Array.isArray(tItem[tKey])
              ) {
                this.findChangedElement(tItem[tKey]);
              }
            }
          } else if (Array.isArray(tItem)) {
            tItem.forEach(q => {
              for (let tKey in q) {
                if (q[tKey] === this.activeNode.fullName) {
                  if (tKey === "@id") {
                    q[tKey] = this.activeNode.name;
                    this.$store.commit("SET_MAIN_ITEM", this.mainFetchItem);
                  } else {
                    if (
                      Array.isArray(this.activeNode.name) &&
                      q["@id"] === this.activeNode.tid
                    ) {
                      q[tKey] = this.activeNode.name.join(";");
                      this.$store.commit("SET_MAIN_ITEM", this.mainFetchItem);
                    } else if (q["@id"] === this.activeNode.tid) {
                      q[tKey] = this.activeNode.name;
                      this.$store.commit("SET_MAIN_ITEM", this.mainFetchItem);
                    }
                  }
                } else if (
                  Object.getPrototypeOf(q[tKey]) === Object.prototype ||
                  Array.isArray(q[tKey])
                ) {
                  this.findChangedElement(q[tKey]);
                }
              }
            });
          } else if (tItem === this.activeNode.fullName) {
            if (sKey === "@id") {
              tItem = this.activeNode.name;
              this.$store.commit("SET_MAIN_ITEM", this.mainFetchItem);
            } else {
              if (
                Array.isArray(this.activeNode.name) &&
                item["@id"] === this.activeNode.tid
              ) {
                tItem = this.activeNode.name.join(";");
                this.$store.commit("SET_MAIN_ITEM", this.mainFetchItem);
              } else if (item["@id"] === this.activeNode.tid) {
                tItem = this.activeNode.name;
                this.$store.commit("SET_MAIN_ITEM", this.mainFetchItem);
              }
            }
          }
        }
      },

      delCreateGraph() {
        this.$store.commit("SET_LOAD_GRAPH", true);
        this.$store.dispatch("deleteGraph", this.inputNewGraphValue)
          .then(() => {
            const newGraph = [
              {
                "@graph": [
                  {
                    "@id": `lego:${this.inputNewGraphValue}`,
                    "lego:hasAttribute": {"@id": "lego:new_node_1"}
                  }
                ],
                "@id": `${urlGraph}${portGraph}/lego/data/${this.inputNewGraphValue}`
              }
            ];
            this.$store.dispatch("fetchEditGraph", newGraph).then(() => {
              this.$store.dispatch("getGraphList");
              this.showModalGraphCreate = false;
              this.createNewGraph = false;
              this.$store.commit("SET_LOAD_GRAPH", false);
            });
          })
      },

      createGraph() {
        let val = /\w/;
        if (val.test(this.inputNewGraphValue)) {
          const graph = this.graphList.find(item => item === this.inputNewGraphValue);
          if(graph) {
            this.showModalGraphCreate = true
          } else {
            this.$store.commit("SET_LOAD_GRAPH", true);
            const newGraph = [
              {
                "@graph": [
                  {
                    "@id": `lego:${this.inputNewGraphValue}`,
                    "lego:hasAttribute": {"@id": "lego:new_node_1"}
                  }
                ],
                "@id": `${urlGraph}${portGraph}/lego/data/${this.inputNewGraphValue}`
              }
            ];
            this.$store.dispatch("fetchEditGraph", newGraph).then(() => {
              this.$store.dispatch("getGraphList");
              this.createNewGraph = false;
              this.$store.commit("SET_LOAD_GRAPH", false);
            });
          }
        } else {
          this.$store.commit("SET_VALID_ERROR", true);
        }
      },

      async cloneGraph() {
        let val = /\w/;
        if (val.test(this.cloneName)) {
          this.showModalGraphClone = false;
          this.$store.commit("SET_LOAD_GRAPH", true);
          const flattened = await jsonld.flatten(
            JSON.parse(
              JSON.stringify(this.mainItem).replace(
                this.activeLink,
                this.cloneName
              )
            )
          );
          const newGraph = [
            {
              "@graph": flattened,
              "@id": `${urlGraph}${portGraph}/lego/data/${this.cloneName}`
            }
          ];
          this.$store.dispatch("fetchEditGraph", newGraph).then(() => {
            this.$store.dispatch("getGraphList");
            this.$store.commit("SET_LOAD_GRAPH", false);
          });
        } else {
          this.$store.commit("SET_VALID_ERROR", true);
        }
      },

      addNewAttribute() {
        if (Array.isArray(this.activeNode.name)) {
          this.activeNode.name.push("");
        } else {
          const name = this.activeNode.name;
          this.activeNode.name = [name];
          this.activeNode.name.push("");
        }
      },

      getGraphList() {
        this.$store.dispatch("getGraphList");
      },

      isChanged(name, fullName, i) {
        if (Array.isArray(name)) {
          if (fullName.split(";")[i] === name[i]) {
            return false;
          } else return true;
        } else {
          if (fullName === name) {
            return false;
          } else return true;
        }
      },

      deleteGraph() {
        this.$store.commit("SET_LOAD_GRAPH", true);
        this.$store.dispatch("deleteGraph", this.activeLink).then(() => {
          this.$store.dispatch("getGraphList");
          this.showModalGraphDelete = false;
          this.$store.commit("SET_ACTIVE_LINK", null);
          this.$store.commit("SET_MAIN_ITEM", {});
          this.$store.commit("SET_LOAD_GRAPH", false);
        });
      },

      modalClose() {
        this.$store.commit("SET_SHOW_MODAL", false);
        this.modalNotification = "Некорректные данные";
      },

      changeGraph() {
        if (this.graphType === "node") {
          this.$store.commit("SET_GRAPH_TYPE", "literal");
        } else {
          this.$store.commit("SET_GRAPH_TYPE", "node");
        }
      },

      textAreaDelete(i) {
        this.activeNode.name.splice(i, 1)
      },

      getYargyRules() {
        this.$store.dispatch("getYargyRules")
      },
    },
    watch: {
      checkboxValue() {
        if (this.checkboxValue) {
          (this.activeNode.name[0] = "0"),
            (this.activeNode.name[1] = "9223372036854775807");
        } else {
          this.activeNode.name[0] = this.activeNode.fullName.split(";")[0];
          this.activeNode.name[1] = this.activeNode.fullName.split(";")[1];
        }
      },

      activeNode() {
        if (this.activeNode && this.activeNode.predicate === "lego:YargyRule") {
          if (this.yargyRules.find(item => item.yargy_rule === this.activeNode.name)) {
            this.radioButtonValue = '1'
          } else {
            this.radioButtonValue = '2'
          }
        }
      },

      cloneName() {
        if (this.validError) {
          this.$store.commit("SET_VALID_ERROR", false);
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .editor {
    width: 100%;
    height: 100%;
    position: relative;

    &__content {
      display: flex;
      position: relative;
      width: 100%;
      height: calc(100% - 75px);
    }
  }

  .add__body {
    padding: 25px 20px 20px;

    &--number {
      display: flex;
      justify-content: space-between;
      color: #e7edf2;

      .input {
        width: 30%;
      }
    }

    &--yargy-wrap {
      display: flex;
      align-items: center;
    }
  }

  .graph-list,
  .edit {
    position: absolute;
    top: 0;
  }

  .graph-list {
    left: 0;
  }

  .edit {
    right: 0;
  }

  .button-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: absolute;
    top: 10px;
    right: 0;
    z-index: 10;

    &--indent {
      right: 21%;
    }
  }

  .modal-input {
    margin-top: 15px;
    margin-bottom: 0;
  }

  .modal__error {
    margin-top: 15px;
    display: block;
    font-size: 12px;
  }

  .select {
    width: 100%;
    padding-bottom: 20px;
    display: flex;
    flex-direction: column;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      display: block;
      bottom: 29px;
      right: 10px;
      border: 4px solid transparent;
      border-top: 4px solid #e7edf2;
    }

    &__label {
      font-size: 10px;
      text-transform: uppercase;
      display: block;
      padding-bottom: 5px;
    }

    &__input {
      padding: 7px;
      width: 100%;
      background-color: #2a2a2a;
      color: #e7edf2;
      border: 1px solid #4a4a4a;
      transition: border-color .3s ease,
      background-color .3s ease;
      appearance: none;
      outline: none;

      &:hover,
      &:focus {
        border: 1px solid #6b6b6b;
      }

      &:disabled {
        background-color: #849096;

        &:hover {
          border: 1px solid #383838;
        }
      }
    }

    &__option {
      padding: 7px;
    }
  }
</style>
