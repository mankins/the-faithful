<script>
    import "$styles/tailwind.css";
    import "$styles/main.scss";
    import "$styles/fonts.css";
    import { afterUpdate } from "svelte";
    import { page as pageStore } from "$components/stores";
  //  import ThemeToggle from "$components/ThemeToggle.svelte";
  
    afterUpdate(async () => {
      const p = window ? window.location : {};
      pageStore.update((before) => {
        const after = { ...before };
        after.path = p.pathname;
        return after;
      });
    });
  </script>
  
  <main class="flex-grow">
    <slot />
  </main>
  