import { fork } from 'child_process'
import * as net from 'net'
import { AddressInfo, Socket } from "net"
const PORT=4002

const createRequestHandlerProcess =(request: string, socket: Socket)=>{
    const childProcess=fork("./requestChildProcess.ts",[request])
    childProcess.on("message",(data)=>{
        socket.write(data as string)
    })
    childProcess.on("exit",()=>{
        console.log("Child process ended")
    })
}


const server=net.createServer()
server.on('connection',(socket: Socket)=>{
    socket.setEncoding("utf-8")
    socket.on('data',(data:Buffer)=>{
        // This will be unefficient do to the task low demand of resources, it is done just by work requirement
        createRequestHandlerProcess(data.toString(),socket)
        
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




