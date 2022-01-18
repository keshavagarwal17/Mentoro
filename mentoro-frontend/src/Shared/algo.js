export const FormatFromMinute = (min)=>{
    let hour = parseInt(min/60);
    let minute = min%60;
    return hour.toString().padStart(2,'0') + ":" + minute.toString().padStart(2,'0')
}

export const dayName = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

export const isUpcoming = (schedule)=>{
    var dateObj = new Date();
    var month = dateObj.getMonth() + 1; //months from 1-12
    var date = dateObj.getDate();
    var year = dateObj.getFullYear();
    if(schedule.year > year) return true;
    if(schedule.year==year && schedule.month > month) return true;
    if(schedule.year== year && schedule.month== month && schedule.date >= date) return true;
    return false;
}