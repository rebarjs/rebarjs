import RebarComposite from '../components/RebarComposite.vue'
import RebarValue from '~/components/RebarValue'

export const baseConfigMap = {
  __value__: {
    input: RebarValue,
    render: RebarValue,
  },
  object: {
    input: RebarComposite,
    render: RebarComposite,
  },
}

export const configMap = (mapping, parentMapping) => {
  const result = { ...mapping }
  const baseMapping = parentMapping || baseConfigMap
  Object.setPrototypeOf(result, baseMapping)
  return result
}
