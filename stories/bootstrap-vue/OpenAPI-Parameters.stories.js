// import { Schema } from '@hyperjump/json-schema-core'
import { bootstrapConfigMap } from './configMap'
import Parameters from './components/Parameters'

// OpenAPI v3.1
// const openapi_v3_1_URL = 'https://spec.openapis.org/oas/3.1/schema/2021-09-28'

// TODO define an OpenAPI PathItem for some example resource
const PathItemExample = {
  parameters: [
    {
      name: 'kind',
      in: 'query',
      schema: {
        type: 'string',
        enum: ['red', 'amber', 'green'],
        title: 'Kind',
      },
    },
  ],
  get: {
    parameters: [
      {
        name: 's',
        in: 'query',
        schema: {
          type: 'string',
          title: 'Search',
        },
      },
    ],
  },
}

export default {
  title: 'OpenAPI Parameters Examples',
}

const SimpleParametersTemplate = (args, { argTypes }) => ({
  props: [...Object.keys(argTypes)],
  template: `
      <Parameters v-bind="$props""></Parameters>
    `,
  components: {
    Parameters,
  },
})

export const simpleParameters = SimpleParametersTemplate.bind({})
simpleParameters.args = {
  configMapping: bootstrapConfigMap,
  uiType: 'get',
  pathItemUrl: 'https://rebarjs.org/examples/Parameters/PathItem',
  pathItem: PathItemExample,
  operationName: 'get',
  value: {},
}
