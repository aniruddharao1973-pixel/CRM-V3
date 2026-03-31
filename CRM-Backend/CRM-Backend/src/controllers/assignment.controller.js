// src/controllers/assignment.controller.js

import { toggleAssignment } from "../services/assign/assignment.service.js";
import prisma from "../utils/prisma.js";

/**
 * 🔁 Toggle assignment
 */
export const toggleAssignmentController = async (req, res) => {
  try {
    const { type, recordId, userId, assigned } = req.body;

    if (!type || !recordId || !userId) {
      return res.status(400).json({
        success: false,
        message: "type, recordId and userId are required",
      });
    }

    const result = await toggleAssignment({
      type,
      recordId,
      userId,
      assigned,
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Assignment Toggle Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

/**
 * 📊 DEAL ASSIGNMENTS
 */
export const getDealAssignments = async (req, res) => {
  const users = await prisma.user.findMany({
    where: {
      role: { in: ["MANAGER", "SALES_REP"] },
      isActive: true,
    },
    select: { id: true, name: true, role: true },
  });

  const deals = await prisma.deal.findMany({
    select: {
      id: true,
      dealName: true,
      assignments: true,
    },
  });

  const formatted = deals.map((deal) => {
    const map = {};

    users.forEach((u) => {
      map[u.id] = false;
    });

    // ✅ ONLY ASSIGNMENTS
    deal.assignments.forEach((a) => {
      map[a.userId] = true;
    });

    return {
      id: deal.id,
      name: deal.dealName,
      assignments: map,
    };
  });

  res.json({ users, records: formatted });
};

/**
 * 📊 CONTACT ASSIGNMENTS
 */
export const getContactAssignments = async (req, res) => {
  const users = await prisma.user.findMany({
    where: {
      role: { in: ["MANAGER", "SALES_REP"] },
      isActive: true,
    },
    select: { id: true, name: true, role: true },
  });

  const contacts = await prisma.contact.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      assignments: true,
    },
  });

  const formatted = contacts.map((c) => {
    const map = {};

    users.forEach((u) => (map[u.id] = false));

    // ✅ ONLY ASSIGNMENTS
    c.assignments.forEach((a) => {
      map[a.userId] = true;
    });

    return {
      id: c.id,
      name: `${c.firstName} ${c.lastName || ""}`,
      assignments: map,
    };
  });

  res.json({ users, records: formatted });
};

/**
 * 📊 ACCOUNT ASSIGNMENTS
 */
export const getAccountAssignments = async (req, res) => {
  const users = await prisma.user.findMany({
    where: {
      role: { in: ["MANAGER", "SALES_REP"] },
      isActive: true,
    },
    select: { id: true, name: true, role: true },
  });

  const accounts = await prisma.account.findMany({
    select: {
      id: true,
      accountName: true,
      assignments: true,
    },
  });

  const formatted = accounts.map((a) => {
    const map = {};

    users.forEach((u) => (map[u.id] = false));

    // ✅ ONLY ASSIGNMENTS
    a.assignments.forEach((x) => {
      map[x.userId] = true;
    });

    return {
      id: a.id,
      name: a.accountName,
      assignments: map,
    };
  });

  res.json({ users, records: formatted });
};
