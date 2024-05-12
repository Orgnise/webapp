import mongodb, { databaseName } from "@/lib/mongodb";
import { OrgniseApiError, handleAndReturnErrorResponse } from "../api/errors";
import { getSearchParams } from "../url";
import { Session, getSession, hashToken } from "./";


interface WithSessionHandler {
  ({
    req,
    params,
    searchParams,
    session,
  }: {
    req: Request;
    params: Record<string, string>;
    searchParams: Record<string, string>;
    session: Session;
  }): Promise<Response>;
}


export const withSession =
  (handler: WithSessionHandler) =>
    async (req: Request, { params }: { params: Record<string, string> }) => {
      try {
        let session: Session | undefined;

        session = await generateSession(req);

        const searchParams = getSearchParams(req.url);
        return await handler({ req, params, searchParams, session });
      } catch (error: any) {
        return handleAndReturnErrorResponse(error);
      }
    };

export async function generateSession(req: Request): Promise<Session> {
  const authorizationHeader = req.headers.get("Authorization");
  let session: Session | undefined;
  if (authorizationHeader) {
    if (!authorizationHeader.includes("Bearer ")) {
      throw new OrgniseApiError({
        code: "bad_request",
        message:
          "Misconfigured authorization header. Did you forget to add 'Bearer '? Learn more: https://https://docs.orgnise.in/api-reference/introduction#authentication",
      });
    }

    const apiKey = authorizationHeader.replace("Bearer ", "");
    const hashedKey = hashToken(apiKey, {
      noSecret: true,
    });
    const client = await mongodb;
    const userCollection = client.db(databaseName).collection("users");

    const users = await userCollection.aggregate([
      {
        $lookup: {
          from: "token",
          localField: "_id",
          foreignField: "user",
          as: "tokens",
        },
      },
      {
        $match:
        {
          tokens: {
            $elemMatch: {
              hashedKey:
                hashedKey
            },
          },
        },
      },
      {
        $unwind: "$tokens",
      },
      {
        $project:
        {
          name: 1,
          email: 1,
          image: 1,
        },
      },
    ]).toArray() as any[];
    const user = users?.[0];
    if (!user) {
      throw new OrgniseApiError({
        code: "unauthorized",
        message: `Unauthorized: Invalid API key: ${apiKey}`,
        docUrl: 'https://docs.orgnise.in/api-reference/introduction#authentication'
      });
    }

    session = {
      user: {
        id: user._id,
        name: user.name || "",
        email: user.email || "",
      },
    };
  } else {
    session = await getSession();
  }
  if (!session?.user.id) {
    throw new OrgniseApiError({
      code: "unauthorized",
      message: "Unauthorized: Login required.",
    });
  }
  return session;
}