import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { WaterContext } from 'contexts/WaterContext';
import moment from 'moment';
import React, { forwardRef, Fragment, useContext, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { getLabel } from 'utils/generator';

const DialogFormPrint = ({ open, onClose }) => {
  const { dataWaterAssesment } = useContext(WaterContext);

  const componentRef = useRef();

  const handlePrintOut = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `
      @media print {
        margin: 20mm; /* You can use other units like px, cm, etc. */
      }
    `
  });

  return (
    <Dialog open={open}>
      <DialogContent>
        <FormAssesmentsPrint data={dataWaterAssesment} ref={componentRef} />
      </DialogContent>
      <DialogActions>
        <Stack direction="row" gap={2}>
          <Button onClick={() => handlePrintOut()} variant="contained">
            Print
          </Button>
          <Button onClick={() => onClose()}>Tutup</Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

const FormAssesmentsPrint = forwardRef(({ data }, ref) => {
  return (
    <Box component="div" ref={ref}>
      <Box sx={{ p: 3 }}>
        <Grid container spacing={1}>
          <Grid item mb={4} xs={12}>
            <Typography
              textTransform="uppercase"
              textAlign="center"
              variant="h4"
            >
              Laporan Hasil Intervensi Kesehatan Lingkungan
            </Typography>
          </Grid>

          {/* base form */}
          <Grid mb={2} item xs={12}>
            <Typography variant="h5">Informasi Umum</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Nama Pengelola SAM</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>: {data?.water?.name}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Legalitas</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>: {data?.water?.legality}</Typography>
          </Grid>
          {data?.water?.legality === 'Ya' && (
            <Fragment>
              <Grid item xs={6}>
                <Typography variant="h6">No. SK</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>: {data?.water?.letterNum}</Typography>
              </Grid>
            </Fragment>
          )}
          <Grid item xs={6}>
            <Typography variant="h6">No. Telp/HP Penanggung Jawab</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>: {data?.water?.phone}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Kode Penyelenggara</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>: {data?.water?.eventCode}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Provinsi</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>: {data?.water?.province?.nama}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Kabupaten/Kota</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>: {data?.water?.region?.nama}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Kecamatan</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>: {data?.water?.district?.nama}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Desa/Kelurahan</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>: {data?.water?.ward?.nama}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Klasifikasi Desa/Kelurahan</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>: {data?.water?.ward?.class}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Kepala Desa/Kelurahan</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>: {data?.water?.headWard}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">No. Telp Kepala Desa/Kelurahan</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>: {data?.water?.phoneHeadWard}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">
              Tersedia Pengawas Internal Kualitas Air Minum
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>: {data?.water?.isPersonQC}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">
              Pelatihan Pengawas Internal Kualitas Air Minum
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>: {data?.water?.trainingStatus}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Sumhber Air</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography sx={{ pl: 2 }} variant="h6">
              A. Nama
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>: {data?.water?.waterSource?.name}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography sx={{ pl: 2 }} variant="h6">
              B. Jenis Sarana
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>: {data?.water?.waterSource?.mediumType}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography sx={{ pl: 2 }} variant="h6">
              C. Kondisi Sarana
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>: {data?.water?.waterSource?.condition}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography sx={{ pl: 2 }} variant="h6">
              D. Sambungan Meteran Air ke Rumah
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>: {data?.water?.waterSource?.waterPipe}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography sx={{ pl: 2 }} variant="h6">
              E. Jam Operasional
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              : {moment(data?.water?.waterSource?.timeOp).format('HH:mm')}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography sx={{ pl: 2 }} variant="h6">
              F. Target Layanan
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>: {data?.water?.waterSource?.serviceTarget}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="h6">
              Jumlah Instalasi Penglolahan Air (Sumber Air/Reservoir)
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Stack>
              <Typography>: {data?.water?.nInstallation?.ipa}</Typography>
              <Typography>{`  ${data?.water?.nInstallation?.reservoir}`}</Typography>
            </Stack>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="h6">Total Populasi Rumah Tangga</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>{`: ${data?.water?.nPopulate?.num} per ${data?.water?.nPopulate?.populateType}`}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">
              Jumlah Pelanggan/Rumah Tangga yang Dilayani{' '}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>{`: ${data?.water?.nCust?.num} per ${data?.water?.nCust?.populateType}`}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="h6">Cakupan Desa</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>: {data?.water?.scope?.ward}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Cakupan Kecamatan</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>: {data?.water?.scope?.district}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Cakupan Kab/Kota</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>: {data?.water?.scope?.region}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Cakupan Provinsi</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>: {data?.water?.scope?.province}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">
              Ada Pengelolaan Tarif atau Tidak
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>: {data?.water?.isManagementRate}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Tarif</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>: {data?.water?.rates}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">BOP Pemeliharaan</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>: {data?.water?.maintenance}</Typography>
          </Grid>

          {/* inspeksi */}
          <Grid item xs={12}>
            <Typography variant="h5">Inspeksi Kesehatan Lingkungan</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Jenis Sarana SAM</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>: {data?.water?.type}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Temperatur</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              : {`${data?.water?.temperature} &#186; Celicius`}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Presipitasi Saat IKL</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>: {data?.water?.precipitation}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Tahun Konstruksi</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>: {data?.water?.year}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">
              Apakah Sarana Terletak Di Daerah Banjir
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>: {data?.water?.isFloodPlace?.value}</Typography>
          </Grid>
          {data?.isFloodPlace?.value === 'Ya' && (
            <Fragment>
              <Grid item xs={6}>
                <Typography variant="h6">
                  Jika "Ya", jelaskan frekuensi banjir, lama dan tingkat
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>: {data?.water?.isFloodPlace?.reason}</Typography>
              </Grid>
            </Fragment>
          )}
          <Grid item xs={6}>
            <Typography variant="h6">Apakah Saat Ini Air Tersedia</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>: {data?.water?.waterAvailable?.value}</Typography>
          </Grid>
          {data?.waterAvailable?.value === 'Tidak' && (
            <Fragment>
              <Grid item xs={6}>
                <Typography variant="h6">
                  Jika "Tidak", sebutkan alasannya?
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>: {data?.water?.waterAvailable?.reason}</Typography>
              </Grid>
            </Fragment>
          )}
          <Grid item xs={6}>
            <Typography variant="h6">Titik GPS</Typography>
          </Grid>
          <Grid item xs={6}>
            <Stack>
              <Typography>: {data?.water?.loc?.lu}</Typography>
              <Typography>: {data?.water?.loc?.ls}</Typography>
            </Stack>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="h6">Tanggal</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>: {moment(data?.reviewDate).format('LL')}</Typography>
          </Grid>

          {/* table form assesments */}
          <Grid mt={3} item xs={12}>
            <TableContainer>
              <Table sx={{ border: '1px solid #dddddd' }}>
                <TableHead>
                  <TableRow>
                    <TableCell>No</TableCell>
                    <TableCell>Pertanyaan</TableCell>
                    <TableCell>Tidak</TableCell>
                    <TableCell>Ya</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.assesments?.map((item, idx) => (
                    <RenderItem item={item} index={idx} level={1} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* signature */}
          <Grid mt={2} item xs={12}>
            <Stack spacing={6}>
              <Typography variant="h6">Pemeriksa,</Typography>
              <Typography variant="h6">{data?.reviewer}</Typography>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
});

const RenderItem = ({ item, index, level }) => {
  const labelPrefix = getLabel(level, index);

  return (
    <Fragment>
      {item.children ? (
        <Fragment>
          <TableRow>
            <TableCell sx={{ fontWeight: level === 1 ? 'bold' : 'normal' }}>
              {labelPrefix}
            </TableCell>
            <TableCell
              sx={{ fontWeight: level === 1 ? 'bold' : 'normal' }}
              colSpan={5}
            >
              {item.name}
            </TableCell>
          </TableRow>
          {item.children?.map((child, childIdx) => (
            <RenderItem
              key={childIdx}
              item={child}
              level={level + 1}
              index={childIdx}
            />
          ))}
        </Fragment>
      ) : (
        <TableRow>
          <TableCell>{labelPrefix}</TableCell>
          <TableCell>{item.name}</TableCell>
          <TableCell>
            {item.value === 'Tidak' ? <p>&#10004;</p> : null}
          </TableCell>
          <TableCell>{item.value === 'Ya' ? <p>&#10004;</p> : null}</TableCell>
        </TableRow>
      )}
    </Fragment>
  );
};

export default DialogFormPrint;
