import { Utilisateur } from "../models/utilisateur.model.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import jwt from "jsonwebtoken";
import { promisify } from "util";
// Méthode	Description	Verbe HTTP	Route API

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const creerEtEnvoyerToken = (utilisateur, statusCode, message, res) => {
  const token = signToken(utilisateur._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    /* The `httpOnly: true` option in a cookie configuration ensures that the cookie is only
        accessible through HTTP requests and cannot be accessed via client-side scripts such as
        JavaScript. This helps to enhance the security of the cookie by preventing potential
        cross-site scripting (XSS) attacks where malicious scripts attempt to steal sensitive
        information stored in cookies. */
    httpOnly: true,
  };

  //the secure means only send cookie when we have https
  //  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);
  // to not show the password
  utilisateur.motDePasse = undefined;
  res.status(statusCode).json({
    status: "success",
    message,
    token,
    data: utilisateur,
  });
};

// registerUser	Inscription d’un nouvel utilisateur (Locataire ou Propriétaire)	POST	/api/users/register
export const inscription = catchAsync(async (req, res, next) => {
  const { nom, email, motDePasse, confirmationMotDePasse } = req.body;

  if (!nom || !email || !motDePasse || !confirmationMotDePasse)
    return next(
      new AppError(
        "Aucune data trouvé dans votre requete , veuillez inserer des champs",
        404
      )
    );
  const nouvelUtilisateur = new Utilisateur({
    nom,
    email,
    motDePasse,
    confirmationMotDePasse,
  });
  await nouvelUtilisateur.save();

  creerEtEnvoyerToken(
    nouvelUtilisateur,
    201,
    "Utilisateur crée avec succes",
    res
  );
});

// loginUser	Authentification et génération du token JWT	POST	/api/users/login
export const connexion = catchAsync(async (req, res, next) => {
  const { email, motDePasse } = req.body;

  if (!email || !motDePasse)
    return next(
      new AppError("veuillez fournir votre email et mot de passe !", 400)
    );

  //2 check if user exists && password is correct
  const utilisateur = await Utilisateur.findOne({ email }).select(
    "+motDePasse"
  );


  if (
    !utilisateur ||
    !(await utilisateur.correctMotDePasse(motDePasse, utilisateur.motDePasse))
  )
    return next(new AppError("email ou mot de passe incorrect", 401));

  creerEtEnvoyerToken(
    utilisateur,
    200,
    "Utilisateur connecté avec succes",
    res
  );
});

// export const proteger = catchAsync(async (req, res, next) => {
//   //1.get token and check if it's there

//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     token = req.headers.authorization.split(" ")[1];
//   } else if (req.cookies.jwt) {
//     token = req.cookies.jwt;
//   }
//   console.log(token);

//   if (!token)
//     return next(
//       new AppError("Vous n'etes pas connecté ! veuillez vous connectez ", 401)
//     );
//   //2. verify the token
//   const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

//   //3. check if user still exists
//   //here we deal with the case the user was deleted after the token was created , then another user cannot grab this token and access
//   const freshUser = await Utilisateur.findById(decode.id);

//   if (!freshUser)
//     return next(
//       new AppError(" L'utilisateur appartenant a ce compte n'existe plus .")
//     );

//   //4. check if user changed password after the was token was issued.
//   if (freshUser.motDePasseChangeApres(decode.iat)) {
//     return next(
//       new AppError("User recently changed password! Please log in again.", 401)
//     );
//   }
//   req.user = freshUser;
//   console.log(req.user);

//   next();
// });

// export const restreindreA = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return next(new AppError("Vous n'avez pas acces a cette ressource"), 403);
//     }
//     next();
//   };
// };




export const proteger = catchAsync(async (req, res, next) => {
  //1.get token and check if it's there

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  console.log(token);
  console.log("Cookies reçus:", req.cookies);
  if (!token)
    return next(
      new AppError("Vous n'etes pas connecté ! veuillez vous connectez ", 401)
    );
  //2. verify the token
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3. check if user still exists
  //here we deal with the case the user was deleted after the token was created , then another user cannot grab this token and access
  const freshUser = await Utilisateur.findById(decode.id);

  if (!freshUser)
    return next(
      new AppError(" L'utilisateur appartenant a ce compte n'existe plus .")
    );

  //4. check if user changed password after the was token was issued.
  if (freshUser.motDePasseChangeApres(decode.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }
  req.user = freshUser;
  console.log(req.user);
  next();
});

export const restreindreA = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Vous n'avez pas acces a cette ressource"), 403);
    }
    next();
  };
}