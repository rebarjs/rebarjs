import MyButton from '~/stories/components/MyButton.vue'
import SimpleContent from '~/components/SimpleContent.vue'
import SSRFormGen from '~/components/SSRFormGen.vue'

export default {
  title: 'SSRFormGen',
  component: SSRFormGen,
}

const Template = (args, { argTypes }) => ({
  components: { SSRFormGen },
  props: [...Object.keys(argTypes), 'content'],
  template: '<SSRFormGen v-bind="$props">{{ content }}</SSRFormGen>',
})

export const SimpleExample = Template.bind({})
SimpleExample.args = {
  uiSchema: {
    data: {
      as: SimpleContent,
      props: {
        value: 'Hello, SCRUD!',
      },
    },
  },
}

export const UseMyButton = Template.bind({})
UseMyButton.args = {
  uiSchema: {
    data: {
      as: MyButton,
      label: 'You should see a button with text here',
      props: {},
    },
  },
  content: 'Hello, SCRUD!',
}
