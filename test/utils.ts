const getTwoDatesFromToday = ()=>{
    const date1= new Date()
    const date2 = new Date(date1.toDateString())
    
    if(date1.getHours()===23){
        date2.setHours(22)
    }else{
        date2.setHours(date1.getHours()+1)
    }

    return{date1,date2}
}

export{getTwoDatesFromToday}