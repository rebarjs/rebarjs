import { Schema } from '@hyperjump/json-schema-core'
import isVarName from 'is-var-name'

export default {
  props: {
    value: {
      type: undefined,
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
    required: {
      type: Boolean,
      required: false,
    },
  },

  data() {
    return {
      componentMatch: undefined,
      label: undefined,
      children: undefined,
      $_jsonSchema: undefined,
      $_jsonLDContext: undefined,
      $_typeKeys: undefined,
    }
  },

  computed: {
    currentComponent() {
      return this.componentForUIType(this.componentMatch)
    },
    as() {
      if (Array.isArray(this.currentComponent)) {
        return this.currentComponent[0]
      }
      return this.currentComponent
    },
    mappingProps() {
      if (Array.isArray(this.currentComponent)) {
        return this.currentComponent[1]
      }
      return {}
    },
    componentProps() {
      const id =
        this.propertyPath === '$' ? this.propertyName : this.propertyPath
      const resultProps = { id }
      if ('__props__' in this.mappingProps) {
        // map properties of this component to props of the target component
        const dunderProps = this.mappingProps.__props__
        for (const targetKey in dunderProps) {
          const sourceKey = dunderProps[targetKey]
          if (sourceKey instanceof Function) {
            resultProps[targetKey] = sourceKey(this)
          } else {
            resultProps[targetKey] = this[sourceKey]
          }
        }
      }
      return { ...this.mappingProps, ...resultProps, ...this.props }
    },
    componentSlots() {
      const resultSlots = []
      if ('__slots__' in this.mappingProps) {
        // map properties of this component to slots of the target component
        const mappingSlots = this.mappingProps.__slots__
        for (const idx in mappingSlots) {
          const slotSource = mappingSlots[idx]
          if (slotSource instanceof Function) {
            resultSlots.push(slotSource(this))
          } else {
            resultSlots.push(this[slotSource])
          }
        }
      }
      return resultSlots
    },
    localValue: {
      get() {
        return this.value
      },
      set(localValue) {
        this.$emit('input', localValue)
      },
    },
  },

  async fetch() {
    if (this.$_jsonSchema === undefined) {
      await this.getJsonSchema()
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
  },

  watch: {
    localValue: {
      handler(newVal) {
        this.$emit('input', newVal)
      },
      deep: true,
    },
  },

  methods: {
    async getLabel() {
      const jsonSchema = await this.getJsonSchema()
      const titleSchema = await this.getSchemaProperty('title', jsonSchema)
      const title = titleSchema ? Schema.value(titleSchema) : undefined
      return title
    },
    componentForUIType(match) {
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
    async getComponentMatch() {
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
      return this.configMapping[key]
    },
    async getTypeKeys() {
      if (this.$_typeKeys === undefined) {
        // construct the type keys to use in fallback matching for the component to use
        // from the configMapping
        const jsonLDType = this.resolveJsonLDContextURL()
        const jsonSchema = await this.getJsonSchema()
        const jsonSchemaType = jsonSchema
          ? await this.resolveJsonSchemaType(jsonSchema)
          : undefined
        const jsonSchemaURI = jsonSchema ? Schema.uri(jsonSchema) : undefined
        const jsonType = typeof (await this.getPropertyValue())
        const jsonSchemaFormatSchema =
          jsonSchemaType && jsonSchemaType === 'string'
            ? await this.getSchemaProperty('format', jsonSchema)
            : undefined
        const jsonSchemaFormat = jsonSchemaFormatSchema
          ? Schema.value(jsonSchemaFormatSchema)
          : undefined
        const keys = [
          jsonLDType,
          jsonSchemaFormat,
          jsonSchemaURI,
          jsonSchemaType,
          jsonType,
        ]
        this.$_typeKeys = []
        for (const typeKey in keys) {
          if (keys[typeKey]) {
            this.$_typeKeys.push(keys[typeKey])
          }
        }
      }
      return this.$_typeKeys
    },
    async resolveJsonSchemaType(jsonSchema) {
      const typeValueSchema = await this.getSchemaProperty('type', jsonSchema)
      return typeValueSchema
        ? Schema.value(typeValueSchema)
        : Schema.uri(jsonSchema)
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
    async getSchemaProperty(property, schema) {
      const hasProperty = schema
        ? await Schema.has(property, schema)
        : undefined
      return hasProperty ? await Schema.step(property, schema) : undefined
    },
    async getChildren() {
      // TODO Need to build the children based on the JSON Schema if available!
      const children = {}
      const propertyValue = await this.getPropertyValue()
      if (typeof propertyValue === 'object') {
        const jsonSchema = await this.getJsonSchema()
        const childKeys = await this.getAllChildKeys()
        const requiredSchema = await this.getSchemaProperty(
          'required',
          jsonSchema
        )
        const requiredChildren = requiredSchema
          ? new Set(Schema.value(requiredSchema))
          : new Set([])
        const jsonSchemaProperties = await this.getSchemaProperty(
          'properties',
          jsonSchema
        )
        for (const idx in childKeys) {
          const childKey = childKeys[idx]
          const childPropertyPath = this.propertyPathFor(childKey)
          const jsonLDContextURL = await this.getJsonLDContextURL()
          // FIXME this is likely incomplete, especially for enveloped resources,
          // which also need to be properly handled...  For enveloped resources
          // the schema and context would need to be retrieved and passed along.
          const childLDContext =
            this.jsonLDContext &&
            typeof this.jsonLDContext === 'object' &&
            typeof this.jsonLDContext[childKey] !== 'undefined'
              ? this.jsonLDContext[childKey]
              : undefined
          let childJsonSchema = await this.getSchemaProperty(
            childKey,
            jsonSchemaProperties
          )
          if (childJsonSchema) {
            const ref = await this.getSchemaProperty('$ref', childJsonSchema)
            if (ref) {
              const refValue = Schema.value(ref)
              childJsonSchema = await Schema.get(refValue, childJsonSchema)
            }
          }
          const childJsonSchemaURL = childJsonSchema
            ? Schema.uri(childJsonSchema)
            : undefined
          const required = requiredChildren.has(childKey)
          children[childKey] = {
            configMapping: this.configMapping,
            propertyPath: childPropertyPath,
            // eslint-disable-next-line object-shorthand
            jsonLDContextURL: jsonLDContextURL,
            jsonSchemaURL: childJsonSchemaURL,
            jsonLDContext: childLDContext,
            jsonSchema: childJsonSchema,
            required,
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
      if (!schema) {
        return new Set()
      }
      const properties = await Schema.step('properties', schema)
      if (!properties) {
        return new Set()
      }
      const keys = await Schema.keys(properties)
      return keys
    },
    // eslint-disable-next-line require-await
    async getPropertyValue() {
      return this.value
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
