import { groq } from "next-sanity";

export const HOME_QUERY = groq`
  *[_type == "home"][0] {
    missionStatement
  }
`;
