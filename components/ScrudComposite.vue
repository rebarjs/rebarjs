<template>
  <div>
    <div v-for="(child, propertyName) in children" :key="propertyName">
      <!-- <scrud-value v-model="value[propertyName]" v-bind="child" /> -->
      <component
        :is="valueComponent"
        v-model="localValue[propertyName]"
        v-bind="child"
      />
    </div>
  </div>
</template>

<script>
import scrud from '~/mixins/scrud'

/**
 * Build a SCRUD component for an object using a ScrudValue or ScrudComposite for each
 * property.
 */
export default {
  mixins: [scrud],
  computed: {
    valueComponent() {
      return this.getComponentFor('__value__')
    },
  },
}
</script>
