import { getCookie } from "cookies-next";
import { NextRequest, NextResponse } from "next/server";

const authenticationPages = [
  "/login", "/register",
]

const privatePageWhitelist = [
  "/",
  "/clientsidefetch",
  "/serversidefetch",
];

function authenticationPageMiddleware(req: NextRequest) {  
  const jwt = (req.cookies.get("jwt") ?? "").trim();
  const rToken = (req.cookies.get("rToken") ?? "").trim();
  if (rToken && jwt) {
    return NextResponse.redirect(new URL(`/`, req.url));
  }
  return NextResponse.next();
}

function privatePageMiddleware(req: NextRequest) {
  const jwt = (req.cookies.get("jwt") ?? "").trim();
  const rToken = (req.cookies.get("rToken") ?? "").trim();
  if (rToken && jwt) {
    return NextResponse.next();
  }
  const loginUrl = new URL(`/login`, req.url);
  loginUrl.searchParams.set("from", req.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

function apiGlobalMiddleware(req: NextRequest) {
  return NextResponse.next();
}

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/api")) {
    return apiGlobalMiddleware(req);
  }
  if (privatePageWhitelist.includes(req.nextUrl.pathname)) {
    return privatePageMiddleware(req);
  }
  if (authenticationPages.includes(req.nextUrl.pathname)) {
    return authenticationPageMiddleware(req);
  }
}
