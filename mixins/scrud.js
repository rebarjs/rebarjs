import { Schema } from '@hyperjump/json-schema-core'

export default {
  data() {
    return {
      as: this.getComponent(),
      label: undefined,
      componentProps: {
        id: this.propertyName,
      },
      children: this.getChildren(),
    }
  },

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

  methods: {
    getComponent() {
      if (!this.component) {
        const typeKeys = this.getTypeKeys()
        for (const key in typeKeys) {
          const componentKey = typeKeys[key]
          const component = this.getComponentFor(componentKey)
          if (component) {
            this.component = component
            break
          }
        }
        if (!this.component) {
          this.component = this.getComponentFor('__default__')
        }
      }
      return this.component
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
    getTypeKeys() {
      if (!this.typeKeys) {
        // construct the type keys to use in fallback matching for the component to use
        // from the configMapping
        const jsonLDType = this.resolveJsonLDContextURL()
        const jsonSchemaType = this.jsonSchema
          ? Schema.uri(this.jsonSchema)
          : undefined
        const jsonType = typeof this.propertyValue
        const keys = [jsonLDType, jsonSchemaType, jsonType]
        this.typeKeys = []
        for (const typeKey in keys) {
          if (keys[typeKey]) {
            this.typeKeys.push(keys[typeKey])
          }
        }
      }
      return this.typeKeys
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
    async getJsonSchema() {
      if (this.jsonSchemaURL) {
        this.jsonSchema = await Schema.get(this.jsonSchemaURL)
      }
      return undefined
    },
    getChildren() {
      // TODO Need to build the children based on the JSON Schema if available!
      const children = typeof this.propertyValue === 'object' ? {} : []
      for (const childName in this.propertyValue) {
        const childValue = this.propertyValue[childName]
        const childPropertyPath = this.propertyPathFor(childName)
        // FIXME this is likely incomplete, especially for enveloped resources,
        // which also need to be properly handled...  For enveloped resources
        // the schema and context would need to be retrieved and passed along.
        const childLDContext =
          this.jsonLDContext &&
          typeof this.jsonLDContext === 'object' &&
          typeof this.jsonLDContext[childName] !== 'undefined'
            ? this.jsonLDContext[childName]
            : undefined
        // For now, assume we're using an SDoc from
        // https://github.com/hyperjump-io/json-schema-core
        const childJsonSchema =
          this.jsonSchema && childName in this.jsonSchema
            ? this.jsonSchema.properties[childName]
            : undefined
        children[childName] = {
          propertyName: childName,
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
      return children
    },
    getPropertyPath() {
      if (!this.propertyPath) {
        return ''
      }
      return this.propertyPath
    },
    propertyPathFor(childName) {
      const parentPath = this.getPropertyPath()
      switch (typeof childName) {
        case 'string':
          return parentPath + '.' + childName
        case 'number':
          return parentPath + '[' + childName + ']'
        default:
          throw new Error(
            'Unsupported property type: ' + typeof this.propertyValue
          )
      }
    },
  },
}
