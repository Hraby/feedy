import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/session";

export default async function middleware(req: NextRequest) {
  const session = await getSession();

  if(req.nextUrl.pathname.startsWith("/admin")){
    if (!session)
      return NextResponse.redirect(new URL("/login", req.nextUrl));
  
    if (!Array.isArray(session.user.role) || !session.user.role.includes("Admin")) {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
    
    
  }

  if(req.nextUrl.pathname.startsWith("/profile")){
    if (!session)
      return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  NextResponse.next();
}