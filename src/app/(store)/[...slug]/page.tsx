// Catch-all route: prevents 404s while COMING_SOON is active in layout.
// The layout renders ComingSoonLanding and never reaches this component,
// but Next.js needs a valid page to avoid a build-time 404.
// Remove this file when the site goes live.
export default function CatchAllPage() {
  return null;
}
