import { SocketMessage } from "../../interfaces/request"

interface HoroscopeRequest{
    requestId: string,
    zodiacalSignId: string,
    bornDate: string | undefined
    date: string
}

interface HoroscopeResponse extends SocketMessage{
    requestId: string,
    horoscope: string,
}

interface ZodiacalSign{
    id: number,
    name: string,
    from_date:{
        day: number,
        month: number
    },
    to_date:{
        day: number,
        month: number
    }
}

interface ZodiacalSigns{
    [key: string]: ZodiacalSign
}

const zodiacal_signs: ZodiacalSigns={
    "aries": {
        id:0,
        name: "ARIES",
        from_date:{
            day: 21,
            month: 3
        },
        to_date:{
            day: 19,
            month: 4
        }
    } as ZodiacalSign,
    "taurus": {
        id:1,
        name: "TAURUS",
        from_date:{
            day: 20,
            month: 4
        },
        to_date:{
            day: 20,
            month: 5
        }
    } as ZodiacalSign,
    "gemini": {
        id:2,
        name: "GEMINI",
        from_date:{
            day: 21,
            month: 5
        },
        to_date:{
            day: 21,
            month: 6
        }
    } as ZodiacalSign,
    "cancer": {
        id:3,
        name: "CANCER",
        from_date:{
            day: 22,
            month: 6
        },
        to_date:{
            day: 22,
            month: 7
        }
    } as ZodiacalSign,
    "leo": {
        id:4,
        name: "LEO",
        from_date:{
            day: 23,
            month: 7
        },
        to_date:{
            day: 22,
            month: 8
        }
    } as ZodiacalSign,
    "virgo": {
        id:5,
        name: "VIRGO",
        from_date:{
            day: 23,
            month: 8
        },
        to_date:{
            day: 22,
            month: 9
        }
    } as ZodiacalSign,
    "libra": {
        id:6,
        name: "LIBRA",
        from_date:{
            day: 23,
            month: 9
        },
        to_date:{
            day: 23,
            month: 10
        }
    } as ZodiacalSign,
    "scorpius": {
        id:7,
        name: "SCORPIUS",
        from_date:{
            day: 24,
            month: 10
        },
        to_date:{
            day: 21,
            month: 11
        }
    } as ZodiacalSign,
    "sagittarius":{
        id:8,
        name: "SAGITTARIUS",
        from_date:{
            day: 22,
            month: 11
        },
        to_date:{
            day: 21,
            month: 12
        }
    } as ZodiacalSign,
    "capricornus": {
        id:9,
        name: "CAPRICORNUS",
        from_date:{
            day: 22,
            month: 12
        },
        to_date:{
            day: 19,
            month: 1
        }
    } as ZodiacalSign,
    "aquarius":{
        id:10,
        name: "AQUARIUS",
        from_date:{
            day: 20,
            month: 1
        },
        to_date:{
            day: 18,
            month: 2
        }
    } as ZodiacalSign,
    "pisces":{
        id:11,
        name: "PISCES",
        from_date: {
            day: 19,
            month: 2
        },
        to_date:{
            day: 20,
            month: 3
        }
    } as ZodiacalSign
}

const horoscope: string[]=[
    "Today you will be spaced out", // unable to concentrate
    "Today you will feel a bit off", //you won't feel yourself
    "Today will make your blood boil", //make you fell angry
    "Today you will be on cloud nine", //feel happy

    "Today will be a pain in the neck", //awful
    "Today you will feel in the top of the world", //Fell great
    "Today you will be over the moon", //feel happy
    "Today you will bored to death", //feel super boring

    "Today you will feel blue", //sad
    "Today you will be on pins and needles", //anxious/nervous
    "Today you will hang your head", //feel ashamed
    "Today you will be scared out of your wits", //feel scared
]



const getZodiacalSignByBornDate=(dateString: string)=>{
    const date=new Date(dateString)
    const month=date.getMonth()
    const day=date.getDay()


    if(month===1){
        if(day<20) return zodiacal_signs["capricornus"]
        return zodiacal_signs["aquarius"]
    }
    if(month===2){
        if(day<19) return zodiacal_signs["aquarius"]
        return zodiacal_signs.pisces
    }
    if(month===3){
        if(day<21) return zodiacal_signs["pisces"]
        return zodiacal_signs.aries
    }
    if(month===4){
        if(day<20) return zodiacal_signs["aries"]
        return zodiacal_signs.taurus
    }
    if(month===5){
        if(day<21) return zodiacal_signs["taurus"]
        return zodiacal_signs.gemini
    }
    if(month===6){
        if(day<21) return zodiacal_signs["gemini"]
        return zodiacal_signs.cancer
    }
    if(month===7){
        if(day<23) return zodiacal_signs["cancer"]
        return zodiacal_signs.leo
        
    }
    if(month===8){
        if(day<23) return zodiacal_signs["leo"]
        return zodiacal_signs.virgo
    }
    if(month===9){
        if(day<23) return zodiacal_signs["virgo"]
        return zodiacal_signs.libra
    }
    if(month===10){
        if(day<23) return zodiacal_signs["libra"]
        return zodiacal_signs.scorpius
        
    }
    if(month===11){
        if(day<23) return zodiacal_signs["scorpius"]
        return zodiacal_signs.sagittarius  
    }
    if(month===12){
        if(day<22) return zodiacal_signs["sagittarius"]
        return zodiacal_signs.capricornus
    }
}

const getHoroscopeForZodiacalSignAndDate=(sign: ZodiacalSign, dateString: string)=>{
    //console.log(JSON.stringify(sign))
    const date = new Date(new Date(dateString).setHours(0,0,0,0))
    const number= date.getTime()+date.getDay()+date.getMonth()+date.getFullYear()
    return horoscope[(number+sign.id)%horoscope.length]
}

const getZodiacalSign=( horoscopeRequest: HoroscopeRequest)=>{
    
    if(horoscopeRequest.zodiacalSignId!==undefined) return zodiacal_signs[horoscopeRequest.zodiacalSignId.toLowerCase()]
    return getZodiacalSignByBornDate(horoscopeRequest.bornDate as string) as ZodiacalSign
}

export{getHoroscopeForZodiacalSignAndDate,getZodiacalSign,zodiacal_signs, HoroscopeRequest,HoroscopeResponse}