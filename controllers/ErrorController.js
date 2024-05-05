const error = (req,res) => {
    const {error_details} = req.query
    return res.status(200).render('main.hbs',{layout: "error.hbs",
    error_message: error_details
  })
}

module.exports = { error }