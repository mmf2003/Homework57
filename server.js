import http from "node:http";
import { URL } from "node:url";

import { handleRequest } from "./routes.js";
import { createPage, sendHtml } from "./html.js";

const PORT = Number(process.env.PORT || 3000);
const MAX_BODY_SIZE = 1024 * 1024;

const server = http.createServer(async (req, res) => {
    try {
        const pathname = new URL(req.url, "http://localhost").pathname;

        if (req.method !== "POST" || pathname !== "/submit") {
            return handleRequest(req, res, pathname);
        }

        const chunks = [];
        let bodySize = 0;
        let tooLarge = false;

        for await (const chunk of req) {
            bodySize += chunk.length;

            if (bodySize > MAX_BODY_SIZE) {
                tooLarge = true;
                break;
            }

            chunks.push(chunk);
        }

        const body = tooLarge ? "" : Buffer.concat(chunks).toString("utf8");

        if (tooLarge) {
            return sendHtml(
                res,
                413,
                createPage("Payload Too Large", "<p>Payload Too Large</p>"),
            );
        }

        handleRequest(req, res, pathname, body);
    } catch (error) {
        console.error("Server error:", error);

        if (!res.headersSent && !res.destroyed) {
            sendHtml(
                res,
                500,
                createPage("Server Error", "<p>Server Error</p>"),
            );
        }
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
