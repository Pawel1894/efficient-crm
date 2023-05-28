import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { getAuth } from "@clerk/nextjs/server";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { TRPCError } from "@trpc/server";
import { GetServerSideProps, InferGetServerSidePropsType, NextApiRequest, NextApiResponse } from "next";
import React from "react";
import superjson from "superjson";

export default function Page({ error, initData }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <div>index</div>;
}

export const getServerSideProps = async ({
  params,
  req,
  res,
}: {
  params: { slug: string };
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  const session = getAuth(req);
  if (!session?.userId) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: createTRPCContext({
      req: req,
      res: res,
    }),
    transformer: superjson,
  });

  try {
    const deal = await helpers.deal.get.fetch(params.slug);

    return {
      props: {
        initData: JSON.stringify(deal),
        error: null,
      },
    };
  } catch (error) {
    let message = "Unknown Error!, please contact admin";
    if (error instanceof TRPCError) {
      message = error.message;
    }

    return {
      props: {
        initData: null,
        error: message,
      },
    };
  }
};
