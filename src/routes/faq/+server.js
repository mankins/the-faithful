export async function get(req, res) {
    const FAQ = 'https://www.notion.so/The-Faithful-FAQ-s-05fe7a8a5566447e82181a4068198ac4';

    return Promise.resolve({
        status: 302,
        headers: {
            "location": FAQ,
            "cache-control": "no-cache; max-age=30",
        },
        body: ''
    });    
}