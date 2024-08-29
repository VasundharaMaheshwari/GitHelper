const { validationResult } = require('express-validator')

const error = (req,res) => {
  const errors = validationResult(req)
  if(errors.isEmpty()){
      const {error_details} = req.query
      return res.status(200).render('main.hbs',{layout: "error.hbs",
      error_message: error_details
    })}
    return res.send("Oops! Error Occured...")
}

module.exports = { error }