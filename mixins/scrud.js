import { Schema } from '@hyperjump/json-schema-core'
import isVarName from 'is-var-name'

export default {
  props: {
    propertyName: {
      type: String,
      required: true,
    },
    propertyValue: {
      required: true,
    },
    configMapping: {
      type: Object,
      required: true,
    },
    uiType: {
      type: String,
      required: true,
    },
    propertyPath: {
      type: String,
      required: false,
      default: '$',
    },
    jsonLDContextURL: {
      type: String,
      required: false,
    },
    jsonSchemaURL: {
      type: String,
      required: false,
    },
    jsonLDContext: {
      type: Object,
      required: false,
    },
    jsonSchema: {
      type: Object,
      required: false,
    },
  },

  data() {
    const id = this.propertyPath === '$' ? this.propertyName : this.propertyPath
    return {
      as: undefined,
      label: undefined,
      componentProps: {
        id,
      },
      children: undefined,
      $_jsonSchema: undefined,
      $_jsonLDContext: undefined,
      $_typeKeys: undefined,
    }
  },

  async fetch() {
    if (this.$_jsonSchema === undefined) {
      await this.getJsonSchema()
    }
    if (this.children === undefined) {
      this.children = await this.getChildren()
    }
    if (this.as === undefined) {
      this.as = await this.getComponent()
    }
  },

  methods: {
    async getComponent() {
      const typeKeys = await this.getTypeKeys()
      let component
      for (const key in typeKeys) {
        const componentKey = typeKeys[key]
        component = this.getComponentFor(componentKey)
        if (component) {
          break
        }
      }
      if (!component) {
        component = this.getComponentFor('__default__')
      }
      return component
    },
    getComponentFor(key) {
      const match = this.configMapping.components[key]
      if (match) {
        switch (this.uiType) {
          case 'post':
            return match.input
          case 'put':
            return match.input
          case 'get':
            return match.render
          default:
            break
        }
      }
      return undefined
    },
    async getTypeKeys() {
      if (this.$_typeKeys === undefined) {
        // construct the type keys to use in fallback matching for the component to use
        // from the configMapping
        const jsonLDType = this.resolveJsonLDContextURL()
        const jsonSchema = await this.getJsonSchema()
        const jsonSchemaType = jsonSchema ? Schema.uri(jsonSchema) : undefined
        const jsonType = typeof (await this.getPropertyValue())
        const keys = [jsonLDType, jsonSchemaType, jsonType]
        this.$_typeKeys = []
        for (const typeKey in keys) {
          if (keys[typeKey]) {
            this.$_typeKeys.push(keys[typeKey])
          }
        }
      }
      return this.$_typeKeys
    },
    resolveJsonLDContextURL() {
      if (this.jsonLDContext) {
        if (this.jsonLDContext['@type']) {
          return this.jsonLDContext['@type']
        } else if (this.jsonLDContext['@id']) {
          return this.jsonLDContext['@id']
        } else if (this.jsonLDContextURL) {
          return this.jsonLDContextURL
        }
      }
      return undefined
    },
    // eslint-disable-next-line require-await
    async getJsonSchemaURL() {
      return this.jsonSchemaURL
    },
    // eslint-disable-next-line require-await
    async getJsonLDContextURL() {
      return this.jsonLDContextURL
    },
    async getJsonSchema() {
      if (this.$_jsonSchema === undefined) {
        if (this.jsonSchema) {
          this.$_jsonSchema = this.jsonSchema
        } else {
          const jsonSchemaURL = await this.getJsonSchemaURL()
          if (jsonSchemaURL) {
            this.$_jsonSchema = await Schema.get(jsonSchemaURL)
          }
        }
        this.$_jsonSchema = this.$_jsonSchema || null
      }
      return this.$_jsonSchema
    },
    async getJsonLDContext() {
      if (this.$_jsonLDContext === undefined) {
        if (this.jsonLDContext) {
          this.$_jsonLDContext = this.jsonLDContext
        } else {
          const jsonLDContextURL = await this.getJsonLDContextURL()
          if (jsonLDContextURL) {
            this.$_jsonLDContext = await this.$cachingClient.get(
              this.convertToHttps(jsonLDContextURL),
              { json: true }
            )
          }
        }
        this.$_jsonLDContext = this.$_jsonLDContext
          ? this.$_jsonLDContext
          : null
      }
      return this.jsonLDContext
    },
    async getChildren() {
      // TODO Need to build the children based on the JSON Schema if available!
      const children = {}
      const propertyValue = await this.getPropertyValue()
      if (typeof propertyValue === 'object') {
        const childKeys = await this.getAllChildKeys()
        for (const idx in childKeys) {
          const childKey = childKeys[idx]
          const childValue = propertyValue[childKey]
          const childPropertyPath = this.propertyPathFor(childKey)
          // FIXME this is likely incomplete, especially for enveloped resources,
          // which also need to be properly handled...  For enveloped resources
          // the schema and context would need to be retrieved and passed along.
          const childLDContext =
            this.jsonLDContext &&
            typeof this.jsonLDContext === 'object' &&
            typeof this.jsonLDContext[childKey] !== 'undefined'
              ? this.jsonLDContext[childKey]
              : undefined
          // For now, assume we're using an SDoc from
          // https://github.com/hyperjump-io/json-schema-core
          const childJsonSchema =
            this.jsonSchema && childKey in this.jsonSchema
              ? this.jsonSchema.properties[childKey]
              : undefined
          children[childKey] = {
            propertyName: childKey,
            propertyValue: childValue,
            configMapping: this.configMapping,
            uiType: this.uiType,
            propertyPath: childPropertyPath,
            jsonLDContextURL: this.jsonLDContextURL,
            jsonSchemaURL: this.jsonSchemaURL,
            jsonLDContext: childLDContext,
            jsonSchema: childJsonSchema,
          }
        }
      }
      return children
    },
    async getAllChildKeys() {
      // respect and preserve both the schema AND the provided value
      const fromSchema = await this.getChildKeysFromSchema()
      const fromPropertyValue = await this.getChildKeysFromPropertyValue()
      const allKeys = [...new Set([...fromSchema, ...fromPropertyValue])]
      return allKeys
    },
    async getChildKeysFromSchema() {
      const schema = await this.getJsonSchema()
      return schema ? Schema.keys(schema) : new Set()
    },
    // eslint-disable-next-line require-await
    async getPropertyValue() {
      return this.propertyValue
    },
    async getChildKeysFromPropertyValue() {
      const value = await this.getPropertyValue()
      if (!value || typeof value !== 'object') {
        return []
      }
      if (Array.isArray(value)) {
        return Array.keys(value)
      }
      return new Set(Object.keys(value))
    },
    getPropertyPath() {
      if (!this.propertyPath) {
        return '$'
      }
      return this.propertyPath
    },
    propertyPathFor(childName) {
      const parentPath = this.getPropertyPath()
      let suffix = ''
      switch (typeof childName) {
        case 'string':
          if (isVarName(childName)) {
            suffix = '.' + childName
          } else {
            suffix = '["' + childName + '"]'
          }
          break
        case 'number':
          suffix = '[' + childName + ']'
          break
        default:
          throw new Error(
            'Unsupported property type: ' + typeof this.getPropertyValue()
          )
      }
      return parentPath + suffix
    },
  },
}
