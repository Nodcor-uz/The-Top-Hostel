import { createFileRoute } from "@tanstack/react-router";
import { HostelPage } from "@/components/hostel-page";

export const Route = createFileRoute("/")({
  component: HostelPage,
  head: () => ({
    links: [{ rel: "preload", as: "image", href: "/photos/facade.jpg" }],
  }),
});
