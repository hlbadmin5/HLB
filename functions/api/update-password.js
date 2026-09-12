export async function onRequestPost(context) {
    try {
        const { username, newPassword } = await context.request.json();
        
        // Hash the new password securely here before saving
        // Update database, clear the temporary flag
        await context.env.DB.prepare(
            "UPDATE admins SET password_hash = ?, is_temp = 0 WHERE username = ?"
        ).bind(newPassword, username).run();

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}