
require('dotenv').config()
const express = require('express');
const fs = require('fs').promises;
const session = require('express-session');


const app = express()

app.set('view engine', 'pug')
app.set('views', './Views')

app.use(express.static(process.cwd() + '/Public'))
app.use(express.urlencoded({ extended : true }))

app.use(session({
  secret : process.env.SECRET,
  saveUninitialized: true,
  resave : false,
  coockie : {
    secure : false
  }
}))

app.get('/', (req, res) => {
  res.render('index')  
})

app.post('/identifier', verify, (req, res)=>{
  res.redirect('/download')
})

app.get('/download', isRegistered, (req, res) => {
  res.download('./Files/Challenge JavaScript.pdf')
})

app.listen(3000, ()=>{
  console.log('listening')
})

async function verify(req, res, next){
  const { name } = req.body;
  let file = null, data = null, content = null;
  
  file = await fs.readFile('./Private/visitor')
  
  data = JSON.parse(file)
  
  if(data.hasOwnProperty(name)){
    console.log('name  '+ name)
    req.session.visitor = name
    return next() 
  }
  else{
    data[name] = new Date()
    content = JSON.stringify(data)
      
    console.log('new   '+content);
    fs.writeFile('./Private/visitor', content)
        .then(data => {
          req.session.visitor = name
          return next()
          }
        )
        .catch(err => console.log(err))
      } 
    }

function isRegistered(req, res, next){
  console.log(req.session)
  if(req.session.visitor)
    return next()
  else
    return res.redirect('/')
}