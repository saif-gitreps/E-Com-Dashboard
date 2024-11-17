import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

type UploadResult = {
   path: string;
   publicUrl: string | null;
};

export async function uploadToSupabase(
   file: File,
   fileType: "product" | "image"
): Promise<UploadResult | null> {
   try {
      const arrayBuffer = await file.arrayBuffer();

      const fileExt = file.name.split(".").pop();
      const fileName = `${fileType}_${Math.random()}.${fileExt}`;
      const filePath = `${fileType}/${fileName}`;

      const { data, error } = await supabase.storage
         .from("products")
         .upload(filePath, arrayBuffer, {
            contentType: file.type,
         });

      if (error) {
         throw error;
      }

      if (fileType === "image") {
         const { data: urlData } = await supabase.storage
            .from("products")
            .getPublicUrl(filePath);

         return {
            path: filePath,
            publicUrl: urlData.publicUrl,
         };
      }

      return {
         path: filePath,
         publicUrl: null,
      };
   } catch (error) {
      console.error("Error uploading to Supabase:", error);
      return null;
   }
}

export async function deleteFromSupabase(path: string): Promise<boolean> {
   try {
      const { error } = await supabase.storage.from("products").remove([path]);

      if (error) throw error;
      return true;
   } catch (error) {
      console.error("Error deleting from Supabase:", error);
      return false;
   }
}

export async function getProductDownloadData(filePath: string) {
   try {
      const { data: fileData, error: downloadError } = await supabase.storage
         .from("products")
         .download(filePath);

      if (downloadError) {
         throw downloadError;
      }

      const extension = filePath.split(".").pop() || "";
      const size = fileData.size;
      const file = await fileData.arrayBuffer();

      return {
         file,
         size,
         extension,
      };
   } catch (error) {
      console.error("Error downloading from Supabase:", error);
      throw error;
   }
}
