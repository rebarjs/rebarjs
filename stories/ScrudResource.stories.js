import SimpleContent from '~/stories/components/SimpleContent.vue'
import String from '~/stories/components/String.vue'
import ScrudResource from '~/components/ScrudResource.vue'
import { configMap } from '~/utils/configMapping'

export default {
  title: 'ScrudResource',
  component: ScrudResource,
}

const Template = (args, { argTypes }) => ({
  components: { ScrudResource },
  props: [...Object.keys(argTypes)],
  template: '<ScrudResource v-bind="$props"></ScrudResource>',
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
  propertyValue: {
    greeting: 'Hi, SCRUD!',
    response: 'Hi, yourself!',
  },
  configMapping: configMappingOnlyDefault,
  uiType: 'get',
}

const configMappingWithString = configMap(
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
  propertyValue: {
    greeting: 'Hi, SCRUD!',
    response: 'Hi, yourself!',
  },
  configMapping: configMappingWithString,
  uiType: 'get',
}
