import { createClient } from "redis";
import crypto from "node:crypto";

const {
  CACHE_URL = "redis://localhost:6379",
  CACHE_KEY = "white-elephant-participants",
  CACHE_DELIMITER = ":::"
} = process.env;

const getClient = initRedis(CACHE_URL);

export async function registerParticipant(name: string) {
  const client = await getClient();
  const uuid = crypto.randomUUID();
  await client.sAdd(CACHE_KEY, `${uuid}${CACHE_DELIMITER}${name}`);

  return { uuid, name };
}

export async function fetchParticipants() {
  const client = await getClient();
  const participants = await client.sMembers(CACHE_KEY);

  const mappedParticipants = participants.map((item) => {
    const [uuid, name] = item.split(CACHE_DELIMITER);
    return {
      name,
      uuid,
    };
  });

  return mappedParticipants;
}

function initRedis(url: string) {
  const client = createClient({ url });

  client.on("error", function (err) {
    console.error(err);
  });
  client.on("reconnecting", function () {
    console.log("Attempting to restore connection to Redid server...");
  });
  client.on("ready", () => {
    console.log("Connected to Redis server!");
  });
  return async function getClient () {
    if (!client.isOpen) {
      await client.connect();
    }
    return client;
  };
}