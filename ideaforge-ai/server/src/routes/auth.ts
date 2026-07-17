import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { verifyEmail } from "../services/email";

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "ideaforge-dev-secret-change-in-production";

function signToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

router.post("/check-email", async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email || typeof email !== "string") {
    res.status(400).json({ error: "Email is required" });
    return;
  }
  const result = await verifyEmail(email.trim().toLowerCase());
  if (result.is_disposable) {
    res.json({ valid: false, deliverable: false, is_disposable: true, suggestion: null, message: "Disposable email addresses are not allowed" });
    return;
  }
  if (!result.deliverable && result.suggestion) {
    res.json({ valid: false, deliverable: false, is_disposable: false, suggestion: result.suggestion, message: `Did you mean ${result.suggestion}?` });
    return;
  }
  res.json({ valid: result.deliverable, deliverable: result.deliverable, is_disposable: false, suggestion: null, message: null });
});

router.post("/register", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ error: "Name, email and password are required" });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ error: "Password must be at least 6 characters" });
    return;
  }
  const existing = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
  if (existing) {
    res.status(400).json({ error: "Email already registered" });
    return;
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name: name.trim(), email: email.trim().toLowerCase(), password: hashed },
  });
  const token = signToken(user.id);
  res.status(201).json({
    token,
    user: { id: user.id, name: user.name, email: user.email, plan: user.plan, verified: user.verified, tokens: (user as any).tokens, monthlyTokens: (user as any).monthlyTokens },
  });
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }
  const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
  if (!user) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }
  const token = signToken(user.id);
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, plan: user.plan, verified: user.verified, tokens: (user as any).tokens, monthlyTokens: (user as any).monthlyTokens },
  });
});

router.get("/me", authMiddleware, async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId! } });
  if (!user) { res.status(404).json({ error: "User not found" }); return; }
  res.json({ user: { id: user.id, name: user.name, email: user.email, plan: user.plan, verified: user.verified, tokens: (user as any).tokens, monthlyTokens: (user as any).monthlyTokens } });
});

router.post("/upgrade", authMiddleware, async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.update({ where: { id: req.userId! }, data: { plan: "pro", tokens: 999999, monthlyTokens: 999999 } as any });
  res.json({ user: { id: user.id, name: user.name, email: user.email, plan: user.plan, verified: user.verified, tokens: (user as any).tokens, monthlyTokens: (user as any).monthlyTokens } });
});

router.post("/create-checkout-session", authMiddleware, async (req: AuthRequest, res: Response) => {
  const { plan, priceId } = req.body;
  if (!plan || !["pro", "enterprise"].includes(plan)) {
    res.status(400).json({ error: "Valid plan ('pro' or 'enterprise') is required" });
    return;
  }
  const sessionId = `cs_mock_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const amount = plan === "enterprise" ? 4900 : 1900;
  const url = `/dashboard/payment/success?session_id=${sessionId}&plan=${plan}&price_id=${priceId || ""}`;
  res.json({ sessionId, url, plan, amount, currency: "usd" });
});

export default router;
