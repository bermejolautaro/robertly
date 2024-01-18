import type { VercelRequest, VercelResponse } from "@vercel/node";
import { google, sheets_v4 } from "googleapis";

const spreadsheetId = process.env.SHEETS_ID;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.SHEETS_CLIENT_EMAIL,
      private_key: JSON.parse(process.env.SHEETS_PRIVATE_KEY ?? "null"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  if (req.method === "GET") {
    await getLogs(req, res, sheets);
  } else if (req.method === "POST") {
    await createLog(req, res, sheets);
  } else if (req.method === "PUT") {
    await updateLog(req, res, sheets);
  } else if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  } else {
    res.status(405).send("Method not allowed");
  }
}

async function getLogs(_req: VercelRequest, res: VercelResponse, sheets: sheets_v4.Sheets): Promise<void> {
  try {
    const logs = (await sheets.spreadsheets.values.get({ spreadsheetId, range: `Internal!F:I` })).data.values;

    if (logs?.length) {
      const headerUser = logs[0][0];
      const headerExercise = logs[0][1];
      const headerDate = logs[0][2];
      const headerPayload = logs[0][3];

      const parsedLogs = logs
        .slice(1)
        .filter((x) => x.length)
        .map((x) => ({
          [headerUser]: x[0],
          [headerExercise]: x[1],
          [headerDate]: x[2],
          [headerPayload]: JSON.parse(x[3]),
        }));

      res.json({ data: parsedLogs });
    } else {
      res.json("No data found.");
    }
  } catch (err) {
    res.json("The API returned an error: " + err);
  }
}

type CreateLogRequest = {
  user: string;
  exercise: string;
  date: string;
  payload: { series: string };
};

async function createLog(req: VercelRequest, res: VercelResponse, sheets: sheets_v4.Sheets): Promise<void> {
  const body = req.body as CreateLogRequest;
  try {
    const exercises = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Internal!F:I",
      valueInputOption: "RAW",
      requestBody: {
        values: [[body.user, body.exercise, body.date, JSON.stringify(body.payload)]],
      },
    });
    res.json({ data: exercises.data });
  } catch (err) {
    res.json("The API returned an error: " + err);
  }
}

type UpdateLogRequest = {
  user: string;
  exercise: string;
  date: string;
  payload: { series: string };
};

async function updateLog(req: VercelRequest, res: VercelResponse, sheets: sheets_v4.Sheets): Promise<void> {
  const body = req.body as UpdateLogRequest;

  try {
    const result = await sheets.spreadsheets.values.get({ spreadsheetId, range: `Internal!F:I` });
    const logs = result.data.values;

    if (logs?.length) {
      let logToUpdated: { index: number; value: string[] } | null = null;

      for (let i = 0; i < logs.length; i++) {
        const x = logs[i];
        if (x[0] === body.user && x[1] === body.exercise && x[2] === body.date) {
          logToUpdated = { index: i, value: [body.user, body.exercise, body.date, JSON.stringify(body.payload)] };
        }
      }

      if (logToUpdated) {
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `Internal!F${logToUpdated.index + 1}:I${logToUpdated.index + 1}`,
          valueInputOption: "RAW",
          requestBody: {
            values: [logToUpdated.value],
          },
        });
      }

      res.json("Updated successfuly!");
    } else {
      res.json("No data found.");
    }
  } catch (err) {
    res.json("The API returned an error: " + err);
  }
}
