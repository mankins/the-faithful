import { redirect } from '@sveltejs/kit';

export async function GET(req, res) {

    throw redirect(302, '/my/labs/theatre');
}
