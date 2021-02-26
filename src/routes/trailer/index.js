export async function get(req, res) {
    const TRAILER = `/preview/pJ8ZLyX6GQy2gR6K72Np3iPhGJU00yYwMP01K3elY02NOQ?${req.query.toString()}`;

    return Promise.resolve({
        status: 302,
        headers: {
            "location": TRAILER,
            "cache-control": "no-cache; max-age=30",
        },
        body: ''
    });    
}