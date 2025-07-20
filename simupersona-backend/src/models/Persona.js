const { v4: uuidv4 } = require('uuid');

class Persona {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.name = data.name;
    this.tone = data.tone;
    this.profession = data.profession;
    this.goals = data.goals;
    
    // Handle personality_traits (can be string or array)
    this.personality_traits = Array.isArray(data.personality_traits) 
      ? data.personality_traits 
      : (data.personality_traits || []);
    
    this.background = data.background || '';
    
    // Handle speaking_style with fallback to communication_style from frontend
    this.speaking_style = data.speaking_style || data.communication_style || '';
    
    // Handle expertise_areas with fallback to expertise from frontend
    this.expertise_areas = data.expertise_areas || data.expertise || [];
    if (Array.isArray(this.expertise_areas)) {
      // Already an array, keep as is
    } else {
      // Convert string to array if needed
      this.expertise_areas = this.expertise_areas || [];
    }
    
    this.conversation_starters = data.conversation_starters || [];
    this.interests = data.interests || '';
    this.isPublic = data.isPublic || false;
    this.userId = data.userId;
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || new Date().toISOString();
  }

  // Convert to JSON for storage
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      tone: this.tone,
      profession: this.profession,
      goals: this.goals,
      personality_traits: this.personality_traits,
      background: this.background,
      speaking_style: this.speaking_style,
      expertise_areas: this.expertise_areas,
      conversation_starters: this.conversation_starters,
      interests: this.interests,
      isPublic: this.isPublic,
      userId: this.userId,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }

  // Generate system prompt for AI
  generateSystemPrompt() {
    const personalityTraits = Array.isArray(this.personality_traits) 
      ? this.personality_traits.join(', ') 
      : this.personality_traits || '';
      
    const expertiseAreas = Array.isArray(this.expertise_areas) 
      ? this.expertise_areas.join(', ') 
      : this.expertise_areas || '';

    const prompt = `You are ${this.name}, a ${this.profession} with the following characteristics:

TONE: ${this.tone}
GOALS: ${this.goals}
PERSONALITY TRAITS: ${personalityTraits}
BACKGROUND: ${this.background}
SPEAKING STYLE: ${this.speaking_style}
EXPERTISE AREAS: ${expertiseAreas}
INTERESTS: ${this.interests}

Please respond to all messages as this character would, maintaining consistency with these traits. 
Stay in character at all times and provide responses that reflect this persona's unique perspective, 
knowledge, and way of communicating.`;

    return prompt;
  }

  // Update persona data
  update(data) {
    if (data.name !== undefined) this.name = data.name;
    if (data.tone !== undefined) this.tone = data.tone;
    if (data.profession !== undefined) this.profession = data.profession;
    if (data.goals !== undefined) this.goals = data.goals;
    if (data.personality_traits !== undefined) this.personality_traits = data.personality_traits;
    if (data.background !== undefined) this.background = data.background;
    
    // Handle speaking_style with fallback to communication_style
    if (data.speaking_style !== undefined) this.speaking_style = data.speaking_style;
    if (data.communication_style !== undefined) this.speaking_style = data.communication_style;
    
    // Handle expertise_areas with fallback to expertise
    if (data.expertise_areas !== undefined) this.expertise_areas = data.expertise_areas;
    if (data.expertise !== undefined) this.expertise_areas = data.expertise;
    
    if (data.conversation_starters !== undefined) this.conversation_starters = data.conversation_starters;
    if (data.interests !== undefined) this.interests = data.interests;
    
    this.updated_at = new Date().toISOString();
  }

  // Validate required fields
  validate() {
    const errors = [];
    
    if (!this.name || this.name.trim().length === 0) {
      errors.push('Name is required');
    }
    
    if (!this.tone || this.tone.trim().length === 0) {
      errors.push('Tone is required');
    }
    
    if (!this.profession || this.profession.trim().length === 0) {
      errors.push('Profession is required');
    }
    
    if (!this.goals || this.goals.trim().length === 0) {
      errors.push('Goals are required');
    }

    if (!this.userId || this.userId.trim().length === 0) {
      errors.push('User ID is required');
    }
    
    return errors;
  }
}

module.exports = Persona;
