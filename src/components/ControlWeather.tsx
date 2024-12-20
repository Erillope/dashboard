{/* Componentes MUI */}

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { MyIndicatior } from "./LineChartWeather";
import { useRef } from 'react';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export interface OnChangeProp {
    onChange: (value: keyof MyIndicatior) => void
  };

export default function ControlWeather(onIndicatorChange: OnChangeProp) {

     {/* Constante de referencia a un elemento HTML */ }
     const descriptionRef = useRef<HTMLDivElement>(null);

    {/* Arreglo de objetos */}
    let items = [
        {"name":"precipitation", "description":"Cantidad de agua que cae sobre una superficie en un período específico."}, 
        {"name": "humidity", "description":"Cantidad de vapor de agua presente en el aire, generalmente expresada como un porcentaje."}, 
        {"name":"temperature", "description":"Grado de temperatura."}
    ]

    {/* Arreglo de elementos JSX */}
    let options = items.map( (item, key) => <MenuItem key={key} value={key}>{item["name"]}</MenuItem> )

    {/* Manejador de eventos */}
    const handleChange = (event: SelectChangeEvent) => {

        let idx = parseInt(event.target.value)
        // alert( idx );

        {/* Modificación de la referencia descriptionRef */}
        if (descriptionRef.current !== null) {
            descriptionRef.current.innerHTML = (idx >= 0) ? items[idx]["description"] : ""
            onIndicatorChange.onChange(items[idx].name as keyof MyIndicatior)
        }

    };

    {/* Variable de estado y función de actualización */}
       
    {/* JSX */}
    return (
        <Paper
            sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column'
            }}
        >

            <Typography mb={2} component="h3" variant="h6" color="primary">
                Variables Meteorológicas
            </Typography>

            <Box sx={{ minWidth: 120 }}>
                   
                <FormControl fullWidth>
                    <InputLabel id="simple-select-label">Variables</InputLabel>
                    <Select
                        labelId="simple-select-label"
                        id="simple-select"
                        label="Variables"
                        defaultValue='-1'
                        onChange={handleChange}
                    >
                        <MenuItem key="-1" value="-1" disabled>Seleccione una variable</MenuItem>

                        {options}

                    </Select>
                </FormControl>

            </Box>
            
            {/* Use la variable de estado para renderizar del item seleccionado */}
            {/* <Typography mt={2} component="p" color="text.secondary">
             {
                 (selected >= 0)?items[selected]["description"]:""
             }
             </Typography> */}
             <Typography ref={descriptionRef} mt={2} component="p" color="text.secondary" />
        </Paper>


    )
}
