import { MediaItem } from "@/sanity/lib/media";
import type { Home } from "@/sanity/types";

// Extract widget types from Home type
type SanityWidgets = NonNullable<Home["widgets"]>;
export type Widget = SanityWidgets[number];
export type WidgetType = Widget["_type"];

// Individual widget types if needed for specific components
export type TwitterWidgetTypes = Extract<Widget, { _type: "twitter" }>;
export type MediaWidgetTypes = Extract<Widget, { _type: "media" }>;
export type ProjectWidgetTypes = Extract<Widget, { _type: "project" }>;
export type RecentsWidgetTypes = Extract<Widget, { _type: "recents" }>;
export type RiveWidgetTypes = Extract<Widget, { _type: "rive" }>;
export type QuotesWidgetTypes = Extract<Widget, { _type: "quotes" }>;
export type StagesWidgetTypes = Extract<Widget, { _type: "stages" }>;
export type CTAWidgetTypes = Extract<Widget, { _type: "cta" }>;
export type TeamWidgetTypes = Extract<Widget, { _type: "team" }>;

// export type WidgetRegistry = {
//   [K in WidgetType]: React.ComponentType<{
//     data: Extract<Widget, { _type: K }>;
//   }>;
// };

export type WidgetRegistry = Record<string, React.ComponentType<{ data: any }>>;
