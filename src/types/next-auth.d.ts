import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    error?: string
    user: {
      id: string
      email: string
      username: string
      first_name: string
      last_name: string
      avatar?: string
      bio?: string
      articles_count?: number
      author_profile?: {
        id: string
        display_name: string
        slug: string
        name: string
        email: string
        avatar?: string
        bio?: string
        articles_count?: number
      }
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    email: string
    username: string
    first_name: string
    last_name: string
    avatar?: string
    bio?: string
    articles_count?: number
    accessToken?: string
    refreshToken?: string
    author_profile?: {
      id: string
      display_name: string
      slug: string
      name: string
      email: string
      avatar?: string
      bio?: string
      articles_count?: number
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    accessTokenExpires?: number
    user?: any
    error?: string
  }
}