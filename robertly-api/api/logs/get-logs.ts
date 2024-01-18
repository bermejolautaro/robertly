import type { VercelRequest, VercelResponse } from "@vercel/node";
import { google, sheets_v4 } from "googleapis";

const users = ["Laucha", "Robert", "Nikito", "Mati", "Peque"];

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
  } else {
    res.status(405).send("Method not allowed");
  }
}

async function getLogs(_req: VercelRequest, res: VercelResponse, sheets: sheets_v4.Sheets): Promise<void> {
  const promises = users.map((user) => sheets.spreadsheets.values.get({ spreadsheetId, range: `${user}!A:AZ` }));

  try {
    const values = (await Promise.all(promises)).map((x) => x?.data.values);

    if (values.every((x) => !!x?.length)) {
      const [lautaro, roberto, nikito, matias, peque] = values;
      res.json({ lautaro, roberto, nikito, matias, peque });
    } else {
      res.json("No data found.");
    }
  } catch (err) {
    res.json("The API returned an error: " + err);
  }
}
