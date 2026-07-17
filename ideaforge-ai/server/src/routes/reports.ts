import { Router, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

router.use(authMiddleware);

router.get("/:ideaId", async (req: AuthRequest, res: Response) => {
  const ideaId = req.params.ideaId as string;
  const idea = await prisma.idea.findFirst({
    where: { id: ideaId, userId: req.userId! },
    include: { report: true },
  });
  if (!idea) { res.status(404).json({ error: "Idea not found" }); return; }
  if (!idea.report) {
    res.status(202).json({ message: "Report is still being generated", idea: { id: idea.id, title: idea.title, status: idea.status } });
    return;
  }
  res.json({ report: idea.report, idea: { id: idea.id, title: idea.title, status: idea.status } });
});

export default router;
