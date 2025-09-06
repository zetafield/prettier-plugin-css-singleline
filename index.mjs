import postcss from "prettier/plugins/postcss";

function isSingleDeclRule(node) {
  if (!node || node.type !== "css-rule" || !Array.isArray(node.nodes)) return false;
  if (node.nodes.length !== 1) return false;
  const decl = node.nodes[0];
  if (!decl || decl.type !== "css-decl") return false;
  if (node.nodes.some(n => n.type === "comment")) return false;
  return true;
}

function selectorToString(selectorNode) {
  if (typeof selectorNode === 'string') return selectorNode;
  
  // Extract the selector text from the structure
  if (selectorNode && selectorNode.type === 'selector-root' && Array.isArray(selectorNode.nodes)) {
    return selectorNode.nodes.map(node => {
      if (node.type === 'selector-selector' && Array.isArray(node.nodes)) {
        return node.nodes.map(n => {
          if (n.type === 'selector-tag') return n.value || '';
          if (n.type === 'selector-class') return `.${n.value || ''}`;
          if (n.type === 'selector-id') return `#${n.value || ''}`;
          if (n.type === 'selector-universal') return '*';
          if (n.type === 'selector-nesting') return '&';
          if (n.type === 'selector-attribute') {
            const name = n.attribute || n.name || '';
            const op = n.operator || '';
            const val = n.value != null ? n.value : '';
            const flag = n.insensitive ? ' i' : '';
            return `[${name}${op}${val}${flag}]`;
          }
          if (n.type === 'selector-pseudo') {
            const v = n.value || '';
            return v.startsWith(':') ? v : `:${v}`;
          }
          if (n.type === 'selector-pseudo-element') {
            const v = n.value || '';
            return v.startsWith('::') ? v : v.startsWith(':') ? `:${v}` : `::${v}`;
          }
          if (n.type === 'selector-combinator') return n.value || '';
          return n.value || '';
        }).join('');
      }
      return '';
    }).join(', ');
  }
  
  return '';
}

function valueToString(valueNode) {
  if (!valueNode) return '';
  // Try to extract a plain text representation from the value AST
  // Handles shapes like value-root -> value-value -> value-word / function / punctuation
  const collect = node => {
    if (!node) return '';
    if (typeof node === 'string') return node;
    if (typeof node.value === 'string') return node.value;
    if (Array.isArray(node.nodes)) return node.nodes.map(collect).join('');
    return '';
  };
  return collect(valueNode);
}

function getIndentColumns(path, options) {
  // Count parent blocks that add indentation (rules and at-rules)
  let level = 0;
  for (let i = 0; ; i += 1) {
    const parent = path.getParentNode(i);
    if (!parent) break;
    if (parent.type === 'css-rule' || parent.type === 'css-atrule') level += 1;
  }
  const unit = options && options.useTabs ? 1 : (options && options.tabWidth) || 2;
  return level * unit;
}

function estimateLineLength(selector, property, value, path, options) {
  // Estimate: indentation + "selector { property: value; }"
  const selectorStr = typeof selector === 'string' ? selector : selectorToString(selector);
  const valueStr = typeof value === 'string' ? value : valueToString(value);
  const indentCols = getIndentColumns(path, options);
  return indentCols + selectorStr.length + property.length + valueStr.length + 6; // 6 for " { ", ": ", "; }"
}

export const languages = postcss.languages;
export const parsers = postcss.parsers;

export const printers = {
  postcss: {
    ...postcss.printers.postcss,
    print(path, options, print) {
      const node = path.getValue();

      if (isSingleDeclRule(node)) {
        const decl = node.nodes[0];
        const selector = node.selector;
        const property = decl.prop;
        const value = decl.value;

        // Convert selector to string for length estimation
        const selectorStr = selectorToString(selector);

        // Check if single-line format fits within printWidth
        const estimatedLength = estimateLineLength(selectorStr, property, value, path, options);

        if (estimatedLength <= options.printWidth) {
          // Build single-line using stringified selector and default value doc
          const selectorSingleLine = selectorStr;
          const valueDoc = path.call(print, 'nodes', 0, 'value');
          return [selectorSingleLine, " { ", property, ": ", valueDoc, "; }"];
        }
      }

      // Fall back to default postcss formatting
      return postcss.printers.postcss.print(path, options, print);
    }
  }
};