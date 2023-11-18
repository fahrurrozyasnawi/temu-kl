export function getNestedProperty(obj, path) {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

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

function generateNumbering(item, index, level = 1) {
  if (level === 1) {
    item.numbering = String.fromCharCode(65 + index); // Uppercase A-Z
  } else if (level % 2 === 1) {
    item.numbering = String.fromCharCode(97 + index); // Lowercase a-z
  } else {
    item.numbering = (index + 1).toString(); // Numbers
  }

  if (item.children && item.children.length > 0) {
    item.children.forEach((child, index) => {
      child.index = index;
      generateNumbering(child, index, level + 1);
    });
  }
}

export function flattenData(data) {
  let result = [];

  function recursiveFlatten(item) {
    result.push({
      No: item.numbering,
      'VARIABEL/KOMPONEN': item.name,
      BOBOT: item.score,
      NILAI: ''
    });

    if (item.children && item.children.length > 0) {
      item.children.forEach((child) => recursiveFlatten(child));
    }
  }

  data.forEach((item, index) => {
    item.index = index;
    generateNumbering(item, index);
    recursiveFlatten(item);
  });

  console.log('result', result);
  return result;
}
