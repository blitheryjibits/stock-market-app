import type { BetterAuthPlugin } from "better-auth";

export const displayNamePlugin = (): BetterAuthPlugin => {
  return {
    id: "display-name-plugin",
    schema: {
      user: {
        fields: {
          displayName: {
            type: "string",
            required: false,
          },
        },
      },
    },
  };
};
