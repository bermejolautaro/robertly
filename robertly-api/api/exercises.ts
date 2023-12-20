import type ***REMOVED*** VercelRequest, VercelResponse ***REMOVED*** from "@vercel/node";
import ***REMOVED*** google ***REMOVED*** from "googleapis";
import ***REMOVED*** GoogleAuth ***REMOVED*** from "googleapis-common";

const spreadsheetId = process.env.SHEETS_ID;
let auth: GoogleAuth | null = null;

export default async function handler(_req: VercelRequest, res: VercelResponse) ***REMOVED***

  try ***REMOVED***
    auth = new google.auth.GoogleAuth(***REMOVED***
      credentials: ***REMOVED***
        client_email: process.env.SHEETS_CLIENT_EMAIL,
        private_key: JSON.parse(process.env.SHEETS_PRIVATE_KEY ?? "null"),
  ***REMOVED***,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
***REMOVED***);
***REMOVED*** catch (e) ***REMOVED***
    console.error(e);
    console.error(process.env.SHEETS_PRIVATE_KEY);
    res.status(500).end();
    return;
***REMOVED***

  const sheets = google.sheets(***REMOVED*** version: "v4", auth ***REMOVED***);

  const exercisesPromise = sheets.spreadsheets.values.get(***REMOVED*** spreadsheetId, range: `Internal!A:C` ***REMOVED***);

  try ***REMOVED***
    const result = await exercisesPromise;
    const exercises = result.data.values;

    if (exercises?.length) ***REMOVED***
      const headerExercise = exercises[0][0];
      const headerType = exercises[0][1];
      const headerMuscleGroup = exercises[0][2];

      const parsedExercises = exercises.slice(1).map((x) => (***REMOVED***
        [headerExercise]: x[0],
        [headerType]: x[1],
        [headerMuscleGroup]: x[2],
  ***REMOVED***));

      return res.json(***REMOVED*** data: parsedExercises ***REMOVED***);
***REMOVED*** else ***REMOVED***
      return res.json("No data found.");
***REMOVED***
***REMOVED*** catch (err) ***REMOVED***
    return res.json("The API returned an error: " + err);
***REMOVED***
***REMOVED***
