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

export const getUserRepo = async(req:Request,res:Response)=>{

  const {owner , repo }= req.params;
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(400).json({ message: "No se proporcionó el token de acceso de GitHub." });
    return
  }
  const token = authHeader.split(' ')[1] || authHeader;
  try {
    const response =await axios.get(`https://api.github.com/repos/${owner}/${repo}` , {
      headers:{Authorization: `token ${token}`}
    });
    
    res.status(200).json({repo:response.data})
    return;
    
  } catch (error) {
    res.status(401).json({"Su token de acceso no es valido":error});
  }
};

export const getEvents = async(req:Request,res:Response)=>{

  const {owner , repo }= req.params;
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(400).json({ message: "No se proporcionó el token de acceso de GitHub." });
    return
  }
  const token = authHeader.split(' ')[1] || authHeader;
  try {
    const response =await axios.get(`https://api.github.com/repos/${owner}/${repo}/events` , {
      headers:{Authorization: `token ${token}`}
    });
    
    res.status(200).json({Eventos:response.data})
    return;
    
  } catch (error) {
    res.status(401).json({"Su token de acceso no es valido":error});
  }
};

export const getLanguages = async(req:Request,res:Response)=>{

  const {owner , repo }= req.params;
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(400).json({ message: "No se proporcionó el token de acceso de GitHub." });
    return
  }
  const token = authHeader.split(' ')[1] || authHeader;
  try {
    const response =await axios.get(`https://api.github.com/repos/${owner}/${repo}/languages` , {
      headers:{Authorization: `token ${token}`}
    });
    
    res.status(200).json({languages:response.data})
    return;
    
  } catch (error) {
    res.status(401).json({"Su token de acceso no es valido":error});
  }
};


