import HttpError from "./HttpError.js";

const validateBody = (schema) => {
  const midware = (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(HttpError(400, error.message));
    }
    next();
  };

  return midware;
};

export default validateBody;