const sveltePreprocess = require('svelte-preprocess');
module.exports = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: sveltePreprocess({
    replace: [
      ['process.env.NODE_ENV', JSON.stringify(process.env.NODE_ENV)],
      ['process.env.APP_VERSION', JSON.stringify(process.env.APP_VERSION)],
    ],
  }),
  kit: {
    // By default, `npm run build` will create a standard Node app.
    // You can create optimized builds for different platforms by
    // specifying a different adapter
    adapter: '@sveltejs/adapter-node',

    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',
  },
};
