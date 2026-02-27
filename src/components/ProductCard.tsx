export interface Product {
    id: string;
    category_id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    is_featured?: boolean;
}

import { Plus } from "lucide-react";
import Image from "next/image";

export function ProductCard({ product, onAdd }: { product: Product, onAdd: (p: Product) => void }) {
    return (
        <div className="flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden h-full">
            {product.image_url ? (
                <div className="relative w-full h-48 sm:h-56 shrink-0 bg-gray-50 border-b border-gray-50">
                    <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                </div>
            ) : null}

            <div className="p-5 flex flex-1 flex-col justify-between">
                <div>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight">{product.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mt-2 mb-4">
                        {product.description}
                    </p>
                </div>

                <div className="flex items-center justify-between mt-auto pt-2">
                    <span className="font-bold text-lg">
                        {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                        }).format(product.price)}
                    </span>
                    <button
                        onClick={() => onAdd(product)}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white hover:scale-105 active:scale-95 transition-transform"
                    >
                        <Plus size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
