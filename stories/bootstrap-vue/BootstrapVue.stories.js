import { Schema } from '@hyperjump/json-schema-core'
import { bootstrapConfigMap } from './configMap'
import SimpleContent from '~/components/SimpleContent'

export default {
  title: 'Bootstrap Vue Examples',
}

const Template = (args, { argTypes }) => ({
  components: { SimpleContent },
  props: [...Object.keys(argTypes)],
  template:
    '<ScrudComposite v-model="$props.propertyValue" v-bind="$props"></ScrudComposite>',
})

const firstExampleSchemaURL =
  'http://scrudful.org/json-schema/storybook/bootstrap-vue/BootStrapVue'

Schema.add(
  {
    $schema: 'https://json-schema.org/draft/2019-09/schema',
    $id: firstExampleSchemaURL,
    type: 'object',
    properties: {
      aString: {
        type: 'string',
        title: 'A String',
      },
      aNumber: {
        type: 'number',
        title: 'A Number',
      },
      aTime: {
        type: 'string',
        format: 'time',
        title: 'A Time',
      },
      aDate: {
        type: 'string',
        format: 'date',
        title: 'A Date',
      },
      anEmail: {
        type: 'string',
        format: 'email',
        title: 'An Email',
      },
      aLink: {
        type: 'string',
        format: 'uri',
        title: 'A Link',
      },
    },
    definitions: {},
  },
  firstExampleSchemaURL
)

export const FirstRenderExample = Template.bind({})
FirstRenderExample.args = {
  propertyName: 'data',
  propertyValue: {
    aString: 'Hello!',
    aNumber: '42',
    aTime: '12:00:00',
    aDate: '2021-10-15',
    anEmail: 'someone@example.com',
    aLink: 'http://example.com',
  },
  configMapping: bootstrapConfigMap,
  uiType: 'get',
  jsonSchemaURL: firstExampleSchemaURL,
}

export const FirstInputExample = Template.bind({})
FirstInputExample.args = {
  propertyName: 'data',
  propertyValue: {},
  configMapping: bootstrapConfigMap,
  uiType: 'post',
  jsonSchemaURL: firstExampleSchemaURL,
}
