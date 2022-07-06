export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - Consent Data',
    title: 'Pegadaian | Consent Data',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui',
      },
      {
        hid: 'Pegadaian | Data Consents',
        name: 'pegadaian-data-consent',
        content: 'Pegadaian | Data Consents',
      },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons|Material+Icons+Outlined',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: true,
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,400;0,700;1,400&display=swap',
      },
    ],
  },

  server: {
    port: process.env.PORT,
    host: process.env.HOST,
  },
  env: {
    apiUrl: process.env.API_URL || 'http://10.184.15.212:10000',
  },

  css: [],

  plugins: [
    { src: '~/plugins/veeValidate', ssr: false },
    { src: '~/plugins/vueEditor', ssr: false },
    { src: '~/plugins/vueChart', ssr: false },
  ],

  components: true,

  buildModules: ['@nuxt/typescript-build', '@nuxtjs/vuetify', '@nuxtjs/moment'],
  moment: {
    locales: ['id'],
  },

  modules: ['@nuxtjs/auth-next', '@nuxtjs/axios'],
  axios: {
    baseURL: process.env.apiUrl,
  },

  auth: {
    strategies: {
      local: {
        token: {
          property: 'data.token',
          global: true,
          // required: true,
          // type: 'Bearer'
        },
        user: {
          property: 'data',
          // autoFetch: true
        },
        endpoints: {
          login: { url: '/auth/login', method: 'post' },
          logout: false,
          user: { url: '/auth/me', method: 'get' },
        },
      },
    },
  },

  router: {
    middleware: ['auth'],
  },

  build: {},

  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    defaultAssets: false,
    theme: {
      disable: false,
      light: true,
      themes: {
        light: {
          primary: '#27ae60',
          secondary: '#bdc3c7',
          warning: '#e67e22',
          success: '#27ae60',
          danger: '#d63031',
        },
      },
    },
  },
}
