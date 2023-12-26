import ***REMOVED*** App, cert, initializeApp ***REMOVED*** from "firebase-admin/app";
import ***REMOVED*** Database, getDatabase ***REMOVED*** from "firebase-admin/database";

let app: App | null = null;
let db: Database | null = null;

declare global ***REMOVED***
  var _app: App | null;
***REMOVED***

export function connectToDatabase() ***REMOVED***
  try ***REMOVED***
    if (app && db) ***REMOVED***
      return ***REMOVED*** app, db ***REMOVED***;
***REMOVED***

    if (process.env.NODE_ENV === "development") ***REMOVED***
      if (!global._app) ***REMOVED***
        app = initApp();
        global._app = app;
  ***REMOVED*** else ***REMOVED***
        app = global._app;
  ***REMOVED***
***REMOVED*** else ***REMOVED***
      app = initApp();
***REMOVED***

    db = getDatabase(app);

    return ***REMOVED*** app, db ***REMOVED***;
***REMOVED*** catch (e) ***REMOVED***
    console.error(e);
***REMOVED***
***REMOVED***

function initApp() ***REMOVED***
  return initializeApp(***REMOVED***
    credential: cert(***REMOVED***
      clientEmail: process.env.DATABASE_CLIENT_EMAIL,
      privateKey: JSON.parse(process.env.DATABASE_PRIVATE_KEY ?? "null"),
      projectId: process.env.DATABASE_PROJECT_ID,
***REMOVED***),
    databaseURL: process.env.DATABASE_URL,
***REMOVED***);
***REMOVED***
