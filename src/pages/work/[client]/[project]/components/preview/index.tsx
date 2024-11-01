import { Preview } from "@/sanity/types";

export default function ProjectPreview({ project }: { project: Preview }) {
  return (
    <div>
      <h1>{project._type}</h1>
      <h1>{project.heading}</h1>
    </div>
  );
}
