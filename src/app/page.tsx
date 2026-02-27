import { createClient } from "@/lib/supabase/server";
import { ClientHome } from "@/components/ClientHome";

export default async function Page() {
    const supabase = await createClient();

    let categories = [];
    let products = [];

    try {
        // If NEXT_PUBLIC_SUPABASE_URL is valid, try fetch
        if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your-supabase-url-here') {
            const [{ data: cats }, { data: prods }] = await Promise.all([
                supabase.from("categories").select("*").eq("active", true).order("order"),
                supabase.from("products").select("*").eq("active", true)
            ]);
            categories = cats || [];
            products = prods || [];
        }
    } catch (error) {
        console.error("Failed to fetch from Supabase. Falling back to mock data.", error);
    }

    // Fallback to mock data if empty (for presentation / before Supabase config)
    if (categories.length === 0) {
        categories = [
            { id: "c1", name: "Pães Artesanais" },
            { id: "c2", name: "Doces & Bolos" },
            { id: "c3", name: "Cafés" },
            { id: "c4", name: "Bebidas Geladas" }
        ];
        products = [
            { id: "p1", category_id: "c1", name: "Croissant Tradicional", description: "Massa folhada amanteigada, original francês.", price: 12.50, image_url: "" },
            { id: "p2", category_id: "c1", name: "Pão de Queijo Recheado", description: "Pão de queijo da canastra com requeijão artesanal.", price: 9.90, image_url: "" },
            { id: "p3", category_id: "c2", name: "Bolo Red Velvet", description: "Fatia generosa com creme cremoso de baunilha.", price: 18.00, image_url: "" },
            { id: "p4", category_id: "c3", name: "Espresso Duplo", description: "Grãos selecionados, torra média.", price: 8.00, image_url: "" },
        ];
    }

    return (
        <ClientHome categories={categories} products={products as any} />
    );
}
