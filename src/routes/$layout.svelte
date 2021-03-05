<script>
  import '$styles/tailwind.css';
  import '$styles/main.scss';
  import '$styles/fonts.css';

  import * as Sentry from '@sentry/browser';
  import { Integrations } from '@sentry/tracing';
  import { afterUpdate } from 'svelte';
  import { page as pageStore } from '$components/stores';
  //  import ThemeToggle from "$components/ThemeToggle.svelte";
  import { fireGoal } from '$components/utils/analytics';
  import { parseParams } from '$components/utils/query';
  import { onMount } from 'svelte';

  afterUpdate(async () => {
    const p = window ? window.location : {};
    pageStore.update((before) => {
      const after = { ...before };
      after.path = p.pathname;
      return after;
    });
  });

  let query = {};

  onMount(async () => {
    let environment = 'production';
    if (window && window.location.href.indexOf('localhost') !== -1) {
      // dev mode
      environment = 'dev';
    }
    let release = 'tf-' + process.env.COMMIT_SHA;

    Sentry.init({
      environment,
      release,
      dsn:
        'https://5a6ba0dde074485fbd80040aedb28d7a@o541573.ingest.sentry.io/5660669',
      integrations: [new Integrations.BrowserTracing()],
      tracesSampleRate: 1.0,
    });
    query = parseParams(window.location.search);

    // check for utm &utm_source=cid&utm_medium=email&utm_campaign=Y3FAKBV4
    if (query.utm_campaign) {
      fireGoal(query.utm_campaign);
      document.cookie = `_src=${query.utm_campaign}; path=/; max-age=8640000`;
    }
  });
</script>

<main class="flex-grow">
  <slot />
</main>
