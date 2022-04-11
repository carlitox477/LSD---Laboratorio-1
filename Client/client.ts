import * as net from "net"
import { AddressInfo } from "net"
import { SocketMessage } from "../interfaces/request";
import { HoroscopeMainServerResponse } from "../Server/horoscope-service-handler";
import { WeatherMainServerResponse } from "../Server/weather-service-handler";


import { askMainOption, SERVER_INFO,CLIENT_INFO } from "./client-utils";



const clientServer=net.createServer()

const client =net.createConnection({
    host: SERVER_INFO.host, //Host to connect
    port: SERVER_INFO.port  //Port to connect
})

client.setEncoding("utf-8")

client.on('connect',()=>{
    //Event that will happen after connection is achieved
    const address=client.address() as AddressInfo
    console.log(`Connection to ${address.address}:${address.port} established}`)
    console.log("Welcome to client UI")
    const optionHandler=askMainOption()
    optionHandler(client)
})

client.on('data',(response)=>{
    //Transform data to JSON
    const jsonResponse=JSON.parse(response.toString()) as SocketMessage

    //Print response
    if(jsonResponse.type === "WEATHER_RESPONSE"){
        const weatherResponse = jsonResponse as WeatherMainServerResponse
        console.log(`Brodcast: ${weatherResponse.brodcast}`)
    }else if(jsonResponse.type === "HOROSCOPE_RESPONSE"){
        const horoscopeResponse =  jsonResponse as HoroscopeMainServerResponse
        console.log(`Horoscope: ${horoscopeResponse.horoscope}`)
    }else{
        //Strange behaviour
        console.log(jsonResponse)
    }

    //Ask other option
    const optionHandler=askMainOption()
    optionHandler(client)    
})

client.on('close',()=>{
    console.log("See you champ!")
    process.exit()
})

client.on('error',(err)=>{
    console.log(err.message)
})


clientServer.listen(CLIENT_INFO.port,()=>{

})
