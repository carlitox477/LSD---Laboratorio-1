import { fork } from 'child_process'
import * as net from 'net'
import { AddressInfo, Socket } from "net"
import {getHoroscopeForZodiacalSignAndDate,getZodiacalSign, HoroscopeRequest} from "./horoscope"

const PORT=4002



const server=net.createServer()
server.on('connection',(socket: Socket)=>{
    socket.setEncoding("utf-8")
    socket.on('data',(data:Buffer)=>{
        //It should recive a JSON with a date
        const horoscopeRequest=JSON.parse(data.toString()) as HoroscopeRequest
        const zodiacalSign= getZodiacalSign(horoscopeRequest)
        const horoscopeResponse={
            type: "RESPONSE",
            requestId: horoscopeRequest.requestId,
            horoscope: getHoroscopeForZodiacalSignAndDate(zodiacalSign,horoscopeRequest.date) as string
        }
        socket.write(JSON.stringify(horoscopeResponse))
        
    })
    socket.on('close',()=>{
        const address=socket.address() as AddressInfo
        console.log(`[HOROSCOPE-SERVER] Communication with ${address.address}:${address.port} closed`)
    })
    socket.on('error',(err)=>{
        const address=socket.address() as AddressInfo
        console.log(`[HOROSCOPE-SERVER] Communication with ${address.address}:${address.port} has throw this error "${err.message}"`)
    })
})

server.listen(PORT,()=>{
    console.log("[HOROSCOPE-SERVER] Horoscope server running")
})

/*
const createRequestHandlerProcess =(request: string, socket: Socket)=>{
    const childProcess=fork("./requestChildProcess.ts",[request])
    childProcess.on("message",(data)=>{
        socket.write(data as string)
    })
    childProcess.on("exit",()=>{
        console.log("Child process ended")
    })
}
createRequestHandlerProcess(data.toString(),socket)
*/