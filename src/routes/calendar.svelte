<script>
  import calendarize from 'calendarize';
  import Arrow from '$components/nav/Arrow.svelte';
  import Nav from '$components/nav/Nav.svelte';

  export let year = 2021;
  export let offset = 0; // Sun
  export let today = new Date(); // Date
  export let month = today.getMonth(); // Mar

  export let labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  export let months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'July',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  $: today_month = today && today.getMonth();
  $: today_year = today && today.getFullYear();
  $: today_day = today && today.getDate();

  let prev = calendarize(new Date(year, month - 1), offset);
  let current = calendarize(new Date(year, month), offset);
  let next = calendarize(new Date(year, month + 1), offset);

  let events = {
    '2021-1-16': [{ time: new Date(2021, 2), display: 'Showing' }],
  };

  let showings = ['20'];

  function toPrev() {
    [current, next] = [prev, current];

    if (--month < 0) {
      month = 11;
      year--;
    }

    prev = calendarize(new Date(year, month - 1), offset);
  }

  function toNext() {
    [prev, current] = [current, next];

    if (++month > 11) {
      month = 0;
      year++;
    }

    next = calendarize(new Date(year, month + 1), offset);
  }
  function isEvent(day) {
    let eventKey = `${today_year}-${today_month}-${day}`;
    return events[eventKey];
  }

  function isToday(day) {
    return today &&
      today_year === year &&
      today_month === month &&
      today_day === day
      ? true
      : false; // `${day} ${year} ${today_year} ${month} ${today_month}`
  }
</script>

<div class="border-t-2">
  <Nav />
</div>

<div class="max-w-screen-lg min-h-screen m-auto content-center">
  <div class="">
    <header class="pt-10">
      <Arrow left on:click={toPrev} />
      <h4>{months[month]} {year}</h4>
      <Arrow on:click={toNext} />
    </header>

    <div class="month">
      {#each labels as txt, idx (txt)}
        <span class="label">{labels[(idx + offset) % 7]}</span>
      {/each}

      {#each { length: 6 } as w, idxw (idxw)}
        {#if current[idxw]}
          {#each { length: 7 } as d, idxd (idxd)}
            {#if current[idxw][idxd] != 0}
              <div
                class="h-full w-full zmax-h-32 p-2 m-auto border bg-white text-xs"
                class:bg-faithful-800={isEvent(current[idxw][idxd])}
              >
			  <div class:text-gray-200={isEvent(current[idxw][idxd])}>{current[idxw][idxd]}</div>
			  <div class="h-full w-full m-auto text-xs flex flex-col items-center justify-center">
                {#if isEvent(current[idxw][idxd])}
                  {#each isEvent(current[idxw][idxd]) as ev}
                    <div class="w-full text-left font-bold text-gray-50">
                      <div class="cursor-pointer flex items-center justify-center">
                        <div title="live q&a">
                          <svg
                            class="w-4 h-4 mr-1"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"
                            />
                            <path
                              d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"
                            />
                          </svg>
                        </div>
                        <div title="tickets available">
                          <svg
                            class="w-4 h-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
					<div><button class="mt-4">hey</button></div>
                  {/each}
               {/if}
			</div>

				</div>
            {:else if idxw < 1}
              <span
                class="h-full w-full p-2 m-auto border other bg-gray-100 text-xs"
                >{prev[prev.length - 1][idxd]}</span
              >
            {:else}
              <span
                class="h-full w-full p-2 m-auto border other bg-gray-100 text-xs"
                >{next[0][idxd]}</span
              >
            {/if}
          {/each}
        {/if}
      {/each}
    </div>
  </div>
</div>

<style>
  header {
    display: flex;
    margin: 2rem auto;
    align-items: center;
    justify-content: center;
    user-select: none;
  }

  h4 {
    display: block;
    text-align: center;
    text-transform: uppercase;
    font-size: 140%;
    margin: 0 1rem;
  }

  .month {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: right;
    grid-gap: 4px;
    min-height: 70vh;
  }

  .label {
    font-weight: 300;
    text-align: center;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
    opacity: 0.6;
  }

  .date {
    font-size: 16px;
    letter-spacing: -1px;
    border: 1px solid #e6e4e4;
    padding-right: 4px;
    font-weight: 700;
    padding: 0.5rem;
  }

  .date.today {
    color: #5286fa;
    background: #c4d9fd;
    border-color: currentColor;
  }

  .date.other {
    opacity: 0.2;
  }
</style>
