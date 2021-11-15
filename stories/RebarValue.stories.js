import { Schema } from '@hyperjump/json-schema-core'
import SimpleContent from '~/components/SimpleContent'
import String from '~/stories/components/String'
import MyButton from '~/stories/components/MyButton'
import RebarValue from '~/components/RebarValue'
import { configMap } from '~/utils/configMapping'

export default {
  title: 'RebarValue',
  component: RebarValue,
}

const Template = (args, { argTypes }) => ({
  components: { RebarValue },
  props: [...Object.keys(argTypes), 'content'],
  template:
    '<RebarValue v-model="$props.propertyValue" v-bind="$props">{{ content }}</RebarValue>',
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
  propertyValue: 'Hi, REBAR!',
  configMapping: configMappingOnlyDefault,
  uiType: 'get',
}

const configMapping = configMap(
  {
    string: {
      // prove that the array mapping works, use empty default props
      input: [String, {}],
      render: [String, {}],
    },
  },
  configMappingOnlyDefault
)

export const NoContextNoSchema = Template.bind({})
NoContextNoSchema.args = {
  propertyName: 'data',
  propertyValue: 'Hi, REBAR!',
  configMapping,
  uiType: 'get',
}

const rebarValueURL = 'http://rebarful.org/json-schema/storybook/RebarValue'
const rebarValueURLRoot = rebarValueURL + '#'
const configWithJsonSchemaMappings = configMap({}, configMapping)
// configWithJsonSchemaMappings[rebarValueURL + '#'] = {
configWithJsonSchemaMappings[rebarValueURLRoot] = {
  input: MyButton,
  render: MyButton,
}

Schema.add(
  {
    $schema: 'https://json-schema.org/draft/2019-09/schema',
    $id: rebarValueURL,
    type: 'object',
    properties: {
      renderAsButton: {
        $ref: '#/definitions/RenderAsButton',
      },
      renderAsEmString: {
        $ref: '#/definitions/RenderAsEmString',
      },
      renderAsPlainString: {
        $ref: '#definitinos/RenderAsPlainString',
      },
    },
    definitions: {
      RenderAsButton: {
        type: 'string',
      },
      RenderAsEmString: {
        type: 'string',
      },
      RenderAsPlainString: {
        type: 'string',
      },
    },
  },
  rebarValueURL
)
export const NoContext = Template.bind({})
NoContext.args = {
  propertyName: 'data',
  propertyValue: 'Hi, REBAR',
  configMapping: configWithJsonSchemaMappings,
  uiType: 'get',
  jsonSchemaURL: rebarValueURL,
}
