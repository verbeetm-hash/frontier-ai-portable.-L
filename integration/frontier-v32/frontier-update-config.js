// Frontier V3.2 production configuration - intentionally fail closed.
// A production signing key MUST be provisioned out of band; SHADOW key is not trusted.
// Release endpoint remains null until a signed production manifest and key governance exist.
export const TRUSTED_RELEASE_KEY = null;
export const UPDATE_MANIFEST_URL = null;
