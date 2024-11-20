import { NextResponse } from "next/server";
import { createNotionEntry } from "@/lib/services/notion";
import { contactFormSchema } from "@/lib/schemas/contact-form";

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();

    // Validate the data
    const validatedData = contactFormSchema.parse(body);

    // Create Notion entry
    const notionResponse = await createNotionEntry(validatedData);

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Form submitted successfully",
      id: notionResponse.id,
    });
  } catch (error) {
    console.error("API Error:", error);

    // Return error response
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while submitting your form",
      },
      { status: 500 },
    );
  }
}

// Optional: Handle other methods
export async function GET() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
