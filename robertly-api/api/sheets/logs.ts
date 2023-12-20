import type ***REMOVED*** VercelRequest, VercelResponse ***REMOVED*** from "@vercel/node";
import ***REMOVED*** google, sheets_v4 ***REMOVED*** from "googleapis";

const spreadsheetId = process.env.SHEETS_ID;

export default async function handler(req: VercelRequest, res: VercelResponse) ***REMOVED***
  const auth = new google.auth.GoogleAuth(***REMOVED***
    credentials: ***REMOVED***
      client_email: process.env.SHEETS_CLIENT_EMAIL,
      private_key: JSON.parse(process.env.SHEETS_PRIVATE_KEY ?? "null"),
***REMOVED***,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
***REMOVED***);

  const sheets = google.sheets(***REMOVED*** version: "v4", auth ***REMOVED***);

  if (req.method === "GET") ***REMOVED***
    await getLogs(req, res, sheets);
***REMOVED*** else if (req.method === "POST") ***REMOVED***
    await createLog(req, res, sheets);
***REMOVED*** else if (req.method === "PUT") ***REMOVED***
    await updateLog(req, res, sheets);
***REMOVED*** else if (req.method === "OPTIONS") ***REMOVED***
    res.status(200).end();
    return;
***REMOVED*** else ***REMOVED***
    res.status(405).send("Method not allowed");
***REMOVED***
***REMOVED***

async function getLogs(_req: VercelRequest, res: VercelResponse, sheets: sheets_v4.Sheets): Promise<void> ***REMOVED***
  try ***REMOVED***
    const logs = (await sheets.spreadsheets.values.get(***REMOVED*** spreadsheetId, range: `Internal!F:I` ***REMOVED***)).data.values;

    if (logs?.length) ***REMOVED***
      const headerUser = logs[0][0];
      const headerExercise = logs[0][1];
      const headerDate = logs[0][2];
      const headerPayload = logs[0][3];

      const parsedLogs = logs
        .slice(1)
        .filter((x) => x.length)
        .map((x) => (***REMOVED***
          [headerUser]: x[0],
          [headerExercise]: x[1],
          [headerDate]: x[2],
          [headerPayload]: JSON.parse(x[3]),
    ***REMOVED***));

      res.json(***REMOVED*** data: parsedLogs ***REMOVED***);
***REMOVED*** else ***REMOVED***
      res.json("No data found.");
***REMOVED***
***REMOVED*** catch (err) ***REMOVED***
    res.json("The API returned an error: " + err);
***REMOVED***
***REMOVED***

type CreateLogRequest = ***REMOVED***
  user: string;
  exercise: string;
  date: string;
  payload: ***REMOVED*** series: string ***REMOVED***;
***REMOVED***;

async function createLog(req: VercelRequest, res: VercelResponse, sheets: sheets_v4.Sheets): Promise<void> ***REMOVED***
  const body = req.body as CreateLogRequest;
  try ***REMOVED***
    const exercises = await sheets.spreadsheets.values.append(***REMOVED***
      spreadsheetId,
      range: "Internal!F:I",
      valueInputOption: "RAW",
      requestBody: ***REMOVED***
        values: [[body.user, body.exercise, body.date, JSON.stringify(body.payload)]],
  ***REMOVED***,
***REMOVED***);
    res.json(***REMOVED*** data: exercises.data ***REMOVED***);
***REMOVED*** catch (err) ***REMOVED***
    res.json("The API returned an error: " + err);
***REMOVED***
***REMOVED***

type UpdateLogRequest = ***REMOVED***
  user: string;
  exercise: string;
  date: string;
  payload: ***REMOVED*** series: string ***REMOVED***;
***REMOVED***;

async function updateLog(req: VercelRequest, res: VercelResponse, sheets: sheets_v4.Sheets): Promise<void> ***REMOVED***
  const body = req.body as UpdateLogRequest;

  try ***REMOVED***
    const result = await sheets.spreadsheets.values.get(***REMOVED*** spreadsheetId, range: `Internal!F:I` ***REMOVED***);
    const logs = result.data.values;

    if (logs?.length) ***REMOVED***
      let logToUpdated: ***REMOVED*** index: number; value: string[] ***REMOVED*** | null = null;

      for (let i = 0; i < logs.length; i++) ***REMOVED***
        const x = logs[i];
        if (x[0] === body.user && x[1] === body.exercise && x[2] === body.date) ***REMOVED***
          logToUpdated = ***REMOVED*** index: i, value: [body.user, body.exercise, body.date, JSON.stringify(body.payload)] ***REMOVED***;
    ***REMOVED***
  ***REMOVED***

      if (logToUpdated) ***REMOVED***
        await sheets.spreadsheets.values.update(***REMOVED***
          spreadsheetId,
          range: `Internal!F$***REMOVED***logToUpdated.index + 1***REMOVED***:I$***REMOVED***logToUpdated.index + 1***REMOVED***`,
          valueInputOption: "RAW",
          requestBody: ***REMOVED***
            values: [logToUpdated.value],
      ***REMOVED***,
    ***REMOVED***);
  ***REMOVED***

      res.json("Updated successfuly!");
***REMOVED*** else ***REMOVED***
      res.json("No data found.");
***REMOVED***
***REMOVED*** catch (err) ***REMOVED***
    res.json("The API returned an error: " + err);
***REMOVED***
***REMOVED***
