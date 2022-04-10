import {sha256} from "js-sha256"
import { AddressInfo, Socket } from "net"
import { SocketMessage } from "../interfaces/request";
import { HoroscopeResponse } from "../Services/horoscope-api/horoscope"

const horoscopeClient_INFO={
    host:'localhost',
    port: 4002
}

interface HoroscopeMainServerRequest extends SocketMessage{
    date: string,
    zodiacalSignId: string;
}

interface HoroscopeMainServerResponse extends SocketMessage{
    date: string,
    horoscope: string;
}


const horoscopeRequestHandler=(client_socket: Socket, date: string, zodiacalSign: string, requestMapping: Map<string, Socket>, horoscopeClient: Socket)=>{
    const clientAddress: AddressInfo=client_socket.address() as AddressInfo
    const requestId = sha256(`${clientAddress.address}:${clientAddress.port}`)
    requestMapping.set(requestId,client_socket)  
    
    horoscopeClient.write(JSON.stringify({
        requestId: requestId,
        date: date,
        zodiacalSignId: zodiacalSign
    }),(err)=>{
        
        if(err){
            client_socket.end()
            console.log(`[MAIN SERVER] Ended with ${clientAddress.address}:${clientAddress.port} due to error sending a request to weather service. Error: "${err.message}"`)
        }else{
            console.log(`[MAIN SERVER] Request sent to WEATHER_SERVICE for client ${clientAddress.address}:${clientAddress.port}`)
        }
    })
}

const horoscopeResponseHandler=(requestId: string, clientSocket: Socket, weatherResponse: HoroscopeResponse, requestMapping: Map<string, Socket>)=>{
    const responseAddress=clientSocket.address() as AddressInfo         
    const horoscope=weatherResponse.horoscope
    
    clientSocket.write(JSON.stringify({
        type: "HOROSCOPE_RESPONSE",
        horoscope: horoscope
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

export{horoscopeRequestHandler,horoscopeResponseHandler,HoroscopeMainServerRequest,HoroscopeMainServerResponse,horoscopeClient_INFO}