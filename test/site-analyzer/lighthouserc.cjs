module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
    },
    assert: {
      preset: "lighthouse:recommended",
    },
  },
};
