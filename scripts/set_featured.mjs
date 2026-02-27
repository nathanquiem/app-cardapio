import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function setFeatured() {
    const { data: products } = await supabase.from("products").select("id");
    if (products && products.length > 0) {
        // Pick 4 random products or the first 4
        const selected = products.slice(0, 4);
        for (const p of selected) {
            await supabase.from("products").update({ is_featured: true }).eq("id", p.id);
        }
        console.log("✅ 4 produtos marcados como queridinhos!");
    }
}
setFeatured();
