import BRebarForm from './components/BRebarForm'
import FormValue from './components/FormValue'
import RebarValue from '~/components/RebarValue'
import SimpleContent from '~/components/SimpleContent'
import { configMap } from '~/utils/configMapping'

export const bootstrapConfigMap = configMap({
  __form__: BRebarForm,
  __value__: {
    render: RebarValue,
    input: FormValue,
  },
  string: {
    render: SimpleContent,
    input: ['b-form-input', { type: 'text' }],
  },
  number: {
    render: SimpleContent,
    input: ['b-form-input', { type: 'number', number: true }],
  },
  integer: {
    render: SimpleContent,
    input: ['b-form-input', { type: 'number', number: true }],
  },
  // TODO define a component for date-time using b-date and b-time
  //   'date-time': {
  //     render: SimpleContent,
  //     input: FormDateTimePicker,
  //   },
  time: {
    render: SimpleContent,
    input: 'b-form-timepicker',
  },
  date: {
    render: SimpleContent,
    input: 'b-form-datepicker',
  },
  email: {
    render: [
      'b-link',
      {
        __props__: {
          // set the href prop with the computed value
          href: (context) => 'mailto:' + context.value,
        },
        // pass context.value in a slot
        __slots__: ['value'],
      },
    ],
    input: ['b-form-input', { type: 'email', rules: 'email' }],
  },
  uri: {
    render: [
      'b-link',
      {
        __props__: {
          href: 'value',
        },
        __slots__: ['value'],
      },
    ],
    input: ['b-form-input', { type: 'url' }],
  },
})
