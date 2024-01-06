import { findIndex, findLastIndex } from 'lodash';

function nodeHasText(node: any) {
  let hasText = false;
  if (node.text) {
    return true;
  }
  if (node.children) {
    hasText = node.children.some(nodeHasText);
  }
  return hasText;
}

export default function trimEditorJsonContent(jsonDesc: unknown) {
  let resJsonDesc = jsonDesc;
  if (Array.isArray(jsonDesc)) {
    const firstIdxWithContent = findIndex(jsonDesc, nodeHasText);
    const lastIdxWithContent = findLastIndex(jsonDesc, nodeHasText);
    resJsonDesc = jsonDesc.slice(firstIdxWithContent, lastIdxWithContent + 1);
  }
  return resJsonDesc;
}
