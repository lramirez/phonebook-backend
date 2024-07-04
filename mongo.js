const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://fullstack:${password}@fullstack.8awy0n1.mongodb.net/phonebook?retryWrites=true&w=majority&appName=fullstack`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (name && number) {
  const person = new Person({
    name: name,
    number: number
  })
  person.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })

} else {
  console.log('phonebook:')
  Person.find({}).then(persons => {
    persons.forEach(person => console.log(`${person.name} ${person.number}`))

    mongoose.connection.close()
  })

}
//const person = new Person({
//  name: 'Jamppa Testijamppa',
//  number: '122 155 144',
//})

