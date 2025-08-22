import admin from 'firebase-admin'
import { errorResponse } from '../utils/response.js';
import env from '../config/env.js';

const serviceAccount = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT)
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export const verifyFirebaseToken = async (req, res, next) => {
  try {
    const token = req.body?.firebaseToken
    if(!token) return errorResponse(res, {
      message: "Bạn chưa có token"
    })

    const decoded = await admin.auth().verifyIdToken(token)
    if(decoded){
      next()
    }
  } catch (error) {
    next(error)
  }
}