import { VercelRequest, VercelResponse } from "@vercel/node";
import { Reference } from "firebase-admin/database";

import { readFileSync } from "fs";
import path from "path";

type Exercise = {
  id: string;
  exercise: string;
  type: string;
  muscleGroup: string;
};

type CreateExerciseRequest = {
  exercise: string;
  type: string;
  muscleGroup: string;
};

type UpdateExerciseRequest = {
  id: string;
  exercise: string;
  type: string;
  muscleGroup: string;
};

type DeleteExerciseRequest = {
  id: string;
};

export async function getExercises(exercisesRef: Reference): Promise<Exercise[]> {
  try {
    const data = (await exercisesRef.once("value")).val() as unknown | null | undefined;

    const exercises = Object.entries(data ?? {}).map(([key, value]) => ({ id: key, ...value })) as Exercise[];

    if (exercises.length) {
      return exercises;
    } else {
      return [];
    }
  } catch (err) {
    return [];
  }
}

export async function createExercise(req: VercelRequest, res: VercelResponse, exercisesRef: Reference): Promise<void> {
  const body = req.body as CreateExerciseRequest;

  try {
    await exercisesRef.push({ ...body });
    res.json("Data saved successfully");
  } catch (err) {
    res.json("The API returned an error: " + err);
  }
}

export async function updateExercise(req: VercelRequest, res: VercelResponse, exercisesRef: Reference): Promise<void> {
  const body = req.body as UpdateExerciseRequest;

  try {
    await exercisesRef.child(body.id).set({ ...body });
    res.json("Updated successfuly!");
  } catch (err) {
    res.json("The API returned an error: " + err);
  }
}

export async function deleteExercise(req: VercelRequest, res: VercelResponse, exercisesRef: Reference): Promise<void> {
  const body = req.body as DeleteExerciseRequest;

  try {
    await exercisesRef.child(body.id).remove();
    res.json("Updated successfuly!");
  } catch (err) {
    res.json("The API returned an error: " + err);
  }
}

export async function seedExercises(_req: VercelRequest, res: VercelResponse, exercisesRef: Reference): Promise<void> {
  const file = path.join(process.cwd(), "files", "exercises-seed.json");
  const stringified = readFileSync(file, "utf8");

  const exercises = JSON.parse(stringified) as CreateExerciseRequest[];
  const promises = exercises.map((x) => exercisesRef.push().set(x));

  try {
    await Promise.all(promises);
    res.json("Data saved successfuly");
  } catch (err) {
    res.json("The API returned an error: " + err);
  }
}
