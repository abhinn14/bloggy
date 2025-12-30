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

  const contentType = req.headers.get("content-type") || "";

  let data: any = undefined;

  if (req.method !== "GET") {
    if (contentType.startsWith("multipart/form-data")) {
      data = Buffer.from(await req.arrayBuffer());
    } else {
      data = await req.json().catch(() => undefined);
    }
  }

  const response = await axios({
    method: req.method,
    url,
    data,
    headers: {
      authorization: req.headers.get("authorization") || "",
      "content-type": contentType,
    },
    validateStatus: () => true,
  });

  return NextResponse.json(response.data, {
    status: response.status,
  });
}

