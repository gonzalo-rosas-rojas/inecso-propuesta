// Where the website demo lives, relative to the proposal page that embeds it (both at the site root).

/** demoUrl("#/obras") → "demo/index.html#/obras" */
export const demoUrl = (hash: string) => `demo/index.html${hash}`;
