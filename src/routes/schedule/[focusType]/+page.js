import { redirect } from '@sveltejs/kit';

export async function load({ page }) {
  const { focusType } = page.params;

  throw redirect(302, `/tickets/${focusType}`);
}
