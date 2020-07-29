<template>
  <header class="header">
    <h1 class="header__title">
      <v-icons iconName="logo" width="24" height="24"/>
      Подсистема семантического анализа текста
    </h1>
    <div class="header__user">
      <div class="header__user-avatar">
        <img src="@/assets/icons/defaultAvatarSmall.png" alt="аватар">
      </div>
    </div>
  </header>
</template>

<script>
  import VIcons from '@/components/VIcons'

  export default {
    name: "TheHeader",
    components: {
      VIcons
    },
  }
</script>

<style lang="scss" scoped>

  .header {
    background-color: #262626;
    color: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
  }

  .header__title {
    font-size: 18px;
    text-transform: uppercase;
    font-weight: normal;
    position: relative;
    display: flex;
    align-items: center;
  }

  .header__user {
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &-avatar {
      display: block;
      width: 30px;
      height: 30px;
      margin-left: 15px;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

</style>
