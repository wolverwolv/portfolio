import type { Context, Config } from "@netlify/functions";

const BACKEND_URL = Netlify.env.get("BACKEND_URL") || "http://208.115.203.106:25649";

export default async (req: Request, context: Context) => {
  // Extract the path after /api/
  const url = new URL(req.url);
  const apiPath = url.pathname;

  // Build the backend URL
  const backendUrl = `${BACKEND_URL}${apiPath}${url.search}`;

  try {
    // Forward the request to the HTTP backend
    const response = await fetch(backendUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: req.method !== "GET" && req.method !== "HEAD" ? await req.text() : undefined,
    });

    // Get the response body
    const data = await response.text();

    // Return the response with appropriate headers
    return new Response(data, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to connect to backend server" }),
      {
        status: 502,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const config: Config = {
  path: ["/api/*"],
};