// assets
import {
  IconBrandChrome,
  IconBuildingCommunity,
  IconClipboardText,
  IconHomeEco
} from '@tabler/icons';

// constant
const icons = {
  IconBrandChrome,
  IconBuildingCommunity,
  IconClipboardText,
  IconHomeEco
};

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const healthyHouse = {
  id: 'healthyHouse',
  type: 'group',
  permission: 'hh:all',
  title: 'Penyehatan Rumah ',
  children: [
    {
      id: 'list-healthyHouse',
      title: 'Penyehatan Rumah ',
      type: 'item',
      url: '/healthy-house',
      icon: icons.IconHomeEco,
      breadcrumbs: false
    }
    // {
    //   id: 'reports',
    //   title: 'Laporan ',
    //   type: 'collapse',
    //   icon: icons.IconClipboardText,
    //   children: [
    //     {
    //       id: 'report-recap',
    //       title: 'Rekapitulasi Penyehatan Rumah',
    //       type: 'item',
    //       url: '/healthy-house/report',
    //       breadcrumbs: false
    //     },
    //     {
    //       id: 'report',
    //       title: 'Rekapitulasi',
    //       type: 'item',
    //       url: '/healthy-house/report/recap',
    //       breadcrumbs: false
    //     }
    //   ]
    // }
  ]
};

export default healthyHouse;
