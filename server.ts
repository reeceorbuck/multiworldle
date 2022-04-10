// @ts-ignore

import { Application, Router } from "https://deno.land/x/oak@v10.2.0/mod.ts";

const app = new Application();

// First we try to serve static files from the _site folder. If that fails, we
// fall through to the router below.
app.use(async (ctx, next) => {
  // console.log(" first req: ", ctx.request.url);
  try {
    await ctx.send({
      root: `${Deno.cwd()}/build`,
      index: "index.html",
    });
  } catch {
    // console.log(" fallthough req: ", ctx.request.url);
    next();
  }
});

const router = new Router();

router.get("/ws", async (ctx) => {
  console.log("socket request received");

  const socket = await ctx.upgrade();
  console.log(socket);

  socket.onopen = () => console.log("WebSocket server reports new connection");
  socket.onmessage = (e) => {
    console.log("messageObject received on server: ", JSON.parse(e.data));
    socket.send(
      JSON.stringify({
        guess: "ANTIGUA AND BARBUDA",
      })
    );
  };
  socket.onerror = (e) => console.log("socket errored:", e);
  socket.onclose = () => console.log("socket closed");
});

// After creating the router, we can add it to the app.
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
