const sveltePreprocess = require('svelte-preprocess');
const node = require('@sveltejs/adapter-node');
const pkg = require('./package.json');
const firebase = require('firebase/package.json');

module.exports = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: sveltePreprocess({
    replace: [
      ['process.env.NODE_ENV', JSON.stringify(process.env.NODE_ENV)],
      [
        'process.env.COMMIT_SHA',
        JSON.stringify(process.env.COMMIT_SHA || 'unset'),
      ],
    ],
  }),
  // options passed to svelte.compile (https://svelte.dev/docs#svelte_compile)
  compilerOptions: null,

  // an array of file extensions that should be treated as Svelte components
  extensions: ['.svelte'],
  kit: {
    adapter: node(),
    amp: false,
    files: {
      assets: 'static',
      // hooks: 'src/hooks',
      lib: 'src/lib',
      routes: 'src/routes',
      // serviceWorker: 'src/service-worker',
      template: 'src/app.html',
    },
    // host: null,
    // hostHeader: null,
    hydrate: true,
    // paths: {
    // 	assets: '',
    // 	base: ''
    // },
    prerender: {
      crawl: true,
      enabled: true,
      force: false,
      pages: ['*'],
    },
    router: true,
    ssr: true,
    vite: () => ({
        alias: {
          'firebase/app': Promise.resolve('firebase/app/dist/index.cjs.js'),
          'firebase/auth': Promise.resolve('firebase/auth/dist/index.cjs.js'),
          'firebase/firestore': Promise.resolve('firebase/firestore/dist/index.cjs.js'),
        },  
      optimizeDeps: {
        include: [],
        exclude: [],
      },
      ssr: {
        noExternal: Object.keys(pkg.dependencies || {}),
      },
      define: {
				FIREBASE_SDK_VERSION: JSON.stringify(firebase.version),
			}
    }),
    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',
  },
};
