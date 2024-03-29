const handlerMongooseError = (error, data, next) => {
    error.status = 400;
    next();
  };
  
  export default handlerMongooseError;