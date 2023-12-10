import Koa from "koa";
import Router from "@koa/router";
import koaBody from "koa-bodyparser";
import koaKors from "@koa/cors";
import createError from "http-errors";
import { registerParticipant, fetchParticipants } from "./redis";

const { HTTP_PORT = "3001" } = process.env;

const app = new Koa();

const apiRouter = new Router({
  prefix: "/api"
});

app
  .use(koaKors())
  .use(koaBody())
  .use(apiRouter.routes())
  .use(apiRouter.allowedMethods());

apiRouter.post("/participants", async (ctx) => {
  const { body } = ctx.request;

  if (!body) {
    throw createError(422, "A body is required!");
  }

  const { name } = body as Record<string, unknown>;

  if (typeof name !== "string"){
    throw createError(422,  "A name field is required!");
  }

  const { uuid } = await registerParticipant(name);

  ctx.status = 201;

  ctx.body = { uuid };
});

apiRouter.get("/participants", async (ctx) => {
  const { randomize } = ctx.query;
  const participant = await fetchParticipants();

  ctx.body = randomize ? shuffle(participant) : participant;
})

app.listen(HTTP_PORT, () => {
  console.log(`HTTP server listening on port ${HTTP_PORT}!`);
});

function shuffle(array: unknown[]) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}