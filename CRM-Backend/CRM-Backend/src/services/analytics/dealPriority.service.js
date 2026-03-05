import prisma from "../../utils/prisma.js";

/*
Priority Score Factors

1️⃣ Deal Value (0–30)
2️⃣ Stage Importance (0–20)
3️⃣ Days Stuck In Stage (0–20)
4️⃣ Closing Date Urgency (0–20)
5️⃣ Risk Level Adjustment (-10 → +10)

Final Score Range ≈ 0–100
*/

export async function getDealPriority(userId) {
  const deals = await prisma.deal.findMany({
    where: {
      dealOwnerId: userId,
      stage: {
        notIn: [
          "CLOSED_WON",
          "CLOSED_LOST",
          "CLOSED_LOST_TO_COMPETITION",
          "REGRETTED",
        ],
      },
    },
    include: {
      account: true,
      risk: true,
      stageHistory: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  const today = new Date();

  const scoredDeals = deals.map((deal) => {
    /* ---------------- VALUE SCORE ---------------- */

    let valueScore = 0;

    if (deal.amount) {
      valueScore = Math.min(deal.amount / 100000, 30);
    }

    /* ---------------- STAGE SCORE ---------------- */

    const stageWeights = {
      RFQ: 5,
      VISIT_MEETING: 7,
      PREVIEW: 9,
      TECHNICAL_PROPOSAL: 12,
      COMMERCIAL_PROPOSAL: 15,
      REVIEW_FEEDBACK: 16,
      MOVED_TO_PURCHASE: 17,
      NEGOTIATION: 20,
    };

    const stageScore = stageWeights[deal.stage] || 5;

    /* ---------------- STAGE AGING ---------------- */

    let agingScore = 0;

    if (deal.stageHistory.length) {
      const entered = new Date(deal.stageHistory[0].createdAt);

      const daysInStage = Math.floor((today - entered) / (1000 * 60 * 60 * 24));

      agingScore = Math.min(daysInStage * 2, 20);
    }

    /* ---------------- CLOSING URGENCY ---------------- */

    let closingScore = 0;

    if (deal.closingDate) {
      const daysToClose = Math.floor(
        (new Date(deal.closingDate) - today) / (1000 * 60 * 60 * 24),
      );

      if (daysToClose <= 7) closingScore = 20;
      else if (daysToClose <= 14) closingScore = 15;
      else if (daysToClose <= 30) closingScore = 10;
      else closingScore = 5;
    }

    /* ---------------- RISK ADJUSTMENT ---------------- */

    let riskAdjustment = 0;

    if (deal.risk) {
      const riskMap = {
        LOW: 5,
        MEDIUM: 0,
        HIGH: -5,
        CRITICAL: -10,
      };

      riskAdjustment = riskMap[deal.risk.riskLevel] || 0;
    }

    /* ---------------- FINAL SCORE ---------------- */

    const priorityScore =
      valueScore + stageScore + agingScore + closingScore + riskAdjustment;

    /* ---------------- REASON ---------------- */

    let reason = "Active opportunity";

    if (closingScore >= 15) reason = "Closing date approaching";

    if (agingScore >= 15) reason = "Deal stuck in stage";

    if (valueScore >= 20) reason = "High value opportunity";

    if (deal.risk?.riskLevel === "HIGH")
      reason = "High risk deal requiring attention";

    return {
      dealId: deal.id,
      dealName: deal.dealName,
      account: deal.account?.accountName,
      stage: deal.stage,
      amount: deal.amount,
      closingDate: deal.closingDate,
      riskLevel: deal.risk?.riskLevel || "UNKNOWN",
      priorityScore: Math.round(priorityScore),
      reason,
    };
  });

  /* ---------------- SORT BY PRIORITY ---------------- */

  return scoredDeals.sort((a, b) => b.priorityScore - a.priorityScore);
}
