import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_API_GATEWAY as string;

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

export async function GET(req: NextRequest, context: RouteContext) {
  return proxy(req, context);
}

export async function POST(req: NextRequest, context: RouteContext) {
  return proxy(req, context);
}

export async function PUT(req: NextRequest, context: RouteContext) {
  return proxy(req, context);
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  return proxy(req, context);
}

async function proxy(req: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  const url = `${BACKEND_BASE_URL}/${path.join("/")}`;

  try {
    const response = await axios({
      method: req.method,
      url,
      params: Object.fromEntries(req.nextUrl.searchParams),
      data:
        req.method !== "GET"
          ? await req.json().catch(() => undefined)
          : undefined,
      headers: {
        authorization: req.headers.get("authorization") || "",
        "content-type": req.headers.get("content-type") || "application/json",
      },
      validateStatus: () => true,
    });

    return NextResponse.json(response.data, {
      status: response.status,
    });
  } catch (err: any) {
    return NextResponse.json(
      { message: "Proxy error", error: err.message },
      { status: 500 }
    );
  }
}
