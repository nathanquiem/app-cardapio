"use client";

import { useState } from "react";
import { Header } from "./Header";
import { WelcomeModal } from "./WelcomeModal";
import { CategoryScroller } from "./CategoryScroller";
import { ProductCard, type Product } from "./ProductCard";
import { CartDrawer } from "./CartDrawer";
import { ShoppingBag, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ClientHome({ categories, products }: { categories: any[], products: Product[] }) {
    const [activeCategory, setActiveCategory] = useState("featured");
    const [cartItems, setCartItems] = useState<(Product & { quantity: number })[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleAddToCart = (product: Product) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const handleRemoveFromCart = (id: string) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const sortProducts = (prods: Product[]) => {
        return [...prods].sort((a, b) => {
            if (a.image_url && !b.image_url) return -1;
            if (!a.image_url && b.image_url) return 1;
            return 0;
        });
    };

    const featuredProducts = sortProducts(products.filter(p => p.is_featured));
    const allCategoriesOptions = [{ id: "featured", name: "Queridinhos" }, ...categories];

    const isSearching = searchQuery.trim().length > 0;

    const searchResults = sortProducts(products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
    ));

    const currentCategoryProducts = activeCategory === "featured"
        ? featuredProducts
        : sortProducts(products.filter(p => p.category_id === activeCategory));

    return (
        <div className="min-h-screen bg-[#fafafa] pb-32">
            <WelcomeModal />
            <Header />

            <div className="px-6 py-4 bg-[#fafafa]/90 backdrop-blur-md z-30 border-b border-gray-100 sticky top-[80px]">
                <div className="relative max-w-2xl mx-auto">
                    <Search className="absolute left-4 top-3 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar na padaria..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-full py-2.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-black shadow-sm transition-all text-sm md:text-base"
                    />
                </div>
            </div>

            {!isSearching && (
                <div className="sticky top-[146px] z-20 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
                    <CategoryScroller
                        categories={allCategoriesOptions}
                        activeCategoryId={activeCategory}
                        onSelect={setActiveCategory}
                    />
                </div>
            )}

            <main className="p-6 max-w-5xl mx-auto pt-8">
                {isSearching ? (
                    <div>
                        <h2 className="text-xl font-bold tracking-tight mb-6 mt-2 text-center md:text-left">Resultados da busca</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {searchResults.map(p => <ProductCard key={p.id} product={p} onAdd={handleAddToCart} />)}
                            {searchResults.length === 0 && (
                                <div className="col-span-full py-20 text-center text-gray-500">Nenhum item encontrado.</div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="flex justify-center md:justify-start mb-8">
                            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                                {activeCategory === "featured" ? "⭐ Os Queridinhos" : categories.find(c => c.id === activeCategory)?.name}
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {currentCategoryProducts.map(p => (
                                <ProductCard key={p.id} product={p} onAdd={handleAddToCart} />
                            ))}
                            {currentCategoryProducts.length === 0 && (
                                <div className="col-span-full py-20 text-center text-gray-500">Nenhum item nesta categoria.</div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            <AnimatePresence>
                {cartItemCount > 0 && !isCartOpen && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-6 left-0 right-0 z-40 px-6 flex justify-center"
                    >
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="w-full max-w-md bg-black text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center justify-between hover:scale-[1.02] active:scale-95 transition-transform"
                        >
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <ShoppingBag size={24} />
                                    <span className="absolute -top-1 -right-2 bg-white text-black text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full">
                                        {cartItemCount}
                                    </span>
                                </div>
                                <span className="font-semibold">Ver Escolhidos da Vez</span>
                            </div>
                            <span className="font-bold">
                                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })
                                    .format(cartItems.reduce((acc, i) => acc + (i.price * i.quantity), 0))}
                            </span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                items={cartItems}
                onRemove={handleRemoveFromCart}
                onClear={() => { setCartItems([]); setIsCartOpen(false); }}
            />
        </div>
    );
}
