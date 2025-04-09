const mongoose = require('mongoose')
mongoose.set('strictQuery', false)



//const password = process.argv[2]
//const name = process.argv[3]
//const number  = process.argv[4]

const url = process.env.MONGODB_URI
//rendervalue = 957e74916ab80bbb264049e4ca64b37c

console.log('connecting to', url)
mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
      })
      .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
      })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    required: true
  },
  number: {
    type: String,
    minlength: 2,
    required: true
}})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
  

module.exports = mongoose.model('Person', personSchema)


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
//Person.find({}).then(result => {
//    console.log("Phonebook:")
//    result.forEach(person => {
//        console.log(`${person.name} ${person.number}`)
//    })
//    mongoose.connection.close()
//  })
//}
