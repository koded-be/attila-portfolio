import {
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

class ProjectImageStorage {
  #bucket = process.env.NEON_STORAGE_PROJECT_IMAGE_BUCKET!;

  #client = new S3Client({
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_ENDPOINT_URL_S3,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    forcePathStyle: true,
  });

  async uploadProjectImage(projectId: string, file: File) {
    const filePath = `${projectId}/${file.name}`;

    try {
      await this.#client.send(
        new PutObjectCommand({
          Bucket: this.#bucket,
          Key: filePath,
          Body: new Uint8Array(await file.arrayBuffer()),
          ContentType: file.type,
        }),
      );
    } catch (error) {
      console.error("Error uploading project image:", error);
      return null;
    }

    return filePath;
  }

  async downloadProjectImage(projectId: string, fileName: string) {
    const filePath = `${projectId}/${fileName}`;

    try {
      const { Body } = await this.#client.send(
        new GetObjectCommand({ Bucket: this.#bucket, Key: filePath }),
      );
      return Body ?? null;
    } catch (error) {
      console.error("Error downloading project image:", error);
      return null;
    }
  }

  async deleteProjectImages(projectId: string) {
    const { Contents } = await this.#client.send(
      new ListObjectsV2Command({
        Bucket: this.#bucket,
        Prefix: `${projectId}/`,
      }),
    );
    if (!Contents?.length) return;

    await this.#client.send(
      new DeleteObjectsCommand({
        Bucket: this.#bucket,
        Delete: { Objects: Contents.map(({ Key }) => ({ Key })) },
      }),
    );
  }

  async uploadResume(file: File) {
    await this.#client.send(
      new PutObjectCommand({
        Bucket: process.env.NEON_STORAGE_VARIOUS_BUCKET!,
        Key: "resume.pdf",
        Body: new Uint8Array(await file.arrayBuffer()),
        ContentType: "application/pdf",
        CacheControl: "no-cache",
      }),
    );
  }

  getResumeUrl() {
    return `${process.env.NEON_STORAGE_PUBLIC_URL}/${process.env.NEON_STORAGE_VARIOUS_BUCKET}/resume.pdf`;
  }

  // Public bucket: returns an instant URL, no network request needed
  getProjectImageUrl(projectId: string, fileName: string) {
    const filePath = `${projectId}/${fileName}`;
    return `${process.env.NEON_STORAGE_PUBLIC_URL}/${this.#bucket}/${filePath}`;
  }
}

export const projectImageStorage = new ProjectImageStorage();
