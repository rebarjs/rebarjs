import rebar from '~/mixins/rebar'

export default {
  mixins: [rebar],
  props: {
    form: {
      type: [Boolean, String, Object],
      default: undefined,
    },
    value: {
      required: false,
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
