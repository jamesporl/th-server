import escapeHtml from 'escape-html';

function serializeEditorNodeToHtml(node: any, parentType?: string) {
  if (node.type === 'text') {
    let string = escapeHtml(node.text) || '&nbsp;';
    console.log(node.text, string);
    const classNames = [];
    if (node.bold) {
      classNames.push('text-bold');
    }
    if (node.italic) {
      classNames.push('text-italic');
    }
    if (node.underline) {
      classNames.push('text-underline');
    }
    if (node.code) {
      classNames.push('text-code');
    }
    if (classNames.length) {
      string = `<span class="${classNames.join(' ')}">${string}</span>`;
    }
    return string;
  }

  const children = node.children.map((n) => serializeEditorNodeToHtml(n, node.type)).join('');

  if (node.type === 'bulleted-list') {
    return `<ul>${children}</ul>`;
  }
  if (node.type === 'numbered-list') {
    return `<ol>${children}</ol>`;
  }
  if (parentType === 'numbered-list' || parentType === 'bulleted-list') {
    return `<li>${children}</li>`;
  }
  return `<p>${children}</p>`;
}

export default function serializeEditorContentToHtml(nodes: unknown) {
  let res = '';
  if (Array.isArray(nodes)) {
    res = (nodes || []).map((node) => serializeEditorNodeToHtml(node)).join('');
  }
  return res;
}
