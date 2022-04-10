import { Socket,createConnection } from "net";

//In progress
class TCP_Connection{
    static HEADER=64 //length of the first message
    socket: Socket

    constructor(host:string, port: number, encoding: BufferEncoding){
        this.socket=createConnection({
            host: host,
            port: port,
        })

        this.socket.setEncoding(encoding)

        this.socket.on('data',(data)=>{
            const jsonData= 0;
        })
    }

    static sendMessage(message:string, socket: Socket, callback: (err: Error | undefined)=>void) {
        //First we send the byte length of the message
        const messageBytesLength=Buffer.from(message).length
        const finMessage=JSON.stringify({
            type: "ACK",
            length: messageBytesLength
        })

        const finMessageByteLength= Buffer.from(JSON.stringify(finMessage)).length
        const overloadToAdd= TCP_Connection.HEADER - finMessageByteLength
        const normalizeFinMessage=`${' '.repeat(overloadToAdd)}${finMessage}`
        

        socket.write(JSON.stringify(normalizeFinMessage))

        // We await confirmation

        //Finally we send the byte length of the message
        socket.write(message, callback)
    }

    static reciveMessage(params:string) {
        // Using the socket library we only need to confirm reception
    }
}
