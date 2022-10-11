import escapeHtml from 'escape-html';

function serializeEditorNodeToText(node: any) {
  if (node.type === 'text') {
    const string = escapeHtml(node.text);
    return string;
  }

  const children = node.children.map((n) => serializeEditorNodeToText(n)).join(' ');

  return children;
}

export default function serializeEditorContentToText(nodes) {
  const res = (nodes || []).map((node) => serializeEditorNodeToText(node)).join(' ');
  return res;
}
