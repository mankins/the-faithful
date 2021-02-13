export async function get(_req, res) {

    const TRAILER = '/preview/t2jYTAKc71QbCfyTlau3GJfErwcJLmnLQS8xHWclWvE';

    return Promise.resolve({
        status: 302,
        headers: {
            "location": TRAILER,
            "cache-control": "no-cache; max-age=30",
        },
        body: ''
    });

    
}