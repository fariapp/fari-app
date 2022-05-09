import { createClient } from "@liveblocks/client";

export function makeLiveBlocksClient() {
  return createClient({
    publicApiKey: false
      ? "pk_test_ETujS9FV5jeieP0ussc8xBkQ"
      : "pk_live_LQJHauN3xAZFOMO6XY7fscYK",
  });
}
