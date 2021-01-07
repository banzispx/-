const fs = require('fs');
const xlsx2json = require('xlsx2json');
const axios = require('axios');
const json2xls = require('json2xls');
const exealjson = require('./exeal.json');
// console.log(exealjson[0][0]);

function name(params) {}
const url =
  'http://scm2.thechenfan.cn:18305/chenfan_arrivals/pu_arrivalvouch/get_arrivalvouch_list?puArrivalCode=&poCode=&brandId=&state=2&vendorId=&productCode=HN20080010&inventoryName=&inventoryCode=&urgentState=&newDate_begin=&newDate_end=&sendDate_begin=&sendDate_end=&createDate_begin=2020-08-01%2000:00:00&createDate_end=2020-08-31%2023:59:59&color=&size=&createName=&updateName=&brandIds=&total=36&pageSize=30&pageNum=1';
const Cookie =
  'SESSION=MjUwOTE2NTQtZDc2My00NWY4LThiMGItY2VlNzBhMGE0Nzcz; token=303A6AC028F0C23A4191A8F13F7FA884264D15D50415364DF560DDF7FFCF15605AD95B05A575E6B236D9558588885E84';
const Authorization =
  '303A6AC028F0C23A4191A8F13F7FA884264D15D50415364DF560DDF7FFCF15605AD95B05A575E6B236D9558588885E84';
const Host = 'scm2.thechenfan.cn:18305';
const privilegeCode = 'd3f9add652c62691a6cf40baad1de8c8';
const Referer =
  'http://scm2.thechenfan.cn:18305/inStorageManage/arrivalOrderList';
// axios
//   .get(url, {
//     headers: {
//       token: 'Bearer ',
//       Cookie: Cookie,
//       Authorization: Authorization,
//       Host: Host,
//       privilegeCode: privilegeCode,
//       Referer: Referer
//     }
//   })
//   .then(res => {
//     // console.log(res.data);
//     console.log(res.data.obj.puArrivalVouchList[0]);
//   });

function getList(url) {
  return axios
    .get(url, {
      headers: {
        token: 'Bearer ',
        Cookie: Cookie,
        Authorization: Authorization,
        Host: Host,
        privilegeCode: privilegeCode,
        Referer: Referer
      }
    })
    .then(res => {
      return res.data.obj.puArrivalVouchList;
    });
}
async function doGetList(url) {
  let arr = await getList(url)
}
// doGetList(url)

async function toExcel() {
  let jsonArr = [];
  for (let index = 0; index < exealjson[0].length; index++) {
    const element = exealjson[0][index];
    console.log(element);
    const productCode = element.B
    const currentUrl = `http://scm2.thechenfan.cn:18305/chenfan_arrivals/pu_arrivalvouch/get_arrivalvouch_list?puArrivalCode=&poCode=&brandId=&state=2&vendorId=&productCode=${productCode}&inventoryName=&inventoryCode=&urgentState=&newDate_begin=&newDate_end=&sendDate_begin=&sendDate_end=&createDate_begin=2020-08-01%2000:00:00&createDate_end=2020-08-31%2023:59:59&color=&size=&createName=&updateName=&brandIds=2&total=36&pageSize=30&pageNum=1`
    let arr = await getList(currentUrl)
    let arrLast = arr[arr.length - 1];
    element.D = arrLast.quantity
    element.F = arrLast.rejectionQuantity
    // let { qualifiedQuantity, recordQuantity, rejectionQuantity, unqualifiedQuantity} = arrLast
    // console.log(qualifiedQuantity, recordQuantity, rejectionQuantity, unqualifiedQuantity );
    jsonArr.push(element)
  }
  console.log(JSON.stringify(jsonArr));
  fs.writeFileSync('./dataRight.xlsx', json2xls(jsonArr), 'binary');
}
toExcel()
// xlsx2json(
//     './2.xlsx', // url
//     {
//         dataStartingRow: 0,  // 第几行开始
//         mapping: {    // 解析 key value
//             'A': 'A',
//             'B': 'B',
//             'C': 'C'
//         }
//     }
// ).then(jsonArray => {  // 输出数组  格式自行log
//     fs.writeFileSync('./exeal.json', JSON.stringify(jsonArray));
// });

// const fs = require('fs');
// const json2xls = require('json2xls');
// const json = require("./json");
// let jsonArr = [];
// for (let jsonKey in json) {
//     jsonArr.push({
//         "A": json[jsonKey].cn, // A 内容
//         "B": json[jsonKey].en, // B 内容
//     });
// }
// fs.writeFileSync('./data.xlsx', json2xls(jsonArr), 'binary');
