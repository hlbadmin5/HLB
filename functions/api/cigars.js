export async function onRequestGet(context) {
    try {
        const { results } = await context.env.DB.prepare("SELECT * FROM cigars ORDER BY id DESC").all();
        const formatted = results.map(row => ({
            ...row,
            active: row.active === 1
        }));
        return new Response(JSON.stringify(formatted), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        return new Response(JSON.stringify([]), { status: 500 });
    }
}