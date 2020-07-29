<template>
  <div class="select">
    <label class="select__label">{{ label }}</label>
    <select class="select__input"
            type="text"
            :value="value"
            :disabled="isDisabled"
            @change="$emit('input', $event.target.value)">
      <option class="select__option"
              v-for="select in selectData"
              :key="select.id"
              :value="isId ? select.id : select.value">
        {{select.value}}
      </option>
    </select>
  </div>
</template>

<script>
  export default {
    name: "VSelect",
    model: {
      prop: 'value'
    },
    props: {
      isId: {
        type: Boolean,
        default: false
      },
      label: String,
      value: [String, Number],
      selectData: Array,
      isDisabled: {
        type: Boolean,
        default: false
      }
    },
  }
</script>

<style lang="scss" scoped>

  .select {
    width: 100%;
    padding-bottom: 20px;
    display: flex;
    flex-direction: column;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      display: block;
      bottom: 29px;
      right: 10px;
      border: 4px solid transparent;
      border-top: 4px solid #e7edf2;
    }

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
      border: 1px solid #4a4a4a;
      transition: border-color .3s ease,
                  background-color .3s ease;
      appearance: none;
      outline: none;

      &:hover,
      &:focus {
        border: 1px solid #6b6b6b;
      }

      &:disabled {
        background-color: #849096;

        &:hover{
          border: 1px solid #383838;
        }
      }
    }

    &__option {
      padding: 7px;
    }
  }

</style>