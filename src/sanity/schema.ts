import { type SchemaTypeDefinition } from "sanity";

// import { blockContentType } from "./schemaTypes/blockContentType";
// import { categoryType } from "./schemaTypes/categoryType";
// import { postType } from "./schemaTypes/postType";
// import { authorType } from "./schemaTypes/authorType";
import { home } from "./schemaTypes/home";
import { services } from "./schemaTypes/services";
import { preview } from "./schemaTypes/preview";
import { work, project } from "./schemaTypes/work";
import { caseStudy } from "./schemaTypes/caseStudy";
import { settings } from "./schemaTypes/settings";
import { team } from "./schemaTypes/team";
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [home, caseStudy, preview, services, work, project, settings, team],
};
