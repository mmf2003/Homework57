import test from "node:test";
import assert from "node:assert/strict";

const BASE_URL = "http://localhost:3000";

// Проверяем, что сервер доступен
async function request(path, options = {}) {
    const response = await fetch(`${BASE_URL}${path}`, options);
    const html = await response.text();

    return { response, html };
}

// Создаём POST-запрос с данными формы
function postForm(data) {
    return {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(data).toString(),
    };
}

// ========================================
// #1. GET ROUTES
// ========================================

test("GET / returns Home page", async () => {
    const { response, html } = await request("/");

    assert.equal(response.status, 200);
    assert.match(html, /<h1>Home<\/h1>/);
    assert.match(html, /Welcome to the Home Page/);
});

test("GET /about returns About page", async () => {
    const { response, html } = await request("/about");

    assert.equal(response.status, 200);
    assert.match(html, /<h1>About<\/h1>/);
    assert.match(html, /Learn more about us/);
});

test("GET /contact returns Contact page", async () => {
    const { response, html } = await request("/contact");

    assert.equal(response.status, 200);
    assert.match(html, /<h1>Contact<\/h1>/);
    assert.match(html, /Get in touch/);
    assert.match(html, /<form/);
});

test("GET unknown route returns 404", async () => {
    const { response, html } = await request("/unknown");

    assert.equal(response.status, 404);
    assert.match(html, /Page Not Found/);
});

// ========================================
// #2. POST REQUESTS
// ========================================

test("POST /submit accepts valid form data", async () => {
    const { response, html } = await request(
        "/submit",
        postForm({
            name: "Alexander",
            email: "alex@example.com",
        }),
    );

    assert.equal(response.status, 200);
    assert.match(html, /Form Submitted/);
    assert.match(html, /Name: Alexander/);
    assert.match(html, /Email: alex@example.com/);
});

test("POST /submit rejects empty name", async () => {
    const { response, html } = await request(
        "/submit",
        postForm({
            name: "",
            email: "alex@example.com",
        }),
    );

    assert.equal(response.status, 400);
    assert.match(html, /Invalid form data/);
});

test("POST /submit rejects empty email", async () => {
    const { response, html } = await request(
        "/submit",
        postForm({
            name: "Alexander",
            email: "",
        }),
    );

    assert.equal(response.status, 400);
    assert.match(html, /Invalid form data/);
});

test("POST /submit rejects whitespace-only fields", async () => {
    const { response, html } = await request(
        "/submit",
        postForm({
            name: "   ",
            email: "   ",
        }),
    );

    assert.equal(response.status, 400);
    assert.match(html, /Invalid form data/);
});

test("POST /submit rejects wrong Content-Type", async () => {
    const { response, html } = await request("/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: "Alexander",
            email: "alex@example.com",
        }),
    });

    assert.equal(response.status, 400);
    assert.match(html, /Invalid form data/);
});

// ========================================
// #3. SECURITY
// ========================================

test("POST /submit escapes XSS content", async () => {
    const { response, html } = await request(
        "/submit",
        postForm({
            name: "<script>alert(1)</script>",
            email: "alex@example.com",
        }),
    );

    assert.equal(response.status, 200);

    assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);

    assert.doesNotMatch(html, /<script>alert\(1\)<\/script>/);
});

test("POST /submit rejects payload over 1 MB", async () => {
    const largeName = "A".repeat(1024 * 1024);

    const { response, html } = await request(
        "/submit",
        postForm({
            name: largeName,
            email: "alex@example.com",
        }),
    );

    assert.equal(response.status, 413);
    assert.match(html, /Payload Too Large/);
});

// ========================================
// #4. HTTP HEADERS
// ========================================

test("Response has correct Content-Type", async () => {
    const { response } = await request("/");

    assert.equal(
        response.headers.get("content-type"),
        "text/html; charset=utf-8",
    );
});

test("Response has X-Content-Type-Options", async () => {
    const { response } = await request("/");

    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
});

test("Response has correct Content-Length", async () => {
    const { response, html } = await request("/");

    const expectedLength = Buffer.byteLength(html, "utf8");

    assert.equal(
        Number(response.headers.get("content-length")),
        expectedLength,
    );
});

// ========================================
// #5. HTML STRUCTURE
// ========================================

test("GET / returns valid basic HTML structure", async () => {
    const { response, html } = await request("/");

    assert.equal(response.status, 200);
    assert.match(html, /<!DOCTYPE html>/i);
    assert.match(html, /<html lang="en">/);
    assert.match(html, /<meta charset="UTF-8">/);
    assert.match(html, /<title>Home<\/title>/);
    assert.match(html, /<body>/);
    assert.match(html, /<\/html>/);
});

// ========================================
// #6. SERVER AFTER ERRORS
// ========================================

test("Server continues working after invalid requests", async () => {
    await request(
        "/submit",
        postForm({
            name: "",
            email: "",
        }),
    );

    const { response, html } = await request("/");

    assert.equal(response.status, 200);
    assert.match(html, /Welcome to the Home Page/);
});

// ========================================
// #7. INTERNAL SERVER ERROR
// ========================================
