import type ***REMOVED*** VercelRequest, VercelResponse ***REMOVED*** from "@vercel/node";
import ***REMOVED*** App, cert, initializeApp ***REMOVED*** from "firebase-admin/app";
import ***REMOVED*** Reference, getDatabase ***REMOVED*** from "firebase-admin/database";

let app: App | null = null;

export default async function handler(req: VercelRequest, res: VercelResponse) ***REMOVED***
  if (req.method === "OPTIONS") ***REMOVED***
    res.status(200).end();
    return;
***REMOVED***

  if (!app) ***REMOVED***
    try ***REMOVED***
      app = initializeApp(***REMOVED***
        credential: cert(***REMOVED***
          clientEmail: process.env.DATABASE_CLIENT_EMAIL,
          privateKey: JSON.parse(process.env.DATABASE_PRIVATE_KEY ?? "null"),
          projectId: process.env.DATABASE_PROJECT_ID,
    ***REMOVED***),
        databaseURL: process.env.DATABASE_URL,
  ***REMOVED***);
***REMOVED*** catch (e) ***REMOVED***
      console.error(e);
      res.status(500).end();
      return;
***REMOVED***
***REMOVED***

  const db = getDatabase(app);
  const logsRef = db.ref().child("logs");

  if (req.method === "GET") ***REMOVED***
    await getLogs(req, res, logsRef);
***REMOVED*** else if (req.method === "POST") ***REMOVED***
    await createLog(req, res, logsRef);
***REMOVED*** else if (req.method === "PUT") ***REMOVED***
    await updateLog(req, res, logsRef);
***REMOVED*** else if (req.method === "DELETE") ***REMOVED***
    await deleteLog(req, res, logsRef);
***REMOVED*** else ***REMOVED***
    res.status(405).send("Method not allowed");
***REMOVED***
***REMOVED***

async function getLogs(_req: VercelRequest, res: VercelResponse, logsRef: Reference): Promise<void> ***REMOVED***
  try ***REMOVED***
    const data = (await logsRef.once("value")).val();

    const logs = Object.values(data);

    if (logs?.length) ***REMOVED***
      res.json(***REMOVED*** data: logs ***REMOVED***);
***REMOVED*** else ***REMOVED***
      res.json(***REMOVED*** data: [] ***REMOVED***);
***REMOVED***
***REMOVED*** catch (err) ***REMOVED***
    res.json("The API returned an error: " + err);
***REMOVED***
***REMOVED***

type CreateLogRequest = ***REMOVED***
  user: string;
  exercise: string;
  date: string;
  payload: ***REMOVED*** series: string ***REMOVED***;
***REMOVED***;

async function createLog(req: VercelRequest, res: VercelResponse, logsRef: Reference): Promise<void> ***REMOVED***
  const body = req.body as CreateLogRequest;
  const id = `$***REMOVED***body.user***REMOVED***|$***REMOVED***body.exercise***REMOVED***|$***REMOVED***body.date***REMOVED***`;

  try ***REMOVED***
    await logsRef.child(id).transaction((currentValue) => (!currentValue ? body : currentValue));

    res.json("Data saved successfully");
***REMOVED*** catch (err) ***REMOVED***
    res.json("The API returned an error: " + err);
***REMOVED***
***REMOVED***

type UpdateLogRequest = ***REMOVED***
  user: string;
  exercise: string;
  date: string;
  payload: ***REMOVED*** series: string ***REMOVED***;
***REMOVED***;

async function updateLog(req: VercelRequest, res: VercelResponse, logsRef: Reference): Promise<void> ***REMOVED***
  const body = req.body as UpdateLogRequest;
  const id = `$***REMOVED***body.user***REMOVED***|$***REMOVED***body.exercise***REMOVED***|$***REMOVED***body.date***REMOVED***`;

  try ***REMOVED***
    await logsRef.update(***REMOVED*** [id]: body ***REMOVED***);
    res.json("Updated successfuly!");
***REMOVED*** catch (err) ***REMOVED***
    res.json("The API returned an error: " + err);
***REMOVED***
***REMOVED***

async function deleteLog(req: VercelRequest, res: VercelResponse, logsRef: Reference): Promise<void> ***REMOVED***
  const body = req.body as UpdateLogRequest;
  const id = `$***REMOVED***body.user***REMOVED***|$***REMOVED***body.exercise***REMOVED***|$***REMOVED***body.date***REMOVED***`;

  try ***REMOVED***
    await logsRef.child(id).remove();
    res.json("Updated successfuly!");
***REMOVED*** catch (err) ***REMOVED***
    res.json("The API returned an error: " + err);
***REMOVED***
***REMOVED***
