import { User } from "../models/user.model.js";
import AppError from "../utils/appError.js";

// Méthode	Description	Verbe HTTP	Route API

export const signup = async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  if (!name || !email || !password || !passwordConfirm)
    return next(new AppError("Aucune data trouvé dans votre requete", 404));

  console.log(req.body);
  try {
    const newUser = new User({ name, email, password, passwordConfirm });
    await newUser.save();
    res.status(201).json("Utilisateur crée avec succes");
  } catch (error) {
    res.status(404).json(error);
  }
};
// registerUser	Inscription d’un nouvel utilisateur (Locataire ou Propriétaire)	POST	/api/users/register
// loginUser	Authentification et génération du token JWT	POST	/api/users/login
// logoutUser	Déconnexion (facultatif si utilisation du JWT)	POST	/api/users/logout
// getUserProfile	Récupérer les informations du profil d’un utilisateur	GET	/api/users/profile/:id
// updateUserProfile	Modifier les informations du profil	PUT	/api/users/profile/:id
// deleteUser	Supprimer un compte utilisateur	DELETE	/api/users/:id
// getAllUsers	Récupérer la liste de tous les utilisateurs (Admin)	GET	/api/users
// updateUserRole	Modifier le rôle d’un utilisateur (Admin)	PUT	/api/users/:id/role
// uploadProfilePicture	Mettre à jour l’image de profil d’un utilisateur	POST	/api/users/upload-profile-picture
// verifyEmail	Vérifier l’email d’un utilisateur via un code envoyé par email	POST	/api/users/verify-email
// resetPassword	Demander une réinitialisation du mot de passe	POST	/api/users/reset-password
// changePassword	Changer son mot de passe après vérification	PUT	/api/users/change-password
// deactivateAccount	Désactiver temporairement un compte utilisateur	PUT	/api/users/deactivate/:id

// Nom du Modèle	Description
// User	Gestion des utilisateurs (locataires, propriétaires, admins)
// Vehicle	Stocke les véhicules mis en location
// Rental	Gère les réservations et locations
// Payment	Gère les paiements sécurisés
// Review	Permet aux utilisateurs de noter et commenter
// Message	Stocke les conversations entre utilisateurs
// Notification	Notifications des actions importantes
// Admin	Gestion des administrateurs
