import { definePlugin, type DocumentDefinition } from "sanity";
import type { StructureResolver } from "sanity/structure";
import { CogIcon, FolderIcon } from "@sanity/icons";

export const singletonPlugin = definePlugin<{ types: string[] }>(
  ({ types }) => {
    return {
      name: "singletonPlugin",
      document: {
        newDocumentOptions: (prev, { creationContext }) => {
          if (creationContext.type === "global") {
            return prev.filter(
              (templateItem) => !types.includes(templateItem.templateId),
            );
          }
          return prev;
        },
        actions: (prev, { schemaType }) => {
          if (types.includes(schemaType)) {
            return prev.filter(({ action }) => action !== "duplicate");
          }
          return prev;
        },
      },
    };
  },
);

export const singletonStructure = (
  types: string[],
  schemas: any[],
): StructureResolver => {
  return (S) => {
    const settingsItem = S.listItem()
      .title("Settings")
      .icon(CogIcon)
      .child(
        S.editor().id("settings").schemaType("settings").documentId("settings"),
      );

    const singletonItems = types
      .filter((type) => type !== "settings")
      .map((type) => {
        const schema = schemas.find((s) => s.name === type);
        return S.listItem()
          .title(schema?.title || type)
          .icon(FolderIcon)
          .child(S.editor().id(type).schemaType(type).documentId(type));
      });
    const defaultListItems = S.documentTypeListItems().filter(
      (listItem) => !types.includes(listItem.getId() || ""),
    );

    return S.list()
      .title("Content")
      .items([
        settingsItem,
        S.divider(),
        ...singletonItems,
        ...defaultListItems,
      ]);
  };
};
