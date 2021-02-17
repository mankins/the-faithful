          <!-- This example requires Tailwind CSS v2.0+ -->
          <div class="bg-white px-4 py-5 mt-4 border-t border-gray-200 sm:px-6">
            <div class="-ml-4 -mt-4 flex justify-between items-center flex-wrap sm:flex-nowrap">
              <div class="ml-4 mt-4">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <picture>
                      <source type="image/webp" srcset="/img/diana-3.webp" />
                      <img        
                        class="h-24 w-24 rounded-full border bg-gray-100"
                        src="/img/diana-3.jpg"
                        alt="Ticket"
                      />
                    </picture>
  
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg leading-6 font-medium text-gray-900">
                      Cinema Premiere
                    </h3>
                    {#if true}
                    <p class="text-sm text-gray-500">
                      <a href="#">
                        $12.50
                      </a>
                    </p>
                    {/if}
                  </div>
              </div>
              </div>
              <div class="ml-4 mt-4 flex-shrink-0 flex">
                <button title="Add Additional" type="button" class="ml-3 relative inline-flex items-center px-1 py-2 border border-transparent text-sm font-medium rounded-full hover:bg-gray-900 text-gray-100  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-faithful-500">
                  <svg class="ml-1 mr-1 h-5 w-5 text-gray-400 hover:text-gray-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                </button>
                <button type="button" title="Remove From Cart" class="ml-3 relative inline-flex items-center px-1 py-2 border border-transparent text-sm font-medium rounded-full hover:bg-gray-900 text-gray-100  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-faithful-500">
                  <svg class="ml-1 mr-1 h-5 w-5 text-gray-400 hover:text-gray-100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                </button>
              </div>
            </div>

          </div>
          <select class="w-full border-0 bg-gray-50 font-light text-sm m-auto">
            <option>March 19, 8:00pm</option>
            <option>March 19, 2:00pm</option>
          </select>
      