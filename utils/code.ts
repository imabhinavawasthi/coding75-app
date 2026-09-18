/**
 * Client-side regex-based syntax highlighter for a premium, IDE-like code viewing experience.
 * 
 * Supports language highlighting for:
 * - C++ (`cpp`)
 * - Java (`java`)
 * - JavaScript (`javascript`)
 * - Python (`python`)
 * 
 * Uses placeholder tokenization to avoid mangling HTML structures.
 */
export const highlightCode = (code: string, lang: string): string => {
  // 1. Escape HTML entities to prevent rendering issues or injection
  let html = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const tokens: string[] = [];
  const addToken = (htmlContent: string) => {
    tokens.push(htmlContent);
    return `___TOKEN_${tokens.length - 1}___`;
  };

  // 2. Extract comments and replace with tokens
  if (lang === "cpp" || lang === "java" || lang === "javascript") {
    // Single line comments: // ...
    html = html.replace(/(\/\/.*)/g, (match) => {
      return addToken(`<span class="text-emerald-500/90 font-medium font-mono">${match}</span>`);
    });
    // Multiline comments: /* ... */
    html = html.replace(/(\/\*[\s\S]*?\*\/)/g, (match) => {
      return addToken(`<span class="text-emerald-500/90 font-medium font-mono">${match}</span>`);
    });
  } else if (lang === "python") {
    // Single line comments: # ...
    html = html.replace(/(#.*)/g, (match) => {
      return addToken(`<span class="text-emerald-500/90 font-medium font-mono">${match}</span>`);
    });
  }

  // 3. Extract strings and replace with tokens
  // Double quoted strings (handling escaped quotes and HTML entity for quotes)
  html = html.replace(/(&quot;(?:\\&quot;|\\\\|.)*?&quot;)/g, (match) => {
    return addToken(`<span class="text-amber-300 font-mono">${match}</span>`);
  });

  // Single quoted strings (handling escaped quotes and HTML entity for single quotes)
  html = html.replace(/(&#39;(?:\\&#39;|\\\\|.)*?&#39;)/g, (match) => {
    return addToken(`<span class="text-amber-300 font-mono">${match}</span>`);
  });

  if (lang === "javascript") {
    // Template literals (backticks)
    html = html.replace(/(`(?:\\`|\\\\|.)*?`)/g, (match) => {
      return addToken(`<span class="text-amber-300 font-mono">${match}</span>`);
    });
  }

  // 4. Highlight functions (words followed by parenthesis)
  const controlFlow = /^(if|for|while|switch|catch|def|class|function|else|return|elif)$/;
  html = html.replace(/\b([a-zA-Z_]\w*)\s*(?=\()/g, (match, p1) => {
    if (controlFlow.test(p1)) {
      return match;
    }
    return addToken(`<span class="text-sky-300 font-bold font-mono">${p1}</span>`);
  });

  // 5. Highlight Keywords & Types based on language
  if (lang === "cpp" || lang === "java" || lang === "javascript") {
    // Standard language keywords
    const keywords = /\b(const|let|var|function|return|class|public|private|protected|void|while|for|if|else|switch|case|break|continue|import|export|from|default|new|this|super|try|catch|finally|throw|static|final|package|interface|extends|implements|struct|template|typename|using|namespace|typedef)\b/g;
    html = html.replace(keywords, (match) => {
      return addToken(`<span class="text-purple-400 font-bold font-mono">${match}</span>`);
    });

    // Primitive types and standard class library symbols
    const types = /\b(int|double|bool|boolean|char|float|long|vector|string|map|set|unordered_map|unordered_set|pair|list|queue|stack|nullptr|null|true|false|Math|Character|Integer|String|Boolean|Double|Float|System|out|println|print|console|log|error|warn)\b/g;
    html = html.replace(types, (match) => {
      return addToken(`<span class="text-teal-300 font-semibold font-mono">${match}</span>`);
    });
  } else if (lang === "python") {
    // Python Keywords
    const keywords = /\b(def|return|class|while|for|in|if|elif|else|and|or|not|is|import|from|as|try|except|finally|raise|assert|with|yield|lambda|global|nonlocal|pass|break|continue)\b/g;
    html = html.replace(keywords, (match) => {
      return addToken(`<span class="text-purple-400 font-bold font-mono">${match}</span>`);
    });

    // Python Built-ins, types, and standard library symbols
    const types = /\b(None|True|False|List|Tuple|Dict|Set|Optional|Union|Any|str|int|float|bool|dict|set|list|tuple|len|max|min|sum|range|print|self)\b/g;
    html = html.replace(types, (match) => {
      return addToken(`<span class="text-teal-300 font-semibold font-mono">${match}</span>`);
    });
  }

  // 6. Highlight Numbers (decimals and floating point)
  html = html.replace(/\b(\d+(?:\.\d+)?)\b/g, (match) => {
    return addToken(`<span class="text-orange-400 font-mono">${match}</span>`);
  });

  // 7. Highlight Operators
  const operatorsMulti = /(===|==|!==|!=|&amp;&amp;|\|\||=&gt;|&lt;=|&gt;=|\+=|-=|\*=|\/=|%=)/g;
  html = html.replace(operatorsMulti, (match) => {
    return addToken(`<span class="text-pink-400/90 font-semibold font-mono">${match}</span>`);
  });

  const operatorsSingle = /(\+|-|\*|\/|%|=|!|\?|:|&lt;|&gt;)/g;
  html = html.replace(operatorsSingle, (match) => {
    return addToken(`<span class="text-pink-400/90 font-semibold font-mono">${match}</span>`);
  });

  // Braces, brackets and parentheses
  const braces = /(\{|\}|\(|\)|\[|\])/g;
  html = html.replace(braces, (match) => {
    return addToken(`<span class="text-gray-400/80 font-mono">${match}</span>`);
  });

  // 8. Reconstruct the final HTML by replacing tokens iteratively in reverse
  let hasTokens = true;
  let iterations = 0;
  while (hasTokens && iterations < 5) {
    hasTokens = false;
    html = html.replace(/___TOKEN_(\d+)___/g, (match, p1) => {
      hasTokens = true;
      const index = parseInt(p1, 10);
      return tokens[index] !== undefined ? tokens[index] : match;
    });
    iterations++;
  }

  return html;
};
