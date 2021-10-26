<template>
  <div>
    <component
      :is="formComponent"
      v-if="isInput"
      v-model="content"
      v-bind="formComponentProps"
      :ui-type="currentUiType"
      :json-schema="$_jsonSchema"
      @submit="onSubmit"
    >
    </component>
    <div v-for="(child, propertyName) in children" v-else :key="propertyName">
      <component
        :is="valueComponent"
        v-model="localValue[propertyName]"
        v-bind="child"
        :ui-type="currentUiType"
      />
    </div>
    <b-button v-if="!isInput" variant="primary" @click="switchToEdit"
      >Edit</b-button
    >
  </div>
</template>

<script>
import { Schema } from '@hyperjump/json-schema-core'
import scrudComposite from '~/mixins/scrudComposite'

export default {
  name: 'OpenApiComponent',
  mixins: [scrudComposite],
  props: {
    configMapping: {
      type: Object,
      required: true,
    },
    uiType: {
      type: String,
      default: 'get',
    },
    openApiSchema: {
      type: Object,
      default: undefined,
    },
    openApiSchemaURL: {
      type: String,
      default: undefined,
    },
    // eslint-disable-next-line vue/require-prop-types
    resourceContent: {
      default: undefined,
    },
    resourceURL: {
      type: String,
      default: undefined,
    },
    form: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      content: {},
      currentUiType: this.uiType,
    }
  },
  // eslint-disable-next-line require-await
  async fetch() {
    if (this.$_jsonSchema === undefined) {
      this.$_jsonSchema = await this.getJsonSchema()
    }
    if (this.children === undefined) {
      this.children = await this.getChildren()
    }
    if (this.componentMatch === undefined) {
      this.componentMatch = await this.getComponentMatch()
    }
    if (this.label === undefined) {
      this.label = await this.getLabel()
    }
    this.content = this.resourceContent ? this.resourceContent : undefined
  },
  computed: {
    isInput() {
      return this.currentUiType === 'post' || this.currentUiType === 'put'
    },
    localValue: {
      get() {
        return this.resourceContent
      },
      set(localValue) {
        this.$emit('input', localValue)
      },
    },
  },
  watch: {
    uiType: {
      handler(newVal) {
        this.currentUiType = newVal
      },
    },
  },
  methods: {
    async getOperationSchema() {
      const operation = await this.getOperation()
      let content
      if (this.isInput) {
        const requestBody = operation ? operation.requestBody : undefined
        content = requestBody ? requestBody.content : undefined
      } else {
        const responses =
          operation && operation.responses ? operation.responses : undefined
        const response = responses ? responses['200'] : undefined
        content = response ? response.content : undefined
      }
      const mediaType = content ? content['application/json'] : undefined
      const schema = mediaType ? mediaType.schema : undefined
      return schema
    },
    async getContentJsonSchema() {
      const schema = await this.getOperationSchema()
      if (schema && schema.$ref) {
        return await Schema.get(schema.$ref)
      }
      // TODO handle inline schema definition, may need to generate an id!!
      // and cache results
      return undefined
    },
    async getContentJsonSchemaURL() {
      const schema = await this.getOperationSchema()
      if (schema && schema.$ref) {
        return schema.$ref
      }
      // TODO handle inline schema definition, may need to generate an id!!
      // and cache results
      return undefined
    },
    async getOperation() {
      const schema = await this.getOpenApiSchema()
      if (schema && this.uiType) {
        return schema[this.uiType]
      }
      return undefined
    },
    // eslint-disable-next-line require-await
    async getOpenApiSchema() {
      if (this.openApiSchema) {
        return this.openApiSchema
      }
      // TODO retrieve it!
      return undefined
    },
    async getJsonSchema() {
      const schema = await this.getContentJsonSchema()
      return schema
    },
    switchToEdit() {
      this.currentUiType = 'put'
    },
    switchToRender() {
      this.currentUiType = 'get'
    },
    // eslint-disable-next-line require-await
    async getPropertyValue() {
      return this.resourceContent
    },
    onSubmit() {
      this.switchToRender()
      alert(JSON.stringify(this.localValue))
    },
  },
}
</script>
