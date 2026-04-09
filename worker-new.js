// ======================== CONFIGURATION ========================
const TELEGRAM_BOT = "8757155296:AAHbLEz15Gp4ccaV0OUpB8oPHwZdJsv-O0s";
const TELEGRAM_CHAT = "-1003310956167";
const CRON_SECRET = "apollo-cron-2026-secure";

// ======================== MAIN HANDLER ========================
export default {
  async fetch(request, env) {
    try {
      return await handleRequest(request, env);
    } catch (err) {
      return new Response(
        "Worker Error: " + err.toString(),
        { headers: { "content-type": "text/html;charset=UTF-8" } }
      );
    }
  }
};

async function handleRequest(request, env) {
  const url = new URL(request.url);
  const PIN = "1234";
  const MASTER_KEY = "698846";

  // License systems
  const LICENSE_EXPIRE = "2026-12-31";
  const USE_KV_LICENSE = true;

  const cookie = request.headers.get("Cookie") || "";
  const loggedIn = cookie.includes("auth=1");

  // ================= CRON =================
  if (url.pathname === "/cron-check") {
    const token = url.searchParams.get("token");
    if (token !== CRON_SECRET) {
      return new Response("Unauthorized", { status: 403 });
    }
    await checkVehicleAlerts(env);
    await handleRequest(
      new Request(request.url.replace("/cron-check", "/api/backup")),
      env
    );
    return new Response("Cron executed successfully");
  }

  // ================= LICENSE CHECK =================
  const masterAccess = url.searchParams.get("master") === MASTER_KEY;
  if (!masterAccess) {
    const today = new Date().toISOString().split("T")[0];
    if (today > LICENSE_EXPIRE) {
      // Return expired status for API, or expired page for HTML
      if (url.pathname.startsWith("/api/")) {
        return Response.json({ error: "license_expired" }, { status: 403 });
      }
      return html(EXPIRED_HTML);
    }
    if (USE_KV_LICENSE) {
      const kvLicense = await env.DATA_STORE.get("APP_LICENSE");
      if (kvLicense && today > kvLicense) {
        if (url.pathname.startsWith("/api/")) {
          return Response.json({ error: "license_expired" }, { status: 403 });
        }
        return html(EXPIRED_HTML);
      }
    }
  }

  // ================= API: LICENSE INFO =================
  if (url.pathname === "/api/license-info") {
    const kv = await env.DATA_STORE.get("APP_LICENSE");
    let expiry = kv || LICENSE_EXPIRE;
    const today = new Date();
    const exp = new Date(expiry);
    const days = Math.floor((exp - today) / (1000 * 60 * 60 * 24));
    return Response.json({
      expiry,
      days,
      status: days < 0 ? "EXPIRED" : "ACTIVE"
    });
  }

  // ================= API: SET LICENSE =================
  if (url.pathname === "/api/set-license" && request.method === "POST") {
    const data = await request.json();
    await env.DATA_STORE.put("APP_LICENSE", data.date);
    return Response.json({ success: true });
  }

  // ================= API: EXPIRY SUMMARY =================
  if (url.pathname === "/api/expiry-summary") {
    const vehicles = await safeList(env, "vehicle:");
    const docs = await safeList(env, "doc:");
    const today = new Date();
    const expired = [];
    const warning = [];

    vehicles.forEach(d => {
      if (!d.expiry) return;
      const exp = new Date(d.expiry);
      const diff = Math.floor((exp - today) / (1000 * 60 * 60 * 24));
      if (diff < 0) expired.push({ car: d.carNumber, doc: d.docType, days: diff, type: "vehicle" });
      else if (diff <= 30) warning.push({ car: d.carNumber, doc: d.docType, days: diff, type: "vehicle" });
    });

    docs.forEach(d => {
      if (!d.expiry) return;
      const exp = new Date(d.expiry);
      const diff = Math.floor((exp - today) / (1000 * 60 * 60 * 24));
      if (diff < 0) expired.push({ car: "DOC", doc: d.name, days: diff, type: "document" });
      else if (diff <= 30) warning.push({ car: "DOC", doc: d.name, days: diff, type: "document" });
    });

    return Response.json({ expired, warning });
  }

  // ================= AUTH =================
  if (url.pathname === "/api/login" && request.method === "POST") {
    const data = await request.json();
    if (data.pin === PIN) {
      return new Response(JSON.stringify({ success: true }), {
        headers: {
          "content-type": "application/json",
          "Set-Cookie": "auth=1; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400"
        }
      });
    }
    return Response.json({ success: false, message: "ভুল পিন!" });
  }

  if (url.pathname === "/api/logout") {
    return new Response(JSON.stringify({ success: true }), {
      headers: {
        "content-type": "application/json",
        "Set-Cookie": "auth=; Path=/; HttpOnly; Max-Age=0"
      }
    });
  }

  if (url.pathname === "/api/check-auth") {
    return Response.json({ loggedIn });
  }

  // ================= AUTH GUARD FOR API =================
  if (url.pathname.startsWith("/api/") && !loggedIn) {
    // Allow login and license-info without auth
    if (url.pathname !== "/api/login" && url.pathname !== "/api/license-info") {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  // ================= DATA APIs =================
  if (url.pathname === "/api/banks") return Response.json(await safeList(env, "bank:"));
  if (url.pathname === "/api/vehicles") return Response.json(await safeList(env, "vehicle:"));
  if (url.pathname === "/api/documents") return Response.json(await safeList(env, "doc:"));

  if (url.pathname === "/api/save-bank" && request.method === "POST") {
    const data = await request.json();
    const key = data.key ? data.key : ("bank:" + Date.now());
    await env.DATA_STORE.put(key, JSON.stringify({
      title: data.title,
      name: data.name,
      account: data.account,
      routing: data.routing,
      branch: data.branch
    }));
    return Response.json({ success: true });
  }

  if (url.pathname === "/api/save-document" && request.method === "POST") {
    const ct = request.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      // Edit mode (no file change)
      const data = await request.json();
      const key = data.key;
      const old = await env.DATA_STORE.get(key);
      if (old) {
        const parsed = JSON.parse(old);
        await env.DATA_STORE.put(key, JSON.stringify({
          name: data.name || parsed.name,
          number: data.number || parsed.number,
          type: data.type || parsed.type,
          expiry: data.expiry || parsed.expiry,
          file: parsed.file
        }));
      }
      return Response.json({ success: true });
    }

    // New document with file
    const form = await request.formData();
    let fileUrl = "";
    const file = form.get("file");
    if (file && file.size > 0) {
      const key = "docs/" + Date.now() + "-" + file.name;
      await env.DOC_BUCKET.put(key, file.stream(), {
        httpMetadata: { contentType: file.type }
      });
      fileUrl = key;
    }
    const key = "doc:" + Date.now();
    await env.DATA_STORE.put(key, JSON.stringify({
      name: form.get("name"),
      number: form.get("number"),
      type: form.get("type"),
      expiry: form.get("expiry"),
      file: fileUrl
    }));
    return Response.json({ success: true });
  }

  if (url.pathname === "/api/save-vehicle" && request.method === "POST") {
    const data = await request.json();
    const key = data.key ? data.key : ("vehicle:" + Date.now());
    // Save version history
    const old = await env.DATA_STORE.get(key);
    if (old) {
      await env.DATA_STORE.put("history:" + key + ":" + Date.now(), old);
    }
    await env.DATA_STORE.put(key, JSON.stringify({
      name: data.name,
      carNumber: data.carNumber,
      docType: data.docType,
      expiry: data.expiry
    }));
    return Response.json({ success: true });
  }

  if (url.pathname === "/api/delete" && request.method === "POST") {
    const data = await request.json();
    await env.DATA_STORE.delete(data.key);
    return Response.json({ success: true });
  }

  // ================= BACKUP =================
  if (url.pathname === "/api/backup") {
    const list = await env.DATA_STORE.list();
    const values = await Promise.all(
      list.keys.map(k => env.DATA_STORE.get(k.name))
    );
    const data = [];
    for (let i = 0; i < list.keys.length; i++) {
      try {
        data.push({
          key: list.keys[i].name,
          value: JSON.parse(values[i])
        });
      } catch (e) {
        data.push({
          key: list.keys[i].name,
          value: values[i]
        });
      }
    }
    const backupKey = "backups/" + Date.now() + ".json";
    await env.DOC_BUCKET.put(backupKey, JSON.stringify(data), {
      httpMetadata: { contentType: "application/json" }
    });
    return Response.json({ success: true, key: backupKey });
  }

  if (url.pathname === "/api/backups") {
    const list = await env.DOC_BUCKET.list({ prefix: "backups/" });
    return Response.json(
      list.objects.map(o => ({ key: o.key, size: o.size }))
    );
  }

  if (url.pathname === "/api/delete-backup" && request.method === "POST") {
    const data = await request.json();
    await env.DOC_BUCKET.delete(data.key);
    return Response.json({ success: true });
  }

  if (url.pathname === "/api/delete-all" && request.method === "POST") {
    const data = await request.json();
    const list = await env.DATA_STORE.list({ prefix: data.prefix });
    await Promise.all(
      list.keys.map(k => env.DATA_STORE.delete(k.name))
    );
    return Response.json({ success: true });
  }

  if (url.pathname === "/api/restore" && request.method === "POST") {
    const data = await request.json();
    const file = await env.DOC_BUCKET.get(data.key);
    const json = await file.text();
    const items = JSON.parse(json);
    for (const item of items) {
      await env.DATA_STORE.put(item.key, JSON.stringify(item.value));
    }
    return Response.json({ success: true });
  }

  if (url.pathname === "/api/history") {
    const key = url.searchParams.get("key");
    const list = await env.DATA_STORE.list({ prefix: "history:" + key });
    return Response.json(list.keys);
  }

  // ================= FILE SERVING =================
  if (url.pathname === "/file") {
    const key = url.searchParams.get("key");
    const object = await env.DOC_BUCKET.get(key);
    if (!object) return new Response("Not found", { status: 404 });
    return new Response(object.body, {
      headers: {
        "content-type": object.httpMetadata.contentType
      }
    });
  }

  // ================= CHECK ALERTS (on homepage load) =================
  await checkVehicleAlerts(env);

  // ================= SERVE FRONTEND =================
  return html(APP_HTML);
}

// ================= HELPER FUNCTIONS =================
async function safeList(env, prefix) {
  if (!env.DATA_STORE) return [];
  const list = await env.DATA_STORE.list({ prefix });
  const values = await Promise.all(
    list.keys.map(k => env.DATA_STORE.get(k.name))
  );
  const result = [];
  for (let i = 0; i < list.keys.length; i++) {
    try {
      result.push({ key: list.keys[i].name, ...JSON.parse(values[i]) });
    } catch (e) {}
  }
  return result;
}

function html(content) {
  return new Response(content, {
    headers: { "content-type": "text/html;charset=UTF-8" }
  });
}

async function checkVehicleAlerts(env) {
  const vehicles = await safeList(env, "vehicle:");
  const docs = await safeList(env, "doc:");
  const today = new Date();
  const all = [
    ...vehicles.map(v => ({
      label: v.carNumber + " – " + v.docType,
      expiry: v.expiry
    })),
    ...docs.map(d => ({
      label: d.name + " – " + d.type,
      expiry: d.expiry
    }))
  ];

  for (const item of all) {
    if (!item.expiry) continue;
    const exp = new Date(item.expiry);
    const diff = Math.floor((exp - today) / (1000 * 60 * 60 * 24));
    if (diff <= 7 && diff >= 0) {
      await sendTelegram(
        `⚠ ${item.label}\n📅 মেয়াদ ${diff} দিনের মধ্যে শেষ হবে (${item.expiry})`
      );
    }
    if (diff < 0) {
      await sendTelegram(
        `🚨 ${item.label}\n📅 মেয়াদ শেষ হয়ে গেছে (${item.expiry})`
      );
    }
  }
}

async function sendTelegram(text) {
  try {
    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT,
          text
        })
      }
    );
  } catch (e) {}
}

// ================= EXPIRED PAGE =================
const EXPIRED_HTML = `<!DOCTYPE html>
<html lang="bn">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>মেয়াদ শেষ</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Inter',system-ui,sans-serif;background:linear-gradient(135deg,#1e293b,#0f172a);height:100vh;display:flex;align-items:center;justify-content:center;color:#1e293b}
.box{background:white;width:90%;max-width:380px;padding:40px 30px;border-radius:24px;text-align:center;box-shadow:0 25px 60px rgba(0,0,0,.3)}
.icon{font-size:64px;margin-bottom:16px}
h2{color:#dc2626;font-size:20px;margin-bottom:12px}
p{color:#64748b;font-size:14px;line-height:1.6}
</style>
</head>
<body>
<div class="box">
<div class="icon">⚠️</div>
<h2>দুঃখিত, সফটওয়্যার এর মেয়াদ শেষ হয়ে গেছে</h2>
<p>সফটওয়্যার পুনরায় ব্যাবহার করতে বাৎসরিক বিল পরিশোধ করে দ্রুত রিনিউ করুন</p>
</div>
</body>
</html>`;

// ================= MAIN APP HTML =================
// PASTE YOUR dist/index.html CONTENT HERE
const APP_HTML = `PASTE_DIST_INDEX_HTML_HERE`;
