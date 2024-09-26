import Classe from '../models/Classe.js';

class ClasseRepository {
  static async creer(classeData) {
    const nouvelleClasse = new Classe(classeData);
    return await nouvelleClasse.save();
  }

  static async obtenirTous() {
    return await Classe.find();
  }

  static async obtenirParId(id) {
    return await Classe.findById(id);
  }

  static async mettreAJour(id, classeData) {
    return await Classe.findByIdAndUpdate(id, classeData, { new: true });
  }

  static async supprimer(id) {
    return await Classe.findByIdAndDelete(id);
  }

  static async sauvegarder(classe) {
    return await classe.save();
  }

  // Vous pouvez ajouter d'autres méthodes spécifiques aux classes si nécessaire
}

export default ClasseRepository;
