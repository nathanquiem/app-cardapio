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
    { categoryName: "Pães Artesanais", filePrefix: "pao_italiano", name: "Pão Italiano", desc: "Pão rústico de casca grossa e miolo alveolado, fermentação natural.", price: 24.0 },
    { categoryName: "Pães Artesanais", filePrefix: "pao_centeio", name: "Pão de Centeio", desc: "Pão escuro rico em fibras, com sementes e sabor intenso.", price: 20.0 },

    { categoryName: "Doces & Bolos", filePrefix: "brigadeiro_gourmet", name: "Brigadeiro Gourmet", desc: "Brigadeiro grande feito com cacau belga e confeitos nobres.", price: 8.5 },
    { categoryName: "Doces & Bolos", filePrefix: "torta_limao", name: "Torta de Limão", desc: "Fatia de torta de limão com merengue suíço tostado.", price: 17.0 },

    { categoryName: "Cafés", filePrefix: "cafe_americano", name: "Café Americano", desc: "Expresso duplo diluído em água quente, sabor limpo e suave.", price: 10.0 },
    { categoryName: "Cafés", filePrefix: "flat_white", name: "Flat White", desc: "Expresso duplo com uma fina e cremosa camada de leite vaporizado.", price: 15.0 },

    { categoryName: "Bebidas Geladas", filePrefix: "suco_laranja", name: "Suco de Laranja", desc: "Suco natural espremido na hora, copo de 400ml.", price: 12.0 },
    { categoryName: "Bebidas Geladas", filePrefix: "soda_italiana", name: "Soda Italiana de Maçã Verde", desc: "Água com gás, xarope de maçã verde e muito gelo.", price: 14.0 },
];

async function seed() {
    console.log("🚀 Iniciando Seeder Parte 3...");

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

    console.log("✅ Seed 3 concluído com sucesso!");
}

seed();
