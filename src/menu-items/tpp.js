// assets
import {
  IconBrandChrome,
  IconBuildingCommunity,
  IconClipboardText
} from '@tabler/icons';

// constant
const icons = { IconBrandChrome, IconBuildingCommunity, IconClipboardText };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const tpp = {
  id: 'tpp',
  type: 'group',
  permission: 'tpp:all',
  title: 'TPP ',
  children: [
    {
      id: 'list-tpp',
      title: 'TPP ',
      type: 'item',
      url: '/tpp',
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
          title: 'Rekapitulasi TPP',
          type: 'item',
          url: '/tpp/report',
          breadcrumbs: false
        },
        {
          id: 'report',
          title: 'Rekapitulasi',
          type: 'item',
          url: '/tpp/report/recap',
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default tpp;
