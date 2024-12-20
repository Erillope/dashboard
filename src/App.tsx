//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import Grid from '@mui/material/Grid2'
import './App.css'
import IndicatorWeather from './components/IndicatorWeather';
import TableWeather from './components/TableWeather';
import ControlWeather from './components/ControlWeather';
import LineChartWeather, { MyIndicatior } from "./components/LineChartWeather";
import Item from './interface/Item';
import { useEffect, useState } from 'react';

interface Indicator {
  title?: String;
  subtitle?: String;
  value?: String;
}

function App() {
  //const [count, setCount] = useState(0)

  {/* Variable de estado y función de actualización */ }
  let [indicator, setIndicator] = useState<keyof MyIndicatior>("humidity")
  let [indicators, setIndicators] = useState<Indicator[]>([])
  let [owm, setOWM] = useState(localStorage.getItem("openWeatherMap"))
  let [items, setItems] = useState<Item[]>([])
  
  let onChange = (indicator: keyof MyIndicatior) => {
    setIndicator(indicator)
  }
  {/* Hook: useEffect */ }
  useEffect(() => {
    
    let request = async () => {

      {/* Referencia a las claves del LocalStorage: openWeatherMap y expiringTime */ }
      let savedTextXML = localStorage.getItem("openWeatherMap") || "";
      let expiringTime = localStorage.getItem("expiringTime");

      {/* Obtenga la estampa de tiempo actual */ }
      let nowTime = (new Date()).getTime();

      {/* Verifique si es que no existe la clave expiringTime o si la estampa de tiempo actual supera el tiempo de expiración */ }
      if (expiringTime === null || nowTime > parseInt(expiringTime)) {

        {/* Request */ }
        let API_KEY = "5c94f9ff69ea2d9c9245c6e59d3b0c95"
        let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`)
        savedTextXML = await response.text();

        {/* Tiempo de expiración */ }
        let hours = 0.01
        let delay = hours * 3600000
        let expiringTime = nowTime + delay

        {/* En el LocalStorage, almacene el texto en la clave openWeatherMap, estampa actual y estampa de tiempo de expiración */ }
        localStorage.setItem("openWeatherMap", savedTextXML)
        localStorage.setItem("expiringTime", expiringTime.toString())
        localStorage.setItem("nowTime", nowTime.toString())

        {/* DateTime */ }
        localStorage.setItem("expiringDateTime", new Date(expiringTime).toString())
        localStorage.setItem("nowDateTime", new Date(nowTime).toString())

        {/* Modificación de la variable de estado mediante la función de actualización */ }
        setOWM(savedTextXML)
      }

      {/* Valide el procesamiento con el valor de savedTextXML */}
      if( savedTextXML ) {

        {/* XML Parser */ }
        const parser = new DOMParser();
        const xml = parser.parseFromString(savedTextXML, "application/xml");

        {/* Arreglo para agregar los resultados */ }

        let dataToIndicators: Indicator[] = new Array<Indicator>();

        {/* 
            Análisis, extracción y almacenamiento del contenido del XML 
            en el arreglo de resultados
        */}

        let name = xml.getElementsByTagName("name")[0].innerHTML || ""
        let times = xml.getElementsByTagName("time")
        let items: Item[] = new Array<Item>();

        let now = new Date(times[0].getAttribute("from") || "").getDate();
        let days = ["2024-12-"+now.toString()]
        let humidities = []
        let precipitations = []
        let temperatures = []
        let dayHumidities = []
        let dayPrecipitation = []
        let dayTemperatures = []
        
        for (let i = 0; i <times.length; i++){
          let day = times[i].getAttribute("from") || ""
          let time_day = new Date(day).getDate()
          
          if (now != time_day){
            humidities.push(dayHumidities.reduce((acumulador, numero) => acumulador + numero, 0)/dayHumidities.length)
            precipitations.push(dayPrecipitation.reduce((acumulador, numero) => acumulador + numero, 0)/dayPrecipitation.length)
            temperatures.push(dayTemperatures.reduce((acumulador, numero) => acumulador + numero, 0)/dayTemperatures.length)
            dayPrecipitation = []
            dayHumidities = []
            dayHumidities.push(parseInt(times[i].getElementsByTagName("humidity")[0].getAttribute("value") || ""))
            dayPrecipitation.push(parseFloat(times[i].getElementsByTagName("precipitation")[0].getAttribute("probability") || ""))
            dayTemperatures.push(parseFloat(times[i].getElementsByTagName("temperature")[0].getAttribute("value") || ""))
            now = time_day
            days.push("2024-12-"+now.toString())
          }
          else{
            dayHumidities.push(parseInt(times[i].getElementsByTagName("humidity")[0].getAttribute("value") || ""))
            dayPrecipitation.push(parseFloat(times[i].getElementsByTagName("precipitation")[0].getAttribute("probability") || ""))
            dayTemperatures.push(parseFloat(times[i].getElementsByTagName("temperature")[0].getAttribute("value") || ""))
          }
          
          
        }
        days.push("Promedio")
        humidities.push(dayHumidities.reduce((acumulador, numero) => acumulador + numero, 0)/dayHumidities.length)
        humidities.push(humidities.reduce((acumulador, numero) => acumulador + numero, 0)/humidities.length)
        precipitations.push(dayPrecipitation.reduce((acumulador, numero) => acumulador + numero, 0)/dayPrecipitation.length)
        precipitations.push(precipitations.reduce((acumulador, numero) => acumulador + numero, 0)/precipitations.length)
        temperatures.push(dayTemperatures.reduce((acumulador, numero) => acumulador + numero, 0)/dayTemperatures.length)
        temperatures.push(temperatures.reduce((acumulador, numero) => acumulador + numero, 0)/temperatures.length)

        for (let i = 0; i <days.length; i++){
          items.push({
            "day": days[i],
            "precipitation": precipitations[i].toFixed(2).toString(),
            "humidity": humidities[i].toFixed(2).toString(),
            "temperature": temperatures[i].toFixed(2).toString()
        })
        }
        setItems(items)
        dataToIndicators.push({ "title": "Location", "subtitle": "City", "value": name })

        let location = xml.getElementsByTagName("location")[1]

        let latitude = location.getAttribute("latitude") || ""
        dataToIndicators.push({ "title": "Location", "subtitle": "Latitude", "value": latitude })

        let longitude = location.getAttribute("longitude") || ""
        dataToIndicators.push({ "title": "Location", "subtitle": "Longitude", "value": longitude })

        let altitude = location.getAttribute("altitude") || ""
        dataToIndicators.push({ "title": "Location", "subtitle": "Altitude", "value": altitude })

        // console.log( dataToIndicators )

        {/* Modificación de la variable de estado mediante la función de actualización */ }
        setIndicators(dataToIndicators)


      }
    }

    request();

  }, [owm])

  let renderIndicators = () => {

    return indicators
      .map(
        (indicator, idx) => (
          <Grid key={idx} size={{ xs: 12, xl: 3 }}>
            <IndicatorWeather
              title={indicator["title"]}
              subtitle={indicator["subtitle"]}
              value={indicator["value"]} />
          </Grid>
        )
      )

  }

  return (
    <Grid container spacing={5}>

      {/* Indicadores */}
      {/* <Grid size={{ xs: 12, xl: 3 }}>
        <IndicatorWeather title={'Indicator 1'} subtitle={'Unidad 1'} value={"1.23"} />
      </Grid>
      <Grid size={{ xs: 12, xl: 3 }}>
        <IndicatorWeather title={'Indicator 2'} subtitle={'Unidad 2'} value={"3.12"} />
      </Grid>
      <Grid size={{ xs: 12, xl: 3 }}>
        <IndicatorWeather title={'Indicator 3'} subtitle={'Unidad 3'} value={"2.31"} />
      </Grid>
      <Grid size={{ xs: 12, xl: 3 }}>
        <IndicatorWeather title={'Indicator 4'} subtitle={'Unidad 4'} value={"3.21"} />
      </Grid> */}
      {renderIndicators()}

      {/* Tabla */}
      <Grid size={{ xs: 12, xl: 8 }}>
        {/* Grid Anidado */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, xl: 3 }}>
            <ControlWeather onChange={onChange}/>
          </Grid>
          <Grid size={{ xs: 12, xl: 9 }}>
          <TableWeather itemsIn={ items } />
          </Grid>
        </Grid>
      </Grid>


      {/* Gráfico */}
      <Grid size={{ xs: 12, xl: 4 }}>
        <LineChartWeather itemsIn={items} indicator={indicator} />
      </Grid>

    </Grid>
  )
}

export default App
