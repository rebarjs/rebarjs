import ScrudComposite from '../components/ScrudComposite.vue'

export const baseConfigMap = {
  object: {
    input: ScrudComposite,
    render: ScrudComposite,
  },
}

export const configMap = (mapping, parentMapping) => {
  const result = { ...mapping }
  result.prototype = parentMapping || baseConfigMap
  return result
}
