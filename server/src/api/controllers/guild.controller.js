import Guild from '../models/guild.model.js';
import User from '../models/user.model.js';
import Character from '../models/character.model.js';

/**
 * Crée une nouvelle guilde
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const createGuild = async (req, res) => {
  try {
    const { name, description, tag, characterId } = req.body;
    
    // Vérifier si le nom de guilde est déjà pris
    const existingGuild = await Guild.findOne({ name });
    if (existingGuild) {
      return res.status(400).json({ message: 'Ce nom de guilde est déjà pris' });
    }
    
    // Vérifier si le tag de guilde est déjà pris
    const existingTag = await Guild.findOne({ tag });
    if (existingTag) {
      return res.status(400).json({ message: 'Ce tag de guilde est déjà pris' });
    }
    
    // Vérifier si le personnage existe et appartient à l'utilisateur
    const character = await Character.findById(characterId);
    if (!character) {
      return res.status(404).json({ message: 'Personnage non trouvé' });
    }
    
    if (character.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Accès non autorisé à ce personnage' });
    }
    
    // Vérifier si le personnage est déjà dans une guilde
    if (character.guildId) {
      return res.status(400).json({ message: 'Ce personnage est déjà dans une guilde' });
    }
    
    // Créer la guilde
    const guild = new Guild({
      name,
      description,
      tag,
      ownerId: req.userId,
      members: [
        {
          userId: req.userId,
          characterId,
          characterName: character.name,
          role: 'owner',
          joinedAt: new Date()
        }
      ],
      createdAt: new Date()
    });
    
    await guild.save();
    
    // Mettre à jour le personnage
    character.guildId = guild._id;
    character.guildRole = 'owner';
    await character.save();
    
    return res.status(201).json(guild);
  } catch (error) {
    console.error('Erreur lors de la création de la guilde:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la création de la guilde' });
  }
};

/**
 * Récupère toutes les guildes
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const getGuilds = async (req, res) => {
  try {
    const { search, sort } = req.query;
    
    // Construire le filtre de recherche
    const filter = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { tag: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Construire les options de tri
    let sortOptions = { createdAt: -1 }; // Par défaut, tri par date de création (plus récent d'abord)
    
    if (sort === 'name') {
      sortOptions = { name: 1 };
    } else if (sort === 'members') {
      sortOptions = { 'members.length': -1 };
    } else if (sort === 'level') {
      sortOptions = { level: -1 };
    }
    
    const guilds = await Guild.find(filter).sort(sortOptions);
    return res.status(200).json(guilds);
  } catch (error) {
    console.error('Erreur lors de la récupération des guildes:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la récupération des guildes' });
  }
};

/**
 * Récupère une guilde par son ID
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const getGuildById = async (req, res) => {
  try {
    const guild = await Guild.findById(req.params.id);
    
    if (!guild) {
      return res.status(404).json({ message: 'Guilde non trouvée' });
    }
    
    return res.status(200).json(guild);
  } catch (error) {
    console.error('Erreur lors de la récupération de la guilde:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la récupération de la guilde' });
  }
};

/**
 * Met à jour une guilde
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const updateGuild = async (req, res) => {
  try {
    const { description, motd } = req.body;
    
    const guild = await Guild.findById(req.params.id);
    
    if (!guild) {
      return res.status(404).json({ message: 'Guilde non trouvée' });
    }
    
    // Vérifier si l'utilisateur est le propriétaire de la guilde
    if (guild.ownerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Seul le propriétaire de la guilde peut la modifier' });
    }
    
    // Mettre à jour la guilde
    if (description) {
      guild.description = description;
    }
    
    if (motd) {
      guild.motd = motd;
    }
    
    await guild.save();
    
    return res.status(200).json(guild);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la guilde:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la mise à jour de la guilde' });
  }
};

/**
 * Supprime une guilde
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const deleteGuild = async (req, res) => {
  try {
    const guild = await Guild.findById(req.params.id);
    
    if (!guild) {
      return res.status(404).json({ message: 'Guilde non trouvée' });
    }
    
    // Vérifier si l'utilisateur est le propriétaire de la guilde
    if (guild.ownerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Seul le propriétaire de la guilde peut la supprimer' });
    }
    
    // Mettre à jour tous les personnages membres de la guilde
    for (const member of guild.members) {
      await Character.updateMany(
        { _id: member.characterId },
        { $unset: { guildId: 1, guildRole: 1 } }
      );
    }
    
    // Supprimer la guilde
    await Guild.findByIdAndDelete(req.params.id);
    
    return res.status(200).json({ message: 'Guilde supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la guilde:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la suppression de la guilde' });
  }
};

/**
 * Rejoint une guilde
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const joinGuild = async (req, res) => {
  try {
    const { characterId } = req.body;
    
    // Vérifier si la guilde existe
    const guild = await Guild.findById(req.params.id);
    if (!guild) {
      return res.status(404).json({ message: 'Guilde non trouvée' });
    }
    
    // Vérifier si le personnage existe et appartient à l'utilisateur
    const character = await Character.findById(characterId);
    if (!character) {
      return res.status(404).json({ message: 'Personnage non trouvé' });
    }
    
    if (character.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Accès non autorisé à ce personnage' });
    }
    
    // Vérifier si le personnage est déjà dans une guilde
    if (character.guildId) {
      return res.status(400).json({ message: 'Ce personnage est déjà dans une guilde' });
    }
    
    // Vérifier si la guilde est pleine (limite de 50 membres)
    if (guild.members.length >= 50) {
      return res.status(400).json({ message: 'Cette guilde est pleine' });
    }
    
    // Ajouter le membre à la guilde
    guild.members.push({
      userId: req.userId,
      characterId,
      characterName: character.name,
      role: 'member',
      joinedAt: new Date()
    });
    
    await guild.save();
    
    // Mettre à jour le personnage
    character.guildId = guild._id;
    character.guildRole = 'member';
    await character.save();
    
    return res.status(200).json({
      message: `${character.name} a rejoint la guilde ${guild.name}`,
      guild
    });
  } catch (error) {
    console.error('Erreur lors de l\'adhésion à la guilde:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de l\'adhésion à la guilde' });
  }
};

/**
 * Quitte une guilde
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const leaveGuild = async (req, res) => {
  try {
    const { characterId } = req.body;
    
    // Vérifier si la guilde existe
    const guild = await Guild.findById(req.params.id);
    if (!guild) {
      return res.status(404).json({ message: 'Guilde non trouvée' });
    }
    
    // Vérifier si le personnage existe et appartient à l'utilisateur
    const character = await Character.findById(characterId);
    if (!character) {
      return res.status(404).json({ message: 'Personnage non trouvé' });
    }
    
    if (character.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Accès non autorisé à ce personnage' });
    }
    
    // Vérifier si le personnage est dans cette guilde
    if (!character.guildId || character.guildId.toString() !== req.params.id) {
      return res.status(400).json({ message: 'Ce personnage n\'est pas dans cette guilde' });
    }
    
    // Vérifier si le personnage est le propriétaire de la guilde
    const memberIndex = guild.members.findIndex(member => member.characterId.toString() === characterId);
    if (memberIndex === -1) {
      return res.status(400).json({ message: 'Ce personnage n\'est pas dans cette guilde' });
    }
    
    if (guild.members[memberIndex].role === 'owner') {
      return res.status(400).json({ message: 'Le propriétaire ne peut pas quitter la guilde. Transférez d\'abord la propriété ou supprimez la guilde.' });
    }
    
    // Retirer le membre de la guilde
    guild.members.splice(memberIndex, 1);
    await guild.save();
    
    // Mettre à jour le personnage
    character.guildId = undefined;
    character.guildRole = undefined;
    await character.save();
    
    return res.status(200).json({
      message: `${character.name} a quitté la guilde ${guild.name}`,
      guild
    });
  } catch (error) {
    console.error('Erreur lors du départ de la guilde:', error);
    return res.status(500).json({ message: 'Erreur serveur lors du départ de la guilde' });
  }
};

/**
 * Expulse un membre de la guilde
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const kickMember = async (req, res) => {
  try {
    const { id: guildId, userId: targetUserId } = req.params;
    
    // Vérifier si la guilde existe
    const guild = await Guild.findById(guildId);
    if (!guild) {
      return res.status(404).json({ message: 'Guilde non trouvée' });
    }
    
    // Vérifier si l'utilisateur est le propriétaire ou un officier de la guilde
    const currentMember = guild.members.find(member => member.userId.toString() === req.userId);
    if (!currentMember || (currentMember.role !== 'owner' && currentMember.role !== 'officer')) {
      return res.status(403).json({ message: 'Seul le propriétaire ou un officier peut expulser un membre' });
    }
    
    // Vérifier si le membre à expulser existe
    const targetMemberIndex = guild.members.findIndex(member => member.userId.toString() === targetUserId);
    if (targetMemberIndex === -1) {
      return res.status(404).json({ message: 'Membre non trouvé dans la guilde' });
    }
    
    const targetMember = guild.members[targetMemberIndex];
    
    // Vérifier si le membre à expulser n'est pas le propriétaire
    if (targetMember.role === 'owner') {
      return res.status(403).json({ message: 'Le propriétaire ne peut pas être expulsé' });
    }
    
    // Vérifier si un officier essaie d'expulser un autre officier
    if (currentMember.role === 'officer' && targetMember.role === 'officer') {
      return res.status(403).json({ message: 'Un officier ne peut pas expulser un autre officier' });
    }
    
    // Mettre à jour le personnage expulsé
    await Character.updateOne(
      { _id: targetMember.characterId },
      { $unset: { guildId: 1, guildRole: 1 } }
    );
    
    // Retirer le membre de la guilde
    guild.members.splice(targetMemberIndex, 1);
    await guild.save();
    
    return res.status(200).json({
      message: `${targetMember.characterName} a été expulsé de la guilde`,
      guild
    });
  } catch (error) {
    console.error('Erreur lors de l\'expulsion du membre:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de l\'expulsion du membre' });
  }
};

/**
 * Promeut un membre au rang d'officier
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const promoteToOfficer = async (req, res) => {
  try {
    const { id: guildId, userId: targetUserId } = req.params;
    
    // Vérifier si la guilde existe
    const guild = await Guild.findById(guildId);
    if (!guild) {
      return res.status(404).json({ message: 'Guilde non trouvée' });
    }
    
    // Vérifier si l'utilisateur est le propriétaire de la guilde
    if (guild.ownerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Seul le propriétaire peut promouvoir un membre' });
    }
    
    // Vérifier si le membre à promouvoir existe
    const targetMemberIndex = guild.members.findIndex(member => member.userId.toString() === targetUserId);
    if (targetMemberIndex === -1) {
      return res.status(404).json({ message: 'Membre non trouvé dans la guilde' });
    }
    
    // Vérifier si le membre est déjà officier ou propriétaire
    if (guild.members[targetMemberIndex].role !== 'member') {
      return res.status(400).json({ message: 'Ce membre est déjà officier ou propriétaire' });
    }
    
    // Promouvoir le membre
    guild.members[targetMemberIndex].role = 'officer';
    await guild.save();
    
    // Mettre à jour le personnage
    await Character.updateOne(
      { _id: guild.members[targetMemberIndex].characterId },
      { guildRole: 'officer' }
    );
    
    return res.status(200).json({
      message: `${guild.members[targetMemberIndex].characterName} a été promu au rang d'officier`,
      guild
    });
  } catch (error) {
    console.error('Erreur lors de la promotion du membre:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la promotion du membre' });
  }
};

/**
 * Rétrograde un officier au rang de membre
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const demoteFromOfficer = async (req, res) => {
  try {
    const { id: guildId, userId: targetUserId } = req.params;
    
    // Vérifier si la guilde existe
    const guild = await Guild.findById(guildId);
    if (!guild) {
      return res.status(404).json({ message: 'Guilde non trouvée' });
    }
    
    // Vérifier si l'utilisateur est le propriétaire de la guilde
    if (guild.ownerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Seul le propriétaire peut rétrograder un officier' });
    }
    
    // Vérifier si le membre à rétrograder existe
    const targetMemberIndex = guild.members.findIndex(member => member.userId.toString() === targetUserId);
    if (targetMemberIndex === -1) {
      return res.status(404).json({ message: 'Membre non trouvé dans la guilde' });
    }
    
    // Vérifier si le membre est bien un officier
    if (guild.members[targetMemberIndex].role !== 'officer') {
      return res.status(400).json({ message: 'Ce membre n\'est pas un officier' });
    }
    
    // Rétrograder l'officier
    guild.members[targetMemberIndex].role = 'member';
    await guild.save();
    
    // Mettre à jour le personnage
    await Character.updateOne(
      { _id: guild.members[targetMemberIndex].characterId },
      { guildRole: 'member' }
    );
    
    return res.status(200).json({
      message: `${guild.members[targetMemberIndex].characterName} a été rétrogradé au rang de membre`,
      guild
    });
  } catch (error) {
    console.error('Erreur lors de la rétrogradation de l\'officier:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la rétrogradation de l\'officier' });
  }
};

/**
 * Transfère la propriété de la guilde
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const transferOwnership = async (req, res) => {
  try {
    const { id: guildId, userId: targetUserId } = req.params;
    
    // Vérifier si la guilde existe
    const guild = await Guild.findById(guildId);
    if (!guild) {
      return res.status(404).json({ message: 'Guilde non trouvée' });
    }
    
    // Vérifier si l'utilisateur est le propriétaire de la guilde
    if (guild.ownerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Seul le propriétaire peut transférer la propriété' });
    }
    
    // Vérifier si le membre à promouvoir existe
    const targetMemberIndex = guild.members.findIndex(member => member.userId.toString() === targetUserId);
    if (targetMemberIndex === -1) {
      return res.status(404).json({ message: 'Membre non trouvé dans la guilde' });
    }
    
    // Trouver l'index du propriétaire actuel
    const currentOwnerIndex = guild.members.findIndex(member => member.userId.toString() === req.userId);
    
    // Transférer la propriété
    guild.ownerId = targetUserId;
    guild.members[currentOwnerIndex].role = 'officer';
    guild.members[targetMemberIndex].role = 'owner';
    
    await guild.save();
    
    // Mettre à jour les personnages
    await Character.updateOne(
      { _id: guild.members[currentOwnerIndex].characterId },
      { guildRole: 'officer' }
    );
    
    await Character.updateOne(
      { _id: guild.members[targetMemberIndex].characterId },
      { guildRole: 'owner' }
    );
    
    return res.status(200).json({
      message: `La propriété de la guilde a été transférée à ${guild.members[targetMemberIndex].characterName}`,
      guild
    });
  } catch (error) {
    console.error('Erreur lors du transfert de propriété:', error);
    return res.status(500).json({ message: 'Erreur serveur lors du transfert de propriété' });
  }
};

export default {
  createGuild,
  getGuilds,
  getGuildById,
  updateGuild,
  deleteGuild,
  joinGuild,
  leaveGuild,
  kickMember,
  promoteToOfficer,
  demoteFromOfficer,
  transferOwnership
};

