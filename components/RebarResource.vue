<template>
  <div>
    <div v-for="(child, propertyName) in children" :key="propertyName">
      <rebar-value v-bind="child" />
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line camelcase
import rebar_resource from '~/mixins/rebar_resource'

export default {
  // eslint-disable-next-line camelcase
  mixins: [rebar_resource],
}
</script>
