import type ***REMOVED*** VercelRequest, VercelResponse ***REMOVED*** from "@vercel/node";
import ***REMOVED*** google, sheets_v4 ***REMOVED*** from "googleapis";

const users = ["Laucha", "Robert", "Nikito", "Mati", "Peque"];

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
***REMOVED*** else ***REMOVED***
    res.status(405).send("Method not allowed");
***REMOVED***
***REMOVED***

async function getLogs(_req: VercelRequest, res: VercelResponse, sheets: sheets_v4.Sheets): Promise<void> ***REMOVED***
  const promises = users.map((user) => sheets.spreadsheets.values.get(***REMOVED*** spreadsheetId, range: `$***REMOVED***user***REMOVED***!A:AZ` ***REMOVED***));

  try ***REMOVED***
    const values = (await Promise.all(promises)).map((x) => x?.data.values);

    if (values.every((x) => !!x?.length)) ***REMOVED***
      const [lautaro, roberto, nikito, matias, peque] = values;
      res.json(***REMOVED*** lautaro, roberto, nikito, matias, peque ***REMOVED***);
***REMOVED*** else ***REMOVED***
      res.json("No data found.");
***REMOVED***
***REMOVED*** catch (err) ***REMOVED***
    res.json("The API returned an error: " + err);
***REMOVED***
***REMOVED***
