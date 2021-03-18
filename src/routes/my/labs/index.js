export async function get(req, res) {

    return Promise.resolve({
        status: 302,
        headers: {
            "location": '/my/labs/theatre',
            "cache-control": "no-cache; max-age=30",
        },
        body: ''
    });    
}