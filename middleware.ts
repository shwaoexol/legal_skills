import { NextResponse } from "next/server";
import { auth } from "@/auth"


export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const { pathname } = req.nextUrl;

    const isLoginPage = pathname === '/admin/login';
    const isAdminArea = pathname.startsWith('/admin');
    
    if (isAdminArea && !isLoginPage && !isLoggedIn){
        return NextResponse.redirect(new URL('/admin/login', req.url));
    }
});

export const config = {
    matcher: ['/admin/:path*']
};