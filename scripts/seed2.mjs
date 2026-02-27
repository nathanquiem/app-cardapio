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

const getImagePath = (prefix) => {
    const files = fs.readdirSync(BRAIN_DIR);
    // Get all matching files, sort by time (latest first) or just pick first
    const matchingFiles = files.filter(f => f.startsWith(prefix) && f.endsWith(".png"));
    if (matchingFiles.length === 0) return null;
    // Pick the most recent one (alphabetical sorting of timestamp works usually)
    matchingFiles.sort().reverse();
    return path.join(BRAIN_DIR, matchingFiles[0]);
};

// Map by exact DB name so we find the right category_id
const productsData = [
    { categoryName: "Pães Artesanais", filePrefix: "pao_fermentacao_natural", name: "Pão de Fermentação Natural", desc: "Pão rústico de longa fermentação, casca crocante e miolo macio.", price: 22.0 },
    { categoryName: "Pães Artesanais", filePrefix: "brioche_frances", name: "Brioche Francês", desc: "Pão doce amanteigado super fofinho com crosta dourada.", price: 18.0 },

    { categoryName: "Doces & Bolos", filePrefix: "brownie_nozes", name: "Brownie com Nozes", desc: "Quadrado de chocolate intenso recheado com nozes crocantes.", price: 14.5 },
    { categoryName: "Doces & Bolos", filePrefix: "eclair_chocolate", name: "Éclair de Chocolate", desc: "A famosa bomba de chocolate feita com legítima pâte à choux.", price: 16.0 },

    { categoryName: "Cafés", filePrefix: "mocha_chantilly", name: "Mocha com Chantilly", desc: "Expresso, leite vaporizado, calda de chocolate e chantilly.", price: 19.0 },
    { categoryName: "Cafés", filePrefix: "macchiato_caramelo", name: "Macchiato de Caramelo", desc: "Leite manchado com expresso e finalizado com treliça de caramelo.", price: 18.5 },

    { categoryName: "Bebidas Geladas", filePrefix: "frappuccino_baunilha", name: "Frappuccino de Baunilha", desc: "Café gelado batido com baunilha, gelo e chantilly.", price: 21.0 },
    { categoryName: "Bebidas Geladas", filePrefix: "cha_gelado_pessego", name: "Chá Gelado de Pêssego", desc: "Misto de chá preto refrescante, limão e pedaços de pêssego.", price: 15.0 },
];

async function seed() {
    console.log("🚀 Iniciando Seeder Parte 2...");

    // Fetch created categories to map IDs
    const { data: cats, error: catError } = await supabase.from("categories").select("*");
    if (catError) {
        console.error("Erro ao buscar categorias:", catError.message);
        process.exit(1);
    }

    // Upload Images and Insert Products
    for (const prod of productsData) {
        const imgPath = getImagePath(prod.filePrefix);
        let publicUrl = null;

        if (imgPath) {
            const fileName = `${prod.filePrefix}-${Date.now()}.png`;
            const fileBuffer = fs.readFileSync(imgPath);

            console.log(`⏳ Fazendo upload de ${fileName}...`);
            const { error: uploadError } = await supabase.storage
                .from("product-images")
                .upload(fileName, fileBuffer, { contentType: "image/png" });

            if (uploadError) {
                console.error("Erro no upload de", fileName, uploadError.message);
            } else {
                publicUrl = supabase.storage.from("product-images").getPublicUrl(fileName).data.publicUrl;
            }
        } else {
            console.warn(`⚠️ Imagem não encontrada para o prefixo: ${prod.filePrefix}`);
        }

        const categoryObj = cats.find((c) => c.name === prod.categoryName);
        const categoryId = categoryObj?.id;

        if (categoryId) {
            console.log(`⏳ Salvando produto ${prod.name}...`);
            await supabase.from("products").insert({
                category_id: categoryId,
                name: prod.name,
                description: prod.desc,
                price: prod.price,
                image_url: publicUrl,
                active: true
            });
        } else {
            console.error(`❌ Categoria não encontrada no banco: ${prod.categoryName}`);
        }
    }

    console.log("✅ Seed 2 concluído com sucesso!");
}

seed();
