-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "plan" TEXT NOT NULL DEFAULT 'free',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Idea" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "targetAudience" TEXT NOT NULL DEFAULT '',
    "industry" TEXT NOT NULL DEFAULT '',
    "attachments" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "marketScope" TEXT NOT NULL DEFAULT 'global',
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Idea_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "viabilityScore" REAL NOT NULL,
    "marketScore" REAL NOT NULL,
    "competitorScore" REAL NOT NULL,
    "monetizationScore" REAL NOT NULL,
    "riskScore" REAL NOT NULL,
    "marketAnalysis" TEXT NOT NULL,
    "competitorOverview" TEXT NOT NULL,
    "monetizationModels" TEXT NOT NULL,
    "riskAssessment" TEXT NOT NULL,
    "nextSteps" TEXT NOT NULL,
    "sources" TEXT NOT NULL DEFAULT '[]',
    "valueHypothesis" TEXT NOT NULL DEFAULT '',
    "riskiestAssumption" TEXT NOT NULL DEFAULT '',
    "pivotSuggestions" TEXT NOT NULL DEFAULT '[]',
    "usedFallback" BOOLEAN NOT NULL DEFAULT false,
    "problemSeverity" REAL NOT NULL DEFAULT 5,
    "marketUrgency" REAL NOT NULL DEFAULT 5,
    "easeOfReplica" REAL NOT NULL DEFAULT 5,
    "founderIdeaFit" REAL NOT NULL DEFAULT 5,
    "executionComplexity" REAL NOT NULL DEFAULT 5,
    "nineDimensions" TEXT NOT NULL DEFAULT '[]',
    "gtmExperiments" TEXT NOT NULL DEFAULT '{}',
    "skepticAnalysis" TEXT NOT NULL DEFAULT '',
    "marketSizing" TEXT NOT NULL DEFAULT '{}',
    "actionPlan" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ideaId" TEXT NOT NULL,
    CONSTRAINT "Report_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Report_ideaId_key" ON "Report"("ideaId");
