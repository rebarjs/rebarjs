<template>
  <validation-provider v-slot="validationContext" :rules="rules">
    <b-form-group :label="label" :label-for="componentProps.id">
      <component
        :is="as"
        v-model="localValue"
        v-bind="componentProps"
        :required="required"
        :state="
          validationContext.errors[0]
            ? false
            : validationContext.valid
            ? true
            : null
        "
        :aria-describedby="describedBy"
      >
        <slot v-for="item in componentSlots">{{ item }}</slot>
      </component>
      <b-form-invalid-feedback :id="describedBy">
        {{ validationContext.errors[0] }}
      </b-form-invalid-feedback>
    </b-form-group>
  </validation-provider>
</template>

<script>
import * as allRules from 'vee-validate/dist/rules'
import { Schema } from '@hyperjump/json-schema-core'
import { ValidationProvider } from 'vee-validate/dist/vee-validate.full.esm'
import scrud from '~/mixins/scrud'

export default {
  name: 'FormValue',
  components: {
    'validation-provider': ValidationProvider,
  },
  mixins: [scrud],
  data() {
    return {
      required: undefined,
    }
  },
  async fetch() {
    await scrud.fetch.call(this)
    if (this.required === undefined && this.jsonSchema) {
      const hasRequired = await Schema.has('required', this.jsonSchema)
      const requiredSchema = hasRequired
        ? await Schema.step('required', this.jsonSchema)
        : undefined
      this.required = requiredSchema ? Schema.value(requiredSchema) : false
    } else {
      this.required = false
    }
  },
  computed: {
    describedBy() {
      return this.id + '-feedback'
    },
    rules() {
      const rules = {
        required: this.required,
      }
      if (this.componentProps.type && this.componentProps.type in allRules) {
        rules[this.componentProps.type] = true
      }
      return rules
    }
  },
}
</script>
