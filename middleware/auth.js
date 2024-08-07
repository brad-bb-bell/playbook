const authenticationMiddleware = async (req, res, next) => {
  console.log(req.header.authorization)
  next()
}

module.export = authenticationMiddleware
