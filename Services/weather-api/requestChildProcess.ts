import { getWeather, WeatherRequest } from "./weather";


const weatherRequestHandler=(request: WeatherRequest)=>{
    const weather=getWeather(request.date)
    const response={
        type: "RESPONSE",
        requestId: request.requestId,
        weather: weather
    }
    process.send?.(JSON.stringify(response))
}

const request= JSON.parse(process.argv[2]) as WeatherRequest
weatherRequestHandler(request)