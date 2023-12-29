import type ***REMOVED*** VercelRequest, VercelResponse ***REMOVED*** from "@vercel/node";
import ***REMOVED*** connectToDatabase ***REMOVED*** from "../../_helpers/_firebase-helper.js";
import ***REMOVED*** seedExercises ***REMOVED*** from "../../_repositories/_exercises-repository.js";

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

  const exercisesRefs = db.ref().child("exercises");

  if (req.method === "PUT") ***REMOVED***
    await seedExercises(req, res, exercisesRefs);
***REMOVED*** else ***REMOVED***
    res.status(405).send("Method not allowed");
***REMOVED***
***REMOVED***
