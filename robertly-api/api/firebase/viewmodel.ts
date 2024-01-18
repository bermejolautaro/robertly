import { VercelRequest, VercelResponse } from "@vercel/node";
import { connectToDatabase } from "../_helpers/_firebase-helper.js";
import { getLogs } from "../_repositories/_logs-repository.js";
import { getExercises } from "../_repositories/_exercises-repository.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

  const logsRef = db.ref().child("logs");
  const exercisesRef = db.ref().child("exercises");

  if (req.method === "GET") {
    const logs = await getLogs(logsRef);
    const exercises = await getExercises(exercisesRef);

    res.json({ data: { logs, exercises } });
  } else {
    res.status(405).send("Method not allowed");
  }
}
