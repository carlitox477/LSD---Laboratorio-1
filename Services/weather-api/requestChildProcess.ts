import { Socket } from "net";
import { getWeather, WeatherRequest } from "./weather";


const weatherRequestHandler=(request: WeatherRequest,socket: Socket)=>{
    console.log(`[WEATHER SERVER] Request recived`) 
    const weather=getWeather(request.date)
    const response={
        type: "RESPONSE",
        requestId: request.requestId,
        weather: weather
    }
    socket.write(JSON.stringify(response),(err)=>{
        if(err){
            console.log(`Error sending ${JSON.stringify(response)}`)
        }else{
            console.log(`Success sending ${JSON.stringify(response)}`)
        }
    })
}

const [,,requestString,socketString]=process.argv;
const request= JSON.parse(requestString) as WeatherRequest
const socket= JSON.parse(socketString) as Socket

weatherRequestHandler(request,socket)
