// Function to generate initialValues without the isCanDisabled property
export function generateInitialValues(data) {
  return data.map((item) => {
    if (item.children) {
      return {
        name: item.name,
        children: generateInitialValues(item.children)
      };
    } else {
      return {
        name: item.name,
        value: item.value
      };
    }
  });
}
