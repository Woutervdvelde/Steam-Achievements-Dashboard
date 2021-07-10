import cookie from "cookie"

export function parseCookies(ctx) {
    const { req } = ctx;
    return cookie.parse(req ? req.headers.cookie || "" : document.cookie);
}

export function checkUserCookies(ctx, cookies) {
    if (!cookies.hasOwnProperty("user")) {
        ctx.res.writeHead(303, {Location: "/login"});
        ctx.res.end();
    }
}