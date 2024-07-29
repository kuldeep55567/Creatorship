import { mergeResolvers } from "@graphql-tools/merge";
import userResolver from "./userResolver.js";
const mergedResolvers = mergeResolvers([userResolver]);
export default mergedResolvers;
