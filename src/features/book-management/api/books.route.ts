import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/shared/api/api-handler";
import { bookRepository } from "@/core/repositories/book.repo";
import { getSession } from "@/core/services/auth.service";
import { ValidationError, UnauthorizedError } from "@/shared/lib/errors";
import { CreateBookServerSchema } from "@/entities/book";
import { promises as fs } from "fs";
import path from "path";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session) throw new UnauthorizedError();

  const sp = new URL(req.url).searchParams;
  const page = Number(sp.get("page") ?? "1");
  const pageSize = Number(sp.get("pageSize") ?? "10");
  const data = await bookRepository.paginate({
    page,
    pageSize,
    userId: session.sub,
  });
  return NextResponse.json(data);
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session) throw new UnauthorizedError();

  const form = await req.formData();
  const title = form.get("title");
  const author = form.get("author");
  const file = form.get("file");

  const parsed = CreateBookServerSchema.safeParse({ title, author });
  if (!parsed.success) throw parsed.error;

  if (!(file instanceof File))
    throw new ValidationError("PDF file is required");
  if (file.type !== "application/pdf")
    throw new ValidationError("Only PDF allowed");
  if (file.size > 30 * 1024 * 1024) throw new ValidationError("Max 30MB");

  const created = await bookRepository.create({
    title: parsed.data.title,
    author: parsed.data.author,
    userId: session.sub,
  });

  const buf = Buffer.from(await file.arrayBuffer());
  const userDirRel = path.posix.join("books", session.sub);
  const fileRel = path.posix.join(userDirRel, `${created.id}.pdf`);

  const userDirAbs = path.join(process.cwd(), userDirRel);
  const fileAbs = path.join(userDirAbs, `${created.id}.pdf`);

  await fs.mkdir(userDirAbs, { recursive: true });
  await fs.writeFile(fileAbs, buf);

  await bookRepository.updatePath(created.id, fileRel);
  return NextResponse.json({ id: created.id }, { status: 201 });
});
