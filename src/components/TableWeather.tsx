import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Item from '../interface/Item';
import { useEffect, useState } from 'react';

interface MyProp {
  itemsIn: Item[];
}

export default function TableWeather(props: MyProp) {
  let [rows, setRows] = useState<Item[]>([])
  useEffect( ()=> {
    setRows(props.itemsIn)
}, [props])
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="right">Día</TableCell>
            <TableCell align="right">Humedad;(%)</TableCell>
            <TableCell align="right">Precipitación;(%)</TableCell>
            <TableCell align="right">Temperatura;(kelvin)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow
              key={idx}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              
              <TableCell align="right">{row.day}</TableCell>
              <TableCell align="right">{row.humidity}</TableCell>
              <TableCell align="right">{row.precipitation}</TableCell>
              <TableCell align="right">{row.temperature}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}