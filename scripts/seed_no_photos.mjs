import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ SUPABASE_SERVICE_ROLE_KEY is missing in .env.local!");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const productsData = [
    // Pães Artesanais (6 items)
    { categoryName: "Pães Artesanais", name: "Baguete Francesa", desc: "Clássica baguete francesa de casca crocante.", price: 9.90 },
    { categoryName: "Pães Artesanais", name: "Focaccia de Alecrim", desc: "Focaccia perfumada com alecrim e azeite.", price: 18.00 },
    { categoryName: "Pães Artesanais", name: "Pão de Forma Integral", desc: "Macio e perfeito para sanduíches saudáveis.", price: 14.50 },
    { categoryName: "Pães Artesanais", name: "Pão Australiano", desc: "Pão escuro macio e levemente adocicado.", price: 12.00 },
    { categoryName: "Pães Artesanais", name: "Croissant de Queijo", desc: "Croissant amanteigado, recheado com queijo.", price: 13.50 },
    { categoryName: "Pães Artesanais", name: "Pão de Hambúrguer", desc: "Brioche super macio para seu lanche em casa.", price: 5.00 },

    // Doces & Bolos (6 items)
    { categoryName: "Doces & Bolos", name: "Quindim Tradicional", desc: "Cremoso, docinho e cheio de coco.", price: 7.50 },
    { categoryName: "Doces & Bolos", name: "Pudim de Leite", desc: "Receita de vó, liso e sem furinhos.", price: 12.00 },
    { categoryName: "Doces & Bolos", name: "Bolo de Cenoura com Chocolate", desc: "Fatia fofinha com casquinha de chocolate duro.", price: 9.00 },
    { categoryName: "Doces & Bolos", name: "Carolina de Doce de Leite", desc: "Massa leve recheada até explodir de doce de leite.", price: 6.50 },
    { categoryName: "Doces & Bolos", name: "Bomba de Baunilha", desc: "Éclair recheada com um autêntico creme de baunilha.", price: 14.00 },
    { categoryName: "Doces & Bolos", name: "Macaron de Pistache", desc: "Um delicado clássico francês sabor pistache.", price: 8.00 },

    // Cafés (6 items)
    { categoryName: "Cafés", name: "Espresso Tônico", desc: "Dose de expresso servido na água tônica com gelo e limão.", price: 16.00 },
    { categoryName: "Cafés", name: "Café Filtrado Especial", desc: "Extraído na Hario V60, perfil floral e adocicado.", price: 14.00 },
    { categoryName: "Cafés", name: "Pingado", desc: "Aquele clássico copo americano com café e leito quentinho.", price: 6.50 },
    { categoryName: "Cafés", name: "Affogato", desc: "Espresso quente despejado sobre uma bola de sorvete de baunilha.", price: 19.00 },
    { categoryName: "Cafés", name: "Irish Coffee", desc: "Café, whiskey irlandês e creme de leite batido.", price: 27.00 },
    { categoryName: "Cafés", name: "Café com Chantilly", desc: "O tradicional com aquele upgrade delicioso de chantilly fresco.", price: 11.00 },

    // Bebidas Geladas (6 items)
    { categoryName: "Bebidas Geladas", name: "Refrigerante Cola Lata", desc: "A lata clássica em versão gelada.", price: 7.00 },
    { categoryName: "Bebidas Geladas", name: "Água com Gás", desc: "Garrafinha de 500ml de água mineral gaseificada.", price: 5.50 },
    { categoryName: "Bebidas Geladas", name: "Suco de Uva Integral", desc: "Suco direto da roça, sem adição de açúcares.", price: 11.00 },
    { categoryName: "Bebidas Geladas", name: "Suco Verde Detox", desc: "Laranja, couve, limão e hortelã bem gelados.", price: 13.50 },
    { categoryName: "Bebidas Geladas", name: "Smoothie de Morango", desc: "Morango congelado batido com iogurte natural e mel.", price: 18.00 },
    { categoryName: "Bebidas Geladas", name: "Chá Mate Gelado", desc: "Tradicional chá mate batido com limão taiti.", price: 9.00 },
];

async function seed() {
    console.log("🚀 Iniciando Seeder Sem Fotos (24 Itens)...");

    // Fetch created categories to map IDs
    const { data: cats, error: catError } = await supabase.from("categories").select("*");
    if (catError) {
        console.error("Erro ao buscar categorias:", catError.message);
        process.exit(1);
    }

    // Insert Products
    for (const prod of productsData) {
        const categoryObj = cats.find((c) => c.name === prod.categoryName);
        const categoryId = categoryObj?.id;

        if (categoryId) {
            console.log(`⏳ Salvando produto ${prod.name}...`);
            await supabase.from("products").insert({
                category_id: categoryId,
                name: prod.name,
                description: prod.desc,
                price: prod.price,
                image_url: null,
                active: true
            });
        } else {
            console.error(`❌ Categoria não encontrada no banco: ${prod.categoryName}`);
        }
    }

    console.log("✅ Seed Text-Only concluído com sucesso!");
}

seed();
