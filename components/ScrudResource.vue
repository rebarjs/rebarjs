<template>
  <div>
    <div v-for="(child, propertyName) in children" :key="propertyName">
      <scrud-value v-bind="child" />
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line camelcase
import scrud_resource from '~/mixins/scrud_resource'

export default {
  // eslint-disable-next-line camelcase
  mixins: [scrud_resource],
}
</script>
