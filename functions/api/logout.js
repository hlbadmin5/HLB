export async function onRequestPost(context) {
    return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
            "Set-Cookie": "hlb_auth=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict"
        }
    });
}