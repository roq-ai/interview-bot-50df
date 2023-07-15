import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { jobDomainValidationSchema } from 'validationSchema/job-domains';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getJobDomains();
    case 'POST':
      return createJobDomain();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getJobDomains() {
    const data = await prisma.job_domain
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'job_domain'));
    return res.status(200).json(data);
  }

  async function createJobDomain() {
    await jobDomainValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.question?.length > 0) {
      const create_question = body.question;
      body.question = {
        create: create_question,
      };
    } else {
      delete body.question;
    }
    const data = await prisma.job_domain.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
