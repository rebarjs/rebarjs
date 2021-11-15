import { Schema } from '@hyperjump/json-schema-core'
import MyButton from '~/stories/components/MyButton'
import SimpleContent from '~/components/SimpleContent'
import String from '~/stories/components/String'
import RebarComposite from '~/components/RebarComposite'
import { configMap } from '~/utils/configMapping'

export default {
  title: 'RebarComposite',
  component: RebarComposite,
}

const Template = (args, { argTypes }) => ({
  components: { RebarComposite },
  props: [...Object.keys(argTypes)],
  template:
    '<RebarComposite v-model="$props.propertyValue" v-bind="$props"></RebarComposite>',
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
    greeting: 'Hi, REBAR!',
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
    greeting: 'Hi, REBAR!',
    response: 'Hi, yourself!',
  },
  configMapping,
  uiType: 'get',
}

const rebarCompositeURL =
  'http://rebarful.org/json-schema/storybook/RebarComposite'
const schemaGreetingURL = '#/definitions/Greeting'
const schemaResponseURL = '#/definitions/Response'
const schemaSomeNumberURL = '#/definitions/SomeNumber'

const configWithJsonSchemaMappings = configMap({}, configMapping)
configWithJsonSchemaMappings[rebarCompositeURL + schemaGreetingURL] = {
  render: MyButton,
  input: MyButton,
}

Schema.add(
  {
    $schema: 'https://json-schema.org/draft/2019-09/schema',
    $id: rebarCompositeURL,
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
  rebarCompositeURL
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
  jsonSchemaURL: rebarCompositeURL,
}
