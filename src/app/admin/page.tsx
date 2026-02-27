import { Store, ShoppingBag, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
    const supabase = await createClient();

    // Fetch stats
    const { count: productsCount } = await supabase.from("products").select("*", { count: "exact", head: true });
    const { count: categoriesCount } = await supabase.from("categories").select("*", { count: "exact", head: true });
    const { count: sessionsCount } = await supabase.from("sessions").select("*", { count: "exact", head: true });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">Visão geral da sua padaria digital.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                        <ShoppingBag size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Produtos Cadastrados</p>
                        <h3 className="text-2xl font-bold text-gray-900">{productsCount || 0}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0">
                        <Store size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Categorias Ativas</p>
                        <h3 className="text-2xl font-bold text-gray-900">{categoriesCount || 0}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center shrink-0">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Acessos à Mesa</p>
                        <h3 className="text-2xl font-bold text-gray-900">{sessionsCount || 0}</h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-lg mb-4">Ações Rápidas</h3>
                    <div className="space-y-3">
                        <Link href="/admin/products" className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-300 transition-colors">
                            <div>
                                <h4 className="font-semibold text-gray-900">Gerenciar Produtos</h4>
                                <p className="text-sm text-gray-500">Adicione ou edite os itens do cardápio</p>
                            </div>
                            <span className="text-gray-400">→</span>
                        </Link>
                        <Link href="/admin/settings" className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-300 transition-colors">
                            <div>
                                <h4 className="font-semibold text-gray-900">Horário de Funcionamento</h4>
                                <p className="text-sm text-gray-500">Ajuste o status de Aberto/Fechado automático</p>
                            </div>
                            <span className="text-gray-400">→</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
