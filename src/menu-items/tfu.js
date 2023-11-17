// assets
import {
  IconBrandChrome,
  IconBuildingCommunity,
  IconClipboardText
} from '@tabler/icons';

// constant
const icons = { IconBrandChrome, IconBuildingCommunity, IconClipboardText };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const tfu = {
  id: 'tfu',
  type: 'group',
  permission: 'tfu:all',
  title: 'TFU ',
  children: [
    {
      id: 'list-tfu',
      title: 'TFU ',
      type: 'item',
      url: '/tfu',
      icon: icons.IconBuildingCommunity,
      breadcrumbs: false
    },
    {
      id: 'reports',
      title: 'Laporan ',
      type: 'collapse',
      icon: icons.IconClipboardText,
      children: [
        {
          id: 'report-recap',
          title: 'Rekapitulasi TFU',
          type: 'item',
          url: '/tfu/report',
          breadcrumbs: false
        },
        {
          id: 'report',
          title: 'Rekapitulasi',
          type: 'item',
          url: '/tfu/report/recap',
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default tfu;
