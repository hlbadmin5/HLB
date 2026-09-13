export async function onRequestPost(context) {
    try {
        const formData = await context.request.formData();
        
        const name = formData.get("cigar-name");
        const wrapper = formData.get("cigar-wrapper");
        const strength = formData.get("cigar-strength");
        const pairingBourbon = formData.get("cigar-pairingBourbon") || "";
        const notes = formData.get("cigar-notes");
        const imageFile = formData.get("cigarImage");

        let imagePath = "";

        // If an image was uploaded, stream it directly to your R2 bucket (`IMAGES`)
        if (imageFile && imageFile.size > 0) {
            const fileName = `images/cigar-${Date.now()}-${imageFile.name}`;
            await context.env.IMAGES.put(fileName, imageFile.stream(), {
                httpMetadata: { contentType: imageFile.type }
            });
            imagePath = `https://images.harmonysliquorbox.com/${fileName}`;
        }

        // Insert row into Cloudflare D1 Database (`DB`)
        await context.env.DB.prepare(`
            INSERT INTO cigars (name, wrapper, strength, pairingBourbon, notes, image, active)
            VALUES (?, ?, ?, ?, ?, ?, 1)
        `).bind(name, wrapper, strength, pairingBourbon, notes, imagePath).run();

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}