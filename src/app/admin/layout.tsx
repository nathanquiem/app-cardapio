import Link from "next/link";
import { LayoutDashboard, Package, Tags, Settings, Store } from "lucide-react";

// Force all admin pages to be dynamic (server-rendered on demand)
// This prevents build-time errors when env vars are not available
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-white border-r border-gray-200 shrink-0">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Padoca Admin</h1>
                        <p className="text-sm text-gray-500">Gestão do Cardápio</p>
                    </div>
                </div>
                <nav className="p-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition-colors shrink-0">
                        <LayoutDashboard size={20} />
                        <span className="hidden md:inline">Dashboard</span>
                    </Link>
                    <Link href="/admin/categories" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition-colors shrink-0">
                        <Tags size={20} />
                        <span className="hidden md:inline">Categorias</span>
                    </Link>
                    <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition-colors shrink-0">
                        <Package size={20} />
                        <span className="hidden md:inline">Produtos</span>
                    </Link>
                    <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition-colors shrink-0">
                        <Settings size={20} />
                        <span className="hidden md:inline">Configurações</span>
                    </Link>
                </nav>
                <div className="p-4 mt-auto hidden md:block">
                    <Link href="/" target="_blank" className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-black text-white hover:bg-gray-800 transition-colors font-medium">
                        <Store size={18} />
                        Acessar Loja
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-4 md:p-8 max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
