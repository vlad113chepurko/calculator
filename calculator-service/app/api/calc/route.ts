"use server";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const { expression } = await req.json();
  const authHeader = req.headers.get("authorization");
  if (!authHeader)
    return NextResponse.json({ error: "Missing token" }, { status: 401 });

  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  try {
    const result = eval(expression);
    return NextResponse.json({ result });
  } catch {
    return NextResponse.json({ error: "Invalid expression" }, { status: 400 });
  }
}