import * as net from "net"
import { Socket} from "net"
import {weatherRequestHandler, weatherResponseHandler,WeatherMainServerRequest,weatherClient_INFO} from "./weather-service-handler"
import {horoscopeRequestHandler,horoscopeResponseHandler, HoroscopeMainServerRequest,horoscopeClient_INFO} from "./horoscope-service-handler"
import {WeatherResponse} from "../Services/weather-api/weather"
import {HoroscopeResponse} from "../Services/horoscope-api/horoscope"


const PORT=4000
let requestMapping: Map<string, Socket>=new Map<string, Socket>()

//Server creation
const server=net.createServer()
//Socket creation
const weatherClient =net.createConnection(weatherClient_INFO)
const horoscopeClient =net.createConnection(horoscopeClient_INFO)

weatherClient.setEncoding("utf-8")
horoscopeClient.setEncoding("utf-8")

weatherClient.on("data",(data)=>{
    const response=JSON.parse(data.toString()) as WeatherResponse
    console.log(`[MAIN SERVER] HANDLING WEATHER RESPONSE`)

    if(response.type==="RESPONSE"){
        const requestId=response.requestId
        const clientSocket=requestMapping.get(requestId)
        weatherResponseHandler(requestId,clientSocket as Socket,response as WeatherResponse, requestMapping)
    }
})


horoscopeClient.on("data",(data)=>{
    const response=JSON.parse(data.toString()) as HoroscopeResponse
    console.log(`[MAIN SERVER] HANDLING HOROSCOPE RESPONSE`)

    if(response.type==="RESPONSE"){
        const requestId=response.requestId
        const clientSocket=requestMapping.get(requestId)
        horoscopeResponseHandler(requestId,clientSocket as Socket,response as HoroscopeResponse, requestMapping)
    }
})

// Given the event arquitecture and that the main server just accept and resend request and response
// It seems that we don't need to fork into child processes to manage the request and response
server.on('connection',(clientSocket: Socket)=>{
    clientSocket.setEncoding("utf-8")
    
    clientSocket.on('data',(data:Buffer)=>{
        const request=JSON.parse(data.toString())

        if(request.type==="WEATHER"){
            const weatherRequest = request as WeatherMainServerRequest;
            weatherRequestHandler(clientSocket,weatherRequest.date, weatherClient,requestMapping)            
            
        }else if(request.type==="HOROSCOPE"){
            const horoscopeRequest = request as HoroscopeMainServerRequest;
            horoscopeRequestHandler(clientSocket,horoscopeRequest.date,horoscopeRequest.zodiacalSignId,requestMapping,horoscopeClient)
            
        }else{
            console.log("[MAIN SERVER] Strange data recieve, closing connection")
            clientSocket.end()
        }
        
    })
    clientSocket.on('close',()=>{
        console.log("Connection ended")
    })
    clientSocket.on('error',(err)=>{
        console.log(err.message)
    })
})



server.listen(PORT,()=>{
    console.log("[MAIN SERVER] RUNNING")
})