import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it('matches the story library and individual story reader',()=>{
    const router=createRouter({routeTree,context:{queryClient:new QueryClient()}});
    expect(router.matchRoutes('/stories').at(-1)?.routeId).toBe('/stories');
    expect(router.matchRoutes('/story/thirsty-crow').at(-1)?.routeId).toBe('/story/$id');
  });
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });
});
