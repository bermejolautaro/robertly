import type { VercelRequest, VercelResponse } from "@vercel/node";
import { App, cert, initializeApp } from "firebase-admin/app";
import { Reference, getDatabase } from "firebase-admin/database";

let app: App | null = null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (!app) {
    try {
      app = initializeApp({
        credential: cert({
          clientEmail: process.env.DATABASE_CLIENT_EMAIL,
          privateKey: JSON.parse(process.env.DATABASE_PRIVATE_KEY ?? "null"),
          projectId: process.env.DATABASE_PROJECT_ID,
        }),
        databaseURL: process.env.DATABASE_URL,
      });
    } catch (e) {
      console.error(e);
      res.status(500).end();
      return;
    }
  }

  const db = getDatabase(app);
  const logsRef = db.ref().child("logs");

  if (req.method === "GET") {
    await getLogs(req, res, logsRef);
  } else if (req.method === "POST") {
    await createLog(req, res, logsRef);
  } else if (req.method === "PUT") {
    await updateLog(req, res, logsRef);
  } else if (req.method === "DELETE") {
    await deleteLog(req, res, logsRef);
  } else {
    res.status(405).send("Method not allowed");
  }
}

async function getLogs(_req: VercelRequest, res: VercelResponse, logsRef: Reference): Promise<void> {
  try {
    const data = (await logsRef.once("value")).val();

    const logs = Object.values(data);

    if (logs?.length) {
      res.json({ data: logs });
    } else {
      res.json({ data: [] });
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

async function createLog(req: VercelRequest, res: VercelResponse, logsRef: Reference): Promise<void> {
  const body = req.body as CreateLogRequest;
  const id = `${body.user}|${body.exercise}|${body.date}`;

  try {
    await logsRef.child(id).transaction((currentValue) => (!currentValue ? body : currentValue));

    res.json("Data saved successfully");
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

async function updateLog(req: VercelRequest, res: VercelResponse, logsRef: Reference): Promise<void> {
  const body = req.body as UpdateLogRequest;
  const id = `${body.user}|${body.exercise}|${body.date}`;

  try {
    await logsRef.update({ [id]: body });
    res.json("Updated successfuly!");
  } catch (err) {
    res.json("The API returned an error: " + err);
  }
}

async function deleteLog(req: VercelRequest, res: VercelResponse, logsRef: Reference): Promise<void> {
  const body = req.body as UpdateLogRequest;
  const id = `${body.user}|${body.exercise}|${body.date}`;

  try {
    await logsRef.child(id).remove();
    res.json("Updated successfuly!");
  } catch (err) {
    res.json("The API returned an error: " + err);
  }
}
