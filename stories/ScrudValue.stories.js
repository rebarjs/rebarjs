import { Schema } from '@hyperjump/json-schema-core'
import SimpleContent from '~/stories/components/SimpleContent'
import String from '~/stories/components/String'
import MyButton from '~/stories/components/MyButton'
import ScrudValue from '~/components/ScrudValue'
import { configMap } from '~/utils/configMapping'

export default {
  title: 'ScrudValue',
  component: ScrudValue,
}

const Template = (args, { argTypes }) => ({
  components: { ScrudValue },
  props: [...Object.keys(argTypes), 'content'],
  template: '<ScrudValue v-bind="$props">{{ content }}</ScrudValue>',
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
  propertyValue: 'Hi, SCRUD!',
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
  propertyValue: 'Hi, SCRUD!',
  configMapping,
  uiType: 'get',
}

const scrudValueURL = 'http://scrudful.org/json-schema/storybook/ScrudValue'
const scrudValueURLRoot = scrudValueURL + '#'
const configWithJsonSchemaMappings = configMap({}, configMapping)
// configWithJsonSchemaMappings[scrudValueURL + '#'] = {
configWithJsonSchemaMappings[scrudValueURLRoot] = {
  input: MyButton,
  render: MyButton,
}

Schema.add(
  {
    $schema: 'https://json-schema.org/draft/2019-09/schema',
    $id: scrudValueURL,
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
  scrudValueURL
)
export const NoContext = Template.bind({})
NoContext.args = {
  propertyName: 'data',
  propertyValue: 'Hi, SCRUD',
  configMapping: configWithJsonSchemaMappings,
  uiType: 'get',
  jsonSchemaURL: scrudValueURL,
}
