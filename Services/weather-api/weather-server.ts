import { fork } from "child_process"
import * as net from "net"
import { AddressInfo, Socket } from "net"

const PORT=4001

const createRequestHandlerProcess =(request: string, socket: Socket)=>{
    const childProcess=fork("./requestChildProcess.ts",[request])
    childProcess.on("message",(data)=>{
        socket.write(data as string)
    })
    childProcess.on("exit",()=>{
        console.log("Child process ended")
    })
}

//Allows to manage multiple TCP connections
const server=net.createServer()

server.on('connection', (socket: Socket)=>{
    socket.setEncoding("utf-8")
    

    console.log(JSON.stringify(socket.address()))

    socket.on('data',(data: Buffer)=>{
        //It should recive a JSON with a date
        console.log(`[WEATHER SERVER] Request recived`)
        createRequestHandlerProcess(data.toString(),socket)
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