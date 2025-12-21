/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as ai_agents from "../ai/agents.js";
import type * as ai_prompts from "../ai/prompts.js";
import type * as explanation from "../explanation.js";
import type * as mutations from "../mutations.js";
import type * as queries from "../queries.js";
import type * as utils_text from "../utils/text.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "ai/agents": typeof ai_agents;
  "ai/prompts": typeof ai_prompts;
  explanation: typeof explanation;
  mutations: typeof mutations;
  queries: typeof queries;
  "utils/text": typeof utils_text;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
