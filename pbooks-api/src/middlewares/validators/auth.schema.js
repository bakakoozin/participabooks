import Joi from "joi";

// Validation des données d'inscription et de connexion
const registerSchema = Joi.object({
  pseudo: Joi.string().alphanum().min(3).max(50).required().messages({
    "string.empty": "Pseudo est requis.",
    "string.alphanum":
      "Pseudo doit contenir uniquement des caractères alphanumérique.",
    "string.min": "Pseudo doit contenir au moins 3 caractères.",
    "string.max": "Pseudo ne doit pas contenir plus de 50 caractères.",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Adresse email est requise.",
    "string.email": "Adresse email doit être valide.",
  }),
  password: Joi.string().min(8).required().messages({
    "string.empty": "Mot de passe requis.",
    "string.min": "Mot de passe doit contenir au moins 8 caractères.",
  }),
});

// Validation des données de connexion
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Adresse email est requise.",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Mot de passe requis.",
  }),
});

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

export { registerSchema, loginSchema, isbnSchema };
