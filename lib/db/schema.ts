import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// All image fields are filenames under the project's `{projectId}/` storage prefix
export type Scene = {
  title: string;
  objects: number;
  triangles: number;
  renderImage: string;
  viewportImage: string;
};

export type Texturing = {
  text: string;
  paletteImage: string;
  uvImages: string[];
};

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title"),
  text: text("text"),
  images: jsonb("images").$type<string[]>(),
  software: text("software"),
  projectType: text("project_type"),
  heroImage: text("hero_image"),
  scenes: jsonb("scenes").$type<Scene[]>(),
  texturing: jsonb("texturing").$type<Texturing>(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
