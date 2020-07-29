<template>
  <button :class="['round-button', {'round-button--cross':!iconName}, {'round-button--green':green}, {'round-button--opacity': opacity}]"
          @click="$emit('roundButtonAction')"
          :disabled="disabled">
    <v-icons v-if="iconName" :iconName="iconName" />
  </button>
</template>

<script>

  import VIcons from '@/components/VIcons'

  export default {
    name: "VRoundButton",
    components: {
      VIcons
    },
    props: {
      iconName: String,
      disabled: Boolean,
      green: Boolean,
      opacity: Boolean
    }
  }
</script>

<style lang="scss" scoped>
  
  .round-button {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: #2e89b7;
    border: none;
    border-top: 4px solid #379bcd;
    cursor: pointer;
    margin-bottom: 15px;
    outline: none;
    position: relative;
    padding: 0;
    transition: background-color .2s ease,
                opacity .2s ease;

    &--cross {
      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 2px;
        height: 17px;
        background-color: #fff;
      }

      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 17px;
        height: 2px;
        background-color: #fff;
      }
    }

    &:hover {
      background-color: #349dd2;
      border-top-color: #44bcf9;
    }

    &:active {
      opacity: .7;
    }
    
    &--green {
      background-color: #2f993c;
      border-top-color: #32a340;

      &:hover {
        background-color: #39b548;
        border-top-color: #42ce53;
      }
    }

    &--opacity {
      border: none;
      background-color: transparent;
      margin: 0;

      &:hover {
        background-color: #4a4a4a;
      }
    }

    &:disabled {
      background-color: #849096;
      border-top: 4px solid #aeafaf;

      &:hover {
        background-color: #849096;
        border-top: 4px solid #aeafaf;
      }
    }

    .icon {
      margin: 0;
    }
  }

</style>