module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      puppeteerScript: "test/site-analyzer/auth.cjs",
      settings: {
        disableStorageReset: true,
      },
    },
    assert: {
      preset: "lighthouse:recommended",
    },
  },
};
