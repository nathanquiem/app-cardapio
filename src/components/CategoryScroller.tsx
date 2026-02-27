"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

interface Category {
    id: string;
    name: string;
}

export function CategoryScroller({ categories, activeCategoryId, onSelect }: { categories: Category[], activeCategoryId: string, onSelect: (id: string) => void }) {
    const scrollRef = useRef<HTMLDivElement>(null);

    return (
        <div className="w-full relative bg-[#fafafa]/90 backdrop-blur-md pt-2 pb-2">
            <div
                ref={scrollRef}
                className="flex md:justify-center gap-3 overflow-x-auto px-6 scrollbar-hide pb-1"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {categories.map((cat) => {
                    const isActive = activeCategoryId === cat.id;

                    return (
                        <button
                            key={cat.id}
                            onClick={() => onSelect(cat.id)}
                            className={`relative px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-all ${isActive ? "text-white" : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                                }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeCategory"
                                    className="absolute inset-0 bg-black rounded-full"
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                />
                            )}
                            <span className="relative z-10">{cat.name}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
