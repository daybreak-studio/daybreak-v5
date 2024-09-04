/**
 * This code is responsible for revalidating the cache when a post or author is updated.
 *
 * It is set up to receive a validated GROQ-powered Webhook from Sanity.io:
 * https://www.sanity.io/docs/webhooks
 *
 * 1. Go to the API section of your Sanity project on sanity.io/manage or run `npx sanity hook create`
 * 2. Click "Create webhook"
 * 3. Set the URL to https://YOUR_NEXTJS_SITE_URL/api/revalidate
 * 4. Dataset: Choose desired dataset or leave at default "all datasets"
 * 5. Trigger on: "Create", "Update", and "Delete"
 * 6. Filter: _type == "post" || _type == "author" || _type == "settings"
 * 7. Projection: Leave empty
 * 8. Status: Enable webhook
 * 9. HTTP method: POST
 * 10. HTTP Headers: Leave empty
 * 11. API version: v2021-03-25
 * 12. Include drafts: No
 * 13. Secret: Set to the same value as SANITY_REVALIDATE_SECRET (create a random secret if you haven't yet)
 * 14. Save the cofiguration
 * 15. Add the secret to Vercel: `npx vercel env add SANITY_REVALIDATE_SECRET`
 * 16. Redeploy with `npx vercel --prod` to apply the new environment variable
 */

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Validate the secret token
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (req.headers["x-sanity-secret"] !== secret) {
    return res.status(401).json({ message: "Invalid secret" });
  }

  try {
    const { path } = req.body;

    if (!path) {
      return res.status(400).json({ message: "Path is required" });
    }

    // Revalidate the specified path
    await res.revalidate(path);

    return res.status(200).json({ message: "Revalidation successful" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Revalidation failed", error: (err as Error).message });
  }
}
