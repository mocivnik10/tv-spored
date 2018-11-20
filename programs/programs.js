const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs'); 
const path = require('path')
const util = require('util')

const readFile = util.promisify(fs.readFile)

let date = new Date()
let formattedDate = date.getFullYear().toString() + (date.getMonth() + 1).toString() + date.getDate().toString()

const program_list = [
  'slo1',
  'natgeo',
  'poptv'
]

const createPrograms = async(program) => {
  console.log(3)
  let date = new Date()
  let formattedDate = date.getFullYear().toString() + (date.getMonth() + 1).toString() + date.getDate().toString()
  const res = await axios.get(`https://tv-spored.siol.net/kanal/${program}/datum/${formattedDate}`)
  
  if(res.status === 200) {
    const html = res.data
    const $ = cheerio.load(html);
    const programTitle = $('.section .wrapper .table-list-header h2').text()
    const guide = [];
    $('.section .table-list-rows .row').each(function (i, elem) {
      guide[i] = {
        startTime: $(this).find('.col-1').text(),
        title: $(this).find('.col-9').text().trim(),
        category: $(this).find('.gray').text()
      }
    })
  
  return fs.writeFileSync(`programs/files/${program}-${formattedDate}.json`, JSON.stringify(guide))
  }

}

const getPrograms = async (program) => {
  console.log('PROGRAM', program)
  let list = {};
  try {
    list = await readdir('programs/files');
    // console.log('LIST', list)
  } catch (e) {
    // console.log('e', e);
  }
  if (list.length === 0) {
    console.log('List undefined');
    // list = {};
  } else {
    list = await readFile(`programs/files/${program}-${formattedDate}.json`, 'utf8')
    list = JSON.parse(list)
    return list
  }
}

const deleteFiles = (directory_path) => {
  // console.log(2)
  if (fs.existsSync(directory_path)) {
    fs.readdirSync(directory_path).forEach((file, index) => {
      let currentPath = path.join(directory_path, file)
      if (fs.lstatSync(currentPath).isDirectory()) {
        deleteFiles(currentPath)
      } else {
        fs.unlinkSync(currentPath)
      }
    })
    // fs.rmdirSync(directory_path)
  }
}

module.exports = {
  program_list,
  createPrograms,
  getPrograms,
  deleteFiles
}