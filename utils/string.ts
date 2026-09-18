/**
 * Formats tag and company names to be capitalized and clean.
 * Replaces dashes and underscores with spaces.
 * Preserves common DSA and computer science acronyms in uppercase.
 */
export function formatTag(tag: string): string {
  if (!tag) return "";

  // Common technical acronyms in computer science and DSA
  const acronyms = new Set([
    "dsa", "dp", "gfg", "sde", "bfs", "dfs", "mst", "lru", "lfu", "sql", 
    "oops", "dbms", "os", "scc", "bst", "trie", "dag", "lca", "rmq", "kmp"
  ]);

  return tag
    .replace(/[-_]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((word) => {
      const lower = word.toLowerCase();
      if (acronyms.has(lower)) {
        return word.toUpperCase();
      }
      // Capitalize first character and keep mixed-case styling (e.g. LeetCode)
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

/**
 * Converts text into a url-friendly slug (lowercase, dashes instead of spaces/underscores).
 */
export function slugify(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // remove special chars except spaces/hyphens
    .replace(/[\s_-]+/g, "-")  // replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, "");  // trim leading/trailing hyphens
}

