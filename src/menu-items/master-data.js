// assets
import {
  IconBrandChrome,
  IconBuildingCommunity,
  IconUser,
  IconArchive
} from '@tabler/icons';

// constant
const icons = { IconBrandChrome, IconBuildingCommunity, IconUser, IconArchive };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const masterData = {
  id: 'master-data',
  type: 'group',
  title: 'Master Data',
  children: [
    {
      id: 'list-master-data-user',
      title: 'User',
      type: 'item',
      url: '/master-data/users',
      icon: icons.IconUser,
      breadcrumbs: false
    },
    {
      id: 'list-master-data-puskesmas',
      title: 'Puskesmas',
      type: 'item',
      url: '/master-data/puskesmas',
      icon: icons.IconBuildingCommunity,
      breadcrumbs: false
    },
    {
      id: 'list-master-data-warga',
      title: 'Penduduk',
      type: 'item',
      url: '/master-data/residents',
      icon: icons.IconUser,
      breadcrumbs: false
    },
    {
      id: 'list-master-data-documents',
      title: 'Dokumen',
      type: 'item',
      url: '/master-data/document',
      icon: icons.IconArchive,
      breadcrumbs: false
    }
  ]
};

export default masterData;
