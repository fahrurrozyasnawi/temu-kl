import dashboard from './dashboard';
import pages from './pages';
import utilities from './utilities';
import other from './other';
import tfu from './tfu';
import masterData from './master-data';
import tpp from './tpp';
import healthyHouse from './healthyHouse';
import water from './water';
import sanitary from './sanitary';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [
    dashboard,
    water,
    healthyHouse,
    tpp,
    tfu,
    sanitary,
    masterData
    // utilities,
    // other
  ]
};

export default menuItems;
