import z from "@/lib/zod";

import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { generateErrorMessage } from "zod-error";
import { ZodOpenApiResponseObject } from "zod-openapi";

export const ErrorCode = z.enum([
  "bad_request",
  "not_found",
  "internal_server_error",
  "unauthorized",
  "forbidden",
  "rate_limit_exceeded",
  "invite_expired",
  "invite_pending",
  "exceeded_limit",
  "conflict",
  "unprocessable_entity",
]);

const errorCodeToHttpStatus: Record<z.infer<typeof ErrorCode>, number> = {
  bad_request: 400,
  unauthorized: 401,
  forbidden: 403,
  exceeded_limit: 403,
  not_found: 404,
  conflict: 409,
  invite_pending: 409,
  invite_expired: 410,
  unprocessable_entity: 422,
  rate_limit_exceeded: 429,
  internal_server_error: 500,
};

const speakeasyErrorOverrides: Record<z.infer<typeof ErrorCode>, string> = {
  bad_request: "BadRequest",
  unauthorized: "Unauthorized",
  forbidden: "Forbidden",
  exceeded_limit: "ExceededLimit",
  not_found: "NotFound",
  conflict: "Conflict",
  invite_pending: "InvitePending",
  invite_expired: "InviteExpired",
  unprocessable_entity: "UnprocessableEntity",
  rate_limit_exceeded: "RateLimitExceeded",
  internal_server_error: "InternalServerError",
};

const ErrorSchema = z.object({
  error: z.object({
    code: ErrorCode.openapi({
      description: "A short code indicating the error code returned.",
      example: "not_found",
    }),
    message: z.string().openapi({
      description: "A human readable error message.",
      example: "The requested resource was not found.",
    }),
    doc_url: z.string().optional().openapi({
      description: "A URL to more information about the error code reported.",
      example: "https://docs.orgnise.in/api-reference",
    }),
  }),
});

export type ErrorResponse = z.infer<typeof ErrorSchema>;
export type ErrorCodes = z.infer<typeof ErrorCode>;

export class OrgniseApiError extends Error {
  public readonly code: z.infer<typeof ErrorCode>;
  public readonly docUrl?: string;

  constructor({
    code,
    message,
    docUrl,
  }: {
    code: z.infer<typeof ErrorCode>;
    message: string;
    docUrl?: string;
  }) {
    super(message);
    this.code = code;
    this.docUrl = docUrl ?? `${docErrorUrl}#${code}`;
  }
}

const docErrorUrl = "https://docs.orgnise.in/api-reference/errors";

export function fromZodError(error: ZodError): ErrorResponse {
  return {
    error: {
      code: "unprocessable_entity",
      message: generateErrorMessage(error.issues, {
        maxErrors: 1,
        delimiter: {
          component: ": ",
        },
        path: {
          enabled: true,
          type: "objectNotation",
          label: "",
        },
        code: {
          enabled: true,
          label: "",
        },
        message: {
          enabled: true,
          label: "",
        },
      }),
      doc_url: `${docErrorUrl}#unprocessable_entity`,
    },
  };
}

export function handleApiError(error: any): ErrorResponse & { status: number } {
  // Zod errors
  if (error instanceof ZodError) {
    return {
      ...fromZodError(error),
      status: errorCodeToHttpStatus.unprocessable_entity,
    };
  }

  // OrgniseApiError errors
  if (error instanceof OrgniseApiError) {
    return {
      error: {
        code: error.code,
        message: error.message,
        doc_url: error.docUrl,
      },
      status: errorCodeToHttpStatus[error.code],
    };
  }

  // Fallback
  return {
    error: {
      code: "internal_server_error",
      message: error instanceof Error ? error.message : "Internal Server Error",
      doc_url: `${docErrorUrl}#internal_server_error`,
    },
    status: 500,
  };
}

export function handleAndReturnErrorResponse(
  err: unknown,
  headers?: Record<string, string>,
) {
  try {
    const { error, status } = handleApiError(err);
    return NextResponse.json<ErrorResponse>({ error }, { headers, status });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          code: "internal_server_error",
          message: "Internal Server Error",
        },
      },
      { headers, status: 500 },
    );
  }
}

export const errorSchemaFactory = (
  code: z.infer<typeof ErrorCode>,
  description: string,
): ZodOpenApiResponseObject => {
  return {
    description,
    content: {
      "application/json": {
        schema: {
          "x-speakeasy-name-override": speakeasyErrorOverrides[code],
          type: "object",
          properties: {
            error: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                  enum: [code],
                  description:
                    "A short code indicating the error code returned.",
                  example: code,
                },
                message: {
                  type: "string",
                  description:
                    "A human readable explanation of what went wrong.",
                  example: "The requested resource was not found.",
                },
                doc_url: {
                  type: "string",
                  description:
                    "A link to our documentation with more details about this error code",
                  example: `${docErrorUrl}#${code}`,
                },
              },
              required: ["code", "message"],
            },
          },
          required: ["error"],
        },
      },
    },
  };
};
