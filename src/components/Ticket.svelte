<script>

import get from 'lodash.get';

export let ticket = {};

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

const getProductFromId = (productId) => {
return 'Virtual Premiere Weekend - The Faithful'; // TODO
};

</script>

<div class="bg-white shadow overflow-hidden sm:rounded-lg">
    {#if false}
  <pre>{JSON.stringify(ticket,null,2)}</pre>
  <pre>{JSON.stringify(raw,null,2)}</pre>
  {/if}
  <div class="px-4 py-5 sm:px-6">
    <h3 class="text-lg leading-6 font-medium text-gray-900">Purchase</h3>
    <p class="mt-1 max-w-2xl text-sm text-gray-500">
        ({get(ticket, 'receipt.type')})
    </p>
  </div>
  <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
    <dl class="sm:divide-y sm:divide-gray-200">
      {#if false}
      <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt class="text-sm font-medium text-gray-500">QR Code</dt>
        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
          {genQr(ticket)}
        </dd>
      </div>
      {/if}
      <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt class="text-sm font-medium text-gray-500">Product</dt>
        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
          <ul class="border border-gray-200 rounded-md divide-y divide-gray-200">
            {#each get(ticket, 'receipt.products', []) as productId, i}
              <li class="pl-3 pr-4 py-3 flex items-center justify-between text-sm mt-2 bg-gray-50" title={productId}>
                {getProductFromId(productId)}
              </li>
            {/each}
          </ul>
      
        </dd>
      </div>
      {#if get(raw, 'livemode') === false}
      <div class="py-4 sm:py-5 sm:grid bg-red-50 sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt class="text-sm font-medium text-gray-500">TEST MODE</dt>
        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
          {(get(raw, 'livemode', '') === false) ? true : false}
        </dd>
      </div>
{/if}
      <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt class="text-sm font-medium text-gray-500">Purchase date</dt>
        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
          {get(ticket, 'receipt.ts', '')}
        </dd>
      </div>
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
      {#if false}
      <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt class="text-sm font-medium text-gray-500">Attachments</dt>
        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
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
                <span class="ml-2 flex-1 w-0 truncate">
                  ticket.pdf
                </span>
              </div>
              <div class="ml-4 flex-shrink-0">
                <a
                  href="#"
                  class="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Download
                </a>
              </div>
            </li>
          </ul>
        </dd>
      </div>
      {/if}
    </dl>
  </div>
</div>
