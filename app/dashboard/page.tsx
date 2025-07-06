"use client";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { api } from "@/lib/api";
import {useEffect} from "react";

export default function Dashboard() {
    const { data: session, status } = useSession();
    const { data: currentUser } = api.user.getCurrent.useQuery();
    const { data: allUsers } = api.user.getAll.useQuery();

    useEffect(() => {
        console.log(allUsers);
    }, [allUsers]);

    if (status === "loading") {
        return <div className="p-8">Loading...</div>;
    }

    if (!session) {
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <Button onClick={() => signOut()} variant="outline">
        Sign Out
    </Button>
    </div>

    <div className="space-y-4">
    <p className="text-gray-600">
        Welcome back, {currentUser?.name || currentUser?.email}!
        </p>

    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
    <h3 className="font-semibold text-green-900 mb-2">✅ tRPC is working!</h3>
    <p className="text-sm text-green-800">
        Total users in database: {allUsers?.length || 0}
    </p>
    </div>
    </div>
    </div>
    </div>
    </div>
);
}