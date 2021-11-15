<template>
  <div>
    <component
      :is="formComponent"
      v-if="isInput"
      v-model="content"
      v-bind="formComponentProps"
      :ui-type="currentUiType"
      :json-schema="currentSchema"
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
import rebarComposite from '~/mixins/rebarComposite'

export default {
  name: 'OpenApiComponent',
  mixins: [rebarComposite],
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
      schemaByUiType: undefined,
      ldContextByUiType: undefined, // stub for the future
    }
  },
  // eslint-disable-next-line require-await
  async fetch() {
    if (this.schemaByUiType === undefined) {
      this.schemaByUiType = {}
      this.schemaByUiType.post = await this.getOperationSchemaFor('post')
      this.schemaByUiType.get = await this.getOperationSchemaFor('get')
      this.schemaByUiType.put = await this.getOperationSchemaFor('put')
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
      return this.isInputOperation(this.currentUiType)
    },
    localValue: {
      get() {
        return this.resourceContent
      },
      set(localValue) {
        this.$emit('input', localValue)
      },
    },
    currentSchema() {
      if (this.currentUiType && this.schemaByUiType) {
        return this.schemaByUiType[this.currentUiType]
      }
      return undefined
    }
  },
  watch: {
    uiType: {
      handler(newVal) {
        this.currentUiType = newVal
      },
    },
  },
  methods: {
    isInputOperation(operation) {
      return operation === 'post' || operation === 'put'
    },
    async getOperationSchema() {
      return await this.getOperationSchemaFor(this.currentUiType)
    },
    async getOperationSchemaFor(uiType) {
      const operation = await this.getOperationFor(uiType)
      let content
      if (this.isInputOperation(uiType)) {
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
      if (schema && schema.$ref) {
        return await Schema.get(schema.$ref)
      }
      return schema
    },
    async getContentJsonSchema() {
      const schema = await this.getOperationSchema()
      if (schema && schema.$ref) {
        return await Schema.get(schema.$ref)
      }
      // TODO handle inline schema definition, may need to generate an id!!
      // and cache results
      return schema
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
      return await this.getOperationFor(this.currentUiType)
    },
    async getOperationFor(uiType) {
      const schema = await this.getOpenApiSchema()
      if (schema && uiType) {
        return schema[uiType]
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
