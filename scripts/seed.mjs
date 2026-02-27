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
    const file = files.find(f => f.startsWith(prefix) && f.endsWith(".png"));
    return file ? path.join(BRAIN_DIR, file) : null;
};

const categoriesData = [
    { id: "c1", name: "Pães Artesanais", order: 1 },
    { id: "c2", name: "Doces & Bolos", order: 2 },
    { id: "c3", name: "Cafés", order: 3 },
    { id: "c4", name: "Bebidas Geladas", order: 4 },
];

const productsData = [
    { category: "c1", filePrefix: "croissant_tradicional", name: "Croissant Tradicional", desc: "Massa folhada amanteigada, receita original francesa.", price: 12.5 },
    { category: "c1", filePrefix: "pao_de_queijo", name: "Pão de Queijo da Canastra", desc: "Porção com 6 unidades quentinhas e muito queijo.", price: 16.0 },
    { category: "c2", filePrefix: "bolo_red_velvet", name: "Bolo Red Velvet", desc: "Fatia generosa com recheio de cream cheese suave.", price: 18.9 },
    { category: "c2", filePrefix: "tartelete_morango", name: "Tartelete de Morango", desc: "Massa sablée com creme pâtissière e morangos frescos.", price: 15.0 },
    { category: "c3", filePrefix: "espresso_duplo", name: "Espresso Duplo", desc: "Grãos arábica selecionados com torra média.", price: 8.5 },
    { category: "c3", filePrefix: "cappuccino_italiano", name: "Cappuccino Italiano", desc: "Espresso com leite vaporizado e crema perfeita.", price: 14.0 },
    { category: "c4", filePrefix: "iced_latte_caramel", name: "Iced Caramel Latte", desc: "Café gelado com leite e nosso caramelo artesanal.", price: 17.5 },
    { category: "c4", filePrefix: "pink_lemonade", name: "Pink Lemonade", desc: "Limonada refrescante com xarope de frutas vermelhas.", price: 13.0 },
];

async function seed() {
    console.log("🚀 Iniciando Seeder...");

    // 1. Insert Categories
    for (const cat of categoriesData) {
        const { error } = await supabase.from("categories").insert({ name: cat.name, order: cat.order, active: true });
        if (error) console.error("Erro na categoria", cat.name, error.message);
    }

    // Fetch created categories to map IDs
    const { data: cats } = await supabase.from("categories").select("*");

    // 2. Upload Images and Insert Products
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
        }

        const categoryId = cats.find((c) => c.name === categoriesData.find(cd => cd.id === prod.category).name)?.id;

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
        }
    }

    console.log("✅ Seed concluído com sucesso!");
}

seed();
