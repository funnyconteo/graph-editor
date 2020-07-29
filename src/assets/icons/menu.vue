<template>
  <g :class="['ham', 'hamRotate180 ', 'ham5', customClass]">
    <path
      class="line top"
      d="m 30,33 h 40 c 0,0 8.5,-0.68551 8.5,10.375 0,8.292653 -6.122707,9.002293 -8.5,6.625 l -11.071429,-11.071429" />
    <path
      class="line middle"
      d="m 70,50 h -40" />
    <path
      class="line bottom"
      d="m 30,67 h 40 c 0,0 8.5,0.68551 8.5,-10.375 0,-8.292653 -6.122707,-9.002293 -8.5,-6.625 l -11.071429,11.071429" />
  </g>
</template>

<script>
  export default {
    props: {
      customClass: {
        type: String,
        default: ''
      },
    }
  }
</script>

<style lang="scss" scoped>

  .line {
    fill: none;
    transition: stroke-dasharray 400ms, stroke-dashoffset 400ms;
    stroke: #fff;
    stroke-width: 5.5;
    stroke-linecap: round;
  }

  .ham {
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: transform 400ms;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .ham5 .top {
    stroke-dasharray: 40 82;
  }

  .ham5 .bottom {
    stroke-dasharray: 40 82;
  }

  .ham5 .top {
    stroke-dasharray: 40 82;
  }
  .ham5 .bottom {
    stroke-dasharray: 40 82;
  }
  .ham5.active .top {
    stroke-dasharray: 14 82;
    stroke-dashoffset: -72px;
  }
  .ham5.active .bottom {
    stroke-dasharray: 14 82;
    stroke-dashoffset: -72px;
  }

</style>
