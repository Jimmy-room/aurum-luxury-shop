import http from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, resolve } from "node:path";

const root = resolve(process.cwd());
const port = 8017;
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};

http
  .createServer((req, res) => {
    const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
    const requested = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
    const filePath = resolve(root, `.${requested}`);

    if (!filePath.startsWith(root) || !existsSync(filePath) || !statSync(filePath).isFile()) {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    res.writeHead(200, { "content-type": types[extname(filePath)] ?? "application/octet-stream" });
    createReadStream(filePath).pipe(res);
  })
  .listen(port, "127.0.0.1", () => {
    console.log(`AURUM shop available at http://127.0.0.1:${port}`);
  });

