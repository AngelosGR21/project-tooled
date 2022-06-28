import testData from "../data/test-data/index";
import seed from "./seed";
import db from "../connection";

const runSeed = () => {
  return seed(testData).then(() => db.end());
};

runSeed();
