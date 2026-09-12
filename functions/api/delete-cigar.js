export async function onRequestPost(context) {
    try {
        const { id } = await context.request.json();
        await context.env.DB.prepare("DELETE FROM cigars WHERE id = ?").bind(id).run();
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}