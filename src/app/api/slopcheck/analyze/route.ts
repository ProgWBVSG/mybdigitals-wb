import { NextResponse } from "next/server";
import { analyze, analyzeFiles, AnalyzeError, type UploadedFile } from "@/lib/analyzer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Rate limit simple en memoria: alcanza para una herramienta gratuita. */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 12;
const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "anon";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Demasiados análisis seguidos. Esperá un minuto y probá de nuevo." },
      { status: 429 },
    );
  }

  try {
    const contentType = req.headers.get("content-type") ?? "";
    const result = contentType.includes("multipart/form-data")
      ? await analyzeFiles(await readUploads(req))
      : await analyze(await readUrl(req));
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof AnalyzeError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("[analyze] error inesperado", err);
    return NextResponse.json(
      { error: "No se pudo completar el análisis. Si era una URL, puede estar bloqueando bots o caída." },
      { status: 502 },
    );
  }
}

async function readUrl(req: Request): Promise<string> {
  let url: unknown;
  try {
    ({ url } = await req.json());
  } catch {
    throw new AnalyzeError("No se pudo leer el pedido.");
  }
  if (typeof url !== "string" || url.length > 2000) {
    throw new AnalyzeError("Pegá una URL válida.");
  }
  return url;
}

async function readUploads(req: Request): Promise<UploadedFile[]> {
  const form = await req.formData();
  const entries = form.getAll("files").filter((f): f is File => f instanceof File);
  if (!entries.length) throw new AnalyzeError("No llegó ningún archivo.");

  const total = entries.reduce((n, f) => n + f.size, 0);
  if (total > MAX_UPLOAD_BYTES) {
    throw new AnalyzeError("Los archivos superan los 12 MB. Subí solo el HTML, el CSS y el JS.");
  }

  return Promise.all(
    entries.map(async (file) => ({
      name: file.name,
      bytes: new Uint8Array(await file.arrayBuffer()),
    })),
  );
}
