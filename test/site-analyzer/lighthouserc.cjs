module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
    },
    assert: {
      preset: "lighthouse:recommended",
      assertions: {
        "unused-javascript": ["error", { maxLength: 1 }], // disable this assertion
      },
    },
  },
};
