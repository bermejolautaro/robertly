import { VercelRequest, VercelResponse } from "@vercel/node";
import { connectToDatabase } from "../_helpers/_firebase-helper.js";

import { getExercises, createExercise, updateExercise, deleteExercise } from "../_repositories/_exercises-repository.js";

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const result = connectToDatabase();

  if (!result) {
    res.status(500).end();
    return;
  }

  const { app, db } = result;

  const exercisesRefs = db.ref().child("exercises");

  if (req.method === "GET") {
    const exercises = await getExercises(exercisesRefs);
    res.json({ data: exercises });
  } else if (req.method === "POST") {
    await createExercise(req, res, exercisesRefs);
  } else if (req.method === "PUT") {
    await updateExercise(req, res, exercisesRefs);
  } else if (req.method === "DELETE") {
    await deleteExercise(req, res, exercisesRefs);
  } else {
    res.status(405).send("Method not allowed");
  }
}
