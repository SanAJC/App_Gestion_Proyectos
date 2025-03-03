import admin, { ServiceAccount } from 'firebase-admin';
import * as serviceAccount from './firebase-service-account.json'; 

// Conversión de tipo para las credenciales
const firebaseCredentials: ServiceAccount = {
  projectId: serviceAccount.project_id,
  clientEmail: serviceAccount.client_email,
  privateKey: serviceAccount.private_key?.replace(/\\n/g, '\n') 
};

admin.initializeApp({
  credential: admin.credential.cert(firebaseCredentials),
  databaseURL: process.env.FIREBASE_DATABASE_URL 
});

// Exportar servicios de Firebase
export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage(); 