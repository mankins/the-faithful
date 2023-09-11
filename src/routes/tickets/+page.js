export async function load({ page }) {
  const { focusType } = page.params;
  return { focusType };
}
