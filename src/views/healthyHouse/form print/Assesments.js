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
import { TPPContext } from 'contexts/TPPContext';
import moment from 'moment';
import React, { forwardRef, Fragment, useContext, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { getLabel } from 'utils/generator';

const DialogFormPrint = ({ open, onClose }) => {
  const { dataTPPAssesment } = useContext(TPPContext);

  console.log('data hh assesment', dataTPPAssesment);

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
        <FormAssesmentsPrint data={dataTPPAssesment} ref={componentRef} />
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
        <Grid container>
          <Grid item mb={4} xs={12}>
            <Typography
              textTransform="uppercase"
              textAlign="center"
              variant="h4"
            >
              {`LAPORAN HASIL INSPEKSI SANITASI ${data?.hh?.type}`}
            </Typography>
          </Grid>

          {/* base form */}
          <Grid item xs={4}>
            <Typography variant="h6">{`Nama ${data?.hh?.type}`}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">
              {data?.hh?.type === 'Sanitasi Rumah Sehat'
                ? 'Nama KK'
                : 'Nama Pemilik Sarana'}
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography>: {data?.hh?.name}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">Alamat</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography>: {data?.address}</Typography>
          </Grid>
          {data?.hh?.type === 'Sanitasi Rumah Sehat' ? (
            <Fragment>
              <Grid item xs={4}>
                <Typography variant="h6">Alamat</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography>: {data?.address}</Typography>
              </Grid>
            </Fragment>
          ) : (
            <Fragment>
              <Grid item xs={4}>
                <Typography variant="h6">Alamat</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography>: {data?.address}</Typography>
              </Grid>
            </Fragment>
          )}

          <Grid item xs={4}>
            <Typography variant="h6">Tanggal Kunjugan/Pemeriksaan</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography>
              : {moment(data?.assesmentDate).format('LL')}
            </Typography>
          </Grid>

          {/* table form assesments */}
          <Grid mt={3} item xs={12}>
            <TableContainer>
              <Table sx={{ border: '1px solid #dddddd' }}>
                <TableHead>
                  <TableRow>
                    <TableCell>No</TableCell>
                    <TableCell>Kriteria Penilaian</TableCell>
                    <TableCell>Nilai</TableCell>
                    <TableCell>Score</TableCell>
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
          <TableCell>{item.score || '-'}</TableCell>
          <TableCell>{item.value === 'Ya' ? item.score : 0}</TableCell>
        </TableRow>
      )}
    </Fragment>
  );
};

export default DialogFormPrint;
