import Paper from '@mui/material/Paper';
import { LineChart } from '@mui/x-charts/LineChart';
import Item from '../interface/Item';

export interface MyIndicatior {
    day: string;
    humidity: number;
    temperature: number;
    precipitation: number,
  }

export interface LineChartProp {
  itemsIn: Item[];
  indicator: keyof MyIndicatior
}


export default function LineChartWeather(props: LineChartProp) {
    const xLabels = props.itemsIn.map(item => item.day).slice(0,props.itemsIn.length-1)
    const pData = props.itemsIn.map(item => parseFloat(item[props.indicator].toString())).slice(0,props.itemsIn.length-1)
    return (
        <Paper
            sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column'
            }}
        >

            {/* Componente para un gráfico de líneas */}
            <LineChart
                width={400}
                height={250}
                series={[
                    { data: pData, label: props.indicator },
                ]}
                xAxis={[{ scaleType: 'point', data: xLabels }]}
            />
        </Paper>
    );
}