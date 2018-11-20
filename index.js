const express = require('express')
const hbs = require('hbs');
const fs = require('fs'); 
const programs = require('./programs/programs')
const util = require('util')

const readFile = util.promisify(fs.readFile)
const readdir = util.promisify(fs.readdir)


const port = process.env.PORT || 3000;
let app = express();

let date = new Date()
let formattedDate = date.getFullYear().toString() + (date.getMonth() + 1).toString() + date.getDate().toString()

hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs')
app.use(express.static(__dirname = './public'))

app.get('/', async(req, res) => {
  res.render('index.hbs')
})

app.get('/reload', async (req, res) => {
  programs.deleteFiles('programs/files')
  programs.program_list.map(x => programs.createPrograms(x))
  // await programs.createPrograms(req.query.value)
  res.redirect('/')
})

app.get('/programs/:program', async(req, res) => {
  console.log(req.params)

  try {
    let list = await programs.getPrograms(req.params.program)

    res.render('index.hbs', {
      show_list: list
    })
  } catch(e) {
    console.log('ERROR', e)
    res.render('index.hbs')
  }

  // res.redirect('/')
})

app.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})



// let program = 'slo1'
// getPrograms(program);
