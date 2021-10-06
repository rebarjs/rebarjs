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

Schema.add(
  {
    $schema: 'https://json-schema.org/draft/2019-09/schema',
    $id: 'http://scrudful.org/json-schema/storybook/ScrudValue',
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
  'http://scrudful.org/json-schema/storybooks/ScrudValue'
)
// export const NoContext = Template.bind({})(async () => {
//   // const dataSchema = await Schema.get("http://scrudful.org/json-schema/storybook/ScrudValue#/definitions/data")
//   console.log(2)
//   // console.log(dataSchema)
//   NoContext.args = {
//     propertyName: 'data',
//     propertyValue: 'Hi, SCRUD',
//     configMapping: configMapping,
//     uiType: 'get',
//     // jsonSchemaURL: Schema.uri(dataSchema),
//     // jsonSchema: dataSchema,
//   }
// })()
