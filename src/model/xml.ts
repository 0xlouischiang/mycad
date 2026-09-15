/**
 * Tiny XML builder — a structured node tree with proper attribute/text
 * escaping, serialized with indentation. Used for URDF/xacro export instead of
 * string concatenation (per the Phase 12 requirement) so we never emit
 * malformed XML from unescaped values.
 */

export interface XmlNode {
  tag: string;
  attrs?: Record<string, string | number>;
  children?: XmlNode[];
  /** Text content (mutually exclusive with children in practice). */
  text?: string;
}

export function el(
  tag: string,
  attrs?: Record<string, string | number>,
  children?: XmlNode[],
): XmlNode {
  return { tag, attrs, children };
}

function escapeAttr(v: string): string {
  return v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeText(v: string): string {
  return v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Serialize a node tree to an indented XML string. */
export function serialize(node: XmlNode, indent = 0): string {
  const pad = "  ".repeat(indent);
  const attrs = node.attrs
    ? Object.entries(node.attrs)
        .map(([k, v]) => ` ${k}="${escapeAttr(String(v))}"`)
        .join("")
    : "";

  if (node.text !== undefined) {
    return `${pad}<${node.tag}${attrs}>${escapeText(node.text)}</${node.tag}>`;
  }
  if (!node.children || node.children.length === 0) {
    return `${pad}<${node.tag}${attrs}/>`;
  }
  const inner = node.children
    .map((c) => serialize(c, indent + 1))
    .join("\n");
  return `${pad}<${node.tag}${attrs}>\n${inner}\n${pad}</${node.tag}>`;
}

/** Serialize a document with the XML prolog. */
export function serializeDocument(root: XmlNode): string {
  return `<?xml version="1.0"?>\n${serialize(root)}\n`;
}

/**
 * Lightweight well-formedness check: every opened tag closes in order. Uses the
 * DOMParser when available (browser) for a real parse; falls back to a tag
 * balance scan (Node/tests). Returns an error string or null.
 */
export function checkWellFormed(xml: string): string | null {
  if (typeof DOMParser !== "undefined") {
    const doc = new DOMParser().parseFromString(xml, "application/xml");
    const err = doc.querySelector("parsererror");
    return err ? err.textContent || "XML parse error" : null;
  }
  // Fallback: balance-check tags (ignores comments/CDATA — fine for our output).
  const stack: string[] = [];
  const re = /<\/?([a-zA-Z_][\w:.-]*)([^>]*?)(\/?)>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml))) {
    const [full, tag, , selfClose] = m;
    if (full.startsWith("<?")) continue;
    if (full.startsWith("</")) {
      if (stack.pop() !== tag) return `Mismatched closing tag </${tag}>`;
    } else if (!selfClose) {
      stack.push(tag);
    }
  }
  return stack.length === 0 ? null : `Unclosed tag <${stack[stack.length - 1]}>`;
}
