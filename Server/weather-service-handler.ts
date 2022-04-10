import {sha256} from "js-sha256"
import { AddressInfo, Socket } from "net"
import {WeatherResponse} from "../Services/weather-api/weather"
import { SocketMessage } from "../interfaces/request"

const weatherClient_INFO={
    host:'localhost',
    port: 4001
}

interface WeatherMainServerRequest extends SocketMessage{
    date: string,
}

interface WeatherMainServerResponse extends SocketMessage{
    date: string,
    brodcast: string
}

const weatherRequestHandler2=(clientId: string,requestId: string, weatherClient: Socket, weather_date: string)=>{
    weatherClient.write(JSON.stringify({
        requestId: requestId,
        date: weather_date
    }),(err)=>{
        
        if(err){
            process.send?.("DESTROY")
        } else{
            console.log(`[MAIN SERVER] Request sent to WEATHER_SERVICE for client ${clientId}`)
        }
    })
}

const weatherRequestHandler=(client_socket: Socket, weather_date: string, weatherClient: Socket, requestMapping: Map<string, Socket>)=>{
    
    const clientAddress: AddressInfo=client_socket.address() as AddressInfo
    const requestId = sha256(`${clientAddress.address}:${clientAddress.port}`)
    requestMapping.set(requestId,client_socket)
    
    weatherClient.write(JSON.stringify({
        requestId: requestId,
        date: weather_date
    }),(err)=>{
        
        if(err){
            requestMapping.delete(requestId)
            client_socket.end()
            console.log(`[MAIN SERVER] Ended with ${clientAddress.address}:${clientAddress.port} due to error sending a request to weather service. Error: "${err.message}"`)
        }else{
            console.log(`[MAIN SERVER] Request sent to WEATHER_SERVICE for client ${clientAddress.address}:${clientAddress.port}`)
        }
    })
}

const weatherResponseHandler=(requestId: string, clientSocket: Socket, weatherResponse: WeatherResponse,requestMapping: Map<string, Socket>)=>{
    const responseAddress=clientSocket.address() as AddressInfo         
    const weather=weatherResponse.weather
    
    clientSocket.write(JSON.stringify({
        type: "WEATHER_RESPONSE",
        brodcast: weather
    }),(err)=>{
        if(err){
            clientSocket.end()
            console.log(`[MAIN SERVER] Response ended connection with ${responseAddress.address}:${responseAddress.port} due to error "${err.message}"`)
        }else{
            console.log(`[MAIN SERVER] Response sent to ${responseAddress.address}:${responseAddress.port}`)
        }
        requestMapping.delete(requestId)

    })
    
}

export{weatherRequestHandler, weatherResponseHandler,WeatherMainServerRequest,WeatherMainServerResponse, weatherClient_INFO}