export async function onRequestPost(context) {
    try {
        const { password } = await context.request.json();
        
        // Match this against your staff passcode (you can update or secure this as needed)
        const MASTER_PASSWORD = "your-secure-passcode"; // Change to your preferred passcode

        if (password === MASTER_PASSWORD) {
            // Set an auth cookie or token for the session
            return new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Set-Cookie": "hlb_auth=authenticated; Path=/; HttpOnly; Secure; SameSite=Strict"
                }
            });
        }

        return new Response(JSON.stringify({ error: "Invalid passcode" }), { status: 401 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}