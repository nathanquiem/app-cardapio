import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ SUPABASE_SERVICE_ROLE_KEY is missing in .env.local!");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const BRAIN_DIR = "C:\\Users\\naelq\\.gemini\\antigravity\\brain\\e10872a0-37ca-4e4c-99f4-c98f6a7aec03";

async function uploadLogo() {
    console.log("🚀 Iniciando upload da Logo...");

    const files = fs.readdirSync(BRAIN_DIR);
    const logoFile = files.find(f => f.startsWith("padoca_logo") && f.endsWith(".png"));

    if (!logoFile) {
        console.error("❌ Logo não encontrada na pasta do brain.");
        process.exit(1);
    }

    const imgPath = path.join(BRAIN_DIR, logoFile);
    const fileBuffer = fs.readFileSync(imgPath);

    console.log(`⏳ Fazendo upload de ${logoFile}...`);
    const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload("padoca_logo.png", fileBuffer, { contentType: "image/png", upsert: true });

    if (uploadError) {
        console.error("❌ Erro no upload:", uploadError.message);
    } else {
        const publicUrl = supabase.storage.from("product-images").getPublicUrl("padoca_logo.png").data.publicUrl;
        console.log("✅ Upload da Logo concluído com sucesso!");
        console.log("URL DA LOGO:", publicUrl);
    }
}

uploadLogo();
