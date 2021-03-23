<script>
  // import Arrow from '../nav/Arrow.svelte';
  import { formatCurrency } from '$components/utils/i18n';
  import { fade, fly } from 'svelte/transition';

  export let item = {};
  export let index = 0;
  // {product: 'cinema-premiere', 'productTitle': 'Cinema Premiere', 'price': {currency:'usd', amount: 1250}})}

  export let handleAdd = () => {};
  export let handleRemove = () => {};
  export let handleItemChange = () => {};

  const handleAddWrapper = () => {
    handleAdd(item, index);
  };
  const handleRemoveWrapper = () => {
    handleRemove(item, index);
  };
  const handleItemTimeSelected = (selected, y) => {
    if (selected && selected.target && selected.target.value) {
      item.productId = selected.target.value;
      handleItemChange(item, index);
    }
  };
</script>

{#if item && item.productTitle}
  <div transition:fly={{ opacity: 0, duration: 500 }}>
    <div class="bg-white px-4 py-5 mt-4 border-t border-gray-200 sm:px-6">
      <div
        class="-ml-4 -mt-4 flex justify-between items-center flex-wrap sm:flex-nowrap"
      >
        <div class="ml-4 mt-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <picture>
                <source type="image/webp" srcset="/img/pope-illustrated.webp" />
                <img
                  class="h-16 w-16 sm:h-24 sm:w-24 rounded-full border bg-gray-100 shadow-xl"
                  src="/img/pope-illustrated.jpg"
                  alt="Ticket"
                />
              </picture>
            </div>
            <div class="ml-4">
              <h3
                class="tracking-tighter font-serif leading-6 font-medium text-gray-900"
              >
                {item.productTitle}
              </h3>
              {#if true}
                <p class="text-sm text-gray-500">
                  {#if item && item.price && item.price.amount}
                    {formatCurrency(item.price.amount, item.price.currency)} each
                  {/if}
                </p>
              {/if}
            </div>
          </div>
        </div>
        <div
          class="ml-4 mt-4 pr-4 flex-shrink-0 flex justify-end flex-row sm:flex-col"
        >
          <button
            on:click={() => {
              handleAddWrapper();
            }}
            title="Add Additional"
            type="button"
            class="ml-3 relative inline-flex items-center px-1 py-2 border border-transparent text-sm font-medium rounded-full hover:bg-gray-900 text-gray-100  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-faithful-500"
          >
            <svg
              class="ml-1 mr-1 h-5 w-5 text-gray-400 hover:text-gray-100"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
          <button
            on:click={() => {
              handleRemoveWrapper();
            }}
            type="button"
            title="Remove From Cart"
            class="ml-3 relative inline-flex items-center px-1 py-2 border border-transparent text-sm font-medium rounded-full hover:bg-gray-900 text-gray-100  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-faithful-500"
          >
            <svg
              class="ml-1 mr-1 h-5 w-5 text-gray-400 hover:text-gray-100"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20 12H4"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
    {#if item.variations}
      <select
        class="w-full border-0 bg-gray-50 font-light text-sm m-auto"
        bind:value={item.productId}
        on:blur={(v) => handleItemTimeSelected(v)}
      >
        {#each item.variations as variation}
          <option value={variation.id}>{variation.description}</option>
        {/each}
      </select>
    {/if}
    <div
      class="w-full border-0 bg-faithful-200 font-light text-sm m-auto flex align-center justify-end items-center"
    >
      <span class="mr-2">Quantity</span>
      <span class="mr-4">{parseInt(item.quantity || 0, 10)}</span>
    </div>
  </div>
{/if}
