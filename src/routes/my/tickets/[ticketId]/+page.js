export async function load({ page }) {
  const { ticketId } = page.params;
  return { ticketId };
}
