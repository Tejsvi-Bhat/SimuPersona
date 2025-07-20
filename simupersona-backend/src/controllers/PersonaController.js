const PersonaStorage = require('../services/PersonaStorage');
const { asyncHandler } = require('../middleware/errorHandler');
const { validatePersonaOwnership, validatePersonaAccess, sanitizeInput } = require('../utils/validation');

class PersonaController {
  constructor() {
    this.storage = new PersonaStorage();
  }

  // Create a new persona
  createPersona = asyncHandler(async (req, res) => {
    // Sanitize input data
    const sanitizedData = this.sanitizePersonaData(req.body);
    
    const persona = await this.storage.create(sanitizedData);
    
    res.status(201).json({
      success: true,
      message: 'Persona created successfully',
      data: persona.toJSON()
    });
  });

  // Get a persona by ID
  getPersona = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body; // In a real app, this would come from authentication middleware
    
    const persona = await this.storage.findById(id);
    
    if (!persona) {
      return res.status(404).json({
        success: false,
        error: 'Persona not found'
      });
    }

    // Check access (owner or public persona)
    validatePersonaAccess(persona, userId);
    
    res.json({
      success: true,
      data: persona.toJSON()
    });
  });

  // Update a persona
  updatePersona = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { userId, ...updateData } = req.body;
    
    // Check if persona exists and user owns it
    const existingPersona = await this.storage.findById(id);
    if (!existingPersona) {
      return res.status(404).json({
        success: false,
        error: 'Persona not found'
      });
    }

    validatePersonaOwnership(existingPersona.userId, userId);
    
    // Sanitize update data
    const sanitizedData = this.sanitizePersonaData(updateData);
    
    const updatedPersona = await this.storage.update(id, sanitizedData);
    
    res.json({
      success: true,
      message: 'Persona updated successfully',
      data: updatedPersona.toJSON()
    });
  });

  // Delete a persona
  deletePersona = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    
    // Check if persona exists and user owns it
    const existingPersona = await this.storage.findById(id);
    if (!existingPersona) {
      return res.status(404).json({
        success: false,
        error: 'Persona not found'
      });
    }

    validatePersonaOwnership(existingPersona.userId, userId);
    
    await this.storage.delete(id);
    
    res.json({
      success: true,
      message: 'Persona deleted successfully'
    });
  });

  // Get all personas for a user (including public ones)
  getUserPersonas = asyncHandler(async (req, res) => {
    const { userId } = req.query;
    const { profession, tone, limit = 10, offset = 0 } = req.query;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    // Get user's own personas
    const userFilters = { userId };
    if (profession) userFilters.profession = profession;
    if (tone) userFilters.tone = tone;
    
    const userPersonas = await this.storage.findAll(userFilters);
    
    // Get public personas (exclude user's own public personas to avoid duplicates)
    const publicFilters = { isPublic: true };
    if (profession) publicFilters.profession = profession;
    if (tone) publicFilters.tone = tone;
    
    const publicPersonas = await this.storage.findAll(publicFilters);
    const filteredPublicPersonas = publicPersonas.filter(p => p.userId !== userId);
    
    // Combine user personas and public personas
    const allPersonas = [...userPersonas, ...filteredPublicPersonas];
    
    // Apply pagination
    const startIndex = parseInt(offset);
    const endIndex = startIndex + parseInt(limit);
    const paginatedPersonas = allPersonas.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedPersonas.map(p => p.toJSON()),
      pagination: {
        total: allPersonas.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: endIndex < allPersonas.length
      }
    });
  });

  // Get persona statistics
  getPersonaStats = asyncHandler(async (req, res) => {
    const stats = await this.storage.getStats();
    
    res.json({
      success: true,
      data: stats
    });
  });

  // Get conversation starters for a persona
  getConversationStarters = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { userId } = req.query;
    
    const persona = await this.storage.findById(id);
    
    if (!persona) {
      return res.status(404).json({
        success: false,
        error: 'Persona not found'
      });
    }

    if (userId) {
      validatePersonaAccess(persona, userId);
    }
    
    res.json({
      success: true,
      data: {
        persona_id: persona.id,
        persona_name: persona.name,
        conversation_starters: persona.conversation_starters
      }
    });
  });

  // Clone a persona (create a copy with new ID)
  clonePersona = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { userId, name } = req.body;
    
    const originalPersona = await this.storage.findById(id);
    
    if (!originalPersona) {
      return res.status(404).json({
        success: false,
        error: 'Persona not found'
      });
    }

    // Create clone data
    const cloneData = {
      ...originalPersona.toJSON(),
      name: name || `${originalPersona.name} (Copy)`,
      userId: userId,
      id: undefined, // Let the system generate a new ID
      created_at: undefined,
      updated_at: undefined
    };

    const clonedPersona = await this.storage.create(cloneData);
    
    res.status(201).json({
      success: true,
      message: 'Persona cloned successfully',
      data: clonedPersona.toJSON()
    });
  });

  // Helper method to sanitize persona data
  sanitizePersonaData(data) {
    const sanitized = {};
    
    // Sanitize string fields
    const stringFields = ['name', 'tone', 'profession', 'goals', 'background', 'speaking_style'];
    stringFields.forEach(field => {
      if (data[field] !== undefined) {
        sanitized[field] = sanitizeInput(data[field]);
      }
    });

    // Sanitize array fields
    const arrayFields = ['personality_traits', 'expertise_areas', 'conversation_starters'];
    arrayFields.forEach(field => {
      if (data[field] !== undefined && Array.isArray(data[field])) {
        sanitized[field] = data[field].map(item => sanitizeInput(item));
      }
    });

    // Pass through other fields
    if (data.userId !== undefined) sanitized.userId = data.userId;
    
    return sanitized;
  }
}

module.exports = PersonaController;
