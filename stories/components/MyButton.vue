<template>
  <button class="button is-primary" @click="onClick">
    <!-- @slot default inner button content -->
    <slot></slot><span v-if="value">{{ value }}</span>
  </button>
</template>

<script>
export default {
  // eslint-disable-next-line vue/component-definition-name-casing
  name: 'my-button',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    value: {
      required: false,
    },
  },

  methods: {
    onClick() {
      /**
       * Click event
       *
       * @event click
       */
      this.$emit('click')
    },
  },
}
</script>

<style scoped>
button {
  border: 1px solid #eee;
  border-radius: 3px;
  background-color: #fff;
  cursor: pointer;
  font-size: 15pt;
  padding: 3px 10px;
  margin: 10px;
}
</style>
