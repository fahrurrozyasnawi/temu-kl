// Helper function to get the appropriate label based on the level and index
export function getLabel(level, index) {
  if (level === 1) {
    return String.fromCharCode(65 + index); // Uppercase A-Z
  } else if (level % 2 === 1) {
    return String.fromCharCode(97 + index); // Lowercase a-z
  } else {
    return (index + 1).toString(); // Numbers
  }
}

function generateNumbering(item, level = 1) {
  if (level === 1) {
    // Uppercase alphabetical numbering for the first level
    item.numbering = String.fromCharCode(65 + item.index);
  } else if (level % 2 === 0) {
    // Even levels use numerical numbering
    item.numbering = item.index + 1;
  } else {
    // Odd levels use lowercase alphabetical numbering
    item.numbering = String.fromCharCode(97 + item.index);
  }

  if (item.children && item.children.length > 0) {
    item.children.forEach((child, index) => {
      child.index = index;
      generateNumbering(child, level + 1);
    });
  }
}

function flattenData(data) {
  let result = [];

  function recursiveFlatten(item) {
    result.push({
      No: item.numbering,
      'VARIABEL/KOMPONEN': item.name,
      NILAI: ''
    });

    if (item.children && item.children.length > 0) {
      item.children.forEach((child) => recursiveFlatten(child));
    }
  }

  data.forEach((item, index) => {
    item.index = index;
    generateNumbering(item);
    recursiveFlatten(item);
  });

  return result;
}
