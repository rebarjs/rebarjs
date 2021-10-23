<template>
  <div>
    <div v-for="(child, propertyName) in children" :key="propertyName">
      <component
        :is="valueComponent"
        v-model="localValue[propertyName]"
        v-bind="child"
        :ui-type="uiType"
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
    valueComponentMatch() {
      return this.getComponentFor('__value__')
    },
    valueComponent() {
      return this.componentForUIType(this.valueComponentMatch)
    },
  },
}
</script>
