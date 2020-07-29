<template>
  <svg class="icon"
       xmlns="http://www.w3.org/2000/svg"
       :width="width"
       :height="height"
       :viewBox="viewBox"
       :aria-labelledby="iconName"
       role="presentation">
    <icon-logo v-if="iconName === 'logo'"></icon-logo>
    <icon-insert-drive v-if="iconName === 'insert'"></icon-insert-drive>
    <icon-delete-forever v-else-if="iconName === 'delete.vue'"></icon-delete-forever>
    <icon-save v-else-if="iconName === 'save'"></icon-save>
    <icon-editor v-else-if="iconName === 'editor'"></icon-editor>
    <icon-editor-white v-else-if="iconName === 'editor-white'"></icon-editor-white>
    <icon-integration v-else-if="iconName === 'integration'"></icon-integration>
    <icon-integration-white v-else-if="iconName === 'integration-white'"></icon-integration-white>
    <icon-ocr v-else-if="iconName === 'ocr'"></icon-ocr>
    <icon-new v-else-if="iconName === 'new'"></icon-new>
    <icon-delete v-else-if="iconName === 'delete'"></icon-delete>
    <icon-import v-else-if="iconName === 'import'"></icon-import>
    <icon-export v-else-if="iconName === 'export'"></icon-export>
    <icon-slash v-else-if="iconName === 'slash'"></icon-slash>
    <icon-menu :class="customClass" v-else-if="iconName === 'menu'"></icon-menu>
    <icon-folder v-else-if="iconName === 'folder'"></icon-folder>
    <icon-google v-else-if="iconName === 'google'"></icon-google>
    <icon-node v-else-if="iconName === 'node'"></icon-node>
    <icon-literal v-else-if="iconName === 'literal'"></icon-literal>
    <icon-clone v-else-if="iconName === 'clone'"></icon-clone>
  </svg>
</template>

<script>
  import iconLogo from '@/assets/icons/logo.vue'
  import iconInsertDrive from '@/assets/icons/delete_forever.vue'
  import iconDeleteForever from '@/assets/icons/insert_drive.vue'
  import iconSave from '@/assets/icons/save.vue'
  import IconEditor from '@/assets/icons/graph_editor.vue'
  import IconEditorWhite from '@/assets/icons/graph_editor_white.vue'
  import IconIntegration from '@/assets/icons/integration.vue'
  import IconIntegrationWhite from '@/assets/icons/integration-white.vue'
  import IconOcr from '@/assets/icons/ocr.vue'
  import IconNew from '@/assets/icons/new.vue'
  import IconDelete from '@/assets/icons/delete.vue'
  import IconImport from '@/assets/icons/import.vue'
  import IconExport from '@/assets/icons/export.vue'
  import IconSlash from '@/assets/icons/slash.vue'
  import IconMenu from '@/assets/icons/menu.vue'
  import IconFolder from '@/assets/icons/folder.vue'
  import IconGoogle from '@/assets/icons/google_icon.vue'
  import IconNode from '@/assets/icons/node.vue'
  import IconLiteral from '@/assets/icons/literal.vue'
  import IconClone from '@/assets/icons/clone.vue'

  export default {
    name: "VIcons",
    components: {
      iconInsertDrive,
      iconDeleteForever,
      iconSave,
      IconEditor,
      IconEditorWhite,
      IconIntegration,
      IconIntegrationWhite,
      IconOcr,
      IconNew,
      IconDelete,
      IconImport,
      IconExport,
      iconLogo,
      IconSlash,
      IconMenu,
      IconFolder,
      IconGoogle,
      IconNode,
      IconLiteral,
      IconClone
    },
    props: {
      iconName: {
        type: String,
      },
      width: {
        type: [Number, String],
        default: 18
      },
      height: {
        type: [Number, String],
        default: 18
      },
      iconColor: {
        type: String,
        default: 'currentColor'
      },
      customClass: {
        type: String,
        default: ''
      },
    },
    computed: {
      viewBox() {
        switch (this.iconName) {
          case 'logo':
            return '0 0 24 25';
          case 'editor':
            return '0 0 16 16';
          case 'editor-white':
            return '0 0 16 16';
          case 'integration':
            return '0 0 16 17';
          case 'integration-white':
            return '0 0 16 17';
          case 'ocr':
            return '0 0 18 16';
          case 'new':
            return '0 0 14 17';
          case 'delete':
            return '0 0 14 17';
          case 'import':
            return '0 0 16 8';
          case 'export':
            return '0 0 16 8';
          case 'slash':
            return '0 0 8 14';
          case 'menu':
            return '0 0 100 100';
          case 'folder':
            return '0 0 16 13';
          case 'google':
            return '0 0 32 32';
          case 'node':
            return '0 0 20 20';
          case 'literal':
            return '0 0 20 20';
          case 'clone':
            return '0 0 34.555 34.555';
          default:
            return '0 0 24 24'
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

  .icon {
    margin-right: 5px;
  }

</style>