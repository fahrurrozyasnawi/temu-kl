// assets
import {
  IconBrandChrome,
  IconBuildingCommunity,
  IconClipboardText,
  IconDroplet
} from '@tabler/icons';

// constant
const icons = {
  IconBrandChrome,
  IconBuildingCommunity,
  IconClipboardText,
  IconDroplet
};

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const water = {
  id: 'water',
  type: 'group',
  permission: 'water:all',
  title: 'Penyehatan Air ',
  children: [
    {
      id: 'list-water',
      title: 'Penyehatan Air ',
      type: 'item',
      url: '/water',
      icon: icons.IconDroplet,
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

export default water;
