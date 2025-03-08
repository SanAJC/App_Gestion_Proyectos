import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { GitHubRepo } from '../types/type';

export const getUserRepos = async (req: Request, res: Response, next: NextFunction) => {

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(400).json({ message: "No se proporcionó el token de acceso de GitHub." });
    return
  }
  const token = authHeader.split(' ')[1];
  try {
    const reposResponse = await axios.get<GitHubRepo[]>('https://api.github.com/user/repos', {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });
    res.status(200).json({ repos: reposResponse.data });
  } catch (error) {
    next(error);
  }
};
