import querystring from "node:querystring";
import { createPage, escapeHtml, sendHtml } from "./html.js";

const pages = {
    "/": {
        title: "Home",
        description: "Welcome to the Home Page",
    },
    "/about": {
        title: "About",
        description: "Learn more about us",
    },
    "/contact": {
        title: "Contact",
        description: "Get in touch",
    },
};

export function handleRequest(req, res, pathname, body = "") {
    if (req.method === "GET" && pages[pathname]) {
        const { title, description } = pages[pathname];

        const form =
            pathname === "/contact"
                ? `
          <form action="/submit" method="POST">
            <p>
              <label>Name:
                <input name="name" required>
              </label>
            </p>
            <p>
              <label>Email:
                <input name="email" type="email" required>
              </label>
            </p>
            <button type="submit">Submit</button>
          </form>`
                : "";

        return sendHtml(
            res,
            200,
            createPage(title, `<p>${description}</p>${form}`),
        );
    }

    if (req.method === "POST" && pathname === "/submit") {
        const contentType = req.headers["content-type"] || "";

        if (
            !/^application\/x-www-form-urlencoded(?:\s*;|$)/i.test(contentType)
        ) {
            return sendHtml(
                res,
                400,
                createPage("Bad Request", "<p>Invalid form data</p>"),
            );
        }

        const data = querystring.parse(body);

        const name = typeof data.name === "string" ? data.name.trim() : "";

        const email = typeof data.email === "string" ? data.email.trim() : "";

        if (!name || !email) {
            return sendHtml(
                res,
                400,
                createPage("Bad Request", "<p>Invalid form data</p>"),
            );
        }

        return sendHtml(
            res,
            200,
            createPage(
                "Form Submitted",
                `<p>Name: ${escapeHtml(name)}</p>
         <p>Email: ${escapeHtml(email)}</p>`,
            ),
        );
    }

    return sendHtml(
        res,
        404,
        createPage("Page Not Found", "<p>Page Not Found</p>"),
    );
}
