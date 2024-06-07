const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors())
app.use(express.json())
var morgan = require('morgan')
morgan.token('req-content', function(req, res) {
    console.log("req", req.body)
    console.log("res", res.body)
    return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] -:response-time ms :req-content'))
let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(`Phonebook has info for ${persons.length} people<br>${new Date()}`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    }
    else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    if (persons.find(person => person.id === id)) {
        persons = persons.filter(person => person.id !== id)
        response.status(204).end()
    } else {
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {
    const person = request.body
    if (!person.hasOwnProperty('name')) {
        return response.status(400).json({error: 'entry must have a name'})
    }
    if (!person.hasOwnProperty("number")) {
        return response.status(400).json({error: 'entry must have a number'})
    }
    if (persons.find(p => p.name === person.name)) {
        return response.status(400).json({error: 'name must be unique'})
    }
    const newPerson = {...person, id: Math.floor(Math.random() * 9999999)}
    persons = persons.concat(newPerson)
    response.json(newPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})