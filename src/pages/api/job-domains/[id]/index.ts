import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { jobDomainValidationSchema } from 'validationSchema/job-domains';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.job_domain
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getJobDomainById();
    case 'PUT':
      return updateJobDomainById();
    case 'DELETE':
      return deleteJobDomainById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getJobDomainById() {
    const data = await prisma.job_domain.findFirst(convertQueryToPrismaUtil(req.query, 'job_domain'));
    return res.status(200).json(data);
  }

  async function updateJobDomainById() {
    await jobDomainValidationSchema.validate(req.body);
    const data = await prisma.job_domain.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteJobDomainById() {
    const data = await prisma.job_domain.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
