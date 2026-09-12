export async function onRequestGet(context) {
    const cookie = context.request.headers.get("Cookie") || "";
    // Check if hlb_auth cookie exists and isn't empty
    if (cookie.includes("hlb_auth=")) {
        return new Response(JSON.stringify({ authenticated: true }), { status: 200 });
    }
    return new Response(JSON.stringify({ authenticated: false }), { status: 401 });
}