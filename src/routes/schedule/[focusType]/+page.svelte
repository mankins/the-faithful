<script context="module">
export async function load({page}) {
  const { focusType } = page.params;

  return {
      redirect: {
        to: `/tickets/${focusType}`,
        status: 302,
      },
    };
  }
</script>
