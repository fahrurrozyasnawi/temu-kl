// assets
import {
  IconBrandChrome,
  IconBuildingCommunity,
  IconClipboardText,
  IconVaccine
} from '@tabler/icons';

// constant
const icons = {
  IconBrandChrome,
  IconBuildingCommunity,
  IconClipboardText,
  IconVaccine
};

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const sanitary = {
  id: 'sanitary',
  type: 'group',
  permission: 'sanitary:all',
  title: 'Klinik Sanitasi ',
  children: [
    {
      id: 'list-sanitary',
      title: 'Klinik Sanitasi ',
      type: 'item',
      url: '/sanitary',
      icon: icons.IconVaccine,
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

export default sanitary;
