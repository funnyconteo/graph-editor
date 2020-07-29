<template>
  <div class="radio">
    <label :class="['radio__label', {'radio__label--checked' : shouldBeChecked}]" >
      <input class="radio__input"
             type="radio"
             :checked="shouldBeChecked"
             :value="value"
             @change="$emit('change', value)">
      {{ label }}
    </label>
  </div>
</template>

<script>
  export default {
    name: "VRadioButton",
    model: {
      prop: 'modelValue',
      event: 'change'
    },
    props: {
      value: [String, Number],
      label: String,
      modelValue: {
        default: ""
      }
    },
    computed: {
      shouldBeChecked() {
        return this.modelValue == this.value
      }
    },
  }
</script>

<style lang="scss" scoped>

  .radio {
    &__input {
      display: none;
    }

    &__label {
      padding-left: 40px;
      cursor: pointer;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        background-color: transparent;
        width: 20px;
        height: 20px;
        border: 1px solid #e7edf2;
        border-radius: 50%;
      }

      &::after {
        content: '';
        position: absolute;
        width: 10px;
        height: 10px;
        background-color: transparent;
        border-radius: 50%;
        left: 6px;
        top: 50%;
        transform: translateY(-50%);
        transition: background-color .2s ease;
      }

      &--checked {
        &::after {
          background-color: #e7edf2;
        }
      }
    }
  }

</style>