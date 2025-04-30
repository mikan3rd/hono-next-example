import { getContext } from "hono/context-storage";

export type HonoEnv = {
  Variables: {
    requestId: string;
  };
};

export const getHonoContext = () => {
  return getContext<HonoEnv>();
};
