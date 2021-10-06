<template>
  <div>
    <div v-for="(child, propertyName) in children" :key="propertyName">
      <scrud-value v-bind="child" />
    </div>
  </div>
</template>

<script>
import scrud from '../mixins/scrud'
import ScrudValue from './ScrudValue.vue'

/**
 * Build a SCRUD component for an object using a ScrudValue or ScrudComposite for each
 * property.
 */
export default {
  components: { ScrudValue },
  mixins: [scrud],
}
</script>
