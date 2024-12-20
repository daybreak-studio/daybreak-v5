"use client";

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { schema } from "@/sanity/schema";
import {
  singletonPlugin,
  singletonStructure,
} from "@/sanity/plugins/singleton";
import { muxInput } from "sanity-plugin-mux-input";

const singletonTypes = ["settings", "home", "team", "services"];
const schemaTypes = schema.types;

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schema' folder
  schema,
  plugins: [
    structureTool({
      structure: singletonStructure(singletonTypes, schemaTypes),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
    singletonPlugin({ types: singletonTypes }),
    muxInput({
      mp4_support: "standard",
    }),
  ],
});
