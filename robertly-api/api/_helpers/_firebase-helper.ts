import { App, cert, initializeApp } from "firebase-admin/app";
import { Database, getDatabase } from "firebase-admin/database";

let app: App | null = null;
let db: Database | null = null;

declare global {
  var _app: App | null;
}

export function connectToDatabase() {
  try {
    if (app && db) {
      return { app, db };
    }

    if (process.env.NODE_ENV === "development") {
      if (!global._app) {
        app = initApp();
        global._app = app;
      } else {
        app = global._app;
      }
    } else {
      app = initApp();
    }

    db = getDatabase(app);

    return { app, db };
  } catch (e) {
    console.error(e);
  }
}

function initApp() {
  return initializeApp({
    credential: cert({
      clientEmail: process.env.DATABASE_CLIENT_EMAIL,
      privateKey: JSON.parse(process.env.DATABASE_PRIVATE_KEY ?? "null"),
      projectId: process.env.DATABASE_PROJECT_ID,
    }),
    databaseURL: process.env.DATABASE_URL,
  });
}
