// material-ui
import { Typography } from '@mui/material';

// project imports
import NavGroup from './NavGroup';
import menuItem from 'menu-items';
import { useContext } from 'react';
import { AuthContext } from 'contexts/AuthContext';
import { filterMenuItems } from 'utils/permissions';

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
  const { dataUser } = useContext(AuthContext);

  const filterItems = filterMenuItems(menuItem.items, dataUser?.permissions);

  const navItems = filterItems.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return <>{navItems}</>;
};

export default MenuList;
