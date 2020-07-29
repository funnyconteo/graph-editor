<template>
  <div class="input">
    <label class="input__label"
           v-if="inputData.label"
           :for="inputData.id">
      {{ inputData.label || 'Нзавание атрибута' }}
    </label>
    <input :class="['input__input', {'input__input--changed' : changed}]"
           :type="type"
           :placeholder="placeholder || ''"
           :id="inputData.id"
           :name="inputData.id"
           :value="value"
           :disabled="disabled"
           @input="$emit('input', $event.target.value)">
  </div>
</template>

<script>
  export default {
    name: "VInput",
    model: {
      prop: 'value'
    },
    props: {
      changed: Boolean,
      disabled: {
        type:  Boolean,
        default: false
      },
      value: [String, Number],
      type: {
        type: String,
        default: 'text'
      },
      placeholder: {
        type: String,
        default: ''
      },
      inputData: {
        label: String
      }
    }
  }
</script>

<style lang="scss" scoped>

  .input {
    width: 100%;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;

    &__label {
      font-size: 10px;
      text-transform: uppercase;
      display: block;
      padding-bottom: 5px;
    }

    &__input {
      padding: 7px;
      background-color: #2a2a2a;
      color: #e7edf2;
      outline: none;
      border: 1px solid #4a4a4a;
      transition: all .3s ease;

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
  }

</style>