import { NextRequest, NextResponse } from "next/server";
import { getServerSideConfig } from "../../config/server";
import md5 from "spark-md5";

const serverConfig = getServerSideConfig();

async function authVerification(req: NextRequest) {
  const accessCode = req.headers.get("access-code");
  const token = req.headers.get("token");
  const hashedCode = md5.hash(accessCode ?? "").trim();

  const isAccessCodeAuthorized = serverConfig.codes.has(hashedCode);
  const isTokenAuthorized = !!token;
  return NextResponse.json({
    isAccessCodeAuthorized,
    isTokenAuthorized,
  });
}
export async function POST(req: NextRequest) {
  return authVerification(req);
}
