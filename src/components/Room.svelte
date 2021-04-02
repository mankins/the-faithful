<script>
  import get from 'lodash.get';
  import JSPretty from '$components/JSPretty.svelte';
  import AccessDenied from './AccessDenied.svelte';
  import ConfirmGuestModal from '$components/modals/ConfirmGuestModal.svelte';
  import Ago from './Ago.svelte';
  import GuestRow from '$components/GuestRow.svelte';

  export let ticket = {};
  export let stripeData = {};
  let guests;

  let openConfirmGuest = false;
  let confirmEmail = '';
  export let handleAddGuest = () => {};

  let handleConfirmGuest = async (em) => {
    const newGuest = await handleAddGuest(em);
    return newGuest;
  };

  let raw = JSON.parse(get(ticket, 'receipt.raw', '{}'));
  //   console.log({ raw });

  const getProductFromId = (productId) => {
    return 'Virtual Premiere Weekend - The Faithful'; // TODO
  };
</script>

<div class="bg-white shadow overflow-hidden sm:rounded-lg">
  {#if false}
    <pre>
    <JSPretty obj={stripeData} />
  </pre>
    <pre>
    <JSPretty obj={ticket} />
  </pre>
    <hr />
    <pre>
    <JSPretty obj={raw} />
  </pre>
  {/if}
  <div class="px-4 py-5 sm:px-6">
    <h3 class="text-lg leading-6 font-medium text-gray-900">Purchase</h3>
    <p class="mt-1 max-w-2xl text-sm text-gray-500">
      {#if get(stripeData, 'refunded', false)}
        (refunded)
      {:else}
        ({get(ticket, 'receipt.type')})
      {/if}
    </p>
  </div>
  <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
    <dl class="sm:divide-y sm:divide-gray-200">
      {#if get(stripeData, 'receiptUrl')}
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Receipt</dt>
          <a
            href={get(stripeData, 'receiptUrl')}
            rel="external"
            target="_blank"
            title="Receipt"
            class="font-medium text-faithful-600 hover:text-faithful-800"
          >
            <dd
              class="mt-1 text-sm bg-gray-100 text-gray-900 sm:mt-0 sm:col-span-2"
            >
              <ul
                class="border border-gray-200 rounded-md divide-y divide-gray-200"
              >
                <li
                  class="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
                >
                  <div class="w-0 flex-1 flex items-center">
                    <!-- Heroicon name: solid/paper-clip -->
                    <svg
                      class="flex-shrink-0 h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <div class="ml-4 flex-shrink-0">
                    <span class="ml-2 flex-1 w-0 truncate font-mono">
                      Printable Receipt
                    </span>
                  </div>
                </li>
              </ul>
            </dd>
          </a>
        </div>
      {/if}
      {#if get(stripeData, 'refunded', false)}
        <div
          class="py-4 sm:py-5 sm:grid bg-red-50 sm:grid-cols-3 sm:gap-4 sm:px-6"
        >
          <dt class="text-sm font-medium text-gray-500">REFUNDED</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {get(stripeData, 'refunded', '') === false ? false : true}
          </dd>
        </div>
      {/if}
      <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt class="text-sm font-medium text-gray-500">Product</dt>
        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
          <ul class="rounded-md">
            {#each get(ticket, 'receipt.products', []) as productId, i}
              <p class="text-sm font-medium text-gray-900 truncate mb-2">
                <picture>
                  <source
                    type="image/webp"
                    srcset="/img/diana-illustrated.webp"
                  />
                  <img
                    class="h-12 w-12 rounded-full"
                    src="/img/diana-illustrated.jpg"
                    alt=""
                  />
                </picture>
                {getProductFromId(productId)}
              </p>
            {/each}
          </ul>
        </dd>
      </div>

      {#if JSON.stringify(get(ticket, 'receipt.products', '')).includes('video:thefaithful:202103')}
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Description</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            <p>
              This pass allows you to join any live screening between March
              19-21, 2021.
            </p>
            <p>Screenings are twice daily, at 2pm and 7pm EDT.</p>
            <p class="mt-4">
              On the day of the screening, visit <a
                rel="external"
                target="_blank"
                title="The Faithful"
                href="https://www.the-faithful.com"
                class="text-faithful-800 underline">www.the-faithful.com</a
              >, using your email address to login.
            </p>
          </dd>
        </div>
      {/if}
      {#if parseInt(get(raw, 'metadata.quantity'), 10)}
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Quantity</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {get(raw, 'metadata.quantity')}
          </dd>
        </div>
        {#if Array(parseInt(get(raw, 'metadata.quantity', 0), 10)).length}
          {#each Array(parseInt(get(raw, 'metadata.quantity', 0), 10)) as _, guestId}
            {#if guestId}
              <GuestRow
                {guestId}
                guest={get(ticket, `guests[${guestId-1}]`)}
                handleAdd={(em) => {
                  if (em) {
                    confirmEmail = em;
                    openConfirmGuest = true;
                  }
                }}
              />
            {:else}
              <GuestRow
                {guestId}
                guest={get(ticket, 'email')}
                force={get(ticket, 'email')}
              />
            {/if}
          {/each}
        {/if}
      {/if}
      <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt class="text-sm font-medium text-gray-500">Billing email address</dt>
        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
          {get(ticket, 'email', '')}
        </dd>
      </div>
      <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt class="text-sm font-medium text-gray-500">Purchase Price</dt>
        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
          {get(ticket, 'receipt.paid', '-')}
        </dd>
      </div>
      <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt class="text-sm font-medium text-gray-500">Receipt Id</dt>
        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
          {get(ticket, 'receipt.id', '-')}
        </dd>
      </div>
      <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt class="text-sm font-medium text-gray-500">Processor</dt>
        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
          {get(ticket, 'receipt.src', '-')}
        </dd>
      </div>
      {#if get(ticket, 'receipt.gifter', '')}
      <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt class="text-sm font-medium text-gray-500">Gifted by</dt>
        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
          {get(ticket, 'receipt.gifter', '-')}
        </dd>
      </div>
      {/if}
      {#if get(raw, 'livemode') === false}
        <div
          class="py-4 sm:py-5 sm:grid bg-red-50 sm:grid-cols-3 sm:gap-4 sm:px-6"
        >
          <dt class="text-sm font-medium text-gray-500">TEST MODE</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {get(raw, 'livemode', '') === false ? true : false}
          </dd>
        </div>
      {/if}
    </dl>
  </div>
</div>
<ConfirmGuestModal
  bind:open={openConfirmGuest}
  email={confirmEmail}
  handleConfirm={() => {
    handleConfirmGuest(confirmEmail);
  }}
/>
