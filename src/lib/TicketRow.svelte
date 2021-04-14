<script>
  import get from 'lodash.get';
  import AccessDenied from './AccessDenied.svelte';

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
console.log({ticket});
  let raw = JSON.parse(get(ticket, 'receipt.raw', '{}'));

  const getProductFromId = (productId) => {
    return 'The Faithful'; // TODO
  };
</script>

<a href={`/my/tickets/${get(ticket, 'receipt.id', '')}`} class="block hover:bg-gray-50">

  <div class="flex items-center px-4 py-4 sm:px-6">
    <div class="min-w-0 flex-1 flex items-center">
      <div class="flex-shrink-0">
        <picture>
          <source type="image/webp" srcset="/img/diana-illustrated.webp" />
        <img class="h-12 w-12 rounded-full" src="/img/diana-illustrated.jpg" alt="">
        </picture>
      </div>
      <div class="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
        <div>          
            {#each get(ticket, 'receipt.products', []) as productId, i}
              <p class="text-sm font-medium text-gray-900 truncate mb-2">
                {getProductFromId(productId)}
              </p>
          {/each}
        </div>
        <div class="hidden md:block">
          <div>
            <p class="text-sm text-gray-900">              
              <time datetime={get(ticket, 'receipt.ts', '').substring(0, 10)}>{get(ticket, 'receipt.ts', '').substring(0, 10)}</time>
            </p>
            <p class="mt-2 flex items-center text-sm text-gray-500">
              {get(ticket, 'receipt.paid', '-')}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div>
      <!-- Heroicon name: solid/chevron-right -->
      <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
      </svg>
    </div>
  </div>
</a>

