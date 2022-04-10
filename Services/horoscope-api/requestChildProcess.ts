import { getHoroscopeForZodiacalSignAndDate, getZodiacalSign, HoroscopeRequest } from "./horoscope";


const horoscopeRequestHandler=(request: HoroscopeRequest)=>{
    const zodiacalSign= getZodiacalSign(request)
    const horoscope =  getHoroscopeForZodiacalSignAndDate(zodiacalSign,request.date)
    const horoscopeResponse={
        type: "RESPONSE",
        requestId: request.requestId,
        horoscope: horoscope
    }
    process.send?.(JSON.stringify(horoscopeResponse))
}

const request= JSON.parse(process.argv[2]) as HoroscopeRequest
horoscopeRequestHandler(request)