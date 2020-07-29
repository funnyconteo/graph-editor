<template>
  <section class="graph">
    <d3-network
      ref="net"
      :net-nodes="nodes"
      :net-links="links"
      :options="options"
      @node-click="graphEvent"
    />
    <slot></slot>
  </section>
</template>

<script>
import D3Network from "@/lib/vue-d3-network.vue";
import jsonld from "jsonld";

const nodeIcon2 =
  "<svg>\n" +
  '  <rect width="100%" height="100%" x="0" y="0" rx="35" ry="100" />\n' +
  "</svg>";
export default {
  name: "graph",
  components: {
    D3Network
  },

  props: {
    graphData: Array
  },

  data: () => ({
    id: 0,
    nodes: [],
    links: [],
    secondId: -1,
    framedData: {}
  }),

  computed: {
    activeNode() {
      return this.$store.state.activeNode;
    },

    activeLink() {
      return this.$store.state.activeLink;
    },

    nameBackUp() {
      return this.$store.state.nameBackUp;
    },

    mainItem() {
      return this.$store.state.mainItem;
    },

    graphType() {
      return this.$store.state.graphType;
    },

    options() {
      return {
        force: 25000,
        nodeSize: 150,
        resizeListener: true,
        nodeLabels: true,
        linkLabels: true,
        canvas: false,
        linkWidth: 3,
        strLinks: true,
        dragging: false,
        fontSize: 16
      };
    }
  },

  watch: {
    async graphData() {
      this.framedData = {};
      this.framedData = await jsonld.frame(this.graphData, this.framedData);
      await this.getMainItem();
      if (this.graphType === "literal") {
        await this.nodesMethod();
        this.linksMethod();
      } else {
        await this.nodesMethodWL();
        this.linksMethodWL();
      }
    },

    async mainItem() {
      if (this.graphType === "literal") {
        await this.nodesMethod();
        this.linksMethod();
      } else {
        await this.nodesMethodWL();
        this.linksMethodWL();
      }
    },

    async graphType() {
      if (this.graphType === "literal") {
        await this.nodesMethod();
        this.linksMethod();
      } else {
        await this.nodesMethodWL();
        this.linksMethodWL();
      }
    }
  },

  methods: {
    getMainItem() {
      const mainItem = this.framedData["@graph"].find(
        item => item["@id"] === `lego:${this.activeLink}`
      );
      if (mainItem) {
        this.$store.commit("SET_MAIN_ITEM", mainItem);
      } else {
        this.$store.commit("SET_MAIN_ITEM", {});
        this.$store.commit("SET_SHOW_MODAL", true);
      }
    },

    nodesMethod() {
      this.nodes = [];
      this.id = 0;
      for (let key in this.mainItem) {
        //first item

        //Is node
        if (
          !Array.isArray(this.mainItem[key]) &&
          Object.getPrototypeOf(this.mainItem[key]) !== Object.prototype
        ) {
          if (key === "@id") {
            this.nodes.push({
              id: String(this.mainItem["@id"]),
              sid: String(this.mainItem["@id"]),
              name: String(this.mainItem["@id"]),
              fullName: String(this.mainItem["@id"]),
              _color: "#2e89b7",
              _svgAttrs: {
                "stroke-width": 7
              }
            });
          }
          // Is few rows (array with strings)
          else if (
            Array.isArray(this.mainItem[key]) &&
            typeof this.mainItem[key][0] === "string"
          ) {
            this.nodes.push({
              sid: String(this.mainItem[key] + this.id),
              tid: String(this.mainItem[key]),
              id: String(this.mainItem[key] + this.id++),
              name: this.mainItem[key],
              fullName: String(this.mainItem[key]),
              predicate: key,
              svgSym: nodeIcon2,
              _color: "#2f993c",
              _svgAttrs: {
                stroke: "#1c5c24",
                "stroke-width": 4
              }
            });
          }
          //is literal
          else {
            this.nodes.push({
              sid: String(this.mainItem[key] + this.id),
              tid: String(this.mainItem["@id"]),
              id: String(this.mainItem[key] + this.id++),
              name: String(this.mainItem[key])
                .split("")
                .includes(";")
                ? String(this.mainItem[key]).split(";")
                : String(this.mainItem[key]),
              fullName: String(this.mainItem[key]),
              predicate: key,
              svgSym: nodeIcon2,
              _color: "#2f993c",
              _svgAttrs: {
                stroke: "#1c5c24",
                "stroke-width": 4
              }
            });
          }
        } else {
          //Inferno
          this.multilevelNodeConstructor(this.mainItem, key);
        }
      }
      this.secondId = 0;
    },

    multilevelNodeConstructor(node, key) {
      //Is array
      if (Array.isArray(node[key])) {
        node[key].forEach(obj => {
          for (let item in obj) {
            if (
              Object.getPrototypeOf(obj) === Object.prototype &&
              Object.getPrototypeOf(obj[item]) !== Object.prototype &&
              !Array.isArray(obj[item])
            ) {
              //Is node
              if (item === "@id") {
                this.nodes.push({
                  sid: String(obj[item]),
                  tid: String(node["@id"]),
                  id: String(obj[item]),
                  name: String(obj[item]),
                  fullName: String(obj[item]),
                  predicate: key,
                  _color: "#2e89b7",
                  _svgAttrs: {
                    "stroke-width": 7
                  }
                });
              }
              //is literal
              else {
                this.nodes.push({
                  sid: String(obj[item] + this.id),
                  tid: String(obj["@id"]),
                  id: String(obj[item] + this.id++),
                  name: String(obj[item])
                    .split("")
                    .includes(";")
                    ? String(obj[item]).split(";")
                    : String(obj[item]),
                  fullName: String(obj[item]),
                  predicate: item,
                  svgSym: nodeIcon2,
                  _color: "#2f993c",
                  _svgAttrs: {
                    stroke: "#1c5c24",
                    "stroke-width": 4
                  }
                });
              }
            }
            // Is few rows (array with strings)
            else if (
              Array.isArray(obj[item]) &&
              typeof obj[item][0] === "string"
            ) {
              this.nodes.push({
                sid: String(obj[item] + this.id),
                tid: String(obj["@id"]),
                id: String(obj[item] + this.id++),
                name: obj[item],
                fullName: String(obj[item]),
                predicate: item,
                svgSym: nodeIcon2,
                _color: "#2f993c",
                _svgAttrs: {
                  stroke: "#1c5c24",
                  "stroke-width": 4
                }
              });
            } else {
              this.multilevelNodeConstructor(obj, item);
            }
          }
        });
      }
      //Is object
      else if (Object.getPrototypeOf(node[key]) === Object.prototype) {
        const obj = node[key];
        for (let item in obj) {
          if (
            !Array.isArray(obj[item]) &&
            Object.getPrototypeOf(obj[item]) !== Object.prototype
          ) {
            //Is node
            if (item === "@id") {
              this.nodes.push({
                sid: String(obj[item]),
                tid: String(node["@id"]),
                id: String(obj[item]),
                name: String(obj[item]),
                fullName: String(obj[item]),
                predicate: key,
                _color: "#2e89b7",
                _svgAttrs: {
                  "stroke-width": 7
                }
              });
            }
            //Is literal
            else {
              this.nodes.push({
                sid: String(obj[item] + this.id),
                tid: String(obj["@id"]),
                id: String(obj[item] + this.id++),
                name: String(obj[item])
                  .split("")
                  .includes(";")
                  ? String(obj[item]).split(";")
                  : String(obj[item]),
                fullName: String(obj[item]),
                predicate: item,
                svgSym: nodeIcon2,
                _color: "#2f993c",
                _svgAttrs: {
                  stroke: "#1c5c24",
                  "stroke-width": 4
                }
              });
            }
          }
          // Is few rows (array with strings)
          else if (
            Array.isArray(obj[item]) &&
            typeof obj[item][0] === "string"
          ) {
            this.nodes.push({
              sid: String(obj[item] + this.id),
              tid: String(obj["@id"]),
              id: String(obj[item] + this.id++),
              name: obj[item],
              fullName: String(obj[item]),
              predicate: item,
              svgSym: nodeIcon2,
              _color: "#2f993c",
              _svgAttrs: {
                stroke: "#1c5c24",
                "stroke-width": 4
              }
            });
          } else {
            this.multilevelNodeConstructor(obj, item);
          }
        }
      }
    },

    nodesMethodWL() {
      this.nodes = [];
      this.id = 0;
      for (let key in this.mainItem) {
        //first item

        //Is node
        if (
          !Array.isArray(this.mainItem[key]) &&
          Object.getPrototypeOf(this.mainItem[key]) !== Object.prototype
        ) {
          if (key === "@id") {
            this.nodes.push({
              id: String(this.mainItem["@id"]),
              sid: String(this.mainItem["@id"]),
              name: String(this.mainItem["@id"]),
              fullName: String(this.mainItem["@id"]),
              _color: "#2e89b7",
              _svgAttrs: {
                "stroke-width": 7
              }
            });
          }
        } else {
          //Inferno
          this.multilevelNodeConstructorWL(this.mainItem, key);
        }
      }
      this.secondId = 0;
    },

    multilevelNodeConstructorWL(node, key) {
      //Is array
      if (Array.isArray(node[key])) {
        node[key].forEach(obj => {
          for (let item in obj) {
            if (
              Object.getPrototypeOf(obj) === Object.prototype &&
              Object.getPrototypeOf(obj[item]) !== Object.prototype &&
              !Array.isArray(obj[item])
            ) {
              //Is node
              if (item === "@id") {
                this.nodes.push({
                  sid: String(obj[item]),
                  tid: String(node["@id"]),
                  id: String(obj[item]),
                  name: String(obj[item]),
                  fullName: String(obj[item]),
                  predicate: key,
                  _color: "#2e89b7",
                  _svgAttrs: {
                    "stroke-width": 7
                  }
                });
              }
            } else {
              this.multilevelNodeConstructorWL(obj, item);
            }
          }
        });
      }
      //Is object
      else if (Object.getPrototypeOf(node[key]) === Object.prototype) {
        const obj = node[key];
        for (let item in obj) {
          if (
            !Array.isArray(obj[item]) &&
            Object.getPrototypeOf(obj[item]) !== Object.prototype
          ) {
            //Is node
            if (item === "@id") {
              this.nodes.push({
                sid: String(obj[item]),
                tid: String(node["@id"]),
                id: String(obj[item]),
                name: String(obj[item]),
                fullName: String(obj[item]),
                predicate: key,
                _color: "#2e89b7",
                _svgAttrs: {
                  "stroke-width": 7
                }
              });
            }
          } else {
            this.multilevelNodeConstructorWL(obj, item);
          }
        }
      }
    },

    linksMethod() {
      this.links = [];
      this.nodes.forEach(item => {
        if (item.tid) {
          this.links.push({
            sid: String(item.sid),
            tid: String(item.tid),
            name: String(item.predicate)
          });
        }
      });
    },

    linksMethodWL() {
      this.links = [];
      this.nodes.forEach(item => {
        if (item.tid) {
          this.links.push({
            sid: String(item.sid),
            tid: String(item.tid),
            name: String(item.predicate)
          });
        }
      });
    },

    graphEvent(event, node) {
      if (node._svgAttrs.stroke !== "url(#gradient)") {
        if (this.activeNode) {
          this.activeNode.name = this.nameBackUp;
        }
        this.$store.commit("SET_ACTIVE_NODE", node);
        this.$store.commit(
          "SET_NAME_BACKUP",
          JSON.parse(JSON.stringify(node.name))
        );
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.graph {
  width: 100%;
  height: calc(100vh - 136px);
  background-color: #222222;
  border: 1px solid #15233e;
  position: relative;
}

.graph__action {
  background-color: #2b2b2b;
  height: 65px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 5px;
}

.net {
  height: 100%;
}
</style>
