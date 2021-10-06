<template>
  <em>{{ value }}</em>
</template>

<script>
export default {
  // eslint-disable-next-line vue/component-definition-name-casing
  name: 'simple-string',
  props: {
    // eslint-disable-next-line vue/require-prop-types
    value: {
      required: true,
    },
  },
}
</script>
