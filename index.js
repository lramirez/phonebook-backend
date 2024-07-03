require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json())
const cors = require('cors')
app.use(cors())
app.use(express.static('dist'))
var morgan = require('morgan')

morgan.token('req-content', function (req, res) {
  console.log('req"', req.body)
  console.log('res', res.body)
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] -:response-time ms :req-content'))
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}


const Person = require('./models/person')

app.get('/api/persons', (request, response) => {

  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    response.send(`Phonebook has info for ${persons.length} people<br>${new Date()}`)
  })

})

app.get('/api/persons/:id', (request, response, next) => {

  Person.findById(request.params.id).then(person => {
    response.json(person)
  }).catch(error => {
    next(error)
    //response.status(404).send({error: 'error finding by id'})
  })
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Person.findByIdAndDelete(id).then(result => {
    response.status(204).end()
  }).catch(error => {
    next(error)
    //response.status(404).send({error: 'unable to delete'})
  })
})

app.post('/api/persons', (request, response, next) => {
  const person = request.body
  if (!person.hasOwnProperty('name')) {
    return response.status(400).json({ error: 'entry must have a name' })
  }
  if (!person.hasOwnProperty('number')) {
    return response.status(400).json({ error: 'entry must have a number' })
  }

  Person.findById(person.id).then(p => {
    if (p) {
      return response.status(400).json({ error: 'name must be unique' })
    }
  }).catch(error => {

    next(error)
  })
  const newPerson = Person({ name: person.name, number: person.number })
  newPerson.save().then(result => response.json(newPerson)).catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number,
  }
  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => {
      console.log('error: ', error)
      next(error)})
})

app.use(errorHandler)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})