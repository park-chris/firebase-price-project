import * as admin from "firebase-admin";

if (!admin.apps.length) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const serviceAccount = require("../admin.json");
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

export { admin };