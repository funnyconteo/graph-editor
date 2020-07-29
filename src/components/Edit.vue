<template>
  <aside class="edit">
    <div class="edit__properties">
      <v-block-header :titleBold="titleBold + ':'" titleLight="Свойства"/>
      <div class="edit__body">
        <slot></slot>
      </div>
    </div>
    <div class="edit__actions">
      <v-button name="Удалить" @buttonAction="$emit('deleteElem')" />
      <v-button name="Ок" @buttonAction="$emit('saveChanges')" />
    </div>
  </aside>
</template>

<script>
  import VBlockHeader from "@/components/VBlockHeader.vue";
  import VButton from '@/components/VButton'

  export default {
    name: "Edit",
    components: {
      VBlockHeader,
      VButton
    },
    props: {
      titleBold: {
        type: String,
        default: ''
      },
    },
  }
</script>

<style lang="scss" scoped>

  .edit {
    width: 20%;
    height: calc(100vh - 160px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-top: 10px;
    background-color: #222222;
    border: 1px solid #383838;
    box-shadow: 3px 3px 5px -1px #000;
    z-index: 10;

    &__properties {
      overflow: hidden;
    }

    &__body {
      padding: 25px 20px 20px;
      overflow: auto;
      height: calc(100% - 82px);
    }

    &__actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 10px;
      border-top: 1px solid #383838;
    }
  }


</style>