<script>
  import LoginModal from '$components/modals/LoginModal.svelte';
  import { parseParams } from '$components/utils/query';

  import { onMount } from 'svelte';

  let query = {};
  let email = '';

  onMount(async () => {
    query = parseParams(window.location.search);
    if (query && query.email) {
      email = query.email;
    }
  });
</script>

<LoginModal {email} />
