<template>
  <b-form @submit="onSubmit">
    <scrud-composite v-model="$props.value" v-bind="$props"></scrud-composite>
    <b-button type="submit" variant="primary">Submit</b-button>
  </b-form>
</template>

<script>
import ScrudComposite from '../../../components/ScrudComposite.vue'
import scrud from '~/mixins/scrud'

export default {
  name: 'BRebarForm',
  components: {
    ScrudComposite,
  },
  mixins: [scrud],
  methods: {
    onSubmit(event) {
      event.preventDefault()
      alert(JSON.stringify(this.value))
    },
  },
}
</script>
