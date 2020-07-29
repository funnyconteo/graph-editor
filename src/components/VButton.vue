<template>
  <button :class="['btn', {'btn--dark' : dark}, {'btn--wide' : wide}]" @click="$emit('buttonAction')">
    <v-icons v-if="iconName" :iconName="iconName" width="18" height="18"/>
    <span class="btn__text">{{ name }}</span>
  </button>
</template>

<script>

  import VIcons from '@/components/VIcons'

  export default {
    name: "VButton",
    components: {
      VIcons
    },
    props: {
      iconName: String,
      wide: Boolean,
      dark: Boolean,
      name: String
    }
  }
</script>

<style lang="scss" scoped>

  .btn {
    background-color: #237fff;
    border: none;
    cursor: pointer;
    padding: 7px;
    outline: none;
    width: 100px;
    transition: opacity .2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 15px;
    
    &__text {
      text-transform: uppercase;
      font-size: 11px;
      line-height: 1.5;
    }

    &--dark {
      background-color: #404040;
      border-top: 4px solid #6b6b6b;
    }

    &--wide {
      width: 100%;
      height: 40px;
      margin: 0;
    }

    &:hover {
      opacity: .8;
    }

    &:active {
      opacity: .6;
    }
  }

  @media (max-width: 1024px) {
    .btn {
      &__text {
        font-size: 9px;
      }
    }
  }

</style>