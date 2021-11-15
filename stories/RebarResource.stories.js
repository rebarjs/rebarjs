import SimpleContent from '~/components/SimpleContent.vue'
import String from '~/stories/components/String.vue'
import RebarResource from '~/components/RebarResource.vue'
import { configMap } from '~/utils/configMapping'

export default {
  title: 'RebarResource',
  component: RebarResource,
}

const Template = (args, { argTypes }) => ({
  components: { RebarResource },
  props: [...Object.keys(argTypes)],
  template: '<RebarResource v-bind="$props"></RebarResource>',
})

const configMappingOnlyDefault = configMap({
  __default__: {
    input: SimpleContent,
    render: SimpleContent,
  },
})

export const NoContextNoSchemaUseDefault = Template.bind({})
NoContextNoSchemaUseDefault.args = {
  propertyValue: {
    greeting: 'Hi, REBAR!',
    response: 'Hi, yourself!',
  },
  configMapping: configMappingOnlyDefault,
  uiType: 'get',
}

const configMappingWithString = configMap(
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
  propertyValue: {
    greeting: 'Hi, REBAR!',
    response: 'Hi, yourself!',
  },
  configMapping: configMappingWithString,
  uiType: 'get',
}
