import { type SchemaTypeDefinition } from "sanity";

import { home } from "./schemas/home";
import { work, preview, caseStudy } from "./schemas/works";
import { services } from "./schemas/services";
import { settings } from "./schemas/settings";
import { team } from "./schemas/team";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [home, work, preview, caseStudy, services, settings, team],
};
