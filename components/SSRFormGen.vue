<template>
  <div>
    <div v-for="(field, propertyName) in schema" :key="propertyName">
      <label v-if="field.label" :for="propertyName">
        {{ field.label }}
      </label>

      <component :is="field.as" v-bind="passingProps(field)"
        ><slot></slot
      ></component>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SSRFormGen',
  components: {},
  props: {
    uiSchema: {
      type: Object,
      required: false,
      default: null,
    },
    // eslint-disable-next-line vue/require-prop-types
    data: {
      required: false,
      default: null,
    },
  },
  computed: {
    schema() {
      if (this.uiSchema !== null) {
        return this.uiSchema
      }
      return {}
    },
  },
  methods: {
    passingProps(field) {
      const properties = {}
      Object.keys(field.props).forEach((propname) => {
        properties[propname] = field.props[propname]
      })
      return properties
    },
  },
}
</script>
