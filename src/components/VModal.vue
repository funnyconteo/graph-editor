<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <v-block-header :titleBold="modalTitle" />
          <div class="modal-body">
            <slot></slot>
          </div>
          <div class="modal-footer">
            <v-button name="Ок" v-if="!isConfirmed" @buttonAction="$emit('closeModal')"/>

            <v-button name="Отмена" v-if="isConfirmed" @buttonAction="$emit('closeModal')"/>
            <v-button name="Ок" v-if="isConfirmed" @buttonAction="$emit('confirmModal')"/>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>

  import VButton from '@/components/VButton'
  import VBlockHeader from "@/components/VBlockHeader.vue";

  export default {
    name: "VModal",
    components: {
      VBlockHeader,
      VButton
    },
    props: {
      modalTitle: String,
      isConfirmed: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
  }

  .modal-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #e7edf2;
  }

  .modal-container {
    width: 300px;
    margin: 0 auto;
    background-color: #282d30;
    border: 1px solid #363636;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
  }

  .modal-body {
    padding: 25px 20px 20px;
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    padding: 10px;
    border-top: 1px solid #383838;
  }

  .modal-enter {
    opacity: 0;
  }

  .modal-leave-active {
    opacity: 0;
  }

  .modal-enter .modal-container,
  .modal-leave-active .modal-container {
    transform: scale(1.1);
  }
</style>
