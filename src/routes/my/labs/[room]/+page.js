export async function load({ page }) {
  const { room } = page.params;
  return { room };
}
