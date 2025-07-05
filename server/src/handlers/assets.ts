// @ts-ignore
export async function HandleAssets(c) {
  try {
    // Try to serve the requested asset first
    const assetResponse = await c.env.ASSETS.fetch(c.req.url);

    // If the asset exists and is not a 404, return it
    if (assetResponse.status !== 404) {
      return assetResponse;
    }

    // If asset doesn't exist, serve index.html for client-side routing
    const indexResponse = await c.env.ASSETS.fetch(new URL('/', c.req.url));
    return c.html(await indexResponse.text());
  } catch (error) {
    // Fallback to serving index.html if anything goes wrong
    const indexResponse = await c.env.ASSETS.fetch(new URL('/', c.req.url));
    return c.html(await indexResponse.text());
  }
}
