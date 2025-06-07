import { z } from 'zod';

/**
 * Schéma de validation pour la création d'une guilde
 */
const createGuildSchema = z.object({
  name: z.string()
    .min(3, { message: "Le nom de la guilde doit contenir au moins 3 caractères" })
    .max(30, { message: "Le nom de la guilde ne peut pas dépasser 30 caractères" })
    .regex(/^[a-zA-Z0-9 _-]+$/, { message: "Le nom de la guilde ne peut contenir que des lettres, des chiffres, des espaces, des tirets et des underscores" }),
  
  tag: z.string()
    .min(2, { message: "Le tag de la guilde doit contenir au moins 2 caractères" })
    .max(5, { message: "Le tag de la guilde ne peut pas dépasser 5 caractères" })
    .regex(/^[a-zA-Z0-9]+$/, { message: "Le tag de la guilde ne peut contenir que des lettres et des chiffres" }),
  
  description: z.string()
    .max(500, { message: "La description de la guilde ne peut pas dépasser 500 caractères" })
    .optional(),
  
  characterId: z.string()
    .min(1, { message: "L'ID du personnage est requis" })
});

/**
 * Schéma de validation pour la mise à jour d'une guilde
 */
const updateGuildSchema = z.object({
  description: z.string()
    .max(500, { message: "La description de la guilde ne peut pas dépasser 500 caractères" })
    .optional(),
  
  motd: z.string()
    .max(200, { message: "Le message du jour ne peut pas dépasser 200 caractères" })
    .optional()
});

/**
 * Middleware de validation pour la création d'une guilde
 */
export const validateCreateGuild = (req, res, next) => {
  try {
    createGuildSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      message: "Données de guilde invalides",
      errors: error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))
    });
  }
};

/**
 * Middleware de validation pour la mise à jour d'une guilde
 */
export const validateUpdateGuild = (req, res, next) => {
  try {
    updateGuildSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      message: "Données de guilde invalides",
      errors: error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))
    });
  }
};

export default {
  validateCreateGuild,
  validateUpdateGuild
};

