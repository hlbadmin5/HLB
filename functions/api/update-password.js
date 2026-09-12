export async function onRequestPost(context) {
    try {
        const { username, newPassword } = await context.request.json();
        
        // Update password and clear temporary status
        await context.env.DB.prepare(
            "UPDATE admins SET password_hash = ?, is_temp = 0 WHERE username = ?"
        ).bind(newPassword, username).run();

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Set-Cookie": `hlb_auth=${username}; Path=/; HttpOnly; Secure; SameSite=Strict`
            }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}