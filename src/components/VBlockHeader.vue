<template>
  <div class="block-header">
    <v-icons v-if="iconName" :iconName="iconName" />
    <h2 class="block-header__title">
      <span class="block-header__title block-header__title--bold"
            v-if="titleBold">
        {{ titleBold }}
      </span>
      <span v-if="titleLight">
        {{ titleLight }}
      </span>
    </h2>
  </div>
</template>

<script>
  import VIcons from '@/components/VIcons'

  export default {
    name: "VBlockHeader",
    components: {
      VIcons
    },
    props: {
      iconName: String,
      titleBold: String,
      titleLight: String,
    }
  }
</script>

<style lang="scss" scoped>

  .block-header {
    padding: 8px 20px 10px;
    background-color: #103040;
    display: flex;
    align-items: center;
    min-height: 19px;

    &__title {
      font-size: 14px;

      &--bold {
        font-weight: bold;
      }
    }
  }

</style>