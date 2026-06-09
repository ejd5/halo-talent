import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const creatorId = formData.get("creatorId") as string || "unknown";

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
    }

    const uploaded: {
      id: string;
      title: string;
      url: string;
      type: string;
      mime_type: string;
      file_size: number;
      creator_id: string;
      thumbnail_url: string | null;
    }[] = [];

    for (const file of files) {
      const id = `med-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const type = file.type.startsWith("image/") ? "image"
        : file.type.startsWith("video/") ? "video"
        : file.type.startsWith("audio/") ? "audio"
        : "document";

      // In production: upload to Supabase Storage or Cloudflare R2
      // const { data, error } = await supabase.storage
      //   .from("media-library")
      //   .upload(`${creatorId}/${id}-${file.name}`, file, {
      //     cacheControl: "3600",
      //     upsert: false,
      //   });
      //
      // For media in the "Talent Premium" department:
      // Encryption at rest:
      // const encrypted = await encrypt(file, creatorKey);
      // await supabase.storage.from("media-library-sensitive").upload(path, encrypted);

      // Mock: return data URL for local development
      const buffer = await file.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      const dataUrl = `data:${file.type};base64,${base64}`;

      uploaded.push({
        id,
        title: file.name.replace(/\.[^/.]+$/, ""),
        url: dataUrl,
        type,
        mime_type: file.type,
        file_size: file.size,
        creator_id: creatorId,
        thumbnail_url: type === "image" ? dataUrl : null,
      });
    }

    return NextResponse.json({
      success: true,
      items: uploaded,
      message: `${uploaded.length} fichier(s) uploadé(s) avec succès`,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Erreur lors de l'upload" }, { status: 500 });
  }
}

// Increase body size limit for file uploads
export const config = {
  api: {
    bodyParser: false,
    responseLimit: "100mb",
  },
};
