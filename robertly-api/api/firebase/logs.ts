import type { VercelRequest, VercelResponse } from "@vercel/node";
import { connectToDatabase } from "../_helpers/_firebase-helper.js";
import { createLog, updateLog, deleteLog, getLogs } from "../_repositories/_logs-repository.js";

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

  if (req.method === "GET") {
    const logs = await getLogs(logsRef);
    res.json({ data: logs });
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
