import moment from 'moment';
// var commonFun={
//     momentTime(date, formatType){
//         moment.updateLocale('zh_cn', {
//             weekdays: [
//               "周日", "周一", "周二", "周三", "周四", "周五", "周六",
//             ]
//           });
//           moment.locale('zh_cn');
//           formatType = typeof formatType == 'string' ? formatType : 'YYYY年MM月DD日 HH:mm:ss';
//           var res = moment(date).format(formatType);
//           return res;
//     },
// }

export function momentTime(date, formatType) {
    moment.updateLocale('zh_cn', {
        weekdays: [
            "周日", "周一", "周二", "周三", "周四", "周五", "周六",
        ]
    });
    moment.locale('zh_cn');
    formatType = typeof formatType == 'string' ? formatType : 'YYYY年MM月DD日 HH:mm:ss';
    var res = moment(date).format(formatType);
    return res;
}