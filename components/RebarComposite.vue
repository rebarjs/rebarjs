<template>
  <div>
    <component
      :is="formComponent"
      v-if="form && renderType === 'input'"
      v-model="$props.value"
      v-bind="formComponentProps"
    >
    </component>
    <div v-for="(child, propertyName) in children" v-else :key="propertyName">
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
import rebarComposite from '~/mixins/rebarComposite'

export default {
  name: 'RebarComposite',
  mixins: [rebarComposite],
}
</script>
