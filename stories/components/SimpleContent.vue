<template>
  <span>{{ value }}</span>
</template>

<script>
export default {
  // eslint-disable-next-line vue/component-definition-name-casing
  name: 'simple-content',
  props: {
    // eslint-disable-next-line vue/require-prop-types
    value: {
      required: true,
    },
  },
}
</script>
