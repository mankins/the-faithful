<script>
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { backOut } from "svelte/easing";

  let toasts = [];

  export let duration = 7500;
  export let initial = { msg: "", type: "success", dismiss: () => {} };

  let toastId = 0;
  const pushToast = (msg = "", type = "success", dismiss = () => {}) => {
    toasts = [
      ...toasts,
      {
        _id: ++toastId,
        msg,
        type,
        dismiss,
      },
    ];

    if (duration) {
      setTimeout(() => {
        unshiftToast();
      }, duration);
    }
  };

  const unshiftToast = () => {
    toasts = toasts.filter((a, i) => i > 0);
  };

  onMount(() => {
    window.pushToast = pushToast;
    if (initial && initial.msg) {
      window.pushToast(initial.msg, initial.type, initial.dismiss);
    }
  });
</script>

<style>
  .toast-wrapper {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
    z-index: 9999;
  }
</style>

<div class="absolute top-10 left-0 right-0 text-center w-3/6 m-auto z-50">
  {#each toasts as toast (toast._id)}
    <div
      class="toast-item"
      in:fly={{ delay: 0, duration: 300, x: 0, y: -50, opacity: 0.1, easing: backOut }}
      out:fade={{ duration: 500, opacity: 0 }}>
      {#if toast.type === 'success'}
      <div class="rounded-md bg-green-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <!-- Heroicon name: check-circle -->
            <svg
              class="h-5 w-5 text-green-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-green-800">{toast.msg}</p>
          </div>
          <div class="ml-auto pl-3">
            <div class="-mx-1.5 -my-1.5">
              <button
                class="inline-flex bg-green-50 rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600">
                <span class="sr-only">Dismiss</span>
                <!-- Heroicon name: x -->
                <svg
                  class="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true">
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      {:else if toast.type === 'alert'}
      <div class="rounded-md bg-red-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
      <!-- Heroicon name: x-circle -->
      <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
                  </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-red-800">{toast.msg}</p>
          </div>
          <div class="ml-auto pl-3">
            <div class="-mx-1.5 -my-1.5">
              <button
                class="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600">
                <span class="sr-only">Dismiss</span>
                <!-- Heroicon name: x -->
                <svg
                  class="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true">
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

{:else}
<div class="rounded-md bg-blue-50 p-4">
    <div class="flex">
      <div class="flex-shrink-0">
<!-- Heroicon name: information-circle -->
<svg class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
    </svg>
          </div>
      <div class="ml-3">
        <p class="text-sm font-medium text-blue-800">{toast.msg}</p>
      </div>
      <div class="ml-auto pl-3">
        <div class="-mx-1.5 -my-1.5">
          <button
            class="inline-flex bg-blue-50 rounded-md p-1.5 text-blue-500 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-50 focus:ring-blue-600">
            <span class="sr-only">Dismiss</span>
            <!-- Heroicon name: x -->
            <svg
              class="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>

{/if}

    </div>
  {/each}
</div>
