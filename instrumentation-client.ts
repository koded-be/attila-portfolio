import { initBotId } from "botid/client/core";

// The contact server action posts to the home page
initBotId({
  protect: [{ path: "/", method: "POST" }],
});
