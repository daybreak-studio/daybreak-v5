import { defineMigration, at, set, create } from "sanity/migrate";

export default defineMigration({
  title: "Create team document from about document",
  documentTypes: ["about"],
  migrate: {
    document(doc) {
      // Create a new team document with the same data
      return create({
        _id: "team",
        _type: "team",
        introduction: doc.introduction,
        media: doc.media,
        team: doc.team,
        jobs: doc.jobs,
      });
    },
  },
});
