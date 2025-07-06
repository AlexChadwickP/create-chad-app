declare module "next-auth" {
    interface Session {
        accessToken?: string
        dbUserId?: number
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string
    }
}