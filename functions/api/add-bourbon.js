export async function onRequestPost(context) {
    try {
        const formData = await context.request.formData();
        
        const name = formData.get("name");
        const type = formData.get("type");
        const proof = formData.get("proof");
        const tags = formData.get("tags");
        const nose = formData.get("nose");
        const palate = formData.get("palate");
        const finish = formData.get("finish");
        const pairingCigar = formData.get("pairingCigar") || "";
        const pairingNote = formData.get("pairingNote") || "";
        const imageFile = formData.get("bottleImage");

        let imagePath = "";

        // If an image was uploaded, stream it directly to your R2 bucket (`IMAGES`)
        if (imageFile && imageFile.size > 0) {
            const fileName = `images/${Date.now()}-${imageFile.name}`;
            await context.env.IMAGES.put(fileName, imageFile.stream(), {
                httpMetadata: { contentType: imageFile.type }
            });
            imagePath = `https://images.harmonysliquorbox.com/${fileName}`;
        }

        // Insert row into Cloudflare D1 Database (`DB`)
        await context.env.DB.prepare(`
            INSERT INTO bourbons (name, type, proof, tags, nose, palate, finish, pairingCigar, pairingNote, image, active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        `).bind(name, type, proof, tags, nose, palate, finish, pairingCigar, pairingNote, imagePath).run();

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}