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
  propertyValue: {
    greeting: 'Hi, SCRUD!',
    response: 'Hi, yourself!',
  },
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
  propertyValue: {
    greeting: 'Hi, SCRUD!',
    response: 'Hi, yourself!',
  },
  configMapping,
  uiType: 'get',
}
