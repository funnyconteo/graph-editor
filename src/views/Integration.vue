<template>
  <div class="integration">
    <header>
      <v-block-header titleBold="Настройка интеграции" iconName="integration-white" />
    </header>
    <div class="integration__content">
      <v-select class="integration__type"
                :selectData="[{value: 'OpenID connect', id: 1}]"
                v-model="connect"
                label="Тип интеграции"
                :isDisabled="true"/>
      <fieldset class="integration__fieldset">
        <legend class="integration__legend">Настройки OpenID Connect</legend>
        <div class="integration__option">
          <span>OpenID Connect PROVIDER URL</span>
          <v-input :inputData="{id: 1}"
                   v-model="settings.provider_url"/>
        </div>
        <div class="integration__option">
          <span>OpenID Connect CLIENT ID</span>
          <v-input :inputData="{id: 1}"
                   v-model="settings.client_id"/>
        </div>
        <div class="integration__option">
          <span>OpenID Connect CLIENT SECRET</span>
          <v-input :inputData="{id: 1}"
                   v-model="settings.client_secret"
                   type="password"/>
        </div>
        <div class="integration__option">
          <span>OpenID Connect SCOPE</span>
          <v-input :inputData="{id: 1}"
                   v-model="settings.scope"/>
        </div>
        <div class="integration__option">
          <span>OpenID Connect LEEWAY</span>
          <v-input :inputData="{id: 1}"
                   type="number"
                   v-model="settings.leeway"/>
        </div>
        <div class="integration__option">
          <span>Default USER</span>
          <v-input :inputData="{id: 1}"
                   v-model="settings.default_usename"/>
        </div>
        <div class="integration__option">
          <span>OpenID Connect ALGORITHM</span>
          <v-select :selectData="algorithms"
                    isId
                    v-model="settings.algorithm"/>
        </div>
      </fieldset>
      <div class="integration__actions">
        <v-button name="Отмена" @buttonAction="getSettings"/>
        <v-button name="Соханить" @buttonAction="fetchSettings"/>
      </div>
    </div>
  </div>
</template>

<script>

  import VBlockHeader from "@/components/VBlockHeader.vue";
  import VSelect from "@/components/VSelect.vue";
  import VButton from '@/components/VButton'
  import VInput from "@/components/VInput.vue";


  export default {
    name: "Integration",
    components: {
      VBlockHeader,
      VSelect,
      VButton,
      VInput
    },
    data:() => ({
      settings: {},
      connect: 'OpenID connect',
    }),
    computed: {
      algorithms() {
        return this.$store.state.algorithms
      },
    },
    mounted() {
      this.getSettings();
      this.getAlgorithms()
    },
    methods: {
      getSettings() {
        this.$store.dispatch('getSettings')
          .then((response) => this.settings = response.data)
      },
      fetchSettings() {
        this.$store.dispatch('fetchSettings', this.settings)
      },
      getAlgorithms() {
        this.$store.dispatch('getAlgorithms')
      },
    }
  }
</script>

<style lang="scss" scoped>

  .integration {
    &__content {
      width: 50%;
      padding: 20px 15px;
    }

    &__type {
      width: 50%;
    }

    &__fieldset {
      color: #e7edf2;
      border-color: #4a4a4a;
      padding: 20px 15px;
    }

    &__legend {
      font-size: 12px;
      font-weight: bold;
    }

    &__option {
      display: flex;
      justify-content: space-between;

      span {
        width: 40%;
      }

      .input,
      .select {
        width: 50%;
      }
    }

    &__actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 10px;
    }
  }

</style>
