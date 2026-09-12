export async function onRequestPost(context) {
    try {
        const { id } = await context.request.json();
        
        // Fetch current active state
        const item = await context.env.DB.prepare("SELECT active FROM bourbons WHERE id = ?").bind(id).first();
        if (!item) return new Response("Not found", { status: 404 });

        const newState = item.active === 1 ? 0 : 1;

        // Toggle state in D1
        await context.env.DB.prepare("UPDATE bourbons SET active = ? WHERE id = ?").bind(newState, id).run();

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}