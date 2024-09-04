/**
 * This plugin contains all the logic for setting up the `Settings` singleton
 */

import { definePlugin, type DocumentDefinition } from "sanity";
import type { StructureResolver } from "sanity/structure";
import { CogIcon, FolderIcon } from "@sanity/icons";

// export const settingsPlugin = definePlugin<{ type: string }>(({ type }) => {
//   return {
//     name: 'settings',
//     document: {
//       // Hide 'Settings' from new document options
//       // https://user-images.githubusercontent.com/81981/195728798-e0c6cf7e-d442-4e58-af3a-8cd99d7fcc28.png
//       newDocumentOptions: (prev, { creationContext }) => {
//         if (creationContext.type === 'global') {
//           return prev.filter((templateItem) => templateItem.templateId !== type)
//         }

//         return prev
//       },
//       // Removes the "duplicate" action on the "settings" singleton
//       actions: (prev, { schemaType }) => {
//         if (schemaType === type) {
//           return prev.filter(({ action }) => action !== 'duplicate')
//         }

//         return prev
//       },
//     },
//   }
// })

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

// // The StructureResolver is how we're changing the DeskTool structure to linking to a single "Settings" document, instead of rendering "settings" in a list
// // like how "Post" and "Author" is handled.
// export const settingsStructure = (
//   typeDef: DocumentDefinition,
// ): StructureResolver => {
//   return (S) => {
//     // The `Settings` root list item
//     const settingsListItem = // A singleton not using `documentListItem`, eg no built-in preview
//       S.listItem()
//         .title(typeDef.title)
//         .icon(typeDef.icon)
//         .child(
//           S.editor()
//             .id(typeDef.name)
//             .schemaType(typeDef.name)
//             .documentId(typeDef.name),
//         )

//     // The default root list items (except custom ones)
//     const defaultListItems = S.documentTypeListItems().filter(
//       (listItem) => listItem.getId() !== typeDef.name,
//     )

//     return S.list()
//       .title('Content')
//       .items([settingsListItem, S.divider(), ...defaultListItems])
//   }
// }

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
      (listItem) => !types.includes(listItem.getId()),
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
