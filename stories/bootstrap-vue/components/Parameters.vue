<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <b-form @submit.prevent="handleSubmit(onSubmit)">
      <div v-for="(child, propertyName) in children" :key="propertyName">
        <component
          :is="valueComponent"
          v-model="localValue[propertyName]"
          v-bind="child"
          :ui-type="'post'"
        />
      </div>
    </b-form>
  </ValidationObserver>
</template>

<script>
import { Schema } from '@hyperjump/json-schema-core'
import { ValidationObserver } from 'vee-validate'
import SwaggerClient from 'swagger-client'
import rebarComposite from '~/mixins/rebarComposite'

export default {
  name: 'Parameters',
  components: {
    ValidationObserver,
  },
  mixins: [rebarComposite],
  props: {
    value: {
      type: Object,
      default: null,
    },
    pathItemUrl: {
      // This property is required so that we can use Schema with the schema provided for individual
      // parameters - we'll need to construct the URL sometimes!
      type: String,
      required: true,
    },
    pathItem: {
      type: Object,
      required: true,
    },
    operationName: {
      type: String,
      required: true,
    },
  },
  computed: {
    operation() {
      return this.pathItem[this.operationName]
    },
    renderType() {
      return 'input'
    },
  },
  methods: {
    async getChildren() {
      const children = {}
      const parameters = await this.getParameterDefinitions()
      for (const idx in parameters) {
        const parameterDefinition = parameters[idx]
        children[parameterDefinition.name] = await this.childFor(
          parameterDefinition
        )
      }
      return children
    },
    async getParameterDefinitions() {
      // first, make sure we've resolved the tree for both the pathItem and the operation parameers
      const pathItemParameters = this.pathItem.parameters
        ? Array.from(
            (await SwaggerClient.resolve({ spec: this.pathItem })).spec
              .parameters
          )
        : []
      const operationParameters = this.operation.parameters
        ? Array.from(
            (await SwaggerClient.resolve({ spec: this.operation })).spec
              .parameters
          )
        : []
      const pathItemUrl = this.pathItemUrl
      // What about Schema? How to provide the proper url??
      return [
        ...pathItemParameters.map((entry) => {
          const parameterOriginalSchema = entry.schema
            ? entry.schema
            : undefined
          return {
            name: entry.name,
            definition: entry,
            originalSchema: parameterOriginalSchema,
            url: pathItemUrl + '/' + entry.name,
          }
        }),
        ...operationParameters.map((entry) => {
          const parameterOriginalSchema = entry.schema
            ? entry.schema
            : undefined
          const operationName = this.operationName
          return {
            name: entry.name,
            definition: entry,
            originalSchema: parameterOriginalSchema,
            url: pathItemUrl + '/' + operationName + '/' + entry.name,
          }
        }),
      ]
    },
    async childFor(parameter) {
      const jsonSchemaURL = parameter.originalSchema.$ref
        ? parameter.originalSchema.$ref
        : parameter.url + '/schema'
      if (parameter.definition.schema) {
        const schema = { ...parameter.definition.schema }
        if (!schema.$schema) {
          // let's pick a schema version to force the load
          schema.$schema = 'https://json-schema.org/draft/2019-09/schema'
        }
        Schema.add(schema, jsonSchemaURL)
      }
      const jsonSchema = await Schema.get(jsonSchemaURL)
      return {
        configMapping: this.configMapping,
        propertyPath: '__parameters__.' + parameter.name,
        jsonSchemaURL,
        jsonSchema,
        required: parameter.definition.required
          ? parameter.definition.required
          : false,
      }
    },
    onSubmit() {
      this.$emit('submit')
    },
  },
}
</script>
