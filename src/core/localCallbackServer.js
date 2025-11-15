import http from "http";

export function waitForToken() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url, "http://localhost:9900");
      const token = url.searchParams.get("token");

      if (!token) {
        res.end("❌ Authentication failed");
        server.close();
        return reject("No token");
      }

      res.setHeader("Content-Type", "text/html");
res.setHeader("Content-Type", "text/html");
res.end(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>CommitAI – Login Successful</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <style>
    body {
      margin: 0;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: "Inter", system-ui, sans-serif;
      color: #f5f5f5;
      background: linear-gradient(#3d260b, #000000);
      overflow: hidden;
      position: relative;
    }

    /* Soft ambient vignette glow */
    .glow {
      position: absolute;
      width: 600px;
      height: 600px;
      background: radial-gradient(
        circle,
        rgba(255, 198, 135, 0.15),
        rgba(0, 0, 0, 0)
      );
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      filter: blur(80px);
      z-index: 0;
    }

    .card {
      position: relative;
      z-index: 10;
      background: rgba(255, 255, 255, 0.06);
      padding: 42px 40px;
      border-radius: 18px;
      width: 380px;
      text-align: center;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.10);
      box-shadow: 0 12px 55px rgba(0, 0, 0, 0.5);
      animation: fadeIn 0.6s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    h2 {
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 10px;
      background: linear-gradient(to bottom, #ffffff, #d4c2a4);
      -webkit-background-clip: text;
      color: transparent;
    }

    .subtext {
      font-size: 15px;
      opacity: 0.75;
      line-height: 1.6;
      margin-top: 6px;
    }
  </style>
</head>

<body>

  <div class="glow"></div>

  <div class="card">
    <h2>Login Successful</h2>
    <p class="subtext">
      You’re now authenticated.<br />
      You can close this page anytime.
    </p>
  </div>

</body>
</html>


`);


      server.close();
      resolve(token);
    });

    server.listen(9900, () => {
      console.log("⏳ Waiting for GitHub login...");
    });
  });
}
