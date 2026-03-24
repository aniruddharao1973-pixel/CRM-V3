// // src/modules/email/emailCampaign.service.js

// import prisma from "../../utils/prisma.js";
// import { sendEmailGateway } from "./emailGateway.js";
// import { renderTemplate } from "./templateRenderer.js";

// export async function sendBulkEmailCampaign({
//   template,
//   recipients,
//   userId,
//   campaignId,
//   subject,
//   body,
// }) {
//   const results = {
//     sent: 0,
//     failed: 0,
//   };

//   /*
//   =====================================================
//   LOAD SENDER USER
//   =====================================================
//   */

//   const user = await prisma.user.findUnique({
//     where: { id: userId },
//   });

//   if (!user) {
//     throw new Error("Sender user not found");
//   }

//   /*
//   =====================================================
//   SEND EMAILS
//   =====================================================
//   */

//   for (const recipient of recipients) {
//     try {
//       const variables = {
//         contact: recipient,
//       };

//       const finalBody = renderTemplate(body || template.body, variables);

//       const finalSubject = subject || template.subject;

//       await sendEmailGateway({
//         userId,
//         from: user.email,
//         to: recipient.email,
//         subject: finalSubject,
//         html: finalBody,
//         provider: user.emailProvider || "SMTP",
//       });

//       await prisma.emailLog.create({
//         data: {
//           fromEmail: user.email,
//           toEmail: recipient.email,

//           subject: finalSubject,
//           body: finalBody,

//           templateId: template.id,
//           campaignId,

//           sentById: userId,

//           status: "SENT",
//           direction: "OUTBOUND",
//           folder: "SENT",
//           sentAt: new Date(),
//         },
//       });

//       results.sent++;
//     } catch (err) {
//       console.error("Campaign email failed:", err.message);

//       results.failed++;
//     }
//   }

//   return results;
// }

// // src/modules/email/emailCampaign.service.js

// import prisma from "../../utils/prisma.js";
// import { sendEmailGateway } from "./emailGateway.js";
// import { renderTemplate } from "./templateRenderer.js";

// export async function sendBulkEmailCampaign({
//   template,
//   recipients,
//   userId,
//   campaignId,
//   subject,
//   body,
//   io,
// }) {
//   const results = {
//     sent: 0,
//     failed: 0,
//   };

//   /*
//   =====================================================
//   LOAD SENDER USER
//   =====================================================
//   */

//   const user = await prisma.user.findUnique({
//     where: { id: userId },
//   });

//   if (!user) {
//     throw new Error("Sender user not found");
//   }

//   const total = recipients.length;

//   /*
//   =====================================================
//   BATCH SETTINGS
//   =====================================================
//   */

//   const BATCH_SIZE = 10;

//   /*
//   =====================================================
//   SEND EMAILS IN PARALLEL BATCHES
//   =====================================================
//   */

//   for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
//     const batch = recipients.slice(i, i + BATCH_SIZE);

//     await Promise.all(
//       batch.map(async (recipient) => {
//         try {
//           const variables = {
//             contact: recipient,
//           };

//           /*
//           =============================================
//           SAFE TEMPLATE HANDLING
//           =============================================
//           */

//           const templateBody = template?.body || "";
//           const templateSubject = template?.subject || "";

//           const finalBody = renderTemplate(body || templateBody, variables);

//           const finalSubject = subject || templateSubject;

//           /*
//           =============================================
//           SEND EMAIL
//           =============================================
//           */

//           await sendEmailGateway({
//             userId,
//             from: user.email,
//             to: recipient.email,
//             subject: finalSubject,
//             html: finalBody,
//             provider: user.emailProvider || "SMTP",
//           });

//           /*
//           =============================================
//           LOG EMAIL
//           =============================================
//           */

//           await prisma.emailLog.create({
//             data: {
//               fromEmail: user.email,
//               toEmail: recipient.email,

//               subject: finalSubject,
//               body: finalBody,

//               templateId: template?.id || null,
//               campaignId,

//               sentById: userId,

//               status: "SENT",
//               direction: "OUTBOUND",
//               folder: "SENT",
//               sentAt: new Date(),
//             },
//           });

//           results.sent++;
//         } catch (err) {
//           console.error("Campaign email failed:", err.message);
//           results.failed++;
//         }

//         /*
//         =====================================================
//         REAL TIME PROGRESS UPDATE
//         =====================================================
//         */

//         if (io) {
//           const completed = results.sent + results.failed;

//           const progress = Math.round((completed / total) * 100);

//           io.emit("email-progress", {
//             campaignId,
//             sent: results.sent,
//             failed: results.failed,
//             total,
//             progress,
//           });
//         }
//       }),
//     );
//   }

//   /*
//   =====================================================
//   CAMPAIGN COMPLETED
//   =====================================================
//   */

//   if (io) {
//     io.emit("email-complete", {
//       campaignId,
//       results,
//     });
//   }

//   return results;
// }
// =====================================================================
// // src/modules/email/emailCampaign.service.js
// import prisma from "../../utils/prisma.js";
// import { sendEmailGateway } from "./emailGateway.js";
// import { renderTemplate } from "./templateRenderer.js";

// export async function sendBulkEmailCampaign({
//   template,
//   recipients,
//   userId,
//   campaignId,
//   subject,
//   body,
// }) {
//   const results = {
//     sent: 0,
//     failed: 0,
//   };

//   /*
//   =====================================================
//   LOAD SENDER USER
//   =====================================================
//   */

//   const user = await prisma.user.findUnique({
//     where: { id: userId },
//   });

//   if (!user) {
//     throw new Error("Sender user not found");
//   }

//   /*
//   =====================================================
//   BATCH SETTINGS
//   =====================================================
//   */

//   const BATCH_SIZE = 10;

//   /*
//   =====================================================
//   SEND EMAILS IN PARALLEL BATCHES
//   =====================================================
//   */

//   for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
//     const batch = recipients.slice(i, i + BATCH_SIZE);

//     await Promise.all(
//       batch.map(async (recipient) => {
//         try {
//           const variables = {
//             contact: recipient,
//           };

//           /*
//           =============================================
//           SAFE TEMPLATE HANDLING
//           =============================================
//           */

//           const templateBody = template?.body || "";
//           const templateSubject = template?.subject || "";

//           const finalBody = renderTemplate(body || templateBody, variables);
//           const finalSubject = subject || templateSubject;

//           /*
//           =============================================
//           SEND EMAIL
//           =============================================
//           */

//           await sendEmailGateway({
//             userId,
//             from: user.email,
//             to: recipient.email,
//             subject: finalSubject,
//             html: finalBody,
//             provider: user.emailProvider || "SMTP",
//           });

//           /*
//           =============================================
//           LOG EMAIL
//           =============================================
//           */

//           await prisma.emailLog.create({
//             data: {
//               fromEmail: user.email,
//               toEmail: recipient.email,
//               subject: finalSubject,
//               body: finalBody,
//               templateId: template?.id || null,
//               campaignId,
//               sentById: userId,
//               status: "SENT",
//               direction: "OUTBOUND",
//               folder: "SENT",
//               sentAt: new Date(),
//             },
//           });

//           results.sent++;
//         } catch (err) {
//           console.error("Campaign email failed:", err.message);
//           results.failed++;
//         }

//         /*
//         =============================================
//         UPDATE CAMPAIGN PROGRESS IN DATABASE
//         =============================================
//         */

//         await prisma.emailCampaign.update({
//           where: { id: campaignId },
//           data: {
//             sentCount: results.sent,
//             failedCount: results.failed,
//           },
//         });
//       }),
//     );
//   }

//   /*
//   =====================================================
//   FINAL CAMPAIGN UPDATE
//   =====================================================
//   */

//   await prisma.emailCampaign.update({
//     where: { id: campaignId },
//     data: {
//       sentCount: results.sent,
//       failedCount: results.failed,
//     },
//   });

//   return results;
// }

// =======================================================================================

// src/modules/email/emailCampaign.service.js
import prisma from "../../utils/prisma.js";
import { sendEmailGateway } from "./emailGateway.js";
import { renderTemplate } from "./templateRenderer.js";
import { parseTemplate } from "./templateParser.js";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function sendBulkEmailCampaign({
  template,
  recipients,
  userId,
  campaignId,
  subject,
  body,
}) {
  const results = {
    sent: 0,
    failed: 0,
  };

  /*
  =====================================================
  LOAD SENDER USER
  =====================================================
  */

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("Sender user not found");
  }

  /*
  =====================================================
  SAFE BATCH SETTINGS (OUTLOOK GRAPH LIMIT)
  =====================================================
  */

  const BATCH_SIZE = 3; // Microsoft allows ~4 concurrent requests safely
  const BATCH_DELAY = 1500; // wait 1.5s between batches

  /*
  =====================================================
  SEND EMAILS IN CONTROLLED BATCHES
  =====================================================
  */

  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    const batch = recipients.slice(i, i + BATCH_SIZE);

    await Promise.all(
      batch.map(async (recipient) => {
        try {
          // 🔥 FETCH FULL CONTACT WITH ACCOUNT
          const fullContact = await prisma.contact.findUnique({
            where: { id: recipient.id },
            include: {
              account: {
                select: {
                  accountName: true,
                  industry: true,
                },
              },
            },
          });

          // 🔥 VARIABLES (THIS FIXES EVERYTHING)
          const variables = {
            contact: fullContact || recipient,
            account: fullContact?.account || {},
          };

          // 🔥 TEMPLATE RENDER
          const templateBody = template?.body || "";
          const templateSubject = template?.subject || "";

          const finalBody = renderTemplate(body || templateBody, variables);
          const finalSubject = parseTemplate(
            subject || templateSubject,
            variables,
          );

          /*
          =================================================
          RETRY LOGIC FOR MICROSOFT THROTTLING
          =================================================
          */

          let attempts = 0;
          const MAX_RETRY = 3;

          while (attempts < MAX_RETRY) {
            try {
              await sendEmailGateway({
                userId,
                from: user.email,
                to: recipient.email,
                subject: finalSubject,
                html: finalBody,
                provider: user.emailProvider || "SMTP",
              });

              break; // success
            } catch (err) {
              if (
                err.message?.includes("ApplicationThrottled") &&
                attempts < MAX_RETRY
              ) {
                attempts++;
                console.warn(
                  `⚠️ Outlook throttled. Retrying ${recipient.email}...`,
                );
                await sleep(2000);
              } else {
                throw err;
              }
            }
          }

          /*
          =================================================
          LOG EMAIL
          =================================================
          */

          await prisma.emailLog.create({
            data: {
              fromEmail: user.email,
              toEmail: recipient.email,
              subject: finalSubject,
              body: finalBody,
              templateId: template?.id || null,
              campaignId,
              sentById: userId,
              status: "SENT",
              direction: "OUTBOUND",
              folder: "SENT",
              sentAt: new Date(),
            },
          });

          results.sent++;
        } catch (err) {
          console.error("Campaign email failed:", err.message);
          results.failed++;
        }

        /*
        =================================================
        UPDATE CAMPAIGN PROGRESS
        =================================================
        */

        await prisma.emailCampaign.update({
          where: { id: campaignId },
          data: {
            sentCount: results.sent,
            failedCount: results.failed,
          },
        });
      }),
    );

    /*
    =====================================================
    DELAY BETWEEN BATCHES (PREVENT THROTTLING)
    =====================================================
    */

    await sleep(BATCH_DELAY);
  }

  /*
  =====================================================
  FINAL CAMPAIGN UPDATE
  =====================================================
  */

  await prisma.emailCampaign.update({
    where: { id: campaignId },
    data: {
      sentCount: results.sent,
      failedCount: results.failed,
    },
  });

  return results;
}
