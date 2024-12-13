import { MediaItem } from "@/sanity/lib/media";
import { Clients } from "@/sanity/types";

export type WidgetSize = "1x1" | "2x2" | "3x3";

interface BaseWidget {
  _key: string;
  _type: "twitterWidget" | "mediaWidget" | "projectWidget";
  position: { row: number; column: number };
  size: WidgetSize;
}

export interface TwitterWidget extends BaseWidget {
  _type: "twitterWidget";
  tweet?: string;
  author?: string;
  link?: string;
}

export interface MediaWidget extends BaseWidget {
  _type: "mediaWidget";
  media?: MediaItem[];
}

export interface ProjectWidget extends BaseWidget {
  _type: "projectWidget";
  selectedClient?: {
    _ref: string;
    _type: string;
  };
  projectType?: "caseStudy" | "preview";
  projectCategory?: string;
}

export type Widget = TwitterWidget | MediaWidget | ProjectWidget;
