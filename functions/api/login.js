export async function onRequestPost(context) {
    try {
        const { username, password } = await context.request.json();
        
        const admin = await context.env.DB.prepare(
            "SELECT * FROM admins WHERE username = ?"
        ).bind(username).first();

        if (!admin) {
            return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
        }

        // Verify password hash (using standard comparison or Web Crypto API)
        // If is_temp is 1, return a flag telling the front-end to force a password change
        if (password === admin.password_hash) {
            return new Response(JSON.stringify({ 
                success: true, 
                forcePasswordChange: admin.is_temp === 1 
            }), {
                status: 200,
                headers: {
                    "Set-Cookie": `hlb_auth=${username}; Path=/; HttpOnly; Secure; SameSite=Strict`
                }
            });
        }

        return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}