export const filterSidebarByRole = function (
  sidebarItems = [],
  userPermissions = []
) {
  let allowedSidebarItems = [];
  let itemsUnderLabel = [];

  for (let i = 0; i < sidebarItems.length; i++) {
    const item = sidebarItems[i];

    if (item.type === 'label') {
      // If there's a previous label with items, push them to the allowed items
      if (itemsUnderLabel.length > 0) {
        allowedSidebarItems.push(...itemsUnderLabel);
        itemsUnderLabel = [];
      }
      itemsUnderLabel.push(item);
    } else if (!item.permission || userPermissions.includes(item.permission)) {
      itemsUnderLabel.push(item);
    }

    // If it's the last item, check if there are any items under the label
    if (i === sidebarItems.length - 1 && itemsUnderLabel.length > 1) {
      allowedSidebarItems.push(...itemsUnderLabel);
    }
  }

  return allowedSidebarItems;
};

export const filterMenuItems = (menuItems = [], permissions = []) => {
  return menuItems
    .filter((item) => {
      if (!item.permission) return true;

      return !permissions.includes(item.permission);
    })
    .map((item) => {
      if (item.children) {
        return {
          ...item,
          children: filterMenuItems(item.children, permissions)
        };
      }

      return item;
    });
};

export const filterRoutes = (routes, userPermissions = []) => {
  return routes
    .filter((route) => {
      // If route has no permission, always include
      if (!route.permission) return true;

      // if(!userPermissions.includes(route.permission))
      // If route has permission, check if user has it
      return !userPermissions.includes(route.permission);
    })
    .map((route) => {
      // If route has children, filter them too
      if (route.children) {
        return {
          ...route,
          children: filterRoutes(route.children, userPermissions)
        };
      }
      return route;
    });
};

export const filterActionButtons = (permission, listPermissions = []) => {
  const isHavePermissions = !listPermissions.includes(permission);

  // console.log('permission', permission);
  // console.log('is allow', isHavePermissions);

  return isHavePermissions;
};
