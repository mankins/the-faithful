<script>
  import Cart from '$components/cart/Cart.svelte';
  import Nav from '$components/nav/Nav.svelte';
  import Footer from '$components/nav/Footer.svelte';

  import { getProduct } from '$components/data.js';

  let cartOpened = false;
  let items = [];

  const handleAddCart = (item) => {
    cartOpened = true;
    items.push(item);
  };

</script>

<div class="min-h-screen bg-faithful-500 overscroll-x-contain overflow-hidden">
  <div class="absolute top-0 mb h-full z-10">
    <Nav>
		<button
		on:click={() => handleAddCart(getProduct('cinema-premiere'))}

		type="button"
		class="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-faithful-600 shadow-sm hover:bg-faithful-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-faithful-500"
	  >
		<!-- Heroicon name: ticket -->
		<svg
		  class="-ml-1 mr-2 h-5 w-5"
		  xmlns="http://www.w3.org/2000/svg"
		  fill="none"
		  viewBox="0 0 24 24"
		  stroke="currentColor"
		>
		  <path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
		  />
		</svg>
		<span>Buy a Ticket</span>
	  </button>
	</Nav>

    <Cart bind:opened={cartOpened} bind:items />
  </div>

  <div class="container ml-6">
    <h1
      class="pt-24 text-4xl font-serif text-gray-900 font-extrabold tracking-tight sm:text-6xl"
    >
      Schedule
    </h1>

    <div class="w-5/6 md:w-4/6">
      <p class="text-justify text-gray-600">
        Limited virtual cinema screenings are available from March, 2021. Some
        screenings are live events with the filmmakers present. Other screenings
        are video on demand and can be watched at your leisure.
      </p>
    </div>
  </div>

  <!-- This example requires Tailwind CSS v2.0+ -->
  <div
    class="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8 bg-faithful-500 pb-16"
  >
    <div class="sm:flex sm:flex-col sm:align-center">
      <div
        class="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-4"
      >
        <div
          class="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200 bg-white mt-0"
        >
          <div class="p-6">
            <h2 class="text-lg leading-6 font-medium text-gray-900">
              Sneak Peek
            </h2>
            <p class="mt-4 text-sm text-gray-500">March 18, 2021</p>
            <p class="mt-8">
              <span class="text-4xl font-extrabold text-gray-900">$5</span>
              <span class="text-base font-medium text-gray-500">/ month</span>
            </p>
            <a
              href="https://help.coil.com/docs/general-info/intro-to-coil/index.html"
              class="mt-8 block w-full bg-gray-600 border border-gray-800 rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-gray-900"
              >Learn about Coil</a
            >
          </div>
          <div class="pt-6 pb-8 px-6">
            <h3
              class="text-xs font-medium text-gray-900 tracking-wide uppercase"
            >
              What's included
            </h3>
            <ul class="mt-6 space-y-4">
              <li class="flex space-x-3">
                <!-- Heroicon name: solid/check -->
                <svg
                  class="flex-shrink-0 h-5 w-5 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="text-sm text-gray-500 font-bold"
                  >World premiere event</span
                >
              </li>
              <li class="flex space-x-3">
                <!-- Heroicon name: solid/check -->
                <svg
                  class="flex-shrink-0 h-5 w-5 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="text-sm text-gray-500">Live Event</span>
              </li>

              <li class="flex space-x-3">
                <!-- Heroicon name: solid/check -->
                <svg
                  class="flex-shrink-0 h-5 w-5 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="text-sm text-gray-500"
                  >Multiple timezone friendly</span
                >
              </li>

              <li class="flex space-x-3">
                <!-- Heroicon name: solid/check -->
                <svg
                  class="flex-shrink-0 h-5 w-5 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="text-sm text-gray-500"
                  >Q&A with the filmmakers</span
                >
              </li>

              <li class="flex space-x-3">
                <!-- Heroicon name: solid/check -->
                <svg
                  class="flex-shrink-0 h-5 w-5 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="text-sm text-gray-500"
                  >Digital movie theatre experience</span
                >
              </li>
              <li class="flex space-x-3">
                <!-- Heroicon name: solid/check -->
                <svg
                  class="flex-shrink-0 h-5 w-5 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="text-sm text-gray-500"
                  >Includes access to all events listed</span
                >
              </li>

              <li class="flex space-x-3 pt-6">
                <span class="text-sm font-extrabold text-gray-500"
                  >Sneak Peek brought to you by <a
                    href="https://www.coil.com/"
                    class="text-faithful-900 underline">Coil</a
                  >. Coil created
                  <a
                    href="https://webmonetization.org/"
                    class="text-faithful-900 underline">web monetization</a
                  > to support content creators on sites like ours via a monthly
                  subscription.</span
                >
              </li>
            </ul>
          </div>
        </div>

        <div
          class="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200 bg-white"
        >
          <div class="p-6">
            <h2 class="text-lg leading-6 font-medium text-gray-900">
              Cinema Premiere
            </h2>
            <p class="mt-4 text-sm text-gray-500">March 19, 2021</p>
            <p class="mt-8">
              <span class="text-4xl font-extrabold text-gray-900">$12.50</span>
              <span class="text-base font-medium text-gray-500">/ticket</span>
            </p>
            <button
              on:click={() => handleAddCart(getProduct('cinema-premiere'))}
              class="mt-8 block w-full bg-gray-800 border border-gray-800 rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-gray-900"
              >Add Ticket</button
            >
          </div>
          <div class="pt-6 pb-8 px-6">
            <h3
              class="text-xs font-medium text-gray-900 tracking-wide uppercase"
            >
              What's included
            </h3>
            <ul class="mt-6 space-y-4">
              <li class="flex space-x-3">
                <!-- Heroicon name: solid/check -->
                <svg
                  class="flex-shrink-0 h-5 w-5 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="text-sm text-gray-500 font-bold"
                  >World premiere event</span
                >
              </li>
              <li class="flex space-x-3">
                <!-- Heroicon name: solid/check -->
                <svg
                  class="flex-shrink-0 h-5 w-5 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="text-sm text-gray-500">Live event</span>
              </li>
              <li class="flex space-x-3">
                <!-- Heroicon name: solid/check -->
                <svg
                  class="flex-shrink-0 h-5 w-5 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="text-sm text-gray-500"
                  >Multiple timezone friendly</span
                >
              </li>

              <li class="flex space-x-3">
                <!-- Heroicon name: solid/check -->
                <svg
                  class="flex-shrink-0 h-5 w-5 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="text-sm text-gray-500"
                  >Q&A with the filmmakers</span
                >
              </li>

              <li class="flex space-x-3">
                <!-- Heroicon name: solid/check -->
                <svg
                  class="flex-shrink-0 h-5 w-5 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="text-sm text-gray-500"
                  >Digital movie theatre experience</span
                >
              </li>
            </ul>
          </div>
        </div>

        <div
          class="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200 bg-white"
        >
          <div class="p-6">
            <h2 class="text-lg leading-6 font-medium text-gray-900">
              Virtual Viewing Event
            </h2>
            <p class="mt-4 text-sm text-gray-500">March 20-22, 2021</p>
            <p class="mt-8">
              <span class="text-4xl font-extrabold text-gray-900">$7.50</span>
              <span class="text-base font-medium text-gray-500">/ ticket</span>
            </p>
            <button
			on:click={() => handleAddCart(getProduct('cinema-virtual'))}
              class="mt-8 block w-full bg-gray-800 border border-gray-800 rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-gray-900"
              >Add Ticket</button
            >
          </div>
          <div class="pt-6 pb-8 px-6">
            <h3
              class="text-xs font-medium text-gray-900 tracking-wide uppercase"
            >
              What's included
            </h3>
            <ul class="mt-6 space-y-4">
              <li class="flex space-x-3">
                <!-- Heroicon name: solid/check -->
                <svg
                  class="flex-shrink-0 h-5 w-5 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="text-sm text-gray-500">Live Event</span>
              </li>
              <li class="flex space-x-3">
                <!-- Heroicon name: solid/check -->
                <svg
                  class="flex-shrink-0 h-5 w-5 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="text-sm text-gray-500"
                  >Multiple timezone friendly</span
                >
              </li>

              <li class="flex space-x-3">
                <!-- Heroicon name: solid/check -->
                <svg
                  class="flex-shrink-0 h-5 w-5 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="text-sm text-gray-500"
                  >Q&A with the filmmakers</span
                >
              </li>

              <li class="flex space-x-3">
                <!-- Heroicon name: solid/check -->
                <svg
                  class="flex-shrink-0 h-5 w-5 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="text-sm text-gray-500"
                  >Digital movie theatre experience</span
                >
              </li>
            </ul>
          </div>
        </div>

        {#if false}
          <div
            class="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200 bg-white"
          >
            <div class="p-6">
              <h2 class="text-lg leading-6 font-medium text-gray-900">
                Streaming
              </h2>
              <p class="mt-4 text-sm text-gray-500">April 2021</p>
              <p class="mt-8">
                <span class="text-4xl font-extrabold text-gray-900">$7.50</span>
                <span class="text-base font-medium text-gray-500">/ stream</span
                >
              </p>
              <a
                href="#"
                class="mt-8 block w-full bg-gray-800 border border-gray-800 rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-gray-900"
                >Add Ticket</a
              >
            </div>
            <div class="pt-6 pb-8 px-6">
              <h3
                class="text-xs font-medium text-gray-900 tracking-wide uppercase"
              >
                What's included
              </h3>
              <ul class="mt-6 space-y-4">
                <li class="flex space-x-3">
                  <!-- Heroicon name: solid/check -->
                  <svg
                    class="flex-shrink-0 h-5 w-5 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span class="text-sm text-gray-500"
                    >Streaming, watch at your leisure</span
                  >
                </li>
              </ul>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
  <Footer />
</div>
