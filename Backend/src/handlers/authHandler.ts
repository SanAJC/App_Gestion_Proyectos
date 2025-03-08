import { Request, Response, NextFunction } from 'express';
import { auth, db } from '../config/firebase';
import { GitHubTokenResponse, GitHubUser }  from '../types/type'
import axios from 'axios';

// Endpoint para iniciar sesión usando la API REST de Firebase
export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const apiKey = process.env.FIREBASE_API_KEY_; 

  if (!apiKey) {
    res.status(500).json({ message: "FIREBASE_API_KEY no configurada" });
    return;
  }

  try {
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true })
    });

    if (!response.ok) {
      const errorData = await response.json();
      res.status(400).json({ message: "Error al iniciar sesión", error: errorData });
      return
    }

    const data = await response.json();
    res.status(200).json({ message: "Login exitoso", data });
  } catch (error) {
    next(error);
  }
};

// Endpoint para registrar un nuevo usuario
export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, username, rol } = req.body;

  try {
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: username
    });
    const userDoc = {
      username,
      email,
      rol: rol || "user" 
    };
    await db.collection('users').doc(userRecord.uid).set(userDoc);

    res.status(201).json({ message: "Usuario registrado correctamente", uid: userRecord.uid });
  } catch (error) {
    next(error);
  }
};


//Endpoint para redigir a Github para la autorizacion
export const githubRedirect = (req: Request, res: Response) => {
  const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID_;
  const redirectUri = 'http://localhost:4000/api/auth/github/callback';
  const scope = 'read:user user:email';
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
  res.redirect(authUrl);
};

//Endpoint para manejar el callback de github

export const githubCallback = async (req: Request, res: Response, next: NextFunction) => {
  const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID_;
  const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET_;

  const { code } = req.query;
  if (!code) {
    res.status(400).json({ message: "No se proporcionó el código de autorización." });
    return;
  }
  
  try {
    // Intercambiar el código por un access token
    const tokenResponse = await axios.post<GitHubTokenResponse>(
      'https://github.com/login/oauth/access_token',
      {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) {
      res.status(400).json({ message: "No se recibió el access token." });
      return;
    }

    // Obtener información del usuario desde GitHub
    const userResponse = await axios.get<GitHubUser>('https://api.github.com/user', {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });

    let githubUser = userResponse.data;
    if (!githubUser.email) {
      const emailsResponse = await axios.get<{ email: string; primary: boolean; verified: boolean }[]>(
        'https://api.github.com/user/emails',
        {
          headers: {
            Authorization: `token ${accessToken}`,
          },
        }
      );
      const emails = emailsResponse.data;
      const primaryEmail = emails.find(emailObj => emailObj.primary && emailObj.verified);
      if (primaryEmail && primaryEmail.email) {
        githubUser.email = primaryEmail.email;
      } else {
        res.status(400).json({ message: "No se pudo obtener un email válido del usuario de GitHub." });
      }
    }
    let firebaseUser;
    try {
      firebaseUser = await auth.getUserByEmail(githubUser.email);
    } catch (error) {
      
      firebaseUser = await auth.createUser({
        email: githubUser.email,
        displayName: githubUser.login,
      });
      await db.collection('users').doc(firebaseUser.uid).set({
        username: githubUser.login,
        email: githubUser.email,
        rol: "user",
      });
    }

    // Crear un custom token de Firebase para que el cliente se autentique
    const customToken = await auth.createCustomToken(firebaseUser.uid);

    // Retornar el token (puedes redirigir al cliente o enviar JSON)
    res.status(200).json({ message: "Inicio de sesión con GitHub exitoso", token: customToken });
  } catch (error) {
    next(error);
  }
};


