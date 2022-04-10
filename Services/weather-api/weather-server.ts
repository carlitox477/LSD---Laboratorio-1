import * as net from "net"
import { AddressInfo, Socket } from "net"
import {getWeather, WeatherRequest} from './weather'

const PORT=4001

//Allows to manage multiple TCP connections
const server=net.createServer()

server.on('connection', (socket: Socket)=>{
    socket.setEncoding("utf-8")
    

    console.log(JSON.stringify(socket.address()))

    socket.on('data',(data: Buffer)=>{
        //It should recive a JSON with a date
        console.log(`[WEATHER SERVER] Request recived`)

        const weatherRequest: WeatherRequest=JSON.parse(data.toString()) as WeatherRequest
        
        const weather=getWeather(weatherRequest.date)
        const response={
            type: "RESPONSE",
            requestId: weatherRequest.requestId,
            weather: weather
        }
        socket.write(JSON.stringify(response),(err)=>{
            if(err){
                console.log(`Error sending ${JSON.stringify(response)}`)
            }else{
                console.log(`Success sending ${JSON.stringify(response)}`)
            }
        })
    })
    socket.on('close',()=>{
        const address=socket.address() as AddressInfo
        console.log(`[WEATHER SERVER] Communication with ${address.address}:${address.port} closed`)
    })
    socket.on('error',(err)=>{
        const address=socket.address() as AddressInfo
        console.log(`[WEATHER SERVER] Communication with ${address.address}:${address.port} has throw this error "${err.message}"`)
    })
})

server.listen(PORT,()=>{
    console.log("[WEATHER SERVER] RUNNING")
})