import ***REMOVED*** VercelRequest, VercelResponse ***REMOVED*** from "@vercel/node";
import ***REMOVED*** connectToDatabase ***REMOVED*** from "../_helpers/_firebase-helper.js";
import ***REMOVED*** getLogs ***REMOVED*** from "../_repositories/_logs-repository.js";
import ***REMOVED*** getExercises ***REMOVED*** from "../_repositories/_exercises-repository.js";

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
  const exercisesRef = db.ref().child("exercises");

  if (req.method === "GET") ***REMOVED***
    const logs = await getLogs(logsRef);
    const exercises = await getExercises(exercisesRef);

    res.json(***REMOVED*** data: ***REMOVED*** logs, exercises ***REMOVED*** ***REMOVED***);
***REMOVED*** else ***REMOVED***
    res.status(405).send("Method not allowed");
***REMOVED***
***REMOVED***
