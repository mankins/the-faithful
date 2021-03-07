<script>
  import { onMount } from 'svelte';

  onMount(() => {});
</script>

<div class="m-6">

  <div>
    <label for="email" class="block text-sm font-medium text-gray-700">Filter</label>
    <div class="mt-1 flex rounded-md shadow-sm">
      <div class="relative flex items-stretch flex-grow focus-within:z-10">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <!-- Heroicon name: solid/users -->
          <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
        </div>
        <input type="text" name="email" id="email" class="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md pl-10 sm:text-sm border-gray-300" placeholder="elvis@grace.land">
      </div>
      <button class="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
        <span>Filter</span>
      </button>
    </div>
  </div>


  <div class="pb-5 border-b border-gray-200">
    <h3
      class="pt-12 text-3xl font-serif text-gray-900 font-extrabold tracking-tight sm:text-5xl"
    >
      Users
    </h3>
  </div>

  <div class="relative pb-5 border-b border-gray-200 sm:pb-2">
    <div class="md:flex md:items-center md:justify-between">
      <div class="mt-3 flex md:mt-0 md:absolute md:top-3 md:right-0">
        {#if false}
        <button
          type="button"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-faithful-500"
        >
          Share
        </button>
        {/if}
        <button
          type="button"
          class="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-faithful-600 hover:bg-faithful-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-faithful-500"
        >
          Add
        </button>
      </div>
    </div>
    <div class="mt-4">
      <!-- Dropdown menu on small screens -->
      <div class="sm:hidden">
        <label for="selected-tab" class="sr-only">Select a tab</label>
        <select
          id="selected-tab"
          name="selected-tab"
          class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-faithful-500 focus:border-faithful-500 sm:text-sm rounded-md"
        >
          <option>Applied</option>

          <option>Phone Screening</option>

          <option selected>Interview</option>

          <option>Offer</option>

          <option>Hired</option>
        </select>
      </div>
      <!-- Tabs at small breakpoint and up -->
      <div class="hidden sm:block">
        <nav class="-mb-px flex space-x-8">
          <!-- Current: "border-faithful-500 text-faithful-600", Default: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300" -->
          <a
            href="#"
            class="border-faithful-500 text-faithful-600 whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm"
            aria-current="page"
          >
Events
          </a>

          <a
            href="#"
            class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm"
          >
            Detail
          </a>

          <a
            href="#"
            class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm"
          >
            Upload
          </a>


        </nav>
      </div>
    </div>
  </div>

</div>
