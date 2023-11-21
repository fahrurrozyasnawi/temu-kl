import { useEffect, useState } from 'react';

// material-ui
import {
  Box,
  Card,
  Grid,
  Stack,
  Typography,
  LinearProgress,
  styled,
  linearProgressClasses
} from '@mui/material';
import {
  IconBuildingCommunity,
  IconCheckupList,
  IconFrame
} from '@tabler/icons-react';

// project imports
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import { gridSpacing } from 'store/constant';
import TitleCard from 'ui-component/cards/TitleCard';
import StatusCard from 'ui-component/cards/StatusCard';
import API from 'api';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800]
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'
  }
}));

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  const [dataTFU, setDataTFU] = useState({
    card: [],
    chartData: { label: [], data: [] }
  });
  const [dataTPP, setDataTPP] = useState({
    card: [],
    chartData: { label: [], data: [] }
  });
  const [dataSanitary, setDataSanitary] = useState({
    card: [],
    chartData: { label: [], data: [] }
  });
  const [dataWater, setDataWater] = useState({
    card: [],
    chartData: { label: [], data: [] }
  });
  const [dataHealthyHouse, setDataHealthyHouse] = useState({
    card: [],
    chartData: { label: [], data: [] }
  });

  useEffect(() => {
    const fetchData = async () => {
      await API.getDashboard()
        .then((res) => {
          const { data } = res.data;

          // tfu dashboard
          const dataCardTFU = [
            { name: 'Jumlah TFU Terdaftar', data: data.tfu?.totalTFU },
            { name: 'Jumlah TFU DiIKL/Dibina', data: data.tfu?.totalIKLTFU },
            { name: 'Jumlah Memenuhi Syarat', data: data.tfu?.syarat },
            { name: 'Jumlah Tidak Memenuhi Syarat', data: data.tfu?.nonSyarat }
          ];
          const chartDataTFU = data.tfu?.chartData;

          // tpp dashboard
          const dataCardTPP = [
            { name: 'Jumlah TPP Terdaftar', data: data.tpp?.totalTPP },
            { name: 'Jumlah TPP DiIKL/Dibina', data: data.tpp?.totalIKLTPP },
            { name: 'Jumlah Memenuhi Syarat', data: data.tpp?.syarat },
            { name: 'Jumlah Tidak Memenuhi Syarat', data: data.tpp?.nonSyarat }
          ];
          const chartDataTPP = data.tpp?.chartData;

          // water dashboard
          const dataCardWater = [
            { name: 'Jumlah SAM', data: data.water?.totalWater },
            { name: 'Jumlah SAM di-IKL', data: data.water?.totalIKLWater },
            {
              name: 'Jumlah SAM Resiko Rendah',
              data: data.water?.resiko?.rendah
            },
            {
              name: 'Jumlah SAM Resiko Sedang',
              data: data.water?.resiko?.sedang
            },
            {
              name: 'Jumlah SAM Resiko Tinggi',
              data: data.water?.resiko?.tinggi
            },
            {
              name: 'Jumlah SAM Resiko Ammat Tinggi',
              data: data.water?.resiko?.amatTinggi
            }
          ];
          const chartDataWater = data.water?.chartData;

          // healthy house dashboard
          const dataCardHealthyHouse = [
            { name: 'Jumlah Sanitasi Rumah', data: data.hh?.totalHH },
            { name: 'Jumlah Rumah DiIKL/Dibina', data: data.hh?.totalIKLHH },
            { name: 'Jumlah Memenuhi Syarat', data: data.hh?.syarat },
            { name: 'Jumlah Tidak Memenuhi Syarat', data: data.hh?.nonSyarat }
          ];
          const chartDataHealthyHouse = data.hh?.chartData;

          // healthy house dashboard
          const dataCardSanitary = [
            { name: 'Jumlah Pasien', data: data.sanitary?.totalSanitary },
            { name: 'Jumlah Jenis Penyakit', data: data.sanitary?.byType },
            { name: 'Jumlah Konseling', data: data.sanitary?.byCounseling }
          ];
          const chartDataSanitary = data.sanitary?.chartData;

          // set state
          setDataTFU((prev) => ({
            ...prev,
            card: dataCardTFU,
            chartData:
              chartDataTFU?.label?.length > 0
                ? chartDataTFU
                : { label: [], data: [] }
          }));
          setDataTPP((prev) => ({
            ...prev,
            card: dataCardTPP,
            chartData:
              chartDataTPP?.label?.length > 0
                ? chartDataTPP
                : { label: [], data: [] }
          }));
          setDataWater((prev) => ({
            ...prev,
            card: dataCardWater,
            chartData:
              chartDataWater?.label?.length > 0
                ? chartDataWater
                : { label: [], data: [] }
          }));
          setDataHealthyHouse((prev) => ({
            ...prev,
            card: dataCardHealthyHouse,
            chartData:
              chartDataHealthyHouse?.label?.length > 0
                ? chartDataHealthyHouse
                : { label: [], data: [] }
          }));
          setDataSanitary((prev) => ({
            ...prev,
            card: dataCardSanitary,
            chartData:
              chartDataSanitary?.label?.length > 0
                ? chartDataSanitary
                : { label: [], data: [] }
          }));

          setLoading(false);
        })
        .catch((err) => console.log('err', err));
    };

    fetchData();
  }, []);

  return (
    <Grid container spacing={gridSpacing}>
      {/* Water */}
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            <TitleCard
              title="Penyehatan Air"
              icon={<IconBuildingCommunity size={52} />}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {dataWater.card?.map((item, index) => (
                <Grid item xs={3} key={index}>
                  <StatusCard
                    value={item.data}
                    icon={<IconCheckupList size={64} />}
                    description={item.name}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            <TotalGrowthBarChart
              title="Grafik"
              data={dataWater.chartData}
              isLoading={isLoading}
            />
          </Grid>
        </Grid>
      </Grid>

      {/* Healthy House */}
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            <TitleCard
              title="Penyehatan Rumah"
              icon={<IconBuildingCommunity size={52} />}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {dataHealthyHouse.card?.map((item, index) => (
                <Grid item xs={3} key={index}>
                  <StatusCard
                    value={item.data}
                    icon={<IconCheckupList size={64} />}
                    description={item.name}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            <TotalGrowthBarChart
              title="Grafik"
              data={dataHealthyHouse.chartData}
              isLoading={isLoading}
            />
          </Grid>
        </Grid>
      </Grid>

      {/* TPP */}
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            <TitleCard
              title="Tempat Pengolahan Pangan"
              icon={<IconBuildingCommunity size={52} />}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {dataTPP.card?.map((item, index) => (
                <Grid item xs={3} key={index}>
                  <StatusCard
                    value={item.data}
                    icon={<IconCheckupList size={64} />}
                    description={item.name}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            <TotalGrowthBarChart
              title="Grafik"
              data={dataTPP.chartData}
              isLoading={isLoading}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            <TitleCard
              title="Tempat Fasilitas Umum"
              icon={<IconBuildingCommunity size={52} />}
            />
          </Grid>
          {/* <Grid item xs={12} sm={6}>
            <Card sx={{ p: 2 }}>
              <Stack
                sx={{ minHeight: 180, pb: 3 }}
                justifyContent="space-between"
              >
                <Stack gap={0.5}>
                  <Typography variant="h5">Realisasi Capaian</Typography>
                  <Typography variant="caption">
                    CAPAIAN TFU YANG DILAKUKAN PENGAWASAN SESUAI STANDAR (IKL)
                  </Typography>
                </Stack>
                <Stack gap={2}>
                  <Typography textAlign="center" variant="h1">
                    90%
                  </Typography>
                  <BorderLinearProgress variant="determinate" value={90} />
                </Stack>
              </Stack>
            </Card>
          </Grid> */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {dataTFU.card?.map((item, index) => (
                <Grid item xs={3} key={index}>
                  <StatusCard
                    value={item.data}
                    icon={<IconCheckupList size={64} />}
                    description={item.name}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            <TotalGrowthBarChart
              title="Grafik TFU"
              data={dataTFU.chartData}
              isLoading={isLoading}
            />
          </Grid>
        </Grid>
      </Grid>

      {/* Sanitary */}
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            <TitleCard
              title="Klinik Sanitasi"
              icon={<IconBuildingCommunity size={52} />}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {dataSanitary.card?.map((item, index) => (
                <Grid item xs={3} key={index}>
                  <StatusCard
                    value={item.data}
                    icon={<IconCheckupList size={64} />}
                    description={item.name}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            <TotalGrowthBarChart
              title="Grafik"
              data={dataSanitary.chartData}
              isLoading={isLoading}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
