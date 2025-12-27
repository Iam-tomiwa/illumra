import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, studioUrl } from "@/sanity/lib/api";

/**
 * CHIPS compliance note:
 * This client configuration uses CDN for published content, which is server-side only.
 * Third-party cookies from Sanity's CDN (cdn.sanity.io) are set by Sanity's servers.
 * For CHIPS compliance, Sanity should set cookies with the Partitioned attribute.
 * Our server-side requests don't send credentials unnecessarily, which helps reduce
 * unnecessary third-party cookie usage.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
  stega: {
    studioUrl,
    logger: console,
    filter: (props) => {
      if (props.sourcePath.at(-1) === "title") {
        return true;
      }

      return props.filterDefault(props);
    },
  },
});
