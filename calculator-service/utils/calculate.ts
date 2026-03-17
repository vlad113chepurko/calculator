import { ensureRedis, redis } from "../../lib/redis/client";
import { Operation } from "./operations";

type CalcInput = { op: Operation; a: number; b: number };

function compute({ op, a, b }: CalcInput) {
  switch (op) {
    case Operation.ADD:
      return a + b;
    case Operation.SUB:
      return a - b;
    case Operation.MUL:
      return a * b;
    case Operation.DIV:
      return a / b;
  }
}

export async function calcWithCache(input: CalcInput) {
  await ensureRedis();

  const key = `calc:${input.op}:${input.a}:${input.b}`;

  const cached = await redis.get(key);
  if (cached !== null) {
    return { value: Number(cached), fromCache: true };
  }

  const value = compute(input);
  await redis.set(key, String(value), { EX: 60 }); 

  return { value, fromCache: false };
}
