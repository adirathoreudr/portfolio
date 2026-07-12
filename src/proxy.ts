import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0] ?? "";

  if (host === "cv.adiisingh.xyz" || host.startsWith("cv.")) {
    return NextResponse.rewrite(new URL("/resume.pdf", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/",
};
