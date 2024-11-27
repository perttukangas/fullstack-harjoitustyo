module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
    },
    assert: {
      preset: "lighthouse:recommended",
      assertions: {
        "unused-javascript": ["error", { maxLength: 30720 }],
      },
    },
  },
};
