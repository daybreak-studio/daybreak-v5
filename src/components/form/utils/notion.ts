import { Client } from "@notionhq/client";
import { ContactFormValues } from "../schema";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID!;

export async function createNotionEntry(data: ContactFormValues) {
  try {
    const response = await notion.pages.create({
      parent: { database_id: DATABASE_ID },
      properties: {
        Name: {
          title: [{ text: { content: data.fullName } }],
        },
        Email: {
          email: data.email,
        },
        "Project Types": {
          multi_select: data.projectTypes.map((type) => ({
            name: type,
          })),
        },
        Message: {
          rich_text: [{ text: { content: data.message } }],
        },
        Link: {
          url: data.link || null,
        },
        Status: {
          status: {
            name: "New!",
          },
        },
        "Created At": {
          date: {
            start: new Date().toISOString(),
          },
        },
      },
    });

    return response;
  } catch (error) {
    console.error("Notion API Error:", error);
    throw new Error("Failed to create Notion entry");
  }
}
