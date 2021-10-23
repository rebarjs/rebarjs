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
import scrud from '~/mixins/scrud'

/**
 * Build a SCRUD component for an object using a ScrudValue or ScrudComposite for each
 * property.
 */
export default {
  mixins: [scrud],
  props: {
    form: {
      type: [Boolean, String, Object],
      default: undefined,
    },
  },
  computed: {
    valueComponentMatch() {
      return this.getComponentFor('__value__')
    },
    valueComponent() {
      return this.componentForUIType(this.valueComponentMatch)
    },
    formComponentMatch() {
      let match
      if (this.form) {
        match = this.form
      }
      if (typeof match === 'boolean' && match) {
        match = this.getComponentFor('__form__')
      }
      return match
    },
    formComponent() {
      if (Array.isArray(this.formComponentMatch)) {
        return this.formComponentMatch[0]
      }
      return this.formComponentMatch
    },
    formComponentProps() {
      const formProps = Array.isArray(this.formComponentMatch)
        ? this.formComponentMatch[1]
        : {}
      const parentProps = { ...this.$props }
      parentProps.form = false
      return { ...parentProps, ...formProps }
    },
  },
}
</script>
