<script>
  import FirebaseProvider from '$lib/FirebaseProvider.svelte';
  import { page as pageStore } from '$lib/stores';
  import { handleLoginAction } from '$lib/utils/auth';
  import Toast from '$lib/Toast.svelte';
  import TermsLinks from '$lib/TermsLinks.svelte';

  let authActions;
  let page = {};
  pageStore.subscribe((value) => {
    page = value;
  });
  let email = '';
  let password = '';
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
          <a href="/" target="_parent">
            <img class="h-12 w-auto" src="/svg/logo.svg" alt="Faithful Logo" />
          </a>
          <Toast />
          <h2 class="mt-6 text-3xl bg-transparent font-extrabold text-gray-900">
            Sign up for an account
          </h2>
          <p class="mt-2 text-sm text-gray-600 max-w">
            Or
            <a
              href="/login"
              class="font-medium text-faithful-600 hover:text-faithful-500"
            >
              login to an existing account
            </a>
          </p>
        </div>

        <div class="mt-8">
          <div>
            <div>
              <p class="text-sm font-medium text-gray-700">Sign in with</p>

              <div class="mt-1 grid grid-cols-4 gap-4">
                <div>
                  <button
                    on:click={() => authActions.clickFacebookSignin()}
                    class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span class="sr-only">Sign in with Coil</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                      class="h-5 w-5"
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
                          /></g
                        ></g
                      ></svg
                    >
                  </button>
                </div>

                <div>
                  <button
                    on:click={() => authActions.clickFacebookSignin()}
                    class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span class="sr-only">Sign in with Facebook</span>
                    <svg
                      class="w-5 h-5"
                      fill="#3b5998"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                <div>
                  <button
                    on:click={() => authActions.clickTwitterSignin()}
                    class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span class="sr-only">Sign in with Twitter</span>
                    <svg
                      class="w-5 h-5"
                      fill="#1DA1F2"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"
                      />
                    </svg>
                  </button>
                </div>

                <div>
                  <button
                    on:click={() => authActions.clickGoogleSignin()}
                    class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span class="sr-only">Sign in with Google</span>
                    <svg
                      class="w-5 h-5"
                      fill="currentColor"
                      aria-hidden="true"
                      viewBox="0 0 533.5 544.3"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
                        fill="#4285f4"
                      />
                      <path
                        d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
                        fill="#34a853"
                      />
                      <path
                        d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
                        fill="#fbbc04"
                      />
                      <path
                        d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
                        fill="#ea4335"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div class="mt-6 relative">
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
                  bind:value={email}
                  name="email"
                  type="email"
                  autocomplete="email"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-faithful-500 focus:border-faithful-500 sm:text-sm"
                />
              </div>
            </div>

            <div class="space-y-1">
              <label
                for="password"
                class="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div class="mt-1">
                <input
                  id="password"
                  bind:value={password}
                  name="password"
                  type="password"
                  autocomplete="current-password"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-faithful-500 focus:border-faithful-500 sm:text-sm"
                />
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center invisible">
                <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  class="h-4 w-4 text-faithful-600 focus:ring-faithful-500 border-gray-300 rounded"
                />
                <label
                  for="remember_me"
                  class="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>
              <div class="text-sm">
                <a
                  href="#"
                  on:click={() => {
                    authActions.forgotPassword(email);
                    return false;
                  }}
                  class="font-medium text-faithful-600 hover:text-faithful-500"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                on:click={() => {
                  authActions.clickUserPassSignup(email, password);
                  return false;
                }}
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-faithful-500"
              >
                Sign up
              </button>
            </div>
            <TermsLinks />
          </div>
        </div>
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
