<script>
    import FirebaseProvider from '$components/FirebaseProvider.svelte';
    import { page as pageStore } from '$components/stores';
    import { handleLoginAction } from '$components/utils/auth';
    import Toast from '$components/Toast.svelte';
    import Processing from '$components/Processing.svelte';

    let authActions;
    let page = {};
    pageStore.subscribe((value) => {
      page = value;
    });
    export let email = '';
    let password = '';
    let processing = false;
    export let nextUrl = '/my';
    let trouble = false;
  </script>
  
  <FirebaseProvider
    bind:actions={authActions}
    on:auth-success-action={handleLoginAction}
    on:auth-failure={(e) => console.error(e)}
  >
    <div class="min-h-screen bg-white flex">
      <div
        class="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24"
      >
        <div class="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <a href="/" target="_parent" rel="external">
              <img class="h-12 w-auto" src="/svg/logo.svg" alt="Faithful Logo" />
            </a>
            <Toast duration={60000} />
            <h2 class="mt-6 text-3xl bg-transparent font-extrabold text-gray-900">
              Sign in for access
            </h2>
          </div>
  
          <div class="mt-24">
            <div>
    
            <div class="mt-6 space-y-6">
              <div>
                <label
                  for="email"
                  class="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div class="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autocomplete="email"
                    bind:value={email}
                    required
                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-faithful-500 focus:border-faithful-500 sm:text-sm"
                  />
                </div>
              </div>
  
              <div>
                <button
                  type="submit"
                  on:click={() => {
                    authActions.clickMagicLinkSignin(email,nextUrl);
                    return false;
                  }}
                  class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-faithful-500"
                >
                  Send email with magic link
                </button>
              </div>
              <div>
                <button
                  on:click={() => authActions.clickAccessSignin(email,nextUrl, (p)=> { processing = p; })}
                  class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-faithful-500 text-sm font-medium text-black hover:bg-faithful-500 hover:opacity-75 focus:outline-none"
                >
                  I have an access code
                </button>
              </div>

            </div>
            <div class="mt-12 mb-6 relative">
                <div
                  class="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div class="w-full border-t border-gray-300" />
                </div>
                <div class="relative flex justify-center text-sm">
                  <span class="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>
            </div>

            <div>
                <button
                  on:click={() => authActions.clickCoilSignin(nextUrl)}
                  class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none"
                >
                  <span class="sr-only">Sign in with Coil</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="h-5 w-5 mr-2"
                    ><defs
                      ><style>
                        .cls-1 {
                          fill: #fff;
                        }
                      </style></defs
                    ><title>coil-icon-black-white</title><g
                      id="Layer_2"
                      data-name="Layer 2"
                      ><g
                        id="Coil_icon_black_and_white"
                        data-name="Coil icon black and white"
                        ><circle cx="24" cy="24" r="24" /><path
                          class="cls-1"
                          d="M31.27,29.43c.65,0,1.49.33,2.07,1.72a1.46,1.46,0,0,1,.14.6c0,2.29-5.34,4.36-8.44,4.52l-.7,0A12.76,12.76,0,0,1,13.24,30a11.8,11.8,0,0,1-1.54-5.88,12.17,12.17,0,0,1,2.07-6.78,12.39,12.39,0,0,1,6.77-5,14.59,14.59,0,0,1,4.39-.71,9.12,9.12,0,0,1,5.51,1.66c2.43,1.77,2.93,3.71,2.93,5a3.69,3.69,0,0,1-.17,1.2,5.54,5.54,0,0,1-4.61,3.81,11.35,11.35,0,0,1-1.31.11c-2,0-2.66-.82-2.66-1.74,0-1.25,1.2-2.73,2.07-2.73a.56.56,0,0,1,.31.09,1.52,1.52,0,0,0,.75.19.53.53,0,0,0,.22,0A1.1,1.1,0,0,0,29,18.1C29,17,27.75,15.6,25,15.6a10.57,10.57,0,0,0-3.1.49,8.24,8.24,0,0,0-4.53,3.51A8,8,0,0,0,16,24.1,7.89,7.89,0,0,0,17,28a8.47,8.47,0,0,0,7.38,4.12h.48c4-.22,4.92-2.18,5.81-2.56A3.06,3.06,0,0,1,31.27,29.43Z"
                        />
                        </g
                      ></g
                    >
                    </svg
                  > Sign in with Coil
                </button>
              </div>
          </div>

          <div on:click={() => { trouble = !trouble} } class="flex-1 flex flex-col justify-center py-6 ">
            <button class="text-sm text-faithful-800 focus:outline-none border border-transparent cursor-pointer underline">Having trouble?</button>

          </div>
          {#if trouble}
          <ul class="text-black font-mono">
            <li>Try entering your email address above</li>
            <li class="pt-4 pb-4">Then press <b class="bg-faithful-500 p-2 text-black">access code</b></li>
            <li>Enter access code: <span class="text-mono font-bold">977705</span></li>
          </ul>
          <p class="mt-6">Still doesn't work? <a class="underline text-faithful-800" href="mailto:max@the-faithful.com">Email max@the-faithful.com</a></p>
          {/if}


        </div>

      </div>
      <div class="hidden lg:block relative w-0 flex-1">
        <picture>
          <source
            type="image/webp"
            srcset="/img/Pope-Snowglobes2.webp"
          />
        <img
          class="absolute inset-0 h-full w-full object-cover"
          src="/img/Pope-Snowglobes2.jpg"
          alt="Pope John Paul and some Snow globes"
        />
        </picture>
      </div>
    </div>
  </FirebaseProvider>
  <Processing processing={processing} />
