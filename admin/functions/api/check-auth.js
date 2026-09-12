export async function onRequestGet(context) {
    const cookie = context.request.headers.get("Cookie") || "";
    if (cookie.includes("hlb_auth=authenticated")) {
        return new Response(JSON.stringify({ authenticated: true }), { status: 200 });
    }
    return new Response(JSON.stringify({ authenticated: false }), { status: 401 });
}