import { SupabaseClient } from "@supabase/supabase-js";

export class ProjectImageStorage {
  private client: SupabaseClient;
  private bucket: string = "project_images";

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  async uploadProjectImage(projectId: string, file: File) {
    const filePath = `${projectId}/${file.name}`;

    const { data, error } = await this.client.storage
      .from(this.bucket)
      .upload(filePath, file, { upsert: true });

    if (error) {
      console.error("Error uploading project image:", error);
      return null;
    }

    return data?.fullPath ?? null;
  }

  async downloadProjectImage(projectId: string, fileName: string) {
    const filePath = `${projectId}/${fileName}`;
    const { data, error } = await this.client.storage
      .from(this.bucket)
      .download(filePath);

    if (error) {
      console.error("Error uploading project image:", error);
      return null;
    }

    if (!data) {
      console.error("Image download returned no data.");
      return null;
    }

    return data;
  }

  // Public bucket: returns an instant URL, no network request needed
  getProjectImageUrl(projectId: string, fileName: string) {
    const filePath = `${projectId}/${fileName}`;
    const { data } = this.client.storage
      .from(this.bucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  // Private bucket: returns a temporary signed URL (async, network request)
  async getSignedProjectImageUrl(
    projectId: string,
    fileName: string,
    expiresInSeconds: number = 60 * 60,
  ) {
    const filePath = `${projectId}/${fileName}`;
    const { data, error } = await this.client.storage
      .from(this.bucket)
      .createSignedUrl(filePath, expiresInSeconds);

    if (error) {
      console.error("Error creating signed URL:", error);
      return null;
    }

    return data?.signedUrl ?? null;
  }
}
