export interface MediaGroup {
  heading: string;
  caption: string;
  items: {
    _type: "image" | "file";
    asset: {
      url: string;
    };
  }[];
}

export interface CaseStudy {
  heading: string;
  media: MediaGroup[];
}
