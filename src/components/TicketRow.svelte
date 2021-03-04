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

  let raw = JSON.parse(get(ticket, 'receipt.raw', ''));

  const getProductFromId = (productId) => {
    return 'Virtual Premiere Weekend - The Faithful'; // TODO
  };
</script>

<tr>
  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
    <ul class="border border-gray-200 rounded-md divide-y divide-gray-200">
      {#each get(ticket, 'receipt.products', []) as productId, i}
        <li class="pl-3 pr-4 py-3 flex items-center justify-between text-sm mt-2 bg-gray-50">
          {getProductFromId(productId)}
        </li>
      {/each}
    </ul>
  </td>
  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
    {get(ticket, 'receipt.paid', '-')}
  </td>
  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
    {get(ticket, 'receipt.ts', '')}
  </td>
  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
    ({get(ticket, 'receipt.type', '-')})
  </td>
  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
    <a
      href={`/my/tickets/${get(ticket, 'receipt.id', '')}`}
      class="text-faithful-600 hover:text-faithful-900">View</a
    >
  </td>
</tr>
