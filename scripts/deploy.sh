#!/usr/bin/env bash
set -euo pipefail

# ──────────────────────────────────────────────────────────────
# BabyBurger — Branch-based Vercel Deployment
# ──────────────────────────────────────────────────────────────
#   main → burger-empire.build.withdarsh.com        (countdown mode, production DB)
#   dev  → dev.burger-empire.build.withdarsh.com    (full site preview, dev DB)
# ──────────────────────────────────────────────────────────────
#
# Prerequisites:
#   1. Vercel CLI installed:  npm i -g vercel
#   2. Logged in:             vercel login
#   3. Project linked:        vercel link
#   4. Environment variables configured (run: ./scripts/deploy.sh setup)
#
# Usage:
#   ./scripts/deploy.sh          # Deploy based on current branch
#   ./scripts/deploy.sh setup    # One-time setup of Vercel env vars
# ──────────────────────────────────────────────────────────────

PROD_DOMAIN="burger-empire.build.withdarsh.com"
DEV_DOMAIN="dev.burger-empire.build.withdarsh.com"

# ── Colors ──
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

info()  { echo -e "${CYAN}[info]${NC}  $*"; }
ok()    { echo -e "${GREEN}[ok]${NC}    $*"; }
warn()  { echo -e "${YELLOW}[warn]${NC}  $*"; }
err()   { echo -e "${RED}[error]${NC} $*"; exit 1; }

# ── Check prerequisites ──
command -v vercel >/dev/null 2>&1 || err "Vercel CLI not found. Install with: npm i -g vercel"
command -v git >/dev/null 2>&1    || err "git not found."

# ──────────────────────────────────────────────────────────────
# Setup: Configure Vercel environment variables per environment
# ──────────────────────────────────────────────────────────────
setup_env() {
  info "Setting up Vercel environment variables..."
  echo ""
  echo "This will configure separate env vars for Production and Preview environments."
  echo "You'll need your database URLs ready for both environments."
  echo ""

  # ── Production env vars (main → burger-empire.build.withdarsh.com) ──
  info "── Production Environment (main branch) ──"
  info "Neon auto-injects POSTGRES_PRISMA_URL & POSTGRES_URL_NON_POOLING via Vercel integration."
  echo "true" | vercel env add NEXT_PUBLIC_COMING_SOON production

  ok "Production env vars set (COMING_SOON=true)"
  echo ""

  # ── Preview env vars (dev → dev.burger-empire.build.withdarsh.com) ──
  info "── Preview/Dev Environment (dev branch) ──"
  info "Neon auto-injects POSTGRES_PRISMA_URL & POSTGRES_URL_NON_POOLING via Vercel integration."
  echo "false" | vercel env add NEXT_PUBLIC_COMING_SOON preview

  ok "Preview env vars set (COMING_SOON=false)"
  echo ""

  ok "Setup complete! You can now deploy with: ./scripts/deploy.sh"
  echo ""
  warn "Remember to also set these in the Vercel dashboard for both environments:"
  echo "  - JWT_SECRET, JWT_REFRESH_SECRET"
  echo "  - NEXT_PUBLIC_APP_URL (https://$PROD_DOMAIN or https://$DEV_DOMAIN)"
  echo "  - RAZORPAY keys, SMTP, SMS (if applicable)"
  echo "  - PREVIEW_SECRET (production only)"
}

# ──────────────────────────────────────────────────────────────
# Deploy based on current branch
# ──────────────────────────────────────────────────────────────
deploy() {
  BRANCH=$(git rev-parse --abbrev-ref HEAD)

  case "$BRANCH" in
    main)
      info "Deploying PRODUCTION → https://$PROD_DOMAIN"
      info "Mode: Countdown (COMING_SOON=true)"
      echo ""

      vercel deploy --prod

      ok "Production deployed to https://$PROD_DOMAIN"
      ;;

    dev)
      info "Deploying DEV → https://$DEV_DOMAIN"
      info "Mode: Full site preview (COMING_SOON=false)"
      echo ""

      # Deploy as preview and capture the deployment URL
      DEPLOY_URL=$(vercel deploy 2>&1 | grep -E '^https://' | tail -1)

      if [ -z "$DEPLOY_URL" ]; then
        err "Failed to get deployment URL. Check vercel output above."
      fi

      info "Preview URL: $DEPLOY_URL"
      info "Aliasing to $DEV_DOMAIN..."

      vercel alias "$DEPLOY_URL" "$DEV_DOMAIN"

      ok "Dev deployed to https://$DEV_DOMAIN"
      ;;

    *)
      warn "Branch '$BRANCH' is not configured for deployment."
      echo ""
      echo "  Deployable branches:"
      echo "    main   → https://$PROD_DOMAIN  (countdown)"
      echo "    dev  → https://$DEV_DOMAIN   (full preview)"
      echo ""
      echo "  Switch branch first:"
      echo "    git checkout main    # for production"
      echo "    git checkout dev    # for dev preview"
      exit 1
      ;;
  esac
}

# ──────────────────────────────────────────────────────────────
# Entry point
# ──────────────────────────────────────────────────────────────
case "${1:-deploy}" in
  setup)  setup_env ;;
  deploy) deploy ;;
  *)
    echo "Usage: ./scripts/deploy.sh [deploy|setup]"
    echo ""
    echo "  deploy  Deploy based on current branch (default)"
    echo "  setup   One-time setup of Vercel env vars"
    exit 1
    ;;
esac
