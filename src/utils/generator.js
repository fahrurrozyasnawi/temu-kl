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
