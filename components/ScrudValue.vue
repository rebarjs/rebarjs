<template>
  <div>
    <label
      v-if="label && (uiType === 'post' || uiType === 'put')"
      :for="componentProps.id"
      >{{ label }}</label
    >
    <component
      :is="as"
      v-model="localValue"
      v-bind="componentProps"
      :ui-type="uiType"
    >
      <slot v-for="item in componentSlots">{{ item }}</slot>
    </component>
  </div>
</template>

<script>
import scrud from '~/mixins/scrud'

export default {
  name: 'ScrudValue',
  mixins: [scrud],
}
</script>
