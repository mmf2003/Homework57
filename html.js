export function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
        };

        return entities[char];
    });
}

export function createPage(title, content) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  ${content}
</body>
</html>`;
}

export function sendHtml(res, statusCode, html) {
    const body = Buffer.from(html, "utf8");

    res.writeHead(statusCode, {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Length": body.length,
        "X-Content-Type-Options": "nosniff",
    });

    res.end(body);
}
