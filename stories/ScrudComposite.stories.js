import { Schema } from '@hyperjump/json-schema-core'
import MyButton from '~/stories/components/MyButton'
import SimpleContent from '~/stories/components/SimpleContent'
import String from '~/stories/components/String'
import ScrudComposite from '~/components/ScrudComposite'
import { configMap } from '~/utils/configMapping'

export default {
  title: 'ScrudComposite',
  component: ScrudComposite,
}

const Template = (args, { argTypes }) => ({
  components: { ScrudComposite },
  props: [...Object.keys(argTypes)],
  template: '<ScrudComposite v-bind="$props"></ScrudComposite>',
})

const configMappingOnlyDefault = configMap({
  __default__: {
    input: SimpleContent,
    render: SimpleContent,
  },
})

export const NoContextNoSchemaUseDefault = Template.bind({})
NoContextNoSchemaUseDefault.args = {
  propertyName: 'data',
  propertyValue: {
    greeting: 'Hi, SCRUD!',
    response: 'Hi, yourself!',
  },
  configMapping: configMappingOnlyDefault,
  uiType: 'get',
}

const configMapping = configMap(
  {
    string: {
      input: String,
      render: String,
    },
  },
  configMappingOnlyDefault
)

export const NoContextNoSchema = Template.bind({})
NoContextNoSchema.args = {
  propertyName: 'data',
  propertyValue: {
    greeting: 'Hi, SCRUD!',
    response: 'Hi, yourself!',
  },
  configMapping,
  uiType: 'get',
}

const scrudCompositeURL =
  'http://scrudful.org/json-schema/storybook/ScrudComposite'
const schemaGreetingURL = '#/definitions/Greeting'
const schemaResponseURL = '#/definitions/Response'
const schemaSomeNumberURL = '#/definitions/SomeNumber'

const configWithJsonSchemaMappings = configMap({}, configMapping)
configWithJsonSchemaMappings[scrudCompositeURL + schemaGreetingURL] = {
  render: MyButton,
  input: MyButton,
}

Schema.add(
  {
    $schema: 'https://json-schema.org/draft/2019-09/schema',
    $id: scrudCompositeURL,
    type: 'object',
    properties: {
      greeting: {
        $ref: schemaGreetingURL,
      },
      response: {
        $ref: schemaResponseURL,
      },
      someNumber: {
        $ref: schemaSomeNumberURL,
      },
    },
    definitions: {
      Greeting: {
        type: 'string',
      },
      Response: {
        type: 'string',
      },
      SomeNumber: {
        type: 'number',
      },
    },
  },
  scrudCompositeURL
)

export const NoContext = Template.bind({})
NoContext.args = {
  propertyName: 'data',
  propertyValue: {
    // renders based on JSON Schema Pointer for type
    greeting: 'I should be a button',
    // renders based on JSON typeof
    response: 'I should be italics',
    // renders __default__
    someNumber: 42,
  },
  configMapping: configWithJsonSchemaMappings,
  uiType: 'get',
  jsonSchemaURL: scrudCompositeURL,
}
