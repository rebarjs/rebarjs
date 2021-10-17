import ScrudComposite from '../components/ScrudComposite.vue'
import ScrudValue from '~/components/ScrudValue'

export const baseConfigMap = {
  __value__: {
    input: ScrudValue,
    render: ScrudValue,
  },
  object: {
    input: ScrudComposite,
    render: ScrudComposite,
  },
}

export const configMap = (mapping, parentMapping) => {
  const result = { ...mapping }
  const baseMapping = parentMapping || baseConfigMap
  Object.setPrototypeOf(result, baseMapping)
  return result
}
