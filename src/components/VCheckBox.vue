<template>
  <div class="checkbox">
    <input class="checkbox--input"
           type="checkbox" id="checkbox"
           @change="$emit('change', $event.target.checked)"
           :checked="checked">
    <label class="checkbox--label" for="checkbox">{{ label }}</label>
  </div>
</template>

<script>
  export default {
    name: "VCheckBox",
    model: {
      prop: 'checked',
      event: 'change'
    },
    props: {
      checked: Boolean,
      label: String
    }
  }
</script>

<style lang="scss" scoped>

  .checkbox {
    &--input {
      display: none;
    }

    &--label {
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
        border: 1px solid #e7edf2;;
        border-radius: 2px;
        transition: background-color .2s ease;
      }

      &::after {
        content: '';
        position: absolute;
        width: 10px;
        height: 5px;
        background-color: transparent;
        border: 2px solid #222222;
        border-top-color: transparent;
        border-right-color: transparent;
        left: 4px;
        top: 4px;
        transform: rotate(-45deg);
      }
    }

    &--input:checked + &--label {
      &::before {
        background-color: #e7edf2;;
      }
    }
  }

</style>