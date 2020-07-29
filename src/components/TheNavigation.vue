<template>
    <nav :class="['navigation', slim ? 'navigation--slim' : '']">
      <div class="navigation__button-wrapper">
        <button class="navigation__button"
                @click="slim = !slim">
          <v-icons iconName="menu" :width="35" :height="35" :customClass="slim ? 'active' : ''"/>
        </button>
      </div>
      <router-link class="navigation__nav-link" to="editor">
        <v-icons iconName="editor" :width="18" :height="18"/>
        <span class="navigation__nav-text" v-if="!slim">Редактор Rdf-графов</span>
      </router-link>
      <router-link class="navigation__nav-link" to="integration">
        <v-icons iconName="integration" />
        <span class="navigation__nav-text" v-if="!slim">Настройка интеграции</span>
      </router-link>
      <router-link class="navigation__nav-link" to="/b">
        <v-icons iconName="ocr" />
        <span class="navigation__nav-text" v-if="!slim">Настрокйка OCR</span>
      </router-link>
    </nav>
</template>

<script>

  import VIcons from '@/components/VIcons'

  export default {
    name: "TheNavigation",
    data: () => ({
      slim: true
    }),
    components: {
      VIcons
    }
  }

</script>

<style lang="scss" scoped>

  .navigation {
    display: flex;
    align-items: stretch;
    flex-direction: column;
    width: 235px;
    overflow: hidden;
    height: calc(100vh - 55px);
    border-right: 1px solid #383838;
    transition: width .2s ease;

    .icon {
      min-width: 18px;
      min-height: 18px;
    }

    &--slim {
      width: 45px;

      .icon {
        margin-right: 0;
      }
    }
  }

  .navigation__button-wrapper {
    padding: 10px 10px 10px 12px;
    border-bottom: 1px solid #393939;
  }

  .navigation__button {
    width: 25px;
    height: 20px;
    background-color: transparent;
    border: none;
    display: flex;
    align-items: center;
    outline: none;
    cursor: pointer;
    padding: 0;
    overflow: hidden;
    position: relative;

    .icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(calc(-50% - 4px), -50%);
    }
  }

  .navigation__nav-link {
    color: #e7edf2;
    text-decoration: none;
    font-size: 13px;
    transition: all .3s ease;
    position: relative;
    border-bottom: 1px solid #383838;
    display: flex;
    align-items: center;
    line-height: 1.5;
    padding: 10px 10px 10px 12px;
    height: 20px;

    &:hover {
      background: #444444;
    }

    &::after {
      content: '';
      display: block;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 5px;
      background-color: transparent;
      transition: background-color .3s ease;
    }
  }

  .navigation__nav-text {
    white-space: nowrap;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 2;
  }

  .router-link-exact-active {
    background: #444444
  }

</style>
