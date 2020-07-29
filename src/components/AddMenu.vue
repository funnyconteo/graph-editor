<template>
  <aside class="add">
    <div class="add-wrapper">
      <div class="add__properties">
        <v-block-header :titleBold="titleBold" iconName="editor-white"/>
        <div class="add__body">
          <v-select :selectData="selectAddData"
                    v-model="selectValue"
                    v-if="!isNode && !isCreateGraph"
                    label="Тип связи"/>
          <v-select :selectData="selectAddData"
                    v-model="nodeAttribute"
                    label="Тип связи"
                    v-if="isNode && !isCreateGraph"
                    :isDisabled="true"/>
          <v-input
            v-if="selectValue === 'lego:AttrName' || selectValue === 'lego:cardinality'|| selectValue === 'lego:default' || isNode || isCreateGraph"
            :inputData="{id: 1, label: 'Название'}"
            v-model="inputValue"
            :disabled="selectValue === 'lego:cardinality' ? true : false"/>
          <span class="add__error" v-if="validError">Название графа может содержать только цифры, латинские буквы и символ "_"</span>
          <v-textarea v-if="selectValue === 'lego:GetElementsRule'"
                      :inputData="{id: 1, label: 'Выражение'}"
                      v-model="inputValue"/>
          <div class="add__body--textareas"
               v-if="selectValue === 'lego:YargyRegExpFilter' || selectValue === 'lego:RegExpRule'">
            <v-textarea :inputData="{id: 1, label: 'Выражение 1'}"
                        v-model="textareasValue.regExpFirstValue"/>
            <v-textarea :inputData="{id: 2, label: 'Выражение 2'}"
                        v-model="textareasValue.regExpSecondValue"/>
          </div>

          <div class="add__body--yargy" v-if="selectValue === 'lego:YargyRule'">
            <div class="add__body--yargy-wrap">
              <v-radio-button v-model="radioButtonValue" value="1"/>
              <div class="select">
                <label class="select__label">Yargy правило</label>
                <select class="select__input"
                        :disabled="radioButtonValue === '2'"
                        v-model="inputValue">
                  <option class="select__option"
                          v-for="select in yargyRules"
                          :key="select.id"
                          :value="select.yargy_rule">
                    {{select.ufn}}
                  </option>
                </select>
              </div>
            </div>
            <div class="add__body--yargy-wrap">
              <v-radio-button v-model="radioButtonValue" value="2"/>
              <v-textarea :inputData="{id: 1, label: 'Yargy правило'}"
                          v-model="inputValue"
                          :disabled="radioButtonValue === '1'"/>
            </div>
          </div>

          <div class="add__body--number" v-if="selectValue === 'lego:Span'">
            <span>От</span>
            <v-input :inputData="{id: 1}"
                     v-model="numbersValue.spanFirstValue"
                     :disabled="checkboxValue"
                     type="number"/>
            <span>до</span>
            <v-input :inputData="{id: 2}"
                     v-model="numbersValue.spanSecondValue"
                     :disabled="checkboxValue"
                     type="number"/>
          </div>
          <div class="checkbox" v-if="selectValue === 'lego:Span'">
            <input class="checkbox--input" type="checkbox" id="checkbox" v-model="checkboxValue">
            <label class="checkbox--label" for="checkbox">По всему документу</label>
          </div>
        </div>
      </div>
      <div class="add__actions">
        <v-button name="Отмена" @buttonAction="$emit('hideNodeMenu')"/>
        <v-button name="Сохранить" @buttonAction="$emit('addNewNode')"/>
      </div>
    </div>
  </aside>
</template>

<script>
  import VBlockHeader from "@/components/VBlockHeader.vue";
  import VInput from "@/components/VInput.vue";
  import VSelect from "@/components/VSelect.vue";
  import VTextarea from "@/components/VTextarea.vue";
  import VButton from '@/components/VButton';
  import VRadioButton from "@/components/VRadioButton";

  export default {
    name: "AddMenu",
    components: {
      VRadioButton,
      VBlockHeader,
      VInput,
      VSelect,
      VTextarea,
      VButton
    },
    props: {
      titleBold: {
        type: String,
        default: '',
      },
      isNode: {
        type: Boolean,
        default: false
      },
      isCreateGraph: {
        type: Boolean,
        default: false
      },
      selectAddData: Array
    },
    computed: {
      mainItem() {
        return this.$store.state.mainItem
      },
      validError() {
        return this.$store.state.validError
      },
      yargyRules() {
        return this.$store.state.yargyRules;
      },
    },
    data: () => ({
      selectValue: '',
      inputValue: '',
      radioButtonValue: '1',

      textareasValue: {
        regExpFirstValue: '',
        regExpSecondValue: '',
      },
      numbersValue: {
        spanFirstValue: '',
        spanSecondValue: '',
      },
      nodeAttribute: 'lego:hasAttribute',
      checkboxValue: false,
    }),
    watch: {
      selectValue() {
        this.inputValue = '';
        this.textareasValue.regExpFirstValue = '';
        this.textareasValue.regExpSecondValue = '';
        this.numbersValue.spanFirstValue = '';
        this.numbersValue.spanSecondValue = '';
        if (this.selectValue === 'lego:cardinality') this.inputValue = '1';
      },
      textareasValue: {
        handler: function () {
          if (this.textareasValue.regExpFirstValue.length > 0 && this.textareasValue.regExpSecondValue.length > 0) {
            this.inputValue = `${this.textareasValue.regExpFirstValue};${this.textareasValue.regExpSecondValue}`
          } else if (this.textareasValue.regExpFirstValue.length === 0 && this.textareasValue.regExpSecondValue.length > 0) {
            this.inputValue = this.textareasValue.regExpSecondValue
          } else if (this.textareasValue.regExpFirstValue.length > 0 && this.textareasValue.regExpSecondValue.length === 0) {
            this.inputValue = this.textareasValue.regExpFirstValue
          }
        },
        deep: true
      },
      numbersValue: {
        handler: function () {
          if (this.numbersValue.spanFirstValue.length > 0 && this.numbersValue.spanSecondValue.length > 0) {
            this.inputValue = `${this.numbersValue.spanFirstValue};${this.numbersValue.spanSecondValue}`
          } else if (this.numbersValue.spanFirstValue.length === 0 && this.numbersValue.spanSecondValue.length > 0) {
            this.inputValue = this.numbersValue.spanSecondValue
          } else if (this.numbersValue.spanFirstValue.length > 0 && this.numbersValue.spanSecondValue.length === 0) {
            this.inputValue = this.numbersValue.spanFirstValue
          }
        },
        deep: true
      },
      checkboxValue() {
        if (this.checkboxValue) {
          this.numbersValue.spanFirstValue = '';
          this.numbersValue.spanSecondValue = '';
          this.inputValue = '0;9223372036854775807'
        } else {
          this.inputValue = ''
        }
      },

      inputValue() {
        if (this.validError) {
          this.$store.commit('SET_VALID_ERROR', false)
        }
      }
    },
    mounted() {
      if (this.isNode) {
        JSON.stringify(this.mainItem).split('lego:new_node').length
          ? this.inputValue = `lego:new_node_${JSON.stringify(this.mainItem).split('lego:new_node').length}`
          : this.inputValue = 'lego:new_node_1'
      }
    }
  }
</script>

<style lang="scss" scoped>

  .add {
    &::before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background-color: #000;
      opacity: .5;
      z-index: 90;
    }

    &-wrapper {
      width: 20%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background-color: #222222;
      border: 1px solid #383838;
      box-shadow: 3px 3px 5px -1px #000;
      z-index: 100;
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
    }

    &__body {
      padding: 25px 20px 20px;

      &--number {
        display: flex;
        justify-content: space-between;
        color: #e7edf2;

        .input {
          width: 30%
        }
      }

      &--yargy-wrap {
        display: flex;
        align-items: center;
      }
    }

    &__actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 10px;
      border-top: 1px solid #383838;
    }

    &__error {
      font-size: 12px;
    }
  }

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
      width: 100%;
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

        &:hover {
          border: 1px solid #383838;
        }
      }
    }

    &__option {
      padding: 7px;
    }
  }

</style>
