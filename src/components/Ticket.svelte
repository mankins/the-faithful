<script>
  import get from 'lodash.get';
  import JSPretty from '$components/JSPretty.svelte';
import AccessDenied from './AccessDenied.svelte';

  export let ticket = {};
  export let stripeData = {};
  let guests = [];

  // import QRCode from 'qrcode-svg-table';
  // const genQr = async () => {
  //     const qrTicket = {};
  //     qrTicket.product = get(ticket,'receipt.products', []);
  //     qrTicket.email = get(ticket, 'email');
  //     qrTicket.ts = get(ticket,'receipt.ts', '');
  //     qrTicket._build = Date.now();
  //    const qr = JSON.stringify(qrTicket);
  //  const out = new QRCode({content: qr, join: true}).svg();
  //  console.log({out});

  //  return out;
  // }

  let raw = JSON.parse(get(ticket, 'receipt.raw', ''));
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

        <dd class="mt-1 text-sm bg-gray-100 text-gray-900 sm:mt-0 sm:col-span-2">
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
                <span class="ml-2 flex-1 w-0 truncate font-mono"> Printable Receipt </span>
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
            <p class="mt-4">On the day of the screening, visit <a rel="external" target="_blank" title="The Faithful" href="https://www.the-faithful.com" class="text-faithful-800 underline">www.the-faithful.com</a>, using your email address to login.</p>
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
        {#if parseInt(get(raw, 'metadata.quantity'), 10) > 1}
        {#each Array(parseInt(get(raw, 'metadata.quantity'), 10)) as _, guestId}
        {#if guestId}
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 items-center justify-center">
          <dt class="text-sm font-medium text-gray-500">Guest</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {#if get(ticket, `guest[${guestId}]`)}
            {get(ticket, `guest[${guestId}]`)}
            {:else}
            <div class="mt-1 flex rounded-md shadow-sm">
              <div class="relative flex items-stretch flex-grow focus-within:z-10">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <!-- Heroicon name: solid/mail -->
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <input
              bind:value={guests[guestId]}
              type="email"
              id={`em-${guestId}`}
              class="block pl-10 w-full border border-transparent bg-gray-100 rounded-md px-5 py-3 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-faithful-500"
              placeholder="Add your guest's email"
               />
              </div>
              <button class="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-faithful-500 focus:border-faithful-500">
                <span>Add</span>
              </button>
            </div>
            {/if}
          </dd>
        </div>
        {/if}
{/each}
        {/if}
      {/if}
      <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt class="text-sm font-medium text-gray-500">Email address</dt>
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
