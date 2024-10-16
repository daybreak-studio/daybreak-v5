import { type SchemaTypeDefinition } from "sanity";

import { home } from "./schemaTypes/home";
import { work, preview, caseStudy } from "./schemaTypes/works";
import { services } from "./schemaTypes/services";
import { settings } from "./schemaTypes/settings";
import { team } from "./schemaTypes/team";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [home, work, preview, caseStudy, services, settings, team],
};
