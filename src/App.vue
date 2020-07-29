<template>
  <div id="app">
    <the-header v-if="isSignIn !== 'signIn'" />
    <div class="main-wrapper">
      <the-navigation v-if="isSignIn !== 'signIn'"/>
      <main :class="['main', isSignIn === 'signIn' ? 'main--wPadding' : '']">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
  import TheHeader from "@/components/TheHeader.vue";
  import TheNavigation from "@/components/TheNavigation.vue";

  export default {
    name: "Main",
    components: {
      TheHeader,
      TheNavigation,
    },
    computed: {
      isSignIn() {
        return this.$route.name
      },
      token() {
        return this.$store.state.token
      }
    },
    methods: {
      getParameterByName(str) {
        let searchParams = new URLSearchParams(window.location.href);
        for (let p of searchParams) {
          if (p[0].includes(str)) return p[1]
        }
      }
    },
    async mounted() {
      if(window.location.href.includes('#')) {
        await localStorage.setItem('id_token', this.getParameterByName('id_token'))
      }
      if(!this.token) {
        this.$router.push({name: "signIn"})
      }
    }
  };
</script>

<style lang="scss">
  body {
    font-family: Segoe, Arial, 'sans-serif';
    height: 100vh;
    width: 100vw;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: #222222;
    color: #e7edf2;
  }

  h1, h2, h3, p, label, button {
    color: #e7edf2;
    font-weight: normal;
    margin: 0;
  }

  ul {
    list-style: none;
  }

  .main-wrapper {
    display: flex;
  }

  .main {
    padding: 10px;
    width: 100%;

    &--wPadding {
      padding: 0;
    }
  }

</style>
