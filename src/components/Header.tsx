"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export function Header() {
    const [customerName, setCustomerName] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const fetchName = () => {
            const name = localStorage.getItem("padoca_session_name");
            if (name) {
                setCustomerName(name);
            }
        };

        fetchName();
        window.addEventListener("padoca_session_updated", fetchName);

        const checkStoreStatus = async () => {
            try {
                const supabase = (await import("@/lib/supabase/client")).createClient();
                const { data } = await supabase.from("settings").select("value").eq("key", "store_hours").single();

                if (data && data.value) {
                    const hours = data.value as { openTime: string, closeTime: string, isOpenToday: boolean };

                    if (!hours.isOpenToday) {
                        setIsOpen(false);
                        setIsChecking(false);
                        return;
                    }

                    const spTime = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
                    const currentHour = spTime.getHours();
                    const currentMinute = spTime.getMinutes();
                    const currentTotalMinutes = currentHour * 60 + currentMinute;

                    const [openH, openM] = hours.openTime.split(":").map(Number);
                    const openTotalMinutes = openH * 60 + openM;

                    const [closeH, closeM] = hours.closeTime.split(":").map(Number);
                    const closeTotalMinutes = closeH * 60 + closeM;

                    setIsOpen(currentTotalMinutes >= openTotalMinutes && currentTotalMinutes < closeTotalMinutes);
                } else {
                    setIsOpen(true);
                }
            } catch (err) {
                console.error("Error fetching store status:", err);
                setIsOpen(true);
            } finally {
                setIsChecking(false);
            }
        };

        checkStoreStatus();

        return () => window.removeEventListener("padoca_session_updated", fetchName);
    }, []);

    return (
        <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm">
            {/* Store Status Indicator - Left Side */}
            <div className="flex-1 flex items-center">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${isOpen ? 'bg-green-50/50' : 'bg-red-50/50'}`}>
                    <div
                        className={`w-2.5 h-2.5 rounded-full ${isOpen ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]'}`}
                    ></div>
                    <span className={`text-xs sm:text-sm font-bold tracking-wide ${isOpen ? 'text-green-600 drop-shadow-[0_0_2px_rgba(34,197,94,0.3)]' : 'text-red-600 drop-shadow-[0_0_2px_rgba(239,68,68,0.3)]'}`}>
                        {isOpen ? 'Aberto' : 'Fechado'}
                    </span>
                </div>
            </div>

            {/* Logo - Center */}
            <div className="flex-shrink-0 flex items-center justify-center">
                <div className="relative w-36 h-14 sm:w-48 sm:h-16 rounded-2xl overflow-hidden shadow-sm">
                    <Image
                        src="https://hwmvywetjjruabfvgabf.supabase.co/storage/v1/object/public/product-images/padoca_logo.png"
                        alt="A Padoca"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </div>

            {/* Customer Greeting - Right Side */}
            <div className="flex-1 flex justify-end">
                {customerName ? (
                    <div className="text-xs sm:text-sm font-medium text-gray-700 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full truncate max-w-[100px] sm:max-w-[150px]">
                        Olá, {customerName.split(' ')[0]}
                    </div>
                ) : (
                    <div className="w-[60px]" /* Spacer if no name */ />
                )}
            </div>
        </header>
    );
}
