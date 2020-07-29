<template>
  <div class="textarea">
    <label class="textarea__label" for="textarea">{{ inputData.label }}</label>
    <textarea :class="['textarea__area', {'textarea__area--changed' : changed}]"
              :id="inputData.id"
              :name="inputData.id"
              :value="value"
              ref="textarea"
              :disabled="disabled"
              @input="$emit('input', $event.target.value)">
    </textarea>
    <v-round-button
      v-if="isDeleted"
      @roundButtonAction="$emit('roundButtonAction')"
      opacity
    />
  </div>
</template>

<script>

  import VRoundButton from "@/components/VRoundButton.vue";

  export default {
    name: "VTextarea",
    components: {
      VRoundButton
    },
    model: {
      prop: 'value'
    },
    props: {
      disabled: {
        type:  Boolean,
        default: false
      },
      changed: Boolean,
      isDeleted: Boolean,
      value: String,
      inputData: {
        label: String
      },
      textareaData: String
    },
    methods: {
      updateSize () {
        if (this.$refs.textarea) {
          setTimeout(() => {
            if (this.$refs.textarea.scrollHeight > 46) {
              this.$refs.textarea.style.height = '0';
              this.$refs.textarea.style.height = `${this.$refs.textarea.scrollHeight - 14}px`;
            } else {
              this.$refs.textarea.style.height = `${30}px`
            }
          }, 0)
        } else {
          setTimeout(() => {this.updateSize()}, 100)
        }

      }
    },
    mounted() {
      this.$refs.textarea.style.height = `${this.$refs.textarea.scrollHeight - 14}px`;
    },
    watch: {
      value: {
        handler: 'updateSize',
        immediate: true
      }
    }
  }
</script>

<style lang="scss" scoped>

  .textarea {
    width: 100%;
    padding-bottom: 20px;
    display: flex;
    flex-direction: column;
    position: relative;

    &__label {
      font-size: 10px;
      text-transform: uppercase;
      display: block;
      padding-bottom: 5px;
    }

    &__area {
      padding: 7px;
      padding-right: 15px;
      outline: none;
      background-color: #2a2a2a;
      color: #e7edf2;
      border: 1px solid #383838;
      transition: border-color .3s ease,
                  background-color .3s ease;
      resize: vertical;

      &:hover,
      &:focus {
        border: 1px solid #6b6b6b;
      }

      &--changed {
        box-shadow: 0 0 5px 0 #237fff
      }

      &:disabled {
        background-color: #849096;

        &:hover{
          border: 1px solid #383838;
        }
      }
    }

    .round-button {
      position: absolute;
      top: 25px;
      right: 5px;
      width: 15px;
      height: 15px;
      transform: rotate(45deg);

      &::before {
        height: 10px;
      }

      &::after {
        width: 10px;
      }
    }
  }

</style>