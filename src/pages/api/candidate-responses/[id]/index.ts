import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { candidateResponseValidationSchema } from 'validationSchema/candidate-responses';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.candidate_response
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getCandidateResponseById();
    case 'PUT':
      return updateCandidateResponseById();
    case 'DELETE':
      return deleteCandidateResponseById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getCandidateResponseById() {
    const data = await prisma.candidate_response.findFirst(convertQueryToPrismaUtil(req.query, 'candidate_response'));
    return res.status(200).json(data);
  }

  async function updateCandidateResponseById() {
    await candidateResponseValidationSchema.validate(req.body);
    const data = await prisma.candidate_response.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteCandidateResponseById() {
    const data = await prisma.candidate_response.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
