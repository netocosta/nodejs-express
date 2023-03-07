const express = require('express')
const path = require('path')
const fs = require('fs')

const app = express()

// definindo o template engine
app.set('view engine', 'ejs')

// definindo os arquivos estaticos (apenas se nao tiver template engine)
//const staticFolder = path.join(__dirname, 'views')
//const expressStatic = express.static(staticFolder)
//app.use(expressStatic)

// definindo os arquivos publicos
app.use(express.static(path.join(__dirname, 'public')))

// habilita para receber dados de formulario (POST)
app.use(express.urlencoded({ extended: true }))


// rotas (usa a pasta views apenas se nao tiver usando template engine)
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Home'
  })
})

app.get('/posts', (req, res) => {
  const data = fs.readFileSync('./store/posts.json')
  const posts = JSON.parse(data)

  res.render('posts', {
    title: 'Posts',
    posts: posts,
  })
})

app.get('/cadastro-posts', (req, res) => {
  const { c } = req.query

  res.render('cadastro-posts', {
    title: 'Formulario',
    cadastrado: c,
  })
})

app.post('/salvar-post', (req, res) => {
  const { title, text, stars } = req.body

  const data = fs.readFileSync('./store/posts.json')
  const posts = JSON.parse(data)
  posts.push({
    title, // é o mesmo de -> titulo: titulo
    text,
    stars
  })

  const postsString = JSON.stringify(posts)
  fs.writeFileSync('./store/posts.json', postsString)

  res.redirect('/cadastro-posts?c=1')
})

app.use((req, res) => {
  res.send('Pagina nao encontrada')
})




// executando o servidor
const port = process.env.PORT || 8080
app.listen(port, () => console.log(`Server is listening on port ${port}!`))