<template>
  <svg
    v-if="nodes.length && links.length"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    ref="svg"
    width="100%"
    height="100%"
    class="net-svg"
    @mouseup.stop="emit('dragEnd', [$event]), dragSvgEnd()"
    @touchend.stop="emit('dragEnd', [$event])"
    @mousedown.stop="dragSvg($event)"
    @mousewheel.stop="scaleSvg($event)"
    @DOMMouseScroll.stop="scaleSvg($event)"
  >

    <defs>
      <radialGradient id="node" cx="50%" cy="50%" fx="50%" fy="50%" r="50%">
        <stop offset="4" stop-color="#222222"/>
        <stop offset="8" stop-color="#217af1"/>
      </radialGradient>
    </defs>

    <defs>
      <radialGradient  id="literal" cx="50%" cy="50%" fx="50%" fy="50%" r="50%">
        <stop offset="4" stop-color="#217af1"/>
      </radialGradient >
    </defs>

    <g id="svg-wrapper"
       :transform="`matrix(${scale} 0 0 ${scale} ${x} ${y})`"
       style="will-change: transform">

      <!--links-->
      <g class="links" id="l-links">
        <path
          :key="link.id"
          v-for="link in links"
          :d="linkPath(link)"
          :id="link.id"
          @click="emit('linkClick', [$event, link])"
          @touchstart.stop="emit('linkClick', [$event, link])"
          v-bind="linkAttrs(link)"
          :class="linkClass(link.id)"
          :style="linkStyle(link)"
        ></path>
      </g>

      <!--nodes-->
      <g class="nodes" id="l-nodes" v-if="!noNodes">
        <template v-for="(node, key) in nodes">
          <svg
            v-if="svgIcon(node)"
            :key="key"
            :viewBox="svgIcon(node).attrs.viewBox"
            :height="normalNodeSize(node, 'height')"
            :width="normalNodeSize(node, 'width')"
            @click="emit('nodeClick', [$event, node])"
            @touchend.stop="emit('nodeClick', [$event, node])"
            @mousedown.stop="emit('dragStart', [$event, key])"
            @touchstart.stop="emit('dragStart', [$event, key])"
            :x="node.x - normalNodeSize(node, 'width') / 2"
            :y="node.y - normalNodeSize(node, 'height') / 2"
            :style="nodeStyle(node)"
            :title="Array.isArray(node.name) ? String(node.name[0]) : String(node.name)"
            :class="nodeClass(node, ['node-svg'])"
            v-html="svgIcon(node).data"
            v-bind="node._svgAttrs"
            :stroke="activeNode === node ? 'url(#literal)' : ''"
          ></svg>

          <!--default circle nodes-->
          <circle
            v-if="!svgIcon(node)"
            :key="key"
            :r="getNodeSize(node) / 2"
            @click="emit('nodeClick', [$event, node])"
            @touchend.stop="emit('nodeClick', [$event, node])"
            @mousedown.stop="emit('dragStart', [$event, key])"
            @touchstart.stop="emit('dragStart', [$event, key])"
            :transform="`translate(${node.x}, ${node.y})`"
            :style="nodeStyle(node)"
            :title="Array.isArray(node.name) ? String(node.name[0]) : String(node.name)"
            :class="nodeClass(node)"
            v-bind="node._svgAttrs"
            :stroke="activeNode === node ? 'url(#node)' : ''"
          ></circle>
        </template>
      </g>

      <!--//-> Links Labels-->
      <g class="labels" id="link-labels" v-if="linkLabels">
        <g v-for="(link, i) in links"
           :key="i+'q'"
           :transform="`translate(${((link.source.x + link.target.x) / 2)}, ${(link.source.y + link.target.y) / 2})`"
           :xlink:href="'#' + link.id">
          <rect :width="link.name.length * 9"
                height="30"
                fill="#194d66"
                stroke="#236b8f"
                stroke-width="2"
                :transform="`translate(${-(link.name.length * 9) / 2}, ${-10})`">
          </rect>
          <text class="link-label"
                :font-size="fontSize">
            <tspan :xlink:href="'#' + link.id">
              {{ link.name }}
            </tspan>
          </text>
        </g>
      </g>

      <!--//- -> Node Labels-->
      <g class="labels" id="node-labels" v-if="nodeLabels">
        <text
          class="node-label"
          :key="i"
          v-for="(node, i) in nodes"
          :transform="`translate(${node.x - (normalNodeSize(node, 'width') / 2 - normalNodeSize(node, 'width') / 10)},
                                 ${node.y - normalNodeSize(node, 'height') / 2 + 40})`"
          :font-size="fontSize"
          :class="node._labelClass ? node._labelClass : ''"
          :stroke-width="fontSize / 8">
          <template v-if="Array.isArray(node.name)">
            <tspan v-for="(name, q) in node.name" x="0" :dy="q !== 0 ? q + 25 : q">
              {{ cutName(name) }}
            </tspan>
          </template>
          <tspan v-else>{{ cutName(node.name) }}</tspan>
        </text>
      </g>
    </g>
  </svg>
</template>

<script>
  import svgExport from "./js/svgExport.js";

  export default {
    name: "svg-renderer",
    props: [
      "size",
      "nodes",
      "noNodes",
      "selected",
      "linksSelected",
      "links",
      "nodeSize",
      "padding",
      "fontSize",
      "strLinks",
      "linkWidth",
      "nodeLabels",
      "linkLabels",
      "labelOffset",
      "nodeSym"
    ],
    data: () => ({
      scale: 0.5,
      x: 300,
      y: 200
    }),
    computed: {
      nodeSvg() {
        if (this.nodeSym) {
          return svgExport.toObject(this.nodeSym);
        }
        return null;
      },
      activeNode() {
        return this.$store.state.activeNode
      }
    },
    methods: {
      cutName(arg) {
        if (arg.split("").includes(":")) {
          if (arg.length > 14) {
            return arg.slice(0, 14) + "...";
          } else return arg
        } else {
          if (arg.length > 40) {
            return arg.slice(0, 40) + "...";
          } else return arg
        }
      },
      dragSvg(event) {
        if (event.target._prevClass === "net-svg") {
          const elem = event.target.firstChild;
          let startPos = undefined;
          let endPos = undefined;
          const y = this.y;
          const x = this.x;
          document.onmousemove = e => {
            startPos === undefined
              ? (startPos = {top: e.pageY, left: e.pageX})
              : startPos;
            endPos = {top: e.pageY, left: e.pageX};
            this.y = endPos.top + y - startPos.top;
            this.x = endPos.left + x - startPos.left;
          };
          startPos = undefined;
        }
      },
      dragSvgEnd() {
        document.onmousemove = null;
      },
      scaleSvg(e) {
        e.stopPropagation();
        e.preventDefault();
        let delta = e.wheelDelta || -e.detail,
          container = document.querySelector("#svg-wrapper"),
          scaleStep = delta > 0 ? 1.25 : 0.8,
          svg = document.querySelector("svg"),
          maxScale = 5,
          minScale = 0.15;
        if (this.scale * scaleStep > maxScale) scaleStep = maxScale / this.scale;
        if (this.scale * scaleStep < minScale) scaleStep = minScale / this.scale;
        this.scale *= scaleStep;
        let box = svg.getBoundingClientRect();
        let point = svg.createSVGPoint();
        point.x = e.clientX - box.left;
        point.y = e.clientY - box.top;
        let currentZoomMatrix = container.getCTM();
        point = point.matrixTransform(currentZoomMatrix.inverse());
        let matrix = svg
          .createSVGMatrix()
          .translate(point.x, point.y)
          .scale(scaleStep)
          .translate(-point.x, -point.y);
        let newZoomMatrix = currentZoomMatrix.multiply(matrix);
        this.x = newZoomMatrix.e;
        this.y = newZoomMatrix.f
      },

      getNodeSize(node, side) {
        let size = node._size || this.nodeSize;
        if (side) size = node["_" + side] || size;
        return size;
      },

      normalNodeSize(node, side) {
        if (side === 'width') {
          let max = 0;
          if (Array.isArray(node.name)) {
            node.name.forEach(item => {
              if (this.cutName(item).length > max) max = this.cutName(item).length
            });
            return max  > 20 ? max * 9 : max * 14
          }
          else if (node.name.split("").includes(":")) {
            return this.cutName(node.name).length * 9.5
          }
          else {
            return this.cutName(node.name).length > 20 ? this.cutName(node.name).length * 10 : this.cutName(node.name).length * 14
          }
        } else if (side === 'height') {
          if (Array.isArray(node.name)) {
            return node.name.length * 40
          } else return 70
        }
      },

      svgIcon(node) {
        return node.svgObj || this.nodeSvg;
      },
      emit(e, args) {
        this.$emit("action", e, args);
      },
      svgScreenShot(cb, toSvg, background, allCss) {
        let svg = svgExport.export(this.$refs.svg, allCss);
        if (!toSvg) {
          if (!background) background = this.searchBackground();
          let canvas = svgExport.makeCanvas(this.size.w, this.size.h, background);
          svgExport.svgToImg(svg, canvas, (err, img) => {
            if (err) cb(err);
            else cb(null, img);
          });
        } else {
          cb(null, svgExport.save(svg));
        }
      },
      linkClass(linkId) {
        let cssClass = ["link"];
        if (this.linksSelected.hasOwnProperty(linkId)) {
          cssClass.push("selected");
        }
        if (!this.strLinks) {
          cssClass.push("curve");
        }
        return cssClass;
      },
      linkPath(link) {
        let d = {
          M: [link.source.x | 0, link.source.y | 0],
          X: [link.target.x | 0, link.target.y | 0]
        };
        if (this.strLinks) {
          return "M " + d.M.join(" ") + " L" + d.X.join(" ");
        } else {
          d.Q = [link.source.x, link.target.y];
          return "M " + d.M + " Q " + d.Q.join(" ") + " " + d.X;
        }
      },
      nodeStyle(node) {
        return node._color ? "fill: " + node._color : "";
      },
      linkStyle(link) {
        let style = {};
        if (link._color) style.stroke = link._color;
        return style;
      },
      nodeClass(node, classes = []) {
        let cssClass = node._cssClass ? node._cssClass : [];
        if (!Array.isArray(cssClass)) cssClass = [cssClass];
        cssClass.push("node");
        classes.forEach(c => cssClass.push(c));
        if (this.selected[node.id]) cssClass.push("selected");
        if (node.fx || node.fy) cssClass.push("pinned");
        return cssClass;
      },
      searchBackground() {
        let vm = this;
        while (vm.$parent) {
          let style = window.getComputedStyle(vm.$el);
          let background = style.getPropertyValue("background-color");
          let rgb = background.replace(/[^\d,]/g, "").split(",");
          let sum = rgb.reduce((a, b) => parseInt(a) + parseInt(b), 0);
          if (sum > 0) return background;
          vm = vm.$parent;
        }
        return "white";
      },
      spriteSymbol() {
        let svg = this.nodeSym;
        if (svg) {
          return svgExport.toSymbol(svg);
        }
      },
      linkAttrs(link) {
        let attrs = link._svgAttrs || {};
        attrs["stroke-width"] = attrs["stroke-width"] || this.linkWidth;
        return attrs;
      }
    }
  };
</script>

<style lang="scss" scoped>
  :root {
    --scale--ratio: 0;
  }

  .svg-wrapper {
    transition: transform 0.3s ease;
  }

  .net-svg {
    user-select: none;
  }

  .curve {
    fill: none;
  }

  .link,
  .node {
    stroke-linecap: round;
    overflow: visible;
  }

  .node {
    cursor: pointer;
  }

  .link {
    stroke: #217af1;

    &:hover {
      stroke: #5DAEFF;
    }
  }

  .node-label,
  .link-label {
    pointer-events: none;
    fill: #e1e1e1;
  }

  .link-label {
    transform: translateY(10px);
    text-anchor: middle;
  }
</style>
