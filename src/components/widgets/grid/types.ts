import { MediaItem } from "@/sanity/lib/media";
import { Clients } from "@/sanity/types";

export type WidgetSize = "1x1" | "2x2" | "3x3";

interface BaseWidget {
  _key: string;
  _type: "twitter" | "media" | "project";
  position: { row: number; column: number };
  size: WidgetSize;
}

export interface TwitterWidget extends BaseWidget {
  _type: "twitter";
  tweet?: string;
  author?: string;
  link?: string;
}

export interface MediaWidget extends BaseWidget {
  _type: "media";
  media?: MediaItem[];
}

export interface ProjectWidget extends BaseWidget {
  _type: "project";
  client?: {
    _ref: string;
    _type: string;
  };
  type?: "caseStudy" | "preview";
  category?: string;
}

export type Widget = TwitterWidget | MediaWidget | ProjectWidget;
