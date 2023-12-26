import type ***REMOVED*** VercelRequest, VercelResponse ***REMOVED*** from "@vercel/node";
import ***REMOVED*** connectToDatabase ***REMOVED*** from "../_firebase-helper";

import ***REMOVED*** getExercises, createExercise, updateExercise, deleteExercise ***REMOVED*** from "../_repositories/_exercises-repository";

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

  if (req.method === "GET") ***REMOVED***
    const exercises = await getExercises(req, res, exercisesRefs);
    res.json(***REMOVED*** data: exercises ***REMOVED***);
***REMOVED*** else if (req.method === "POST") ***REMOVED***
    await createExercise(req, res, exercisesRefs);
***REMOVED*** else if (req.method === "PUT") ***REMOVED***
    await updateExercise(req, res, exercisesRefs);
***REMOVED*** else if (req.method === "DELETE") ***REMOVED***
    await deleteExercise(req, res, exercisesRefs);
***REMOVED*** else ***REMOVED***
    res.status(405).send("Method not allowed");
***REMOVED***
***REMOVED***
