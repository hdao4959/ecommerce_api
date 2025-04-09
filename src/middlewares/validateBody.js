
const validateBody = (req, res, next) => {
  const { error, value } = categorySchema.validate(req.body, { abortEarly: true })

  if (error) {
    return res.status(500).json(error.details[0].message)
  }


  req.body = value;
  next();

}

export default validateBody