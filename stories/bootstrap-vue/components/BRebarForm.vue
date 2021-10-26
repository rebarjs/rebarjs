<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <b-form @submit.prevent="handleSubmit(onSubmit)">
      <scrud-composite v-model="$props.value" v-bind="$props"></scrud-composite>
      <b-button type="submit" variant="primary">Submit</b-button>
    </b-form>
  </ValidationObserver>
</template>

<script>
import { ValidationObserver } from 'vee-validate';
import ScrudComposite from '../../../components/ScrudComposite.vue'
import scrud from '~/mixins/scrud'


export default {
  name: 'BRebarForm',
  components: {
    ScrudComposite,
    ValidationObserver,
  },
  mixins: [scrud],
  methods: {
    onSubmit() {
      this.$emit('submit')
    },
  },
}
</script>
