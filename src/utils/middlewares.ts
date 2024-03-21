import { NextFunction, Request, Response } from "express"
import { z } from "zod"

export function validate<T extends z.ZodRawShape>(schema: z.ZodObject<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const bodySchema = z.object({
      body: schema,
    })
    try {
      bodySchema.parse({
        body: req.body,
      })

      next()
    } catch (err: any) {
      res.status(400).send(err.errors)
    }
  }
}
