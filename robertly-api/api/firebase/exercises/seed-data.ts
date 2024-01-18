import type { VercelRequest, VercelResponse } from "@vercel/node";
import { connectToDatabase } from "../../_helpers/_firebase-helper.js";
import { seedExercises } from "../../_repositories/_exercises-repository.js";

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

  const exercisesRefs = db.ref().child("exercises");

  if (req.method === "PUT") {
    await seedExercises(req, res, exercisesRefs);
  } else {
    res.status(405).send("Method not allowed");
  }
}
