interface AssetBinding {
  fetch(request: Request): Promise<Response>;
}

interface EmailBinding {
  send(message: {
    to: string;
    from: string;
    subject: string;
    text: string;
    replyTo?: string;
  }): Promise<{ messageId: string }>;
}

interface Env {
  ASSETS: AssetBinding;
  EMAIL: EmailBinding;
  TURNSTILE_SECRET_KEY?: string;
  TURNSTILE_SITE_KEY?: string;
  CONTACT_FROM_EMAIL?: string;
  CONTACT_TO_EMAIL?: string;
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

async function fetchAsset(request: Request, env: Env, pathname: string) {
  const url = new URL(request.url);
  url.pathname = pathname;
  return env.ASSETS.fetch(new Request(url, request));
}

function responseJson(body: Record<string, string | boolean>, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function formValue(form: FormData, name: string) {
  const value = form.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function sameOrigin(request: Request, url: URL) {
  const origin = request.headers.get("Origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === url.host;
  } catch {
    return false;
  }
}

async function verifyTurnstile(token: string, request: Request, env: Env) {
  if (!env.TURNSTILE_SECRET_KEY) return false;

  const formData = new URLSearchParams({
    secret: env.TURNSTILE_SECRET_KEY,
    response: token,
  });
  const remoteIp = request.headers.get("CF-Connecting-IP");
  if (remoteIp) formData.set("remoteip", remoteIp);

  const result = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData,
  });

  if (!result.ok) return false;
  const payload = (await result.json()) as { success?: boolean; "error-codes"?: string[] };
  if (!payload.success) console.error("Turnstile verification failed.", payload["error-codes"] || []);
  return payload.success === true;
}

async function sendContactEmail(name: string, email: string, message: string, env: Env) {
  if (!env.CONTACT_FROM_EMAIL || !env.CONTACT_TO_EMAIL) return false;

  try {
    await env.EMAIL.send({
      from: env.CONTACT_FROM_EMAIL,
      to: env.CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `Portfolio contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });
    return true;
  } catch (error) {
    console.error("Contact email could not be delivered.", error);
    return false;
  }
}

async function handleContact(request: Request, url: URL, env: Env) {
  if (request.method !== "POST") return responseJson({ error: "Method not allowed." }, 405);
  if (!sameOrigin(request, url)) return responseJson({ error: "Invalid request origin." }, 403);

  const form = await request.formData();
  const name = formValue(form, "name");
  const email = formValue(form, "email");
  const message = formValue(form, "message");
  const website = formValue(form, "website");
  const turnstileToken = formValue(form, "turnstileToken");

  if (website) return responseJson({ ok: true });
  if (name.length < 2 || name.length > 80 || !email.includes("@") || email.length > 254 || message.length < 30 || message.length > 3000) {
    return responseJson({ error: "Please complete the form with a valid name, email, and message." }, 400);
  }
  if (!env.TURNSTILE_SECRET_KEY || !env.CONTACT_FROM_EMAIL || !env.CONTACT_TO_EMAIL) {
    return responseJson({ error: "Contact delivery is being configured. Please try again shortly." }, 503);
  }
  if (!(await verifyTurnstile(turnstileToken, request, env))) {
    return responseJson({ error: "Spam protection could not verify this submission. Please try again." }, 403);
  }
  if (!(await sendContactEmail(name, email, message, env))) {
    return responseJson({ error: "The message could not be delivered. Please try again shortly." }, 502);
  }

  return responseJson({ ok: true, message: "Context received. I will get back to you soon." });
}

const worker = {
  async fetch(
    request: Request,
    env: Env,
    _ctx: ExecutionContext,
  ): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact-config") {
      return responseJson({ siteKey: env.TURNSTILE_SITE_KEY || "" });
    }

    if (url.pathname === "/api/contact") {
      return handleContact(request, url, env);
    }

    if (url.pathname === "/") {
      return fetchAsset(request, env, "/index.html");
    }

    const asset = await env.ASSETS.fetch(request);
    if (asset.status !== 404) {
      return asset;
    }

    const notFound = await fetchAsset(request, env, "/404.html");
    return new Response(notFound.body, {
      status: 404,
      headers: notFound.headers,
    });
  },
};

export default worker;
