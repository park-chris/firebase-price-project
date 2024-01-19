import * as admin from "firebase-admin";

// Firebase 앱을 한 번만 초기화
if (!admin.apps.length) {
  admin.initializeApp();
}

export { admin };