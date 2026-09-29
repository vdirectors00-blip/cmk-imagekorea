// CMK 홈페이지 문의 접수 → cmk.leads 저장 + 알리고 문자 알림(발송은 DB 에서)
// 수신번호·알리고 키는 요청에서 받지 않는다. 전부 DB Vault 에 있다.

const ALLOW = new Set([
  "https://cmkimage.co.kr",
  "https://www.cmkimage.co.kr",
  "https://vdirectors00-blip.github.io",
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "http://localhost:8899",
]);

function corsHeaders(origin: string | null): Record<string, string> {
  const h: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type, x-cmk-ping",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
  if (origin && ALLOW.has(origin)) h["Access-Control-Allow-Origin"] = origin;
  return h;
}

function json(body: unknown, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  const head = corsHeaders(origin);

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: head });

  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  // 상태 점검 겸 깨우기. 출처 검사 앞에 둔다(깃허브 액션에는 Origin 이 없다).
  // 저장도 발송도 하지 않고 DB 를 한 번 건드려 무료 플랜 일시정지를 막는다.
  if (req.method === "POST" && req.headers.get("x-cmk-ping") === "1") {
    if (!url || !key) return json({ ok: false, error: "server_unconfigured" }, 500, head);
    try {
      const r = await fetch(url + "/rest/v1/rpc/cmk_health", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: key,
          Authorization: "Bearer " + key,
        },
        body: "{}",
      });
      const t = await r.text();
      return new Response(t, {
        status: r.ok ? 200 : 502,
        headers: { ...head, "Content-Type": "application/json" },
      });
    } catch (_e) {
      return json({ ok: false, error: "db_unreachable" }, 502, head);
    }
  }

  if (req.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405, head);
  if (!head["Access-Control-Allow-Origin"]) return json({ ok: false, error: "origin_not_allowed" }, 403, head);

  let p: Record<string, unknown>;
  try {
    p = await req.json();
  } catch {
    return json({ ok: false, error: "bad_json" }, 400, head);
  }

  // 허니팟: 봇이 채우면 저장도 발송도 없이 성공으로 응답
  if (String(p.website ?? "").trim() !== "") {
    return json({ ok: true, skipped: true }, 200, head);
  }

  const name = String(p.name ?? "").trim();
  const phone = String(p.phone ?? "").replace(/[^0-9]/g, "");
  if (!name) return json({ ok: false, error: "name_required" }, 400, head);
  if (!/^0[0-9]{8,10}$/.test(phone)) return json({ ok: false, error: "phone_invalid" }, 400, head);

  if (!url || !key) return json({ ok: false, error: "server_unconfigured" }, 500, head);

  const clientIp = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || null;

  const payload = {
    p: {
      name,
      title: String(p.title ?? "").trim() || null,
      company: String(p.company ?? "").trim() || null,
      phone,
      message: String(p.message ?? "").trim() || null,
      lang: String(p.lang ?? "ko"),
      page: String(p.page ?? "").slice(0, 200) || null,
      client_ip: clientIp,
    },
  };

  let res: Response;
  try {
    res = await fetch(url + "/rest/v1/rpc/cmk_submit_lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: key,
        Authorization: "Bearer " + key,
      },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.error("rpc_fetch_failed", e);
    return json({ ok: false, error: "rpc_unreachable" }, 502, head);
  }

  const text = await res.text();
  if (!res.ok) {
    console.error("rpc_error", res.status, text.slice(0, 500));
    return json({ ok: false, error: "rpc_error" }, 502, head);
  }

  let out: Record<string, unknown>;
  try {
    out = JSON.parse(text);
  } catch {
    return json({ ok: false, error: "rpc_bad_response" }, 502, head);
  }

  if (out.ok === false && out.error === "rate_limited") {
    return json({ ok: false, error: "rate_limited" }, 429, head);
  }
  // 문자 실패는 접수 실패가 아니다. 저장됐으면 성공으로 돌려준다.
  return json(out, out.ok === true ? 200 : 400, head);
});
