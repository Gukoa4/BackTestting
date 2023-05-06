/*divide y vencerás
    agenda telefónica
    backend de las rutas
    conexión a la base de datos
    model y schema
    dot env
*/
// mongodb+srv://Moderador:<password>@fullstack.dfq26fk.mongodb.net/telefono?retryWrites=true&w=majority
const express = require('express')
const cors = require("cors"); 
const app = express()
app.use(cors())

require('dotenv').config()
const Telefono = require('./models/telefono')
const PORT = process.env.PORT || 3002;
app.use(express.static("dist"));
app.use(express.json());

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/api/telefono', (req, res) => {
    Telefono.find({}).then(telefonos =>{
        res.json(telefonos) 
    })
})
app.get('/api/info', (req, res) => {
  let date= new Date()
  Telefono.find({}).then(telefonos =>{
     console.log(telefonos.length)
     res.send(`<p>Phonebook has info for ${telefonos.length} people</p> <p>${date}</p>`)
  })
})

app.get("/api/telefono/:id", (request, response, next) => {
    console.log("mostrando");
    Telefono.findById(request.params.id)
    .then(telefono => {
      if(telefono) {
        response.json(telefono)
      }else{
        response.status(404).end()
      }
    })
    .catch(error =>next(error))

})



app.post("/api/telefono", (request, response) => {
    console.log("posteando");
  
    const body = request.body;
  
    if (!body.name) {
      return response.status(400).json({
        error: "content missing",
      });
    }
    const telefono = new Telefono({
      name: body.name,
      number: body.number,
    });
    telefono
      .save()
      .then(savedTelefono => savedTelefono.toJSON())
      .then(savedAndFormattedPhone =>{
        response.json(savedAndFormattedPhone)
      })
      .catch(error=>next(error))
});

app.delete('/api/telefono/:id', (request,response,next) =>{
  Telefono.findByIdAndRemove(request.params.id)
    .then( result =>{
      console.log('borrando')
      console.log(result)
      result
        ?response.statusMessage = "Current element eliminated"
        :response.statusMessage = "Current element does not exist"
      response.status(204).end()
    })
    .catch (error => next(error))
})
app.put('/api/telefono/:id', (request,response,next) =>{
  const body = request.body

  const telefono ={
    number: body.number,
  }
  Telefono.findByIdAndUpdate(request.params.id, telefono, {new: true})
    .then( updateTelefono =>{
      response.json(updateTelefono)
    })
    .catch (error => next(error))
})
 


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
  };
  
  app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) =>{
  console.error(error.message)
  if (error.name === 'CastError'){
    return response.status(400).send({error: 'malformatted id'})
  } else if (error.name === 'ValidationError'){
    return response.status(400).json({error: error.message})
  }
  next(error)
}

app.use(errorHandler);

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
