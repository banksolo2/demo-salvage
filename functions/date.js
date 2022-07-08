
const getMonthNo = (month) =>{
    if(month === 'January') return '01';
    else if(month === 'February') return '02';
    else if(month === 'March') return '03';
    else if(month === 'April') return '04';
    else if(month === 'May') return '05';
    else if(month === 'June') return '06';
    else if(month === 'July') return '07';
    else if(month === 'August') return '08';
    else if(month === 'September') return '09';
    else if(month === 'October') return '10';
    else if(month === 'November') return '11';
    else if(month === 'December') return '12';
};

const convertDateFormat = (date) =>{
    let arr = date.split(' ');
    let month = getMonthNo(arr[1]);
    return arr[2]+'-'+month+'-'+arr[0];
}

const getMonthName = (month) => {
    switch (month) {
        case '01':
            return 'January';
            break;
        case '02':
            return 'February';
            break;
        case '03':
            return 'March';
            break;
        case '04':
            return 'April';
            break;
        case '05':
            return 'May';
            break;
        case '06':
            return 'June';
            break;
        case '07':
            return 'July';
            break;
        case '08':
            return 'August';
            break;
        case '09':
            return 'September';
            break;
        case '10':
            return 'October';
            break;
        case '11':
            return 'November';
            break;
        case '12':
            return 'December';
            break;
        default:
            return null;
            break;
    } 
}

const convertDateBack = date =>{
    let arr = date.split('-');
    let month = getMonthName(arr[1]);
    return `${arr[2]} ${month} ${arr[0]}`;
}

module.exports = { 
    convertDateFormat,
    convertDateBack
};
