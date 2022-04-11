
import * as readLine from 'readline-sync'
import { Socket } from "net"
import { WeatherMainServerRequest } from "../Server/weather-service-handler";

import { HoroscopeMainServerRequest } from "../Server/horoscope-service-handler";

const SERVER_INFO = {
    host: 'localhost',
    port: 4000
}

const CLIENT_INFO = {
    host: 'localhost',
    port: 3999
}

const HOROSCOPE_OPTIONS=[
    "ARIES",
    "TAURUS",
    "GEMINI",
    "CANCER",
    "LEO",
    "VIRGO",
    "LIBRA",
    "SCORPIUS",
    "SAGITTARIUS",
    "CAPRICORNUS",
    "AQUARIUS",
    "PISCES"
]

const askZodiacalSign= ()=>{
    while(true){
        console.log("Select a zodiacal sign")
        HOROSCOPE_OPTIONS.map((sign, index)=>{
            console.log(`${index+1} - ${sign}`)
        })
        const answer=readLine.question("Selected option: ")
        const zodiacalSignIndexSelected= Number(answer)-1
        if(zodiacalSignIndexSelected >= 0 && zodiacalSignIndexSelected <=11) return HOROSCOPE_OPTIONS[zodiacalSignIndexSelected]
        console.log("Invalid option")
    }
}




const askDate= ()=>{
    while(true){
        const answer=readLine.question("Introduce a valid date (DD-MM-YYYY): ")
        const dayParts=answer.split("/").join("-").trim().split('-');
        if(dayParts.length===3){
            try{
                const date = new Date(Number(dayParts[2]),Number(dayParts[1])-1,Number(dayParts[0]))
                return date
            }catch(err){}
        }
        
    }
}

const MAIN_OPTIONS =[
    {
        description: "Query today's weather",
        response:(client: Socket)=>{
            
            const todayWeatherRequest: WeatherMainServerRequest ={
                type: "WEATHER",
                date: Date()
            }

            console.log(JSON.stringify(todayWeatherRequest))
            client.write(JSON.stringify(todayWeatherRequest))
        }
    },
    {
        description: "Query today's horoscope for a particular zodiacal sign",
        response:(client: Socket)=>{
            const zodiacalSign=askZodiacalSign()
            console.log(zodiacalSign)
            const horoscopeRequest:HoroscopeMainServerRequest={
                type: "HOROSCOPE",
                date: Date(),
                zodiacalSignId: zodiacalSign
            }
            client.write(JSON.stringify(horoscopeRequest))
        }
    },
    {
        description: "Query weather of a particular date",
        response:(client: Socket)=>{
            const date = askDate()
            const todayWeatherRequest: WeatherMainServerRequest ={
                type: "WEATHER",
                date: date.toString()
            }
            client.write(JSON.stringify(todayWeatherRequest))
            
        }
    },
    {
        description: "Query horoscope for a particular zodiacal sign of a particular date",
        response:(serverConnection: Socket)=>{
            const date = askDate()
            const zodiacalSign=askZodiacalSign()
            const horoscopeRequest:HoroscopeMainServerRequest={
                type: "HOROSCOPE",
                date: date.toString(),
                zodiacalSignId:zodiacalSign
            }
            serverConnection.write(JSON.stringify(horoscopeRequest))
        }
    },
    {
        description: "Exit",
        response: (serverConnection: Socket)=>{
            console.log("Bye, bye!")
            serverConnection.end(()=>{
                
            })
            
        }
    }
]


const askMainOption= ()=>{
    console.log("Select an option")
    MAIN_OPTIONS.map((option, optionIndex)=>{
        console.log(`${optionIndex+1} - ${option.description}`)
    })
    while(true){
        const answer=readLine.question("Selected option: ")
        const optionIndexSelected= Number(answer)-1
        if(optionIndexSelected >= 0 && optionIndexSelected<MAIN_OPTIONS.length) return MAIN_OPTIONS[optionIndexSelected].response
        console.log("Please select a valid option")
    }
}


export{SERVER_INFO,CLIENT_INFO,askMainOption}

