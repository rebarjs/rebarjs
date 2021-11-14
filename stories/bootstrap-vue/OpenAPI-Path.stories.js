import { Schema } from '@hyperjump/json-schema-core'
import { bootstrapConfigMap } from './configMap'
import PathItem from './components/PathItem'

// OpenAPI v3.1
// const openapi_v3_1_URL = 'https://spec.openapis.org/oas/3.1/schema/2021-09-28'

const ProfileSchemaURL = 'http://scrudful.org/json-schema/storybook/Profile'
Schema.add(
  {
    $schema: 'https://json-schema.org/draft/2019-09/schema',
    $id: ProfileSchemaURL,
    type: 'object',
    properties: {
      firstName: {
        type: 'string',
        minLength: 2,
        title: 'First Name',
      },
      lastName: {
        type: 'string',
        minLength: 2,
        title: 'Last Name',
      },
      email: {
        type: 'string',
        format: 'email',
        title: 'Email',
      },
      age: {
        type: 'integer',
        minimum: 18,
        maximum: 130,
        title: 'Age',
      },
    },
    required: ['firstName', 'lastName', 'email'],
  },
  ProfileSchemaURL
)

// TODO define an OpenAPI PathItem for some example resource
const PathItemWithGetPut = {
  get: {
    operationId: 'retrieve-Profile',
    responses: {
      // eslint-disable-next-line prettier/prettier
      200: {
        content: {
          'application/json': {
            schema: {
              $ref: ProfileSchemaURL,
            },
          },
        }
      },
    },
  },
  put: {
    operationId: 'update-Profile',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: ProfileSchemaURL,
          }
        }
      }
    },
    responses: {
      // eslint-disable-next-line prettier/prettier
      200: {},
    },
  },
  delete: {
    operationId: 'delete-Profile',
    responses: {
      // eslint-disable-next-line prettier/prettier
      200: {},
    },
  },
}

export default {
  title: 'OpenAPI Path Examples',
}

const SimpleRetrieveUpdateDeleteTemplate = (args, { argTypes }) => ({
  props: [...Object.keys(argTypes)],
  template: `
      <PathItem v-bind="$props""></PathItem>
    `,
  components: {
    PathItem,
  },
})

export const retrieveUpdateDelete = SimpleRetrieveUpdateDeleteTemplate.bind({})
retrieveUpdateDelete.args = {
  resourceContent: {
    firstName: 'Oscar',
    lastName: 'the Grouch',
    age: 50,
    email: 'oscar@sesamestreet.com',
  },
  openApiSchema: PathItemWithGetPut,
  configMapping: bootstrapConfigMap,
  uiType: 'get',
}
