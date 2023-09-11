export async function load({ page }) {
  const { videoId } = page.params;
  return { videoId };
}
