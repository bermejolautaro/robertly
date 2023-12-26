import type ***REMOVED*** VercelRequest, VercelResponse ***REMOVED*** from "@vercel/node";
import ***REMOVED*** connectToDatabase ***REMOVED*** from "../_firebase-helper";
import ***REMOVED*** createLog, updateLog, deleteLog, getLogs ***REMOVED*** from "../_repositories/_logs-repository";

export default async function handler(req: VercelRequest, res: VercelResponse) ***REMOVED***
  if (req.method === "OPTIONS") ***REMOVED***
    res.status(200).end();
    return;
***REMOVED***

  const result = connectToDatabase();

  if (!result) ***REMOVED***
    res.status(500).end();
    return;
***REMOVED***

  const ***REMOVED*** app, db ***REMOVED*** = result;

  const logsRef = db.ref().child("logs");

  if (req.method === "GET") ***REMOVED***
    const logs = await getLogs(req, res, logsRef);
    res.json(***REMOVED*** data: logs ***REMOVED***);
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
