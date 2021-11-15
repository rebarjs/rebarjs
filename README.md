# rebar-nuxt

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate

# run storybook
$ yarn nuxt storybook
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## Conda Environment Notes

A specific version of `openssl=1.1.1l` is specified to avoid an [issue with openssl 3.0](https://stackoverflow.com/questions/69692842/error0308010cdigital-envelope-routinesunsupported)