export const cashbackRoutes = {
  getWallet: (organizationId: string) => `/cashback/wallet/${organizationId}`,
  getTransactions: (organizationId: string) =>
    `/cashback/transactions/${organizationId}`,
}
