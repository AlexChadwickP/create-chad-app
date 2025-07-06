import AuthProvider from "@/components/providers/session-provider";
import TRPCProvider from "@/components/providers/trpc-provider";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body>
        <AuthProvider>
            <TRPCProvider>
                {children}
            </TRPCProvider>
        </AuthProvider>
        </body>
        </html>
    );
}