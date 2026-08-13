import fs from "fs";
import path from "path";

const clientDir = path.resolve("dist/client");
const assetsDir = path.join(clientDir, "assets");

if (fs.existsSync(assetsDir)) {
  const files = fs.readdirSync(assetsDir);
  const jsIndex = files.find((f) => f.startsWith("index-") && f.endsWith(".js"));
  const cssIndex = files.find((f) => f.startsWith("styles-") && f.endsWith(".css"));

  const html = `<!DOCTYPE html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SentinAI Enterprise Autonomous SOC</title>
    ${cssIndex ? `<link rel="stylesheet" href="/assets/${cssIndex}">` : ""}
  </head>
  <body class="bg-slate-950 text-slate-50 antialiased">
    <div id="root"></div>
    ${jsIndex ? `<script type="module" src="/assets/${jsIndex}"></script>` : ""}
  </body>
</html>`;

  fs.writeFileSync(path.join(clientDir, "index.html"), html);
  console.log(
    "✅ Successfully generated dist/client/index.html with bundles:",
    { jsIndex, cssIndex }
  );
} else {
  console.error("❌ Assets directory not found:", assetsDir);
}
