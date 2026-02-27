"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Edit2, Trash2, X } from "lucide-react";

type Category = {
    id: string;
    name: string;
    active: boolean;
    order: number;
};

export default function CategoriesPage() {
    const supabase = createClient();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: "", active: true, order: 0 });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setIsLoading(true);
        const { data, error } = await supabase.from("categories").select("*").order("order", { ascending: true });
        if (data) setCategories(data);
        setIsLoading(false);
    };

    const handleOpenModal = (category?: Category) => {
        if (category) {
            setEditingId(category.id);
            setFormData({ name: category.name, active: category.active, order: category.order || 0 });
        } else {
            setEditingId(null);
            setFormData({ name: "", active: true, order: categories.length + 1 });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editingId) {
            // Update
            const { error } = await supabase.from("categories").update(formData).eq("id", editingId);
            if (!error) {
                setCategories(categories.map(c => c.id === editingId ? { ...c, ...formData } : c));
            }
        } else {
            // Create
            const { data, error } = await supabase.from("categories").insert(formData).select().single();
            if (data) {
                setCategories([...categories, data].sort((a, b) => a.order - b.order));
            }
        }
        handleCloseModal();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta categoria? Os produtos atrelados poderão ficar órfãos.")) return;

        const { error } = await supabase.from("categories").delete().eq("id", id);
        if (!error) {
            setCategories(categories.filter(c => c.id !== id));
        } else {
            alert("Erro ao excluir: " + error.message);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Categorias</h1>
                    <p className="text-gray-500 text-sm">Gerencie as seções do seu cardápio</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center gap-2 bg-black text-white px-4 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors"
                >
                    <Plus size={18} />
                    Nova Categoria
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="p-4 font-semibold text-gray-600">Ordem</th>
                                <th className="p-4 font-semibold text-gray-600">Nome</th>
                                <th className="p-4 font-semibold text-gray-600">Status</th>
                                <th className="p-4 font-semibold text-gray-600 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={4} className="p-8 text-center text-gray-500">Carregando...</td></tr>
                            ) : categories.length === 0 ? (
                                <tr><td colSpan={4} className="p-8 text-center text-gray-500">Nenhuma categoria encontrada.</td></tr>
                            ) : (
                                categories.map((cat) => (
                                    <tr key={cat.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4 font-medium text-gray-500">{cat.order}</td>
                                        <td className="p-4 font-bold text-gray-900">{cat.name}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${cat.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                {cat.active ? 'Ativa' : 'Inativa'}
                                            </span>
                                        </td>
                                        <td className="p-4 flex items-center justify-end gap-2">
                                            <button onClick={() => handleOpenModal(cat)} className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors">
                                                <Edit2 size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(cat.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold">{editingId ? 'Editar Categoria' : 'Nova Categoria'}</h2>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-black transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Nome</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
                                    required
                                    placeholder="Ex: Hambúrgueres"
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Ordem (Posição)</label>
                                    <input
                                        type="number"
                                        value={formData.order}
                                        onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-end">
                                    <label className="flex items-center gap-2 cursor-pointer p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={formData.active}
                                            onChange={e => setFormData({ ...formData, active: e.target.checked })}
                                            className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                                        />
                                        <span className="text-sm font-semibold text-gray-700">Está Ativa?</span>
                                    </label>
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={handleCloseModal} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors">Cancelar</button>
                                <button type="submit" className="px-5 py-2.5 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-colors">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
