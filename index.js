const express = require('express')
const  morgan = require('morgan')
const app = express()
app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static('dist'))
const Person = require('./models/person')




let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  },
  {
    id: "5",
    name: "Mary moi",
    number: "39-6423122"
  }
]

app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
      //console.log("Phonebook:")
      response.json(people)
    })
  })

app.get("/info", (request, response) => {
  const amount = persons.length
  const date = new Date();
  response.send(
    `<h2>Phonebook has info for ${amount} people </h2>
    <p> ${date} </p>`
  )
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})


const generateId = () => {
  let randomNumber = Math.floor(Math.random() * 1501);

  return randomNumber
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log("moi", body)


  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }

  const samename = persons.some(p => p.name === body.name);

  if (samename) {
    return response.status(400).json({ error: 'name must be unique' });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: String(generateId())
  }

  persons = persons.concat(person)

  response.json(person)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})






//if (process.argv[3] != null && process.argv[4] != null) {
//    const person = new Person({
//        name: `${name}`,
//        number: `${number}`,
//      })
//      
//    person.save().then(result => {
//        console.log(`added ${person.name} number ${person.number} to phonebook`)
//        mongoose.connection.close()
//      })
//} else {
//

