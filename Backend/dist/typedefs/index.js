import { mergeTypeDefs } from "@graphql-tools/merge";
import userTypeDef from "./userTypeDef.js";
const mergedTypeDefs = mergeTypeDefs([userTypeDef]);
export default mergedTypeDefs;
