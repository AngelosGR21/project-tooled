/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	forceExit: true,
  verbose: true,
  forceExit: true,
  setupFilesAfterEnv: ["jest-sorted", "jest-extended/all"],
}
