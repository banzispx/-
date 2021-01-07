const fs = require('fs');
const xlsx2json = require('xlsx2json');
const axios = require('axios');
const json2xls = require('json2xls');
const exealjson = require('./1-7exeal.json');

// 
const Cookie =
  'SESSION=MjgzYjYwYzQtZjI2My00Nzc1LWJmOWItMjcxNzI2YWZkMjA4; token=CF8FDC55DAA3E1BFBC605BCB75BABC9C08E0FD1CEBD8B735156884F57C800CA75AD95B05A575E6B236D9558588885E84';
const Authorization =
  'CF8FDC55DAA3E1BFBC605BCB75BABC9C08E0FD1CEBD8B735156884F57C800CA75AD95B05A575E6B236D9558588885E84';
const Host = 'scm2.thechenfan.cn:18305';
const privilegeCode = 'd8b48ad951e6ba1d641e483b88e1c30f';
const Referer =
  'http://scm2.thechenfan.cn:18305/inStorageManage/arrivalOrderList';
// 获取商品信息的函数
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
// 处理原来的Excel生成json，是第一步
// xlsx2json(
//     './1-7.xlsx', // url
//     {
//         dataStartingRow: 0,  // 第几行开始
//         mapping: {    // 解析 key value
//             'A': 'F',
//             'B': 'A',
//             'C': 'E'
//         }
//     }
// ).then(jsonArray => {  // 输出数组  格式自行log
//     fs.writeFileSync('./1-7exeal.json', JSON.stringify(jsonArray));
// });

async function toExcel() {
  let jsonArr = [];
  let errorList = [];
  for (let index = 0; index < exealjson[0].length; index++) {
    const element = exealjson[0][index];
    console.log(element);
    const productCode = element.B
    const currentUrl = `http://scm2.thechenfan.cn:18305/chenfan_arrivals/pu_arrivalvouch/get_arrivalvouch_list?puArrivalCode=&poCode=&brandId=&state=&vendorId=&productCode=${productCode}&inventoryName=&inventoryCode=&urgentState=&newDate_begin=&newDate_end=&sendDate_begin=&sendDate_end=&createDate_begin=&createDate_end=&color=&size=&createName=&updateName=&total=0&pageSize=200&pageNum=1`
    try {
      let arr = await getList(currentUrl)
      let arrLast = arr[arr.length - 1];
      element.D = arrLast.quantity
      element.F = arrLast.rejectionQuantity
      if (arr.length >= 2) {
        element.E = arr[0].venAbbName
        for (let index = 0; index < arr.length - 2; index++) {
          if (element.E.indexOf(arr[index].venAbbName) < 0) {
            element.E += `、${arr[index].venAbbName}`
          }
        }
      }
      jsonArr.push(element)
    } catch (error) {
      try {
        let arr = await getList(currentUrl)
        let arrLast = arr[arr.length - 1];
        element.D = arrLast.quantity
        element.F = arrLast.rejectionQuantity
        if (arr.length >= 2) {
          element.E = arr[0].venAbbName
          for (let index = 0; index < arr.length - 2; index++) {
            if (element.E.indexOf(arr[index].venAbbName) < 0) {
              element.E += `、${arr[index].venAbbName}`
            }
          }
        }
        jsonArr.push(element)
      } catch (error) {
        // 就算错误也添加到数组
        jsonArr.push(element) 
        // 此数组保存错误列表
        errorList.push(element)
      }
    }
  }
  // 打印错误的数据列表
  console.log(JSON.stringify(jsonArr), errorList);
  fs.writeFileSync('./dataRight1-7.xlsx', json2xls(jsonArr), 'binary');
}
toExcel()


// 此代码是专门处理
// async function name(params) {
//   const productCode = 'CH20102230'
//   const currentUrl = `http://scm2.thechenfan.cn:18305/chenfan_arrivals/pu_arrivalvouch/get_arrivalvouch_list?puArrivalCode=&poCode=&brandId=&state=2&vendorId=&productCode=${productCode}&inventoryName=&inventoryCode=&urgentState=&newDate_begin=&newDate_end=&sendDate_begin=&sendDate_end=&createDate_begin=2020-010-01%2000:00:00&createDate_end=2020-10-31%2023:59:59&color=&size=&createName=&updateName=&brandIds=2&total=36&pageSize=30&pageNum=1`
//   let arr = await getList(currentUrl)
//   let arrLast = arr[arr.length - 1];
//   console.log(arrLast.quantity, arrLast.rejectionQuantity);
// }
// name()