const environment = {
  isProduction: process.env.NEXT_PUBLIC_ENVIRONMENT! === "production",
  githubClientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!,
  githubRedirectUri: process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI!,
  apiUrl: process.env.NEXT_PUBLIC_API_URL!,
  baseDomain: process.env.BASE_DOMAIN!,
};

export default environment;
