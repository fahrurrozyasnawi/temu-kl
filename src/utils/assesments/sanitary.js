export const baseForm = {
  region: '',
  pubHealth: '',
  district: '',
  name: '',
  familyNum: '',
  age: {
    value: null,
    _type: ''
  },
  gender: '',
  job: '',
  address: {
    subVillage: '',
    rt: '',
    rw: '',
    ward: undefined
  },
  class: ''
};

export const sanitaryDiareForm = [
  {
    name: 'Sejak kapan sakit',
    value: ''
  },
  {
    name: 'Sebelum sakit diare makan/minum apa?',
    value: ''
  },
  {
    name: 'Di mana?',
    value: ''
  },
  {
    name: 'Sumber air bersih berasal dari mana?',
    value: '',
    options: [
      'Ledeng/PDAM',
      'SGL/SPT',
      'Perlindungan Mata Air (PMA)',
      'Air hujan',
      'Sungai',
      'Lainnya'
      // {
      //   label: 'Lainnya',
      //   isOther: true
      // }
    ]
  },
  {
    name: 'Bila menggunakan SGL/SPT apakah jaraknya dengan jamban keluarga lebih dari 10 meter?',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Bila menggunakan mata air apakah mata air tersebut terlindung ?',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Apakah air minum yang dipergunakan sehari-hari dimasak ?',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Apakah air yang sudah dimasakdisimpan dalam wadah yang tertutup?',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Apakah wadah tersebut dalam keadaan bersih ?',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Apakah di rumah memiliki jamban?',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Bila	memiliki jamban	apakah	jamban	tersebut	memenuhi	syarat (mempunyai tempat penampungan kotoran seperti septik tang?',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Dimanakah anggota keluarga biasanya berak?',
    value: '',
    options: [
      'Kakus/WC sendiri',
      'Kakus/WC umum',
      'Sungai',
      'Kebun',
      'Empang',
      'Lainnya'
      // {
      //   label: 'Lainnya',
      //   isOther: true
      // }
    ]
  },
  {
    name: 'Bagaimana kebiasaan membuang tinja bayi/anak kecil?',
    value: '',
    options: [
      'Dikemas lalu dibuang dalam kakus/WC (bagi bayi)',
      'Berak sendiri di kakus/WC (bagi anak kecil)',
      'Berak sembarang',
      'Dibuang sembarangan'
    ]
  },
  {
    name: 'Jika pasien adalah bayi yang masih menyusu, ditanyakan tentang susu yang diminumnya?',
    value: '',
    options: [
      'Menyusu  ibunya',
      'Apakah menyusu dengan botol',
      'Lainnya'
      // {
      //   label: 'Lainnya',
      //   isOther: true
      // }
    ]
  },
  {
    name: 'Jika pasien bayi menyusu dengan botol, bagaimana cara mencuci botol susu dan cara penyajiannya? (Diisi jika pilihan sebelumnya adalah menyusu dengan botol)',
    value: ''
  },
  {
    name: 'Apakah anggota keluarga biasa melakukan cuci tangan dengan sabun sesudah berak?',
    value: '',
    options: ['Ya', 'Tidak']
  }
];

export const sanitaryDiareInitialValues = {
  name: '',
  age: '',
  parent: '',
  job: '',
  address: {
    name: '',
    nbAssociate: '',
    ctAssociate: ''
  },
  ward: undefined
};

export const sanitaryMalaria_ = [
  {
    label: 'Nama',
    name: 'name',
    inputType: 'text',
    grid: 12,
    value: ''
  },
  {
    label: 'Umur',
    name: 'age',
    inputType: 'text',
    grid: 12,
    value: ''
  },
  {
    label: 'Jenis kelamin',
    name: 'gender',
    inputType: 'select',
    options: ['Laki-laki', 'Perempuan'],
    grid: 12,
    value: ''
  },
  {
    label: 'Alamat',
    name: 'address',
    inputType: 'text',
    grid: 4,
    value: ''
  },
  {
    label: 'Kelurahan/Desa',
    name: 'ward',
    areaType: 'ward',
    inputType: 'autocomplete',
    grid: 4,
    value: ''
  },
  {
    label: 'Tipe Rumah',
    name: 'homeType',
    inputType: 'select',
    options: ['Laki-laki', 'Perempuan'],
    grid: 12,
    value: ''
  }
];

export const sanitaryMalaria = {
  name: '',
  age: '',
  gender: '',
  parent: '',
  job: '',
  address: '',
  ward: undefined,
  homeType: {
    value: '',
    other: ''
  }
  // responses: []
};

export const sanitaryMalariaForm = [
  {
    name: 'Pernahkan pasien menderita penyakit malaria sebelumnya?',
    value: '',
    options: ['Belum pernah', 'Pernah 1-2 kali', 'Pernah 3 kali atau lebih']
  },
  {
    name: 'Apakah sebelum sakit, 2 minggu yang lalu pernah berkunjung ke tempat/kota lain?',
    value: '',
    options: [
      'Tidak',
      'Ya'
      // {
      //   label: 'Ya',
      //   type: 'place',
      //   isOther: true
      // }
    ]
  },
  {
    name: 'Adakah di sekitar tempat tersebut anda menjumpai orang sakit dengan gejala yang sama',
    value: '',
    otherValue: '',
    options: [
      'Tidak',
      {
        label: 'Ada, berapa orang',
        name: 'others',
        inputType: 'text',
        isOther: true
      }
    ]
  },
  {
    name: 'Apakah ada anggota keluarga/tetangga yang menderita sakit yang serupa?',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Bila Ya, Siapa sebutkan ',
    value: '',
    dependsOn: {
      qIndex: 3,
      answer: 'Ya'
    },
    children: [
      {
        name: 'Jenis kelamin',
        value: '',
        options: ['Laki-laki', 'Perempuan']
      },
      {
        name: 'golongan umur (tahun)',
        value: ''
      },
      {
        name: 'Pekerjaan, sebutkan',
        value: '',
        // name: 'others',
        inputType: 'text',
        isOther: true
      }
    ]
  },
  {
    name: 'Apakah selokan umum di sekitar rumah aliran airnya lancar?',
    value: '',
    options: [
      'Ya dan ada ditemukan jentik ditempat tersebut',
      'Ya tapi tidak ada ditemukan jentik ditempat tersebut',
      'Tidak'
    ]
  },
  {
    name: 'Adakah banyak pepohonan/semak-semak yang rimbun/rindang di sekitar rumah?',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Apakah ventilasi di rumah pasien "tidak dipasangi" kasa?',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Apakah terdapat lubang yang memungkinkan sehingga nyamuk bisa masuk ke dalam rumah',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Apakah penderita dan keluarganya, bila tidur menggunakan kelambu?',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Apakah penderita/keluarganya melakukan penyemprotan dalam rumah sebelum tidur malam?',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Apakah menggunakan repellent di dalam rumah sebelum tidur',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Apakah menggunakan obat nyamuk bakar di dalam rumah sebelum tidur',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Apakah di sekitar rumah anda pada jarak < 2 km ada genangan air limbah/comberan',
    value: '',
    options: [
      'Ya dan ada ditemukan jentik ditempat tersebut',
      'Ya tapi tidak ada ditemukan jentik ditempat tersebut',
      'Tidak'
    ]
  },
  {
    name: 'Apakah di lingkungan rumah pasien dilakukan di lakukan pengaliran/penimbunan genangan- genangan air',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Apakah ada kubangan air atau lagun di sekitar rumah pada jarak < 2 Km',
    value: '',
    options: [
      'Ya dan ada ditemukan jentik ditempat tersebut',
      'Ya tapi tidak ada ditemukan jentik ditempat tersebut',
      'Tidak'
    ]
  },
  {
    name: 'Apakah di rumah terdapat kandang ternak (sapi/kerbau)',
    value: '',
    options: [
      'Ya dan kandang tersebut terpisah dari rumah',
      'Ya tapi kandang tersebut tidak terpisah dari rumah',
      'Tidak'
    ]
  }
];

export const sanitaryDBD = {
  name: '',
  age: '',
  job: '',
  education: '',
  parent: '',
  address: {
    name: '',
    nbAssociate: '',
    ctAssociate: '',
    rk: ''
  },
  ward: undefined
};

export const sanitaryDBDForm = [
  {
    name: 'Apakah sebelumnya Ibu/Bpk/Sdr pernah menderita panyakit DBD?',
    value: '',
    options: ['Ya, pernah', 'Belum Pernah']
  },
  {
    name: 'Apakah Ibu/Bpk/Sdr seminggu yang lalu sebelum sakit pernah berkunjung ke tempat/kota lain ?',
    value: '',
    otherValue: '',
    options: [
      'Tidak',
      {
        label: 'Ya',
        name: 'others',
        inputType: 'place',
        level: 2
      }
    ]
  },
  {
    name: 'Apakah dalam 2 -3 bulan terakhir ada anggota keluarga/tetangga atau teman sekolah (bagi anak sekolah) menderita sakit yang sama?',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Apakah Ibu/Bpk/Sdr tidur antara pukul 09.00-10.00 dan 16.00-17.00?',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Apakah sebelum tidur disemprot dahulu atau menggunakan pelindung diri (obat anti nyamuk b akar/coil, obat anti nyamuk elektrik, obat anti nyamuk oles) atau memakai kelambu?',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Apakah di sekitar rumah banyak ditemukan barang -barang bekas seperti kaleng, ban, botol plastik bekas, lubang pohon, dan lain-lain yang dapat menampung air hujan ?',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Apakah jarak antara rumah Ibu/Bpk/Sdr dengan rumah tetangga berdekatan (kurang dari 1 meter) atau lingkungan perumahan padat/rapat?',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Apakah pagar rumah Ibu/Bpk/Sdr terbuat dari potongan bambu atau beton yang dapat menampung air hujan (pagar berlubang) ?',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Apakah cahaya matahari dapat masuk ke dalam rumah?',
    value: '',
    options: ['Ya', 'Tidak']
  }
];

export const sanitarySkin = {
  name: '',
  age: '',
  job: '',
  education: '',
  parent: '',
  address: {
    name: '',
    nbAssociate: '',
    ctAssociate: '',
    rk: ''
  },
  ward: undefined
};

export const sanitarySkinForm = [
  {
    name: 'Sumber Air Bersih yang digunakan:',
    value: '',
    otherValue: '',
    options: [
      'Ledeng (PAM), mata air terlindung',
      'SGL/SPT',
      'Sumur Gali',
      'Sungai',
      'Empang',
      'Air hujan (PAH)',
      {
        label: 'Lain-lain',
        name: 'others',
        inputType: 'text'
      }
    ]
  },
  {
    name: 'Apakah sumber yang ada mencukupi kebutuhan',
    value: '',
    options: ['Cukup', 'Kurang']
  },
  {
    name: 'Dimana Bapak/Ibu/Saudara mandi sehari-hari?',
    value: '',
    otherValue: '',
    options: [
      'Kamar mandi sendiri',
      'MCK (Mandi Cuci Kakus), kamar mandi umum',
      'Empang',
      'Sungai',
      'Sumur',
      {
        label: 'Lain-lain',
        name: 'others',
        inputType: 'text'
      }
    ]
  },
  {
    name: 'Berapa jarak sumber air dengan sumber pencemaran (air limbah)',
    value: '',
    options: ['Lebih dari 10 meter.', 'Kurang dari 10 meter.']
  },
  {
    name: 'Berapa jarak sumber air dengan pembuangan sampan',
    value: '',
    options: ['Lebih dari 10 meter', 'Kurang dari 10 meter']
  },
  {
    name: 'Apakah pasien mandi pakai sabun ?',
    value: '',
    options: ['Ya', 'Tidak', 'Kadang-kadang']
  },
  {
    name: 'Bagaimana pola penggunaan handuk ( handuk mandi digunakan sendiri )',
    value: '',
    options: ['Ya', 'Tidak', 'Kadang-kadang']
  },
  {
    name: 'Apakah sabun yang digunakan untuk mandi digunakan',
    value: '',
    options: ['Bersama-sama', 'Masing-masing orang satu sabun']
  },
  {
    name: 'Apakah pasien berkuku pendek dan bersih ?',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Apakah pasien sebagai karyawan pabrik yang selalu kontak dengan bahan bahan kimia ?',
    value: '',
    options: ['Ya', 'Tidak']
  }
];

export const sanitaryWormy = {
  name: '',
  age: '',
  job: '',
  parent: '',
  address: {
    name: '',
    nbAssociate: '',
    ctAssociate: '',
    rk: ''
  },
  ward: undefined
};

export const sanitaryWormyForm = [
  {
    name: 'Apakah kuku penderita bersih ?',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Tempat tinggal penderita:',
    value: '',
    options: [
      'Daerah perkebunan',
      'Daerah pertambangan',
      'Daerah peternakan',
      'Daerah perumahan',
      'Daerah pasar',
      {
        label: 'Lain-lain',
        name: 'others',
        inputType: 'text'
      }
    ]
  },
  {
    name: 'Dimana anggota keluarga berak?',
    value: '',
    options: ['Kakus/WC sendiri', 'Kakus/WC umum', 'Sungai', 'Kebun', 'Empang']
  },
  {
    name: 'Jika penderita kecacingan anak sekolah, bahan lantai sekolah berupa',
    value: '',
    options: ['Tanah', 'Keramik, plester, tegel, papan']
  },
  {
    name: 'Apakah bahan lantai dirumah berupa ?',
    value: '',
    options: ['Tanah', 'Keramik, plester, tegel, papan']
  },
  {
    name: 'Apakah anggota keluarga biasa melakukan cuci tangan sebelum makan?',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Apakah anggota keluarga biasa melakukan cuci tangan sesudah berak?',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Apakah anggota keluarga menggunakan alas kaki?',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Apakah suka makan makanan mentah/lalapan?',
    value: '',
    options: ['Ya', 'Tidak']
  }
];

export const sanitaryISPA = {
  name: '',
  age: '',
  parent: {
    father: '',
    mother: ''
  },
  education: {
    father: '',
    mother: ''
  },
  address: '',
  ward: undefined
};

export const sanitaryISPAForm = [
  {
    name: 'Apakah terdapat batuk dan atau kesulitan benafas?',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Telah berapa lama menderita batuk-batuk seperti ini?',
    value: ''
  },
  {
    name: 'Berapa orang yang sakit seperti ini dalam keluarga?',
    value: ''
  },
  {
    name: 'Apakah pada siang hari di dalam rumah dalam keadaan gelap?',
    value: '',
    options: ['Ya', 'Sedang (antara terang dan gelap).', 'Tidak']
  },
  {
    name: 'Apakah di rumah terdapat atap tembus cahaya (kaca, fiber atau plastik tembus cahaya, dan lainnya) yang memungkinkan sinar matahari masuk ke dalam rumah?',
    value: '',
    options: ['Ya', 'Sedang', 'Tidak']
  },
  {
    name: 'Apakah di rumah terdapat pintu atau jendela yang tembus cahaya (kaca, fiber, plastik, dan lainnya)?',
    value: '',
    options: ['Ya', 'Tidak ada']
  },
  {
    name: 'Apakah penderita berada di dalam rumah dalam keadaan panas (sumuk/gerah) terutama pada siang hari?',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Apakah rumah penderita terdapat lubang hawa atau lubang angin?',
    value: '',
    options: ['Ya', 'Tidak ada']
  },
  {
    name: 'Luas rumah?',
    value: '',
    options: ['Kurang 8m2/orang.', '8 m2/orang', 'Lebih 8m/orang']
  },
  {
    name: 'Bahan bakar apa yang digunakan untuk memasak?',
    value: '',
    options: ['Gas', 'Minyak tanah', 'Arang', 'Kayu bakar']
  },
  {
    name: 'Apakah di dapur terdapat cerobong asap atau lubang tempat keluar asap?',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Apakah penderita tidur setempat tidur atau sekamar dengan orang lain (istri/suami, anak, dan lainnya)?',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Jika batuk kemanakan ludah/riak batuk dibuang?',
    value: '',
    options: [
      'Sembarang tempat',
      'Kamar mandi atau WC/jamban.',
      'Te mpat khusus ludah/riak (paidon).'
    ]
  },
  {
    name: 'Apakah setiap kali batuk penderita menutup mulut?',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Apakah anggota keluarga Bering memasak sambil momong anak?',
    value: '',
    options: ['Ya', 'Tidak']
  }
];

export const sanitaryTBP = {
  name: '',
  parent: '',
  age: '',
  job: '',
  address: '',
  ward: undefined
};

export const sanitaryTBPForm = [
  {
    name: 'Telah berapa lama menderita  batuk-batuk?',
    value: ''
  },
  {
    name: 'Berapa orang yang sakit seperti ini dalam keluarga?',
    value: ''
  },
  {
    name: 'Apakah ada anak balita?',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Apakah pads siang hari di dalam rumah dalam keadaan gelap?',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Apakah rumah penderita terdapat lubang haws atau lubang angin, agar sirkulasi udara di dalam rumah lancar?',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Apakah kamar tidak memiliki ventilasi/lubang angin?',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Apakah lantai rumah terbuat dari tanah?',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Apakah saudara tidur sekamar atau sekamar dengan orang lain (istri/suami, anak, dan lainnya)?',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Jika batuk, dibuang di tempat khusus ludah/riak (paidon, kamar mandi, atau WC/ Jamban)',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Apakah setiap kali batuk penderita menutup mulut?',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Apakah pengguna alat makan saudara dipisahkan dengan anggota keluarga ?',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: ' Apakah ventilasi di rumah Ibu/Bpk/Sdr dipasang "kasa" ?',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Apakah Ibu/Bpk/Sdr mempunyai kebiasaan menggantungkan pakaian di dalam rumah?',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Adakah Ibu/Bpk/Sdr mempunyai tempat penampungan air bersih seperti tempayan, gentong, drum atau sejenisnya?',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Apakah tempat penampungan air bersih seperti tempayan, gentong, drum atau sejenisnya tersebut diberi tutup?',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Apakah Ibu/Bpk/Sdr secara rutin seminggu sekali menguras bak mandi, bak WC, dan tempat penampungan air lainnya?',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: '6. Adakah Ibu/Bpk/Sdr memelihara tanaman dalam pot air?',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Apakah  Ibu/Bpk/Sdr  memelihara burung dalam sangkar  di dalam maupun di luar rumah ?',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Apakah tempat-tempat penampungan air yang jarang dikuras diberi bubuk larvasida/abate (zat yang dapat membunuh jentik atau membuat nyamuk mandul)?',
    value: '',
    options: ['Ya', 'Tidak']
  },
  {
    name: 'Apakah di rumah ada talang air yang tidak mengalir dan letaknya terlindung dari sinar matahari (misalnya terlindung pohon rindang)?',
    value: '',
    options: ['Ya', 'Tidak']
  }
];

const SanitaryAssesments = [
  {
    name: 'Diare',
    assesment: sanitaryDiareForm,
    nameLabel: 'Diare',
    baseForm: sanitaryDiareInitialValues
  },
  {
    name: 'Malaria',
    assesment: sanitaryMalariaForm,
    nameLabel: 'Malaria',
    baseForm: sanitaryMalaria
  },
  {
    name: 'DBD',
    assesment: sanitaryDBDForm,
    nameLabel: 'Demam Berdarah Dengue (DBD)',
    baseForm: sanitaryDBD
  },
  {
    name: 'Kulit',
    assesment: sanitarySkinForm,
    baseForm: sanitarySkin,
    nameLabel: 'Kulit'
  },
  {
    name: 'Kecacingan',
    assesment: sanitaryWormyForm,
    baseForm: sanitaryWormy,
    nameLabel: 'Kecacingan'
  },
  {
    name: 'ISPA',
    assesment: sanitaryISPAForm,
    baseForm: sanitaryISPA,
    nameLabel: 'ISPA'
  },
  {
    name: 'TBP',
    assesment: sanitaryTBPForm,
    baseForm: sanitaryTBP,
    nameLabel: 'TBP'
  }
];

export default SanitaryAssesments;
