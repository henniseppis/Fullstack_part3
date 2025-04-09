require('dotenv').config()
const express = require('express')
const Person = require('./models/person')

const app = express()

app.use(express.static('dist'))
app.use(express.json())

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(person => {
      response.json(person)
    })
    .catch(error => next(error))
  })


app.get("/info", (request, response) => {
  const date = new Date();
  Person.countDocuments({})
  .then(result => {
    const amount = result
    response.send(`<h2>Phonebook has info for ${amount} people </h2><p> ${date} </p>`)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
  .then(person => {
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
  })
  .catch(error => next(error))
  })

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id',(request, response, next) => {
  Person.findByIdAndUpdate(request.params.id)
  .then(person => {
    person.name = request.body.name
    person.number = request.body.number

    return person.save().then((updatedPerson) => {
    response.json(updatedPerson)
  })
  .catch(error => next(error))
})
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

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

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(addedPerson => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    response.json(addedPerson)
  })
  .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
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

