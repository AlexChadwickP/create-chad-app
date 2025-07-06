"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-2xl mx-auto text-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        🚀 Create Chad App
                    </h1>

                    <p className="text-xl text-gray-600 mb-8">
                        The opinionated full-stack template for building apps fast
                    </p>

                    <div className="bg-gray-50 rounded-lg p-6 mb-8">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">What's included:</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                                <span className="text-green-500 mr-2">✓</span>
                                Next.js 14 with App Router
                            </div>
                            <div className="flex items-center">
                                <span className="text-green-500 mr-2">✓</span>
                                TypeScript & Tailwind CSS
                            </div>
                            <div className="flex items-center">
                                <span className="text-green-500 mr-2">✓</span>
                                Keycloak Authentication
                            </div>
                            <div className="flex items-center">
                                <span className="text-green-500 mr-2">✓</span>
                                PostgreSQL with Drizzle ORM
                            </div>
                            <div className="flex items-center">
                                <span className="text-green-500 mr-2">✓</span>
                                tRPC
                            </div>
                            <div className="flex items-center">
                                <span className="text-green-500 mr-2">✓</span>
                                Ready for production
                            </div>
                        </div>
                    </div>

                    {session ? (
                        <div className="space-y-4">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <p className="text-green-800">
                                    Welcome back, <span className="font-semibold">{session.user?.name || session.user?.email}</span>!
                                </p>
                                <p className="text-sm text-green-600 mt-1">
                                    You&apos;re authenticated and ready to build.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    onClick={() => signOut()}
                                    variant="outline"
                                    className="px-8 py-2"
                                >
                                    Sign Out
                                </Button>
                                <Button
                                    onClick={() => window.open('/dashboard', '_self')}
                                    className="px-8 py-2"
                                >
                                    Go to Dashboard
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-gray-600">
                                Get started by signing in with Keycloak
                            </p>
                            <Button
                                onClick={() => signIn("keycloak")}
                                size="lg"
                                className="px-8 py-3 text-lg"
                            >
                                Sign In with Keycloak
                            </Button>
                        </div>
                    )}

                    <div className="mt-8 pt-8 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                            Built with ❤️ for developers who want to ship fast
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}