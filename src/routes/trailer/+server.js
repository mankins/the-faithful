import { redirect } from '@sveltejs/kit';

export async function GET(req, res) {
    const TRAILER = `/preview/pJ8ZLyX6GQy2gR6K72Np3iPhGJU00yYwMP01K3elY02NOQ?${req.query.toString()}`;
    
    throw redirect(302, TRAILER);
}