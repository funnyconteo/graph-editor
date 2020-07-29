<template @click="clicks($event)">
  <div class="dropdown">
    <header :class="`dropdown-header dropdown-header${show ? '--active': ''}`"
            @click="showMe(object)">
      <div class="dropdown-header__title">
        <div class="dropdown-header__text">
          <span class="dropdown-header__header">{{header}}</span>
        </div>
        <div class="dropdown-header__arrow"></div>
      </div>
    </header>
    <main class="dropdown-content" v-if="show">
      <slot></slot>
    </main>
  </div>
</template>

<script>

  export default {
    name: 'VDropDown',

    props: {
      header: {
        type: String,
        required: true
      },
      object: {
        type: Object
      }
    },

    data() {
      return {
        show: false
      }
    },

    methods: {
      showMe(obj) {
        this.show = !this.show;
        this.$emit('showMe', obj)
      },
    },
  }
</script>

<style lang="scss" scoped>

  .dropdown {
    display: flex;
    flex-direction: column;
    margin-bottom: 2px;
    user-select: none;

    &:last-of-type {
      margin-bottom: 0;
    }
  }

  .dropdown-header {
    cursor: pointer;
    max-width: 100%;
    color: #fff;
    padding: 8px 10px 10px;
    background-color: #194d66;
    border-top: 2px solid #2f8dbb;
    transition: background-color .2s ease;

    .dropdown-header__title {
      .dropdown-header__arrow {
        width: 15px;
        height: 10px;
        display: block;
        position: relative;
        transform: rotate(0);

        &::before {
          content: '';
          display: block;
          position: absolute;
          width: 10px;
          height: 2px;
          background-color: #fff;
          top: 50%;
          right: 0;
          transform: rotate(45deg) translateY(-50%);
        }

        &::after {
          content: '';
          display: block;
          position: absolute;
          width: 10px;
          height: 2px;
          background-color: #fff;
          top: 50%;
          left: 0;
          transform: rotate(-45deg) translateY(-50%);
        }
      }
    }

    &:hover,
    &:active {
      background-color: #216688;
    }

    &--active {
      background-color: #1697c1;
      border-top-color: #87b9ff;

      .dropdown-header__title {
        .dropdown-header__arrow {
          transform: rotate(180deg);
        }
      }

      &:hover,
      &:active {
        background-color: #33a9ce;
      }
    }
  }

  .dropdown-header__title {
    display: flex;
    align-items: center;
    min-height: 0;

    .dropdown-header__text {
      .dropdown-header__header {
        left: 25px;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .dropdown-header__arrow {
      padding-top: 4px;
      transition: 0.2s all ease-in;
    }
  }

  .dropdown-header__text {
    margin-right: auto;
    width: 90%;
    font-size: 13px;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    position: relative;
  }

  .dropdown-content {
    color: #000000;
    height: 100%;
    padding: 10px 10px 0;
    background-color: #3d4244;
  }

</style>