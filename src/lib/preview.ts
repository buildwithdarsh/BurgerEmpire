// Preview token verification — stub after backend migration.
// The coming-soon preview system no longer uses server-side JWT verification.

export async function verifyPreviewToken(token: string): Promise<{ valid: boolean }> {
  return { valid: !!token };
}
