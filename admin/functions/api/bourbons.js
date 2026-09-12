export async function onRequestGet(context) {
    try {
        const { results } = await context.env.DB.prepare("SELECT * FROM bourbons ORDER BY id DESC").all();
        // Format boolean for active status to match your front-end code expectation
        const formatted = results.map(row => ({
            ...row,
            tags: row.tags ? row.tags.split(",") : [],
            active: row.active === 1
        }));
        return new Response(JSON.stringify(formatted), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        return new Response(JSON.stringify([]), { status: 500 });
    }
}