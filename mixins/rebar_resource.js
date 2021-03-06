import rebar from '~/mixins/rebar'
import RebarValue from '~/components/RebarValue.vue'

/**
 * Build a REBAR component for an object given the URL of the object and/or its value.
 */
export default {
  components: { RebarValue },
  mixins: [rebar],
  props: {
    propertyName: {
      type: String,
      required: false,
      default: undefined,
    },
    // this property will be ignored
    // eslint-disable-next-line vue/require-prop-types
    propertyValue: {
      required: false,
      default: undefined,
    },
    resourceURL: {
      type: String,
      required: false,
      default: undefined,
    },
    resourceOptions: {
      type: Object,
      required: false,
      default: undefined,
    },
  },
  data() {
    // the $_ properties are largely the resolved values for this instance.
    return {
      // the body of the resource
      $_propertyValue: undefined,
      $_jsonSchemaURL: undefined,
      $_jsonLDContextURL: undefined,
      $_jsonSchema: undefined,
      $_jsonLDContext: undefined,
      $_resourceOptions: undefined,
      children: undefined,
    }
  },
  async fetch() {
    if (this.propertyValue === undefined) {
      if (!this.resourceURL) {
        throw new Error(
          'Incomplete configuration: propertyValue or resourceURL MUST be provided in props'
        )
      }
      await this.getResource()
    } else {
      this.$_propertyValue = this.propertyValue
    }
    if (this.$_resourceOptions === undefined) {
      await this.getResourceOptions()
    }
    if (this.$_jsonSchema === undefined) {
      await this.getJsonSchema()
    }
    if (this.$_jsonLDContext === undefined) {
      await this.getJsonLDContext()
    }
    if (this.children === undefined) {
      this.children = await this.getChildren()
    }
    if (this.as === undefined) {
      this.as = await this.getComponent()
    }
  },
  methods: {
    async getResource() {
      // TODO handle HTTP error responses
      if (this.$_propertyValue === undefined) {
        this.$_propertyValue =
          this.propertyValue !== undefined
            ? this.propertyValue
            : await this.$cachingClient.get(
                this.convertToHttps(this.resourceURL),
                { json: true }
              )
      }
      return this.$_propertyValue
    },
    async getResourceOptions() {
      // TODO handle HTTP error responses
      if (this.$_resourceOptions === undefined) {
        if (this.resourceOptions) {
          this.$_resourceOptions = this.resourceOptions
        } else if (this.resourceURL) {
          this.$_resourceOptions = await this.$cachingClient.options(
            this.convertToHttps(this.resourceURL),
            { json: true }
          )
        } else {
          this.$_resourceOptions = null
        }
      }
      return this.$_resourceOptions
    },
    async getJsonSchemaURL() {
      if (this.$_jsonSchemaURL === undefined) {
        if (this.jsonSchemaURL) {
          this.$_jsonSchemaURL = this.jsonSchemaURL
        } else {
          const options = await this.getResourceOptions()
          if (options) {
            switch (this.uiType) {
              case 'post':
                this.$_jsonSchemaURL = this.getPostSchemaURLFrom(options)
                break
              case 'get':
              case 'put':
                this.$_jsonSchemaURL = this.getSchemaURLFrom(options)
                break
              default:
                throw new Error('Unsupported uiType: ' + this.uiType)
            }
          }
        }
        this.$_jsonSchemaURL = this.$_jsonSchemaURL
          ? this.$_jsonSchemaURL
          : null
      }
      return this.$_jsonSchemaURL
    },
    async getJsonSchema() {
      if (this.$_jsonSchema === undefined) {
        if (this.jsonSchema) {
          this.$_jsonSchema = this.jsonSchema
        } else {
          const jsonSchemaURL = await this.getJsonSchemaURL()
          if (jsonSchemaURL) {
            this.$_jsonSchema = await this.$cachingClient.options(
              this.convertToHttps(this.$_jsonSchemaURL),
              { json: true }
            )
          }
        }
        this.$_jsonSchema = this.$_jsonSchema ? this.$_jsonSchema : null
      }
      return this.$_jsonSchema
    },
    async getJsonLDContextURL() {
      if (this.$_jsonLDContextURL === undefined) {
        if (this.jsonLDContextURL) {
          this.$_jsonLDContextURL = this.jsonLDContextURL
        } else {
          const options = await this.getResourceOptions()
          if (options) {
            switch (this.uiType) {
              case 'post':
                this.$_jsonLDContextURL = this.getPostContextURLFrom(options)
                break
              case 'get':
              case 'put':
                this.$_jsonLDContextURL = this.getContextURLFrom(options)
                break
              default:
                throw new Error('Unsupported uiType: ' + this.uiType)
            }
          }
        }
        this.$_jsonLDContextURL = this.$_jsonLDContextURL
          ? this.$_jsonLDContextURL
          : null
      }
      return this.$_jsonLDContextURL
    },
    getPostSchemaURLFrom(data) {
      return data.requestBody.content['application/json'].schema
    },
    getPostContextURLFrom(data) {
      return data.requestBody.content['application/json'].context
    },
    getSchemaURLFrom(data) {
      return data.responses['200'].content['application/json'].schema
    },
    getContextURLFrom(data) {
      return data.responses['200'].content['application/json'].context
    },
    convertToHttps(url) {
      if (url) {
        const to = new URL(url)
        to.protocol = 'https'
        return to.toString()
      }
    },
    getPropertyValue() {
      return this.$_propertyValue
    },
  },
}
