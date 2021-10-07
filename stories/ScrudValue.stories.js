import { Schema } from '@hyperjump/json-schema-core'
import SimpleContent from '~/stories/components/SimpleContent.vue'
import String from '~/stories/components/String.vue'
import ScrudValue from '~/components/ScrudValue.vue'
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
  components: {
    __default__: {
      input: SimpleContent,
      render: SimpleContent,
    },
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
    components: {
      string: {
        input: String,
        render: String,
      },
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
Schema.add(
  {
    $schema: 'https://json-schema.org/draft/2019-09/schema',
    $id: scrudValueURL,
    type: 'object',
    properties: {
      data: {
        $ref: '#/definitions/Data',
      },
    },
    definitions: {
      Data: {
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
  configMapping,
  uiType: 'get',
  jsonSchemaURL: scrudValueURL,
}
