// // const sveltePreprocess = require('svelte-preprocess');
// // const node = require('@sveltejs/adapter-node');
// // const pkg = require('./package.json');
// // const firebase = require('firebase/package.json');
// // const deps = Object.keys(pkg.dependencies || {}).sort();

// import sveltePreprocess from 'svelte-preprocess';
// // import node from '@sveltejs/adapter-node';
// import adapter from '@sveltejs/adapter-auto';

// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);

// const pkg = require('./package.json');
// const deps = Object.keys(pkg.dependencies || {}).sort();
// const firebase = require('firebase/package.json');

// const config = {
//   // Consult https://github.com/sveltejs/svelte-preprocess
//   // for more information about preprocessors
//   preprocess: sveltePreprocess({
//     replace: [
//       ['process.env.NODE_ENV', JSON.stringify(process.env.NODE_ENV)],
//       [
//         'process.env.COMMIT_SHA',
//         JSON.stringify(process.env.COMMIT_SHA || 'unset'),
//       ],
//     ],
//   }),
//   // options passed to svelte.compile (https://svelte.dev/docs#svelte_compile)
//   compilerOptions: null,

//   // an array of file extensions that should be treated as Svelte components
//   extensions: ['.svelte'],
//   kit: {
//     adapter: adapter(),
//     amp: false,
//     files: {
//       assets: 'static',
//       // hooks: 'src/hooks',
//       lib: 'src/lib',
//       routes: 'src/routes',
//       // serviceWorker: 'src/service-worker',
//       template: 'src/app.html',
//     },
//     // host: null,
//     // hostHeader: null,
//     // hydrate: true,
//     // paths: {
//     // 	assets: '',
//     // 	base: ''
//     // },
//     // prerender: {
//     //   crawl: true,
//     //   enabled: true,
//     //   force: false,
//     //   pages: ['*'],
//     // },
//     // router: true,
//     // ssr: true,
//     vite: () => ({
//       // optimizeDeps: {
//       //   include: [], // 'duration','es5-ext'
//       //   exclude: [],
//       // },
//       // ssr: {
//       //   noExternal: [...deps],
//       // },
//       define: {
// 				FIREBASE_SDK_VERSION: JSON.stringify(firebase.version),
// 			}
//     }),
//     // hydrate the <div id="svelte"> element in src/app.html
//     target: '#svelte',
//   },
// };
// export default config;

//import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-vercel';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess({
    replace: [
      [
        'import.meta.env.VERCEL_ANALYTICS_ID',
        JSON.stringify(process.env.VERCEL_ANALYTICS_ID),
      ],
    ],
    postcss: true,
  }),
  kit: {
    adapter: adapter(),
    alias: {
      $lib: 'src/lib',
    },
    // Override http methods in the Todo forms
    // methodOverride: {
    // //   allowed: ['PATCH', 'DELETE']
    // },
    // files: {
    //   assets: `static`,
    //   appTemplate: 'src/app.html'
    // }
  },
};

export default config;
