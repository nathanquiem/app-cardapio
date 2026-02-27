"use client";

import { ShoppingBag, X, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "./ProductCard";

interface CartItem extends Product {
    quantity: number;
}

export function CartDrawer({
    isOpen,
    onClose,
    items,
    onRemove,
    onClear,
}: {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[];
    onRemove: (id: string) => void;
    onClear: () => void;
}) {
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                        className="fixed bottom-0 left-0 right-0 h-[85vh] bg-white z-50 rounded-t-3xl shadow-2xl flex flex-col"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <ShoppingBag size={20} />
                                <h2 className="text-xl font-bold tracking-tight">Escolhidos da vez</h2>
                                <span className="bg-black text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                    {items.reduce((acc, i) => acc + i.quantity, 0)}
                                </span>
                            </div>
                            <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
                                    <ShoppingBag size={48} className="opacity-20" />
                                    <p>Nenhum item escolhido ainda.</p>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                                        <div className="font-semibold text-lg bg-white w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200">
                                            {item.quantity}x
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium leading-tight">{item.name}</h4>
                                            <p className="text-sm text-gray-500 font-medium">
                                                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(item.price)}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => onRemove(item.id)}
                                            className="text-red-400 hover:text-red-500 p-2"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-gray-500">Estimativa</span>
                                    <span className="text-2xl font-bold">
                                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(total)}
                                    </span>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={onClear}
                                        className="flex-1 py-4 font-medium text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                                    >
                                        Esvaziar
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="flex-[2] py-4 font-medium text-white bg-black rounded-xl hover:bg-gray-800 transition-colors"
                                    >
                                        Voltar pro Cardápio
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
