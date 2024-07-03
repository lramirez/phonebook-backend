const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URI
console.log(url)
console.log('connecting to', url)
mongoose.connect(url)
  .then(result => { console.log('connected to MongoDB') }).catch((error) => { console.log('error connecting to MongoDB:', error.message) })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true

  },
  number: {
    type: String,
    minlength: 8,
    validate: {
      validator: function (v) {
        console.log('validating')
        const regEx =  /^\d{2,3}-\d{1,}$/
        console.log('regex', regEx)
        const val_result = regEx.test(v)
        console.log('val_result', val_result)
        return val_result
      },
      message: props => 'Phone number is of incorrect format!'
    },
    required: [true, 'Person phone number required!']
  }
})

//const Person = mongoose.model('Person', personSchema)

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    console.log('returned object', returnedObject)
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)