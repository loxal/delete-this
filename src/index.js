import * as base64 from "@borderless/base64";
import utf8 from "utf8";

function handler(event) {
  const url = new URL(event.request.url);
  if(url.pathname.startsWith("/base64/")) {
    if(event.request.method === "GET") {
      try {
        const rx = /base64\/([^\/]*)/;
        const [, encodedSegment] = url.pathname.match(rx);
        const base64Decoded = base64.decode(encodedSegment);
        const asString = String.fromCodePoint(...base64Decoded);
        const utf8Decoded = utf8.decode(asString);
        const uriEncoded = encodeURIComponent(encodedSegment);
        return new Response(utf8Decoded, {
          headers: new Headers({ 
            "set-cookie": `encodedSegment=${uriEncoded}; Max-Age=3600`
          }),
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          headers: new Headers({ 
            "Content-Type": "application/json"
          }),
          status: 500
        });
      }
    } else {
      return new Response("Method Not Allowed", {
        status: 405
      });
    }
  } else if (url.pathname.startsWith("/status/")) {
    return fetch(req, { backend: "origin_0" });
  }
  return new Response("Not Found", {
    status: 404
  });
}

addEventListener("fetch", (event) => event.respondWith(handler(event)));