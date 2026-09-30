import { error } from "console";
import { NextResponse } from "next/server";
import { auth } from "@/auth";


export async function requireAdmin() {
    const session = await auth();

    if (!session?.user) {
        return { error: NextResponse.json({error: 'Не авторизован'}, { status: 401 })};
    }
}