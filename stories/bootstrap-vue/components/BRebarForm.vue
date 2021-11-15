<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <b-form @submit.prevent="handleSubmit(onSubmit)">
      <rebar-composite v-model="$props.value" v-bind="$props"></rebar-composite>
      <b-button type="submit" variant="primary">Submit</b-button>
    </b-form>
  </ValidationObserver>
</template>

<script>
import { ValidationObserver } from 'vee-validate'
import RebarComposite from '../../../components/RebarComposite.vue'
import rebar from '~/mixins/rebar'

export default {
  name: 'BRebarForm',
  components: {
    RebarComposite,
    ValidationObserver,
  },
  mixins: [rebar],
  methods: {
    onSubmit() {
      this.$emit('submit')
    },
  },
}
</script>
