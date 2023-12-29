import ***REMOVED*** VercelRequest, VercelResponse ***REMOVED*** from "@vercel/node";
import ***REMOVED*** Reference ***REMOVED*** from "firebase-admin/database";

import ***REMOVED*** readFileSync ***REMOVED*** from "fs";
import path from "path";

type Exercise = ***REMOVED***
  id: string;
  exercise: string;
  type: string;
  muscleGroup: string;
***REMOVED***;

type CreateExerciseRequest = ***REMOVED***
  exercise: string;
  type: string;
  muscleGroup: string;
***REMOVED***;

type UpdateExerciseRequest = ***REMOVED***
  id: string;
  exercise: string;
  type: string;
  muscleGroup: string;
***REMOVED***;

type DeleteExerciseRequest = ***REMOVED***
  id: string;
***REMOVED***;

export async function getExercises(exercisesRef: Reference): Promise<Exercise[]> ***REMOVED***
  try ***REMOVED***
    const data = (await exercisesRef.once("value")).val() as unknown | null | undefined;

    const exercises = Object.entries(data ?? ***REMOVED******REMOVED***).map(([key, value]) => (***REMOVED*** id: key, ...value ***REMOVED***)) as Exercise[];

    if (exercises.length) ***REMOVED***
      return exercises;
***REMOVED*** else ***REMOVED***
      return [];
***REMOVED***
***REMOVED*** catch (err) ***REMOVED***
    return [];
***REMOVED***
***REMOVED***

export async function createExercise(req: VercelRequest, res: VercelResponse, exercisesRef: Reference): Promise<void> ***REMOVED***
  const body = req.body as CreateExerciseRequest;

  try ***REMOVED***
    await exercisesRef.push(***REMOVED*** ...body ***REMOVED***);
    res.json("Data saved successfully");
***REMOVED*** catch (err) ***REMOVED***
    res.json("The API returned an error: " + err);
***REMOVED***
***REMOVED***

export async function updateExercise(req: VercelRequest, res: VercelResponse, exercisesRef: Reference): Promise<void> ***REMOVED***
  const body = req.body as UpdateExerciseRequest;

  try ***REMOVED***
    await exercisesRef.child(body.id).set(***REMOVED*** ...body ***REMOVED***);
    res.json("Updated successfuly!");
***REMOVED*** catch (err) ***REMOVED***
    res.json("The API returned an error: " + err);
***REMOVED***
***REMOVED***

export async function deleteExercise(req: VercelRequest, res: VercelResponse, exercisesRef: Reference): Promise<void> ***REMOVED***
  const body = req.body as DeleteExerciseRequest;

  try ***REMOVED***
    await exercisesRef.child(body.id).remove();
    res.json("Updated successfuly!");
***REMOVED*** catch (err) ***REMOVED***
    res.json("The API returned an error: " + err);
***REMOVED***
***REMOVED***

export async function seedExercises(_req: VercelRequest, res: VercelResponse, exercisesRef: Reference): Promise<void> ***REMOVED***
  const file = path.join(process.cwd(), "files", "exercises-seed.json");
  const stringified = readFileSync(file, "utf8");

  const exercises = JSON.parse(stringified) as CreateExerciseRequest[];
  const promises = exercises.map((x) => exercisesRef.push().set(x));

  try ***REMOVED***
    await Promise.all(promises);
    res.json("Data saved successfuly");
***REMOVED*** catch (err) ***REMOVED***
    res.json("The API returned an error: " + err);
***REMOVED***
***REMOVED***
