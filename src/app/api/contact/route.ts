import { NextResponse } from "next/server";
import { createNotionEntry } from "@/components/form/utils/notion";
import { contactFormSchema } from "@/components/form/schema";

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();

    // Validate the data against our current schema
    const validatedData = contactFormSchema.parse(body);

    // Create Notion entry using our current service
    const notionResponse = await createNotionEntry(validatedData);

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Form submitted successfully",
      notionEntryId: notionResponse.id,
    });
  } catch (error) {
    console.error("API Error:", error);

    // Return error response with more specific error handling
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          message: "Form submission failed",
          error: error.message,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred",
      },
      { status: 500 },
    );
  }
}

// Prevent other methods
export async function GET() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
