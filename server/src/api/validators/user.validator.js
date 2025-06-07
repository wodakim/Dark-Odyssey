import { z } from 'zod';

/**
 * Schéma de validation pour la création d'un utilisateur
 */
export const createUserSchema = z.object({
  username: z.string()
    .min(3, { message: "Le nom d'utilisateur doit contenir au moins 3 caractères" })
    .max(30, { message: "Le nom d'utilisateur ne peut pas dépasser 30 caractères" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Le nom d'utilisateur ne peut contenir que des lettres, des chiffres et des underscores" }),
  
  email: z.string()
    .email({ message: "L'adresse email n'est pas valide" }),
  
  password: z.string()
    .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
    .regex(/[A-Z]/, { message: "Le mot de passe doit contenir au moins une lettre majuscule" })
    .regex(/[a-z]/, { message: "Le mot de passe doit contenir au moins une lettre minuscule" })
    .regex(/[0-9]/, { message: "Le mot de passe doit contenir au moins un chiffre" }),
});

/**
 * Schéma de validation pour la mise à jour d'un utilisateur
 */
export const updateUserSchema = z.object({
  username: z.string()
    .min(3, { message: "Le nom d'utilisateur doit contenir au moins 3 caractères" })
    .max(30, { message: "Le nom d'utilisateur ne peut pas dépasser 30 caractères" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Le nom d'utilisateur ne peut contenir que des lettres, des chiffres et des underscores" })
    .optional(),
  
  email: z.string()
    .email({ message: "L'adresse email n'est pas valide" })
    .optional(),
  
  password: z.string()
    .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
    .regex(/[A-Z]/, { message: "Le mot de passe doit contenir au moins une lettre majuscule" })
    .regex(/[a-z]/, { message: "Le mot de passe doit contenir au moins une lettre minuscule" })
    .regex(/[0-9]/, { message: "Le mot de passe doit contenir au moins un chiffre" })
    .optional(),
});

/**
 * Middleware de validation pour les requêtes
 * @param {Object} schema - Schéma de validation Zod
 * @returns {Function} Middleware Express
 */
export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      message: "Données de requête invalides",
      errors: error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))
    });
  }
};

/**
 * Middleware de validation pour la création d'un utilisateur
 */
export const validateCreateUser = validate(createUserSchema);

/**
 * Middleware de validation pour la mise à jour d'un utilisateur
 */
export const validateUpdateUser = validate(updateUserSchema);

export default {
  createUserSchema,
  updateUserSchema,
  validate,
  validateCreateUser,
  validateUpdateUser
};

