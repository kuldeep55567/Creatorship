import { mergeResolvers } from "@graphql-tools/merge";
import userResolver from "./userResolver";

const mergedResolvers = mergeResolvers([userResolver]);

export default mergedResolvers;