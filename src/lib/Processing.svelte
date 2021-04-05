<script>
      import { fade } from 'svelte/transition';

export let processing = false;
export let status = "Please Wait...";
export let subStatus = "TCB";

</script>

{#if processing}
  <div transition:fade={{ duration: 250 }} class="fixed z-10 inset-0 overflow-y-auto">
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-faithful-500 opacity-100" />
      </div>

      <span
        class="hidden sm:inline-block sm:align-middle sm:h-screen"
        aria-hidden="true">&#8203;</span
      >
        <div
          transition:fade={{ duration: 250 }}
          class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle m-auto max-w-sm sm:w-full sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div>
            <div
              class="mx-auto flex items-center justify-center h-12 w-12 rounded-full"
              class:bg-yellow-200={subStatus === 'TCB'}
              class:bg-gray-50={subStatus !== 'TCB'}
            >
              <svg
                class:hidden={subStatus !== 'TCB'}
                class="h-6 w-6 text-black"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-5">
              <h3
                class="text-lg leading-6 font-medium text-gray-900"
                id="modal-headline"
              >
                {status}
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">{subStatus}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
{/if}
