// Consult https://www.snowpack.dev to learn about these options
const path = require('path');
const pkg = require(path.join(process.cwd(), 'package.json'));
const sveltePreprocess = require("svelte-preprocess");
const preprocess = sveltePreprocess({
  scss: {
    includePaths: ["src"],
  },
  postcss: {
    plugins: [require("autoprefixer")],
  },
});
console.log(...Object.keys(pkg.dependencies || {}));
module.exports = {
//  extends: "@sveltejs/snowpack-config",
  // optimize: {
  //   treeshake: true
  // },
  packageOptions: {
    // ignore `import fs from 'fs'` etc
    // externalPackage: require("module").builtinModules,
    // polyfillNode: true,
    knownEntrypoints: ["svelte"],
    external: [
      ...require("module").builtinModules.filter((m) => m !== "process"),
     ...Object.keys(pkg.dependencies || {})
    ],
    //    packageLookupFields: ["main", "svelte","module"],
  },
  preprocess,
  plugins: [
    [
      "@snowpack/plugin-svelte",
      {
        compilerOptions: {
          hydratable: true,
        },
      },
    ],
    ["@snowpack/plugin-sass", {}],
    [
      '@snowpack/plugin-build-script',
      {
        cmd: "postcss",
        input: [".css", ".pcss"],
        output: [".css"],
      }
    ],
  ],
  buildOptions: {
    sourcemaps: true,
  },
  devOptions: {
    open: 'none',
    output: 'stream'
  },
  mount: {
    '.svelte/assets': `/${process.env.SVELTE_KIT_APP_DIR}/assets`,
    "src/components": "/_components",
    "src/styles": "/_styles",
  },
  alias: {
    $app: './.svelte/assets/runtime/app',
    $components: "./src/components",
    $styles: "./src/styles",
  },
};
