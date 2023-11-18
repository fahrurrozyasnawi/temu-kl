import { forwardRef } from 'react';
import {
  Box,
  Grid,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack
} from '@mui/material';

const FormReportsPrint = forwardRef(({ data }, ref) => {
  return (
    <Box component="div" ref={ref}>
      <Box sx={{ p: 3 }}>
        <Grid container>
          <Grid item mb={4} xs={12}>
            <Typography
              textTransform="uppercase"
              textAlign="center"
              variant="h4"
            >
              REKAPITULASI TPP
            </Typography>
            <Typography
              textTransform="uppercase"
              textAlign="center"
              variant="h4"
            >
              {`Puskesmas ${data?.puskesmas.name}`}
            </Typography>
            <Typography
              textTransform="uppercase"
              textAlign="center"
              variant="h4"
            >
              {`Per tanggal : ${moment(data?.report?.period).format(
                'YYYY-MM-dd'
              )}`}
            </Typography>
          </Grid>

          {/* base form */}
          <Grid item xs={4}>
            <Typography variant="h6">Nama TPP</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography>: {data?.tpp?.name}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">Pemilik</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography>: {data?.owner}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">Alamat</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography>: {data?.tpp?.address}</Typography>
          </Grid>

          {/* table form assesments */}
          <Grid mt={3} item xs={12}>
            <TableContainer>
              <Table sx={{ border: '1px solid #dddddd' }}>
                <TableHead>
                  <TableRow>
                    <TableCell>No</TableCell>
                    <TableCell>Nama TPP</TableCell>
                    <TableCell>Jenis TPP</TableCell>
                    <TableCell>Alamat</TableCell>
                    <TableCell>Provinsi</TableCell>
                    <TableCell>Kab/Kota</TableCell>
                    <TableCell>Kecamatan</TableCell>
                    <TableCell>Puskesmas</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.tpps?.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>No</TableCell>
                      <TableCell>Nama TPP</TableCell>
                      <TableCell>Jenis TPP</TableCell>
                      <TableCell>Alamat</TableCell>
                      <TableCell>Provinsi</TableCell>
                      <TableCell>Kab/Kota</TableCell>
                      <TableCell>Kecamatan</TableCell>
                      <TableCell>Puskesmas</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* signature */}
          <Grid mt={2} item xs={12}>
            <Stack direction="row" gap={4} justifyContent="flex-end">
              <Stack spacing={6}>
                <Box>
                  <Typography variant="h6">Mengetahui :</Typography>
                  <Typography variant="h6">
                    {data?.report.leader?.position}
                  </Typography>
                </Box>
                <Typography variant="h6">
                  {data?.report?.leader?.name}
                </Typography>
              </Stack>
              <Stack spacing={6}>
                <Box>
                  <Typography variant="h6">Dibuat Oleh,</Typography>
                  <Typography variant="h6">
                    {data?.report.maker?.position}
                  </Typography>
                </Box>
                <Typography variant="h6">
                  {data?.report?.maker?.name}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
});
