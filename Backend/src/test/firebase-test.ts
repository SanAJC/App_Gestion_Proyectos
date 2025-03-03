import { db } from '../config/firebase';

const testConnection = async () => {
  try {
    const testDoc = await db.collection('test').doc('connection').get();
    console.log('✅ Conexión exitosa a Firestore');
    console.log('Documento de prueba:', testDoc.data());
  } catch (error) {
    console.error('🚨 Error de conexión:', error);
  }
};

testConnection();