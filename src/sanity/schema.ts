import { type SchemaTypeDefinition } from "sanity";

// import { blockContentType } from "./schemaTypes/blockContentType";
// import { categoryType } from "./schemaTypes/categoryType";
// import { postType } from "./schemaTypes/postType";
// import { authorType } from "./schemaTypes/authorType";
import { home } from "./schemaTypes/home";
import { services } from "./schemaTypes/services";
import { preview } from "./schemaTypes/preview";
import { work } from "./schemaTypes/work";
import { caseStudy } from "./schemaTypes/caseStudy";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [home, caseStudy, preview, services, work],
};
