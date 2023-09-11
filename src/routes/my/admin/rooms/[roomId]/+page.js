export async function load({ page }) {
  const { roomId } = page.params;
  return { roomId };
}
