import { findIndex, findLastIndex } from 'lodash';

export default function trimEditorJsonContent(jsonDesc: unknown) {
  let resJsonDesc = jsonDesc;
  if (Array.isArray(jsonDesc)) {
    const firstIdxWithContent = findIndex(
      jsonDesc,
      (node) => {
        if (node.children && Array.isArray(node.children) && node.children.length === 1) {
          const child = node.children[0];
          if (child.type !== 'text' || (child.type === 'text' && child.text)) {
            return true;
          }
        }
        return false;
      },
    );

    const lastIdxWithContent = findLastIndex(
      jsonDesc,
      (node) => {
        if (node.children && Array.isArray(node.children) && node.children.length === 1) {
          const child = node.children[0];
          if (child.type !== 'text' || (child.type === 'text' && child.text)) {
            return true;
          }
        }
        return false;
      },
    );

    resJsonDesc = jsonDesc.slice(firstIdxWithContent, lastIdxWithContent + 1);
  }
  return resJsonDesc;
}
