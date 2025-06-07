import { z } from 'zod';

/**
 * Schéma de validation pour la création d'un personnage
 */
const createCharacterSchema = z.object({
  name: z.string()
    .min(3, { message: "Le nom du personnage doit contenir au moins 3 caractères" })
    .max(20, { message: "Le nom du personnage ne peut pas dépasser 20 caractères" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Le nom du personnage ne peut contenir que des lettres, des chiffres et des underscores" }),
  
  race: z.enum(['human', 'elf', 'dwarf', 'orc', 'goblin'], {
    errorMap: () => ({ message: "Race invalide. Choisissez parmi: human, elf, dwarf, orc, goblin" })
  }),
  
  class: z.enum(['warrior', 'mage', 'rogue', 'cleric'], {
    errorMap: () => ({ message: "Classe invalide. Choisissez parmi: warrior, mage, rogue, cleric" })
  }),
  
  appearance: z.object({
    hairStyle: z.number().int().min(1).max(10).optional(),
    hairColor: z.string().regex(/^#[0-9A-F]{6}$/, { message: "La couleur des cheveux doit être au format hexadécimal (ex: #FF0000)" }).optional(),
    skinColor: z.string().regex(/^#[0-9A-F]{6}$/, { message: "La couleur de peau doit être au format hexadécimal (ex: #F5DEB3)" }).optional(),
    eyeColor: z.string().regex(/^#[0-9A-F]{6}$/, { message: "La couleur des yeux doit être au format hexadécimal (ex: #0000FF)" }).optional(),
    faceStyle: z.number().int().min(1).max(10).optional()
  }).optional()
});

/**
 * Schéma de validation pour la mise à jour d'un personnage
 */
const updateCharacterSchema = z.object({
  name: z.string()
    .min(3, { message: "Le nom du personnage doit contenir au moins 3 caractères" })
    .max(20, { message: "Le nom du personnage ne peut pas dépasser 20 caractères" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Le nom du personnage ne peut contenir que des lettres, des chiffres et des underscores" })
    .optional()
});

/**
 * Middleware de validation pour la création d'un personnage
 */
export const validateCreateCharacter = (req, res, next) => {
  try {
    createCharacterSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      message: "Données de personnage invalides",
      errors: error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))
    });
  }
};

/**
 * Middleware de validation pour la mise à jour d'un personnage
 */
export const validateUpdateCharacter = (req, res, next) => {
  try {
    updateCharacterSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      message: "Données de personnage invalides",
      errors: error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))
    });
  }
};

export default {
  validateCreateCharacter,
  validateUpdateCharacter
};

