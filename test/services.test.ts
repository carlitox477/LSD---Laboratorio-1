import { getHoroscopeForZodiacalSignAndDate,zodiacal_signs } from "../Services/horoscope-api/horoscope"
import { getWeather } from "../Services/weather-api/weather"
import { getTwoDatesFromToday } from "./utils/utils"
import { expect } from 'chai';

describe("Services",()=>{
    it("Should get the same horoscope for same sign and date",()=>{
        const zodiacalSign=zodiacal_signs["aries"]
        const{date1,date2}=getTwoDatesFromToday()

        const horoscope1=getHoroscopeForZodiacalSignAndDate(zodiacalSign,date1.toString())
        const horoscope2=getHoroscopeForZodiacalSignAndDate(zodiacalSign,date2.toString())

        //Check they are both equals
        expect(horoscope1,"Different horoscope for same date").eql(horoscope2)
    })

    it("weather.ts:getWeather should get the same brodcast for same date",()=>{
        const{date1,date2}=getTwoDatesFromToday()

        const broadcast1=getWeather(date1.toString())
        const broadcast2=getWeather(date2.toString())
        
        //Check they are both equals
        
        expect(broadcast1,"Different brodcast for same date").eql(broadcast2)
        
    })
})