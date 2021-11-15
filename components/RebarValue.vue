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
import rebar from '~/mixins/rebar'

export default {
  name: 'RebarValue',
  mixins: [rebar],
}
</script>
