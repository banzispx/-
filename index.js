const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
let url1 = 'https://www.doutula.com/tag/%E5%90%8C%E5%BA%8A';

axios.get(url1).then(res => {
  // console.log(res.data);
  let $ = cheerio.load(res.data);
  $('.list-group-item .page-content a img').each((index, ele) => {
    let imgurl ='https:' + $(ele).attr('src')
    console.log(imgurl);
    let exdname = path.extname(imgurl)
    let ws = fs.createWriteStream(`img/${index}${exdname}`);
    axios.get(`${imgurl}`, { responseType: 'stream' }).then(res => {
      res.data.pipe(ws)
      res.data.on('cloce', function() {
        ws.close()
      })
    });
  });
});
