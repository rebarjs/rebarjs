<template>
  <div>
    <label v-if="label" :for="propertyName">{{ label }}</label>
    <component :is="as" v-model="propertyValue" v-bind="componentProps">
      <slot></slot>
    </component>
  </div>
</template>

<script>
import scrud from '~/mixins/scrud'

export default {
  mixins: [scrud],
}
</script>
