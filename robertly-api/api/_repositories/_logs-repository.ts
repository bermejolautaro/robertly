import { VercelRequest, VercelResponse } from "@vercel/node";
import { Reference } from "firebase-admin/database";

type CreateLogRequest = {
  user: string;
  exercise: string;
  date: string;
  payload: { series: string };
};

type UpdateLogRequest = {
  user: string;
  exercise: string;
  date: string;
  payload: { series: string };
};

export async function getLogs(logsRef: Reference): Promise<unknown[]> {
  try {
    const data = (await logsRef.once("value")).val();

    const logs = Object.values(data);

    if (logs?.length) {
      return logs;
    } else {
      return [];
    }
  } catch (err) {
    return [];
  }
}

export async function createLog(req: VercelRequest, res: VercelResponse, logsRef: Reference): Promise<void> {
  const body = req.body as CreateLogRequest;
  const id = `${body.user}|${body.exercise}|${body.date}`;

  try {
    await logsRef.child(id).transaction((currentValue) => (!currentValue ? body : currentValue));

    res.json("Data saved successfully");
  } catch (err) {
    res.json("The API returned an error: " + err);
  }
}

export async function updateLog(req: VercelRequest, res: VercelResponse, logsRef: Reference): Promise<void> {
  const body = req.body as UpdateLogRequest;
  const id = `${body.user}|${body.exercise}|${body.date}`;

  try {
    await logsRef.update({ [id]: body });
    res.json("Updated successfuly!");
  } catch (err) {
    res.json("The API returned an error: " + err);
  }
}

export async function deleteLog(req: VercelRequest, res: VercelResponse, logsRef: Reference): Promise<void> {
  const body = req.body as UpdateLogRequest;
  const id = `${body.user}|${body.exercise}|${body.date}`;

  try {
    await logsRef.child(id).remove();
    res.json("Updated successfuly!");
  } catch (err) {
    res.json("The API returned an error: " + err);
  }
}
