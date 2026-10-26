import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, test } from "node:test";
import { PrismaClient } from "@prisma/client";

const baseUrl = process.env.INTEGRATION_BASE_URL;
const prisma = new PrismaClient();

after(async () => {
  await prisma.$disconnect();
});

test("auth cookies protect and authorize the ideas API", { skip: !baseUrl }, async () => {
  const email = `integration-${randomUUID()}@example.test`;
  const password = `Integration-${randomUUID()}-Aa1`;

  try {
    const registration = await fetch(new URL("/api/auth/register", baseUrl), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "Integration Test", email, password }),
    });
    assert.equal(registration.status, 201);
    const registrationData = await registration.json();
    assert.equal(typeof registrationData.token, "undefined");

    const login = await fetch(new URL("/api/auth/login", baseUrl), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    assert.equal(login.status, 200);
    assert.equal(typeof (await login.json()).token, "undefined");
    const setCookie = login.headers.get("set-cookie");
    assert.ok(setCookie?.includes("ideaforge_token="));
    assert.match(setCookie, /httponly/i);
    const cookie = setCookie.split(";")[0];

    const unauthorized = await fetch(new URL("/api/ideas", baseUrl));
    assert.equal(unauthorized.status, 401);

    const ideas = await fetch(new URL("/api/ideas", baseUrl), {
      headers: { cookie },
    });
    assert.equal(ideas.status, 200);
    assert.ok(Array.isArray((await ideas.json()).ideas));

    const createIdea = await fetch(new URL("/api/ideas", baseUrl), {
      method: "POST",
      headers: { cookie, "content-type": "application/json" },
      body: JSON.stringify({ title: "Integration idea", description: "A test idea." }),
    });
    assert.equal(createIdea.status, 201);

    const logout = await fetch(new URL("/api/auth/logout", baseUrl), {
      method: "POST",
      headers: { cookie, origin: new URL(baseUrl).origin },
    });
    assert.equal(logout.status, 200);
    assert.match(logout.headers.get("set-cookie") ?? "", /max-age=0/i);
  } finally {
    await prisma.user.deleteMany({ where: { email } });
  }
});
