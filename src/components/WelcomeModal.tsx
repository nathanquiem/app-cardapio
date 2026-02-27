"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function WelcomeModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [isWelcoming, setIsWelcoming] = useState(false);

    useEffect(() => {
        // Check if user already has a session
        const storedUuid = localStorage.getItem("padoca_session_uuid");
        const storedName = localStorage.getItem("padoca_session_name");

        if (!storedUuid || !storedName) {
            setIsOpen(true);
        }
    }, []);

    const handleStart = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        // Generate a simple UUID v4
        const uuid = crypto.randomUUID();

        // Save to local storage
        localStorage.setItem("padoca_session_uuid", uuid);
        localStorage.setItem("padoca_session_name", name.trim());

        // Dispatch an event so the Header updates immediately without a page reload
        window.dispatchEvent(new Event("padoca_session_updated"));

        // Trigger the welcome animation
        setIsWelcoming(true);

        // Wait 2.5 seconds, then close the modal to reveal the app
        setTimeout(() => {
            setIsOpen(false);
        }, 2500);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#fafafa]/80 backdrop-blur-xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="w-full max-w-md bg-white rounded-3xl shadow-2xl flex flex-col items-center overflow-hidden"
                    >
                        {isWelcoming ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center p-12 gap-6 w-full"
                            >
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="relative w-32 h-32 rounded-[2rem] overflow-hidden shadow-sm"
                                >
                                    <Image
                                        src="https://hwmvywetjjruabfvgabf.supabase.co/storage/v1/object/public/product-images/padoca_logo.png"
                                        alt="A Padoca"
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </motion.div>
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="flex flex-col items-center"
                                >
                                    <h1 className="text-2xl font-bold text-center text-gray-500">
                                        Boas-vindas,<br />
                                        <span className="text-black text-3xl">{name.trim()}!</span>
                                    </h1>
                                </motion.div>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                    className="text-sm font-medium text-gray-400 mt-2 animate-pulse"
                                >
                                    Preparando seu cardápio...
                                </motion.p>
                            </motion.div>
                        ) : (
                            <div className="w-full p-8 flex flex-col items-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden">
                                    <Image src="https://hwmvywetjjruabfvgabf.supabase.co/storage/v1/object/public/product-images/padoca_logo.png" alt="Logo" fill className="object-cover opacity-50" />
                                </div>
                                <h2 className="text-2xl font-bold mb-2 text-center">A Padoca</h2>
                                <p className="text-gray-500 mb-8 text-center text-sm px-4">
                                    Por favor, nos diga como podemos te chamar para organizar seu pedido na mesa.
                                </p>

                                <form onSubmit={handleStart} className="w-full flex flex-col gap-4">
                                    <input
                                        type="text"
                                        placeholder="Seu nome ou apelido..."
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:outline-none focus:ring-2 focus:ring-black transition-all text-center font-medium text-lg placeholder:text-gray-400"
                                        required
                                        autoFocus
                                        maxLength={20}
                                    />
                                    <button
                                        type="submit"
                                        className="w-full py-4 mt-2 bg-black text-white rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-95 transition-transform shadow-lg shadow-black/20"
                                    >
                                        Acessar Cardápio
                                    </button>
                                </form>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
