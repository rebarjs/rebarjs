<template>
  <validation-provider v-slot="validationContext" :rules="rules" :name="label">
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
        :ui-type="uiType"
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
import {
  extend,
  ValidationProvider,
} from 'vee-validate/dist/vee-validate.full.esm'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import scrud from '~/mixins/scrud'

export default {
  name: 'FormValue',
  components: {
    'validation-provider': ValidationProvider,
  },
  mixins: [scrud],
  computed: {
    describedBy() {
      return this.componentProps.id + '-feedback'
    },
    rules() {
      const rules = {
        required: this.required,
      }
      const type = this.componentProps.type
      const id = this.componentProps.id
      if (type && type in allRules) {
        rules[type] = true
      }
      if (this.jsonSchemaValidator) {
        extend(id, this.jsonSchemaValidator)
        rules[id] = true
      }
      return rules
    },
    jsonSchemaValidator() {
      if (this.jsonSchema) {
        const jsonSchema = Schema.value(this.jsonSchema)
        const ajv = new Ajv()
        addFormats(ajv)
        return ajv.compile(jsonSchema)
      }
      return null
    },
  },
}
</script>
