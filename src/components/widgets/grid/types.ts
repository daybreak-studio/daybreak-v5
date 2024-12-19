import { MediaItem } from "@/sanity/lib/media";
import type { Home } from "@/sanity/types";

// Extract widget types from Home type
type SanityWidgets = NonNullable<Home["widgets"]>;
export type Widget = SanityWidgets[number];
export type WidgetType = Widget["_type"];

// Individual widget types if needed for specific components
export type TwitterWidget = Extract<Widget, { _type: "twitter" }>;
export type MediaWidget = Extract<Widget, { _type: "media" }>;
export type ProjectWidget = Extract<Widget, { _type: "project" }>;
export type RecentsWidget = Extract<Widget, { _type: "recents" }>;
export type RiveWidget = Extract<Widget, { _type: "rive" }>;

export type WidgetRegistry = {
  [K in WidgetType]: React.ComponentType<{
    data: Extract<Widget, { _type: K }>;
  }>;
};
