const fs = require('fs').promises;
const path = require('path');
const Persona = require('../models/Persona');

class PersonaStorage {
  constructor() {
    this.dataFile = path.join(__dirname, '../../data/personas.json');
    this.ensureDataFileExists();
  }

  async ensureDataFileExists() {
    try {
      await fs.access(this.dataFile);
    } catch (error) {
      // File doesn't exist, create it with empty array
      await fs.writeFile(this.dataFile, JSON.stringify([], null, 2));
    }
  }

  async readData() {
    try {
      const data = await fs.readFile(this.dataFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading persona data:', error);
      return [];
    }
  }

  async writeData(data) {
    try {
      await fs.writeFile(this.dataFile, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error writing persona data:', error);
      throw new Error('Failed to save persona data');
    }
  }

  async create(personaData) {
    const personas = await this.readData();
    const persona = new Persona(personaData);
    
    // Validate persona
    const errors = persona.validate();
    if (errors.length > 0) {
      throw new Error(`Validation errors: ${errors.join(', ')}`);
    }

    personas.push(persona.toJSON());
    await this.writeData(personas);
    
    return persona;
  }

  async findById(id) {
    const personas = await this.readData();
    const personaData = personas.find(p => p.id === id);
    
    if (!personaData) {
      return null;
    }
    
    return new Persona(personaData);
  }

  async findByUserId(userId) {
    const personas = await this.readData();
    const userPersonas = personas.filter(p => p.userId === userId);
    
    return userPersonas.map(p => new Persona(p));
  }

  async update(id, updateData) {
    const personas = await this.readData();
    const index = personas.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error('Persona not found');
    }
    
    const persona = new Persona(personas[index]);
    persona.update(updateData);
    
    // Validate updated persona
    const errors = persona.validate();
    if (errors.length > 0) {
      throw new Error(`Validation errors: ${errors.join(', ')}`);
    }
    
    personas[index] = persona.toJSON();
    await this.writeData(personas);
    
    return persona;
  }

  async delete(id) {
    const personas = await this.readData();
    const index = personas.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error('Persona not found');
    }
    
    personas.splice(index, 1);
    await this.writeData(personas);
    
    return true;
  }

  async findAll(filters = {}) {
    const personas = await this.readData();
    let filteredPersonas = personas;
    
    if (filters.userId) {
      filteredPersonas = filteredPersonas.filter(p => p.userId === filters.userId);
    }
    
    if (filters.profession) {
      filteredPersonas = filteredPersonas.filter(p => 
        p.profession.toLowerCase().includes(filters.profession.toLowerCase())
      );
    }
    
    if (filters.tone) {
      filteredPersonas = filteredPersonas.filter(p => 
        p.tone.toLowerCase().includes(filters.tone.toLowerCase())
      );
    }
    
    if (filters.hasOwnProperty('isPublic')) {
      filteredPersonas = filteredPersonas.filter(p => p.isPublic === filters.isPublic);
    }
    
    return filteredPersonas.map(p => new Persona(p));
  }

  async getStats() {
    const personas = await this.readData();
    const stats = {
      total: personas.length,
      byProfession: {},
      byTone: {},
      recentlyCreated: 0
    };

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    personas.forEach(persona => {
      // Count by profession
      stats.byProfession[persona.profession] = (stats.byProfession[persona.profession] || 0) + 1;
      
      // Count by tone
      stats.byTone[persona.tone] = (stats.byTone[persona.tone] || 0) + 1;
      
      // Count recently created
      if (new Date(persona.created_at) > oneWeekAgo) {
        stats.recentlyCreated++;
      }
    });

    return stats;
  }
}

module.exports = PersonaStorage;
