<template>
  <div class="wrapper">
    <div class="sk-double-bounce">
      <div class="sk-child sk-double-bounce-1"></div>
      <div class="sk-child sk-double-bounce-2"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "VPreloader"
  }
</script>

<style lang="scss" scoped>

  .wrapper {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    background-color: rgba(0, 0 , 0, .5);
    z-index: 99;
  }

  .sk-double-bounce {
    width: 70px;
    height: 70px;
    position: relative;
    margin: auto;

    .sk-child {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #237fff;
      opacity: 0.6;
      position: absolute;
      top: 0;
      left: 0;
      animation: sk-double-bounce 2.0s infinite ease-in-out;
    }

    .sk-double-bounce-2 {
      animation-delay: -1.0s;
    }
  }

  @keyframes sk-double-bounce {
    0%, 100% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.0);
    }
  }

</style>