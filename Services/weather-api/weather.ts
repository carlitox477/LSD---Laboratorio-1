import { SocketMessage } from "../../interfaces/request"

interface WeatherRequest extends SocketMessage {
    requestId: string,
    date: string
}

interface WeatherResponse extends SocketMessage {
    requestId: string,
    weather: string
}

const weather: string[]=[
    "SUNNY",
    "CLOUDY",
    "OVERCAST",
    "THUNDER STORM",
    "PARTLY SUNNY",
    "FOG",
    "SHOWERS",
    "HEAVY RAIN",
    "RAIN WITH SUN",
    "SNOWY",
    "PARTLY CLOUDY",
    "RAIN",
    "SLEET"
]

const getWeather=(dateString: string)=>{
    const date=new Date(dateString).setHours(0,0,0,0)
    return weather[date % weather.length]
}



export{getWeather, WeatherRequest,WeatherResponse}