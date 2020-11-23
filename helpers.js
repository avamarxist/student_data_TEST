

exports.genericCb = (err, result)=>{
    if(err){
        console.log(err);
    } else{
        console.log(result);
    }
};

exports.getYearTerm = (date)=>{
    // 
    let month = date.getMonth();
    if(month>=8 && month<11){ return [date.getFullYear(), 1] }
    else if((month>=0 && month<2) || month==11){ return [date.getFullYear()-1, 2] }
    else if(month>=2 && month<6){ return [date.getFullYear()-1, 3] }
    else if(month>=6 && month<8){ return [date.getFullYear()-1, 4] }
    else{ return [,]}
}