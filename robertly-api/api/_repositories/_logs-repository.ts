import ***REMOVED*** VercelRequest, VercelResponse ***REMOVED*** from "@vercel/node";
import ***REMOVED*** Reference ***REMOVED*** from "firebase-admin/database";

type CreateLogRequest = ***REMOVED***
  user: string;
  exercise: string;
  date: string;
  payload: ***REMOVED*** series: string ***REMOVED***;
***REMOVED***;

type UpdateLogRequest = ***REMOVED***
  user: string;
  exercise: string;
  date: string;
  payload: ***REMOVED*** series: string ***REMOVED***;
***REMOVED***;

export async function getLogs(_req: VercelRequest, res: VercelResponse, logsRef: Reference): Promise<unknown[]> ***REMOVED***
  try ***REMOVED***
    const data = (await logsRef.once("value")).val();

    const logs = Object.values(data);

    if (logs?.length) ***REMOVED***
      return logs;
***REMOVED*** else ***REMOVED***
      return [];
***REMOVED***
***REMOVED*** catch (err) ***REMOVED***
    res.json("The API returned an error: " + err);
***REMOVED***
***REMOVED***

export async function createLog(req: VercelRequest, res: VercelResponse, logsRef: Reference): Promise<void> ***REMOVED***
  const body = req.body as CreateLogRequest;
  const id = `$***REMOVED***body.user***REMOVED***|$***REMOVED***body.exercise***REMOVED***|$***REMOVED***body.date***REMOVED***`;

  try ***REMOVED***
    await logsRef.child(id).transaction((currentValue) => (!currentValue ? body : currentValue));

    res.json("Data saved successfully");
***REMOVED*** catch (err) ***REMOVED***
    res.json("The API returned an error: " + err);
***REMOVED***
***REMOVED***

export async function updateLog(req: VercelRequest, res: VercelResponse, logsRef: Reference): Promise<void> ***REMOVED***
  const body = req.body as UpdateLogRequest;
  const id = `$***REMOVED***body.user***REMOVED***|$***REMOVED***body.exercise***REMOVED***|$***REMOVED***body.date***REMOVED***`;

  try ***REMOVED***
    await logsRef.update(***REMOVED*** [id]: body ***REMOVED***);
    res.json("Updated successfuly!");
***REMOVED*** catch (err) ***REMOVED***
    res.json("The API returned an error: " + err);
***REMOVED***
***REMOVED***

export async function deleteLog(req: VercelRequest, res: VercelResponse, logsRef: Reference): Promise<void> ***REMOVED***
  const body = req.body as UpdateLogRequest;
  const id = `$***REMOVED***body.user***REMOVED***|$***REMOVED***body.exercise***REMOVED***|$***REMOVED***body.date***REMOVED***`;

  try ***REMOVED***
    await logsRef.child(id).remove();
    res.json("Updated successfuly!");
***REMOVED*** catch (err) ***REMOVED***
    res.json("The API returned an error: " + err);
***REMOVED***
***REMOVED***
