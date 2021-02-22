<script>
    export let message = "Access Denied";
    export let ctaClick = () => (window.location.href = '/login');
    export let messageOnly = true;
    export let ctaMessage = "Login?";
</script>

<div class="fixed z-10 inset-0 overflow-y-auto">
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75" />
      </div>

      <span
        class="hidden sm:inline-block sm:align-middle sm:h-screen"
        aria-hidden="true">&#8203;</span>
      <div
        class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline">
        <div>
            <img class="pb-4 m-auto h-12 w-auto" src="/svg/logo.svg" alt="Faithful Logo" />
            {#if messageOnly}
          <div class="mt-3 text-center sm:mt-5">

                <h3
                class="text-lg leading-6 font-medium text-gray-900"
                id="modal-headline">
                {message}
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  <a href="/login">Login again</a>
                  </p>
              </div>
            </div>
          {:else}
            <div
              class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <!-- Heroicon name: check -->
              <svg
                class="h-6 w-6 text-green-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div class="mt-3 text-center sm:mt-5">
              <h3
                class="text-lg leading-6 font-medium text-gray-900"
                id="modal-headline">
                {message}
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500" />
              </div>
            </div>
            <div class="mt-5 sm:mt-6">
              <button
                on:click={ctaClick}
                type="button"
                class="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-faithful-600 text-base font-medium text-white hover:bg-faithful-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-faithful-500 sm:text-sm">
                {ctaMessage}
              </button>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
