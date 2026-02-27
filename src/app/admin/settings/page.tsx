"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Clock, Key, Save } from "lucide-react";

type StoreHours = {
    openTime: string;
    closeTime: string;
    isOpenToday: boolean;
};

export default function SettingsPage() {
    const supabase = createClient();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [dbId, setDbId] = useState<number | null>(null);
    const [hours, setHours] = useState<StoreHours>({
        openTime: "08:00",
        closeTime: "22:00",
        isOpenToday: true,
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setIsLoading(true);
        const { data, error } = await supabase.from("settings").select("*").eq("key", "store_hours").single();
        if (data && data.value) {
            setDbId(data.id);
            setHours(data.value as StoreHours);
        }
        setIsLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        if (dbId) {
            const { error } = await supabase.from("settings").update({ value: hours }).eq("id", dbId);
            if (error) alert("Erro ao salvar: " + error.message);
            else alert("Configurações salvas com sucesso!");
        } else {
            const { data, error } = await supabase.from("settings").insert({ key: "store_hours", value: hours }).select().single();
            if (error) alert("Erro ao criar: " + error.message);
            else if (data) {
                setDbId(data.id);
                alert("Configurações salvas!");
            }
        }

        setIsSaving(false);
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Configurações da Loja</h1>
                <p className="text-gray-500 text-sm">Gerencie o funcionamento automático da Padoca</p>
            </div>

            {isLoading ? (
                <div className="p-8 text-center text-gray-500">Carregando configurações...</div>
            ) : (
                <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-8">

                    <div>
                        <div className="flex items-center gap-3 mb-4 text-gray-900">
                            <Clock size={20} className="text-blue-500" />
                            <h2 className="text-lg font-bold">Horário de Funcionamento (Automático)</h2>
                        </div>
                        <p className="text-sm text-gray-500 mb-6">
                            O sistema acende a luz de "Aberto" para o cliente automaticamente cruzando essa configuração com o fuso horário de São Paulo (BRT).
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 bg-gray-50 rounded-xl border border-gray-100">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Abre às:</label>
                                <input
                                    type="time"
                                    value={hours.openTime}
                                    onChange={(e) => setHours({ ...hours, openTime: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black bg-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha às:</label>
                                <input
                                    type="time"
                                    value={hours.closeTime}
                                    onChange={(e) => setHours({ ...hours, closeTime: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black bg-white"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <label className="flex items-start gap-4 cursor-pointer p-5 border border-amber-200 bg-amber-50 rounded-xl transition-colors">
                            <div className="pt-0.5">
                                <input
                                    type="checkbox"
                                    checked={hours.isOpenToday}
                                    onChange={e => setHours({ ...hours, isOpenToday: e.target.checked })}
                                    className="w-5 h-5 rounded border-amber-300 text-amber-600 focus:ring-amber-600"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-base font-bold text-amber-900">A Padoca vai abrir hoje?</span>
                                <span className="text-sm text-amber-700 mt-1">
                                    Desmarque esta caixa caso seja feriado ou ocorra algum imprevisto. Se estiver desmarcada, o app vai exibir "Fechado" o dia inteiro, ignorando o horário acima.
                                </span>
                            </div>
                        </label>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex items-center gap-2 px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-black/20 disabled:opacity-50"
                        >
                            <Save size={18} />
                            {isSaving ? "Salvando..." : "Salvar Configurações"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
