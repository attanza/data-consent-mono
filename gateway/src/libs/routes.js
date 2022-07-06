const baseRateLimit = {
  windowMs: 1000,
  max: 30,
};

const baseProxy = {
  changeOrigin: true,
  onProxyReq: function onProxyReq(proxyReq, req, res) {
    if (req.user) {
      proxyReq.setHeader("x-auth-id", req.user._id);
      proxyReq.setHeader("x-auth-role", req.user.role);
      proxyReq.setHeader("x-auth-email", req.user.email);
    }
    if (req.source) {
      proxyReq.setHeader("x-auth-id", req.source._id);
      proxyReq.setHeader("x-auth-role", "ALL");
      proxyReq.setHeader("x-auth-email", req.source.name);
      proxyReq.setHeader("x-source-id", req.source._id);
    }
  },
};

export const ROUTES = [
  {
    url: "/auth",
    auth: false,
    rateLimit: baseRateLimit,
    proxy: {
      target: "http://localhost:10004/auth",
      changeOrigin: true,
      pathRewrite: {
        [`^/auth`]: "",
      },
    },
  },
  {
    url: "/users",
    auth: true,
    rateLimit: baseRateLimit,
    proxy: {
      ...baseProxy,
      target: "http://localhost:10004/users",
      pathRewrite: {
        [`^/users`]: "",
      },
    },
  },
  {
    url: "/consents",
    auth: true,
    rateLimit: baseRateLimit,
    proxy: {
      ...baseProxy,
      target: "http://localhost:10001/consents",
      pathRewrite: {
        [`^/consents`]: "",
      },
    },
  },
  {
    url: "/terms",
    auth: true,
    rateLimit: baseRateLimit,
    proxy: {
      ...baseProxy,
      target: "http://localhost:10001/terms",
      pathRewrite: {
        [`^/terms`]: "",
      },
    },
  },
  {
    url: "/check-lists",
    auth: true,
    rateLimit: baseRateLimit,
    proxy: {
      ...baseProxy,
      target: "http://localhost:10001/check-lists",
      pathRewrite: {
        [`^/check-lists`]: "",
      },
    },
  },
  {
    url: "/sources",
    auth: true,
    rateLimit: baseRateLimit,
    proxy: {
      ...baseProxy,
      target: "http://localhost:10001/sources",
      pathRewrite: {
        [`^/sources`]: "",
      },
    },
  },
  {
    url: "/statistics",
    auth: true,
    rateLimit: baseRateLimit,
    proxy: {
      ...baseProxy,
      target: "http://localhost:10001/statistics",
      pathRewrite: {
        [`^/statistics`]: "",
      },
    },
  },
  {
    url: "/seed",
    auth: true,
    rateLimit: baseRateLimit,
    proxy: {
      ...baseProxy,
      target: "http://localhost:10001/seed",
      pathRewrite: {
        [`^/seed`]: "",
      },
    },
  },
  {
    url: "/audit-trails",
    auth: true,
    rateLimit: baseRateLimit,
    proxy: {
      ...baseProxy,
      target: "http://localhost:10003/audit-trails",
      pathRewrite: {
        [`^/audit-trails`]: "",
      },
    },
  },
  {
    url: "/attachments",
    auth: true,
    rateLimit: baseRateLimit,
    proxy: {
      ...baseProxy,
      target: "http://localhost:10002/attachments",
      pathRewrite: {
        [`^/attachments`]: "",
      },
    },
  },
];
