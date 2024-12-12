import { type SchemaTypeDefinition } from "sanity";

import { home } from "./schemas/home";
import { clients, preview, caseStudy } from "./schemas/clients";
import { services } from "./schemas/services";
import { settings } from "./schemas/settings";
import { team } from "./schemas/team";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [home, clients, preview, caseStudy, services, settings, team],
};
