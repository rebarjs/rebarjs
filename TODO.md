# TODO

## Core

* Add support for `__form__` mapping to define the form component for input
* Make `SimpleContent` a core component and use it as the `__default__`
* Make a `SimpleForm` core component and use it as the `__form__` default
  * though, could I just use `form`??
* Add support for `string` and `object` component mapping
  * `string` would be the markup alias, this may work out of the box
  * `object` would have an `as` property for the component to map to and `props` to pass
    along to the component.


## Storybooks

* Stories demonstrating mapping from JSON-LD context
* Stories demonstrating forms and validation
    * Stories using Beufy, VeeValidate, and json-schema-core validation functions
* Stories demonstrating using REST endpoints
    * No schema, no context
    * Schema, no context
    * Context, no schema
    * Schema and Context
    * SCRUDful!!
* Stories demonstrating Components that use ScrudComposite
* Storybooks for OpenAPI/Swagger apps
* List/Detail style app!

## Components

* ScrudComponent
* OpenAPIComponent
* ScrudBrowser component
* OpenAPIBrowser component