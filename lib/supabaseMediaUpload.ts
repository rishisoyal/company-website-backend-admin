import { createSupabaseClient } from "./supabase";

export default async function supabaseMediaUpload(
  file: File
): Promise<string | null> {
  const supabase = await createSupabaseClient();

  const { data, error } = await supabase.storage
    .from("media")
    .upload(`media/${file.name}`, file, {
      contentType: file.type,
      upsert: true,
    });

  if (error) {
    console.log(error);
    return null;
  }

  // return public url
  const urlData = supabase.storage
    .from("media")
    .getPublicUrl(`media/${file.name}`); // path inside the bucket

  if (error) {
    console.error(error);
    return error;
  }
  return urlData.data.publicUrl;
}
