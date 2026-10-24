# Node.js HTTP Server — Homework57

A basic HTTP server built using native Node.js modules without Express or other third-party dependencies.

The application demonstrates HTTP routing, HTML page generation, form submission, input validation, security measures, and automated testing.

## Features

- HTTP server running on port 3000
- GET and POST request handling
- Custom routing without Express
- Dynamic HTML response generation
- Contact form submission
- Form validation
- HTML escaping to prevent reflected XSS
- Maximum POST request size of 1 MB
- HTTP error handling
- Automated tests using the built-in Node.js test runner

## Technologies

- Node.js
- JavaScript (ES Modules)
- `node:http`
- `node:url`
- `node:querystring`
- `node:test`
- `node:assert/strict`

No external dependencies are required.

## Project Structure

```text
Homework57/
├── server.js       # HTTP server and request body handling
├── routes.js       # GET and POST routing
├── html.js         # HTML generation and response headers
├── test.js         # Automated HTTP tests
├── package.json    # Project configuration and scripts
└── README.md       # Project documentation
```

## Installation and Running

### 1. Clone the repository

```bash
git clone https://github.com/mmf2003/Homework57.git
```

### 2. Open the project directory

```bash
cd Homework57
```

### 3. Start the server

```bash
npm start
```

Alternatively:

```bash
node server.js
```

The server starts at:

http://localhost:3000

The port can be configured using the `PORT` environment variable. The default port is `3000`.

No `npm install` is required because the project uses only built-in Node.js modules.

## HTTP Routes

| Method | Route      | Description                 | Status |
| ------ | ---------- | --------------------------- | ------ |
| GET    | `/`        | Home page                   | 200    |
| GET    | `/about`   | About page                  | 200    |
| GET    | `/contact` | Contact page with HTML form | 200    |
| POST   | `/submit`  | Submit name and email       | 200    |
| POST   | `/submit`  | Invalid form data           | 400    |
| POST   | `/submit`  | Request body exceeds 1 MB   | 413    |
| GET    | `/unknown` | Page not found              | 404    |

Unexpected internal server errors are handled with status `500`.

## GET Request Examples

### Home

```http
GET /
```

Response:

```html
<h1>Home</h1>
<p>Welcome to the Home Page</p>
```

### About

```http
GET /about
```

Response:

```html
<h1>About</h1>
<p>Learn more about us</p>
```

### Contact

```http
GET /contact
```

Response includes:

```html
<h1>Contact</h1>
<p>Get in touch</p>
```

The Contact page also contains a form with `name` and `email` fields.

## POST Request Example

Endpoint:

```http
POST /submit
Content-Type: application/x-www-form-urlencoded
```

Request body:

```text
name=Alexander&email=alex@example.com
```

Successful response:

```html
<h1>Form Submitted</h1>
<p>Name: Alexander</p>
<p>Email: alex@example.com</p>
```

HTTP status: `200 OK`.

### Invalid Form Data

If the name or email field is empty, the server returns:

```text
400 Bad Request
Invalid form data
```

### Payload Too Large

If the POST request body exceeds 1 MB, the server returns:

```text
413 Payload Too Large
```

### Page Not Found

Requests to unknown routes return:

```text
404 Not Found
Page Not Found
```

### Internal Server Error

Unexpected internal errors return:

```text
500 Internal Server Error
Server Error
```

## HTTP Response Headers

HTML responses include:

```http
Content-Type: text/html; charset=utf-8
Content-Length: <body size in bytes>
X-Content-Type-Options: nosniff
```

`Content-Length` is calculated using the UTF-8 byte length of the response body.

## Security

The application implements basic security measures:

- Validates that name and email are not empty.
- Rejects unsupported POST content types.
- Escapes HTML special characters in user-provided values.
- Limits POST request bodies to 1 MB.
- Uses `X-Content-Type-Options: nosniff`.
- Handles invalid routes and malformed form data.

For example, the input:

```html
<script>
    alert(1);
</script>
```

is displayed as escaped text:

```html
&lt;script&gt;alert(1)&lt;/script&gt;
```

## Automated Testing

The project includes automated tests using the native Node.js test runner.

Start the server in the first terminal:

```bash
npm start
```

Open another terminal and run:

```bash
npm test
```

The tests cover:

- GET routes
- POST form submission
- Empty and invalid form fields
- Unsupported content types
- XSS escaping
- 1 MB payload limit
- HTTP response headers
- HTML structure
- Server behavior after invalid requests

### Test Results

The latest local test run completed successfully:

```text
tests 16
pass 16
fail 0
cancelled 0
skipped 0
```

All 16 automated tests passed.

## Limitations

- No database or persistent storage.
- No authentication or authorization.
- Email validation checks only for non-empty input.
- Only predefined routes are supported.
- Maximum POST request body size is 1 MB.
- The server is intended for educational purposes.
- The `500 Internal Server Error` handler is implemented but is not covered by the current automated test suite.

## Repository

https://github.com/mmf2003/Homework57.git
