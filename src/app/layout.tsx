import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "A Padoca - Cardápio Digital",
    description: "Faça seu pedido na hora.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <body suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}
