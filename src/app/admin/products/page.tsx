"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Upload } from "lucide-react";
import Image from "next/image";

type Product = {
    id: string;
    category_id: string;
    name: string;
    description: string;
    price: number;
    image_url: string | null;
    active: boolean;
    is_featured: boolean;
};

type Category = {
    id: string;
    name: string;
};

export default function ProductsPage() {
    const supabase = createClient();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Form state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: 0,
        category_id: "",
        active: true,
        is_featured: false,
        image_url: "" as string | null
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        // Fetch Categories
        const { data: cats } = await supabase.from("categories").select("id, name").order("name");
        if (cats) setCategories(cats);

        // Fetch Products
        const { data: prods } = await supabase.from("products").select("*").order("name");
        if (prods) setProducts(prods);

        setIsLoading(false);
    };

    const handleOpenModal = (product?: Product) => {
        if (product) {
            setEditingId(product.id);
            setFormData({
                name: product.name,
                description: product.description || "",
                price: product.price,
                category_id: product.category_id,
                active: product.active,
                is_featured: product.is_featured || false,
                image_url: product.image_url
            });
        } else {
            setEditingId(null);
            setFormData({
                name: "",
                description: "",
                price: 0,
                category_id: categories.length > 0 ? categories[0].id : "",
                active: true,
                is_featured: false,
                image_url: null
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        if (isUploading) return;
        setIsModalOpen(false);
        setEditingId(null);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from("product-images")
            .upload(fileName, file);

        if (uploadError) {
            alert("Erro ao enviar imagem: " + uploadError.message);
        } else {
            const { data: { publicUrl } } = supabase.storage
                .from("product-images")
                .getPublicUrl(fileName);

            setFormData(prev => ({ ...prev, image_url: publicUrl }));
        }
        setIsUploading(false);
    };

    const handleRemoveImage = () => {
        setFormData(prev => ({ ...prev, image_url: null }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.category_id) {
            alert("Selecione uma categoria!");
            return;
        }

        if (editingId) {
            const { error } = await supabase.from("products").update(formData).eq("id", editingId);
            if (!error) {
                setProducts(products.map(p => p.id === editingId ? { ...p, ...formData, id: editingId } : p));
            } else {
                alert("Erro ao atualizar: " + error.message);
            }
        } else {
            const { data, error } = await supabase.from("products").insert(formData).select().single();
            if (data) {
                setProducts([...products, data]);
            } else if (error) {
                alert("Erro ao criar: " + error.message);
            }
        }
        handleCloseModal();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este produto?")) return;

        const { error } = await supabase.from("products").delete().eq("id", id);
        if (!error) {
            setProducts(products.filter(p => p.id !== id));
        } else {
            alert("Erro ao excluir: " + error.message);
        }
    };

    const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || "Desconhecida";

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Produtos</h1>
                    <p className="text-gray-500 text-sm">Gerencie o cardápio da padaria</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center gap-2 bg-black text-white px-4 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors"
                >
                    <Plus size={18} />
                    Novo Produto
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="p-4 font-semibold text-gray-600 w-16">Foto</th>
                                <th className="p-4 font-semibold text-gray-600">Produto</th>
                                <th className="p-4 font-semibold text-gray-600">Categoria</th>
                                <th className="p-4 font-semibold text-gray-600">Preço</th>
                                <th className="p-4 font-semibold text-gray-600">Status</th>
                                <th className="p-4 font-semibold text-gray-600 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Carregando...</td></tr>
                            ) : products.length === 0 ? (
                                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Nenhum produto encontrado.</td></tr>
                            ) : (
                                products.map((prod) => (
                                    <tr key={prod.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4">
                                            {prod.image_url ? (
                                                <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
                                                    <Image src={prod.image_url} alt={prod.name} fill className="object-cover" />
                                                </div>
                                            ) : (
                                                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                                                    <ImageIcon size={20} />
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-gray-900">{prod.name}</div>
                                            {prod.is_featured && <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full mt-1 inline-block">⭐ Queridinho</span>}
                                        </td>
                                        <td className="p-4 text-gray-600">{getCategoryName(prod.category_id)}</td>
                                        <td className="p-4 font-medium text-gray-900">
                                            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(prod.price)}
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${prod.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                {prod.active ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </td>
                                        <td className="p-4 flex items-center justify-end gap-2 h-[81px]">
                                            <button onClick={() => handleOpenModal(prod)} className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors">
                                                <Edit2 size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(prod.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl my-8">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
                            <h2 className="text-xl font-bold">{editingId ? 'Editar Produto' : 'Novo Produto'}</h2>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-black transition-colors" disabled={isUploading}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Image Upload Area */}
                            <div className="flex flex-col gap-2">
                                <label className="block text-sm font-semibold text-gray-700">Foto do Produto (Opcional)</label>
                                <div className="flex items-end gap-4">
                                    {formData.image_url ? (
                                        <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-gray-200">
                                            <Image src={formData.image_url} alt="Preview" fill className="object-cover" />
                                            <button
                                                type="button"
                                                onClick={handleRemoveImage}
                                                className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full hover:bg-red-500 transition-colors backdrop-blur-md"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="w-32 h-32 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-gray-400">
                                            <ImageIcon size={28} className="mb-2" />
                                            <span className="text-xs font-medium">Sem foto</span>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploading}
                                        className="px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {isUploading ? "Enviando..." : <><Upload size={16} /> Enviar Foto</>}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nome</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
                                        required
                                        placeholder="Ex: Pão de Queijo Recheado"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Descrição</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black min-h-[80px]"
                                        placeholder="Ingredientes e detalhes deliciosos..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Preço (R$)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Categoria</label>
                                    <select
                                        value={formData.category_id}
                                        onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black bg-white"
                                        required
                                    >
                                        <option value="" disabled>Selecione...</option>
                                        {categories.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-2">
                                <label className="flex-1 flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-900">⭐ Queridinho</span>
                                        <span className="text-xs text-gray-500">Aparece no topo inicial</span>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={formData.is_featured}
                                        onChange={e => setFormData({ ...formData, is_featured: e.target.checked })}
                                        className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                                    />
                                </label>
                                <label className="flex-1 flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-900">✅ Ativo no Cardápio</span>
                                        <span className="text-xs text-gray-500">Visível aos clientes</span>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={formData.active}
                                        onChange={e => setFormData({ ...formData, active: e.target.checked })}
                                        className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                                    />
                                </label>
                            </div>

                            <div className="pt-4 mt-2 flex justify-end gap-3 sticky bottom-0 bg-white border-t border-gray-50 -mx-6 -mb-6 p-6 rounded-b-2xl shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
                                <button type="button" onClick={handleCloseModal} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors" disabled={isUploading}>Cancelar</button>
                                <button type="submit" className="px-5 py-2.5 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-black/20" disabled={isUploading}>
                                    Salvar Produto
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
