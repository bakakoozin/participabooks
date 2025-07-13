import Joi from "joi";

// Validation des données d'ISBN
const isbnSchema = Joi.object({
  isbn: Joi.string()
    .pattern(/^\d{13}$/)
    .required()
    .messages({
      "string.empty": "Un numéro d'isbn est requis.",
      "string.pattern.base": "L'isbn doit contenir exactement 13 chiffres.",
    }),
});

export { isbnSchema };