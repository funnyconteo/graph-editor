<template>
  <button :class="['graph-select', {'graph-select--active' : isActive}]" @click="$emit('selectGraph')">
    <v-icons iconName="folder" />
    <h3 class="graph-select__title">{{ buttonData }}</h3>
  </button>
</template>

<script>
  import VIcons from '@/components/VIcons'

  export default {
    name: "VGraphSelect",
    components: {
      VIcons
    },
    props: {
      isActive: {
        type: Boolean,
        default: false
      },
      buttonData: String
    }
  }
</script>

<style lang="scss" scoped>

  .graph-select {
    width: 100%;
    border: none;
    text-align: left;
    padding: 10px 20px;
    outline: none;
    cursor: pointer;
    border-bottom: 1px solid #1b1f21;
    background-color: transparent;
    transition: background-color .3s ease,
    opacity .2s ease;
    display: flex;

    &__title {
      font-size: 14px;
    }
    
    &--active {
      background-color: #444444;
    }

    &:hover {
      background: #444444;
    }

    &:active {
      opacity: .7;
    }
  }

</style>