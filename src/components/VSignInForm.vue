<template>
  <div class="sign-form">
    <div class="sign-form__header">
      <v-icons class="sign-form__header-logo"
               iconName="logo"
               width="65" height="65"/>
      <span class="sign-form__header-title">
        Подсистема семантического анализа текста
      </span>
    </div>
    <div class="sign-form__form">
      <v-input :inputData="{label: 'Логин', id: 1}"
               v-model="signIn.logIn"/>
      <v-input :inputData="{label: 'Пароль', id: 2}"
               type="password"
               v-model="signIn.password"/>
      <v-button class="sign-form__form-btn" name="Войти"
                :wide="true"
                @buttonAction="$emit('buttonAction')"/>
      <button class="google-auth">
        <v-icons iconName="google" />
        <span>Авторизация через Google</span>
      </button>
    </div>
  </div>
</template>

<script>

  import VInput from "@/components/VInput.vue";
  import VIcons from '@/components/VIcons'
  import VButton from '@/components/VButton'

  export default {
    name: "VSignInForm",
    components: {
      VInput,
      VIcons,
      VButton
    },
    data: () => ({
      signIn: {
        logIn: '',
        password: ''
      }
    })
  }
</script>

<style lang="scss" scoped>

  .sign-form {
    width: 420px;
  }

  .sign-form__header,
  .sign-form__form {
    padding: 32px 40px;
  }

  .sign-form__header {
    display: flex;
    align-items: center;
    background-color: #000000;
    border: 1px solid #363636;
  }

  .sign-form__header-logo {
    margin-right: 20px;
  }

  .sign-form__header-title {
    text-transform: uppercase;
    color: #fff;
    width: 200px;
    font-size: 18px;
  }

  .sign-form__form {
    background-color: #282d30;
    border: 1px solid #363636;
    border-top: none;
  }

  .google-auth {
    color: #237fff;
    background-color: transparent;
    border: 1px solid #237fff;
    width: 100%;
    padding: 7px;
    margin-top: 20px;
    height: 40px;
    cursor: pointer;
    outline: none;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color .2s ease,
                opacity .2s ease;

    span {
      transform: translateY(1px);
    }
    
    &:hover {
      opacity: .8;
    }

    &:active {
      opacity: .6;
    }
  }

  .sign-form__form-btn {
    margin-top: 20px;
  }

</style>