import type { VercelRequest, VercelResponse } from "@vercel/node";
import { google } from "googleapis";
import { GoogleAuth } from "googleapis-common";

const spreadsheetId = process.env.SHEETS_ID;
let auth: GoogleAuth | null = null;

export default async function handler(_req: VercelRequest, res: VercelResponse) {

  try {
    auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.SHEETS_CLIENT_EMAIL,
        private_key: JSON.parse(process.env.SHEETS_PRIVATE_KEY ?? "null"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });
  } catch (e) {
    console.error(e);
    console.error(process.env.SHEETS_PRIVATE_KEY);
    res.status(500).end();
    return;
  }

  const sheets = google.sheets({ version: "v4", auth });

  const exercisesPromise = sheets.spreadsheets.values.get({ spreadsheetId, range: `Internal!A:C` });

  try {
    const result = await exercisesPromise;
    const exercises = result.data.values;

    if (exercises?.length) {
      const headerExercise = exercises[0][0];
      const headerType = exercises[0][1];
      const headerMuscleGroup = exercises[0][2];

      const parsedExercises = exercises.slice(1).map((x) => ({
        [headerExercise]: x[0],
        [headerType]: x[1],
        [headerMuscleGroup]: x[2],
      }));

      return res.json({ data: parsedExercises });
    } else {
      return res.json("No data found.");
    }
  } catch (err) {
    return res.json("The API returned an error: " + err);
  }
}
