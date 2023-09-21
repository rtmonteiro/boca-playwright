import { readableStreamToText } from "bun";

const {stdout} = Bun.spawn(["bunx", "playwright", "test"]);
const text = await readableStreamToText(stdout);
console.log(text); // "hello\n"

