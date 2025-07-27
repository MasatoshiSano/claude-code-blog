import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const response = await fetch(`${API_BASE_URL}/auth/jwt/token/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          if (!response.ok) {
            return null
          }

          const data = await response.json()
          
          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.first_name + ' ' + data.user.last_name,
            accessToken: data.access,
            refreshToken: data.refresh,
            ...data.user
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour
  },
  jwt: {
    maxAge: 60 * 60, // 1 hour
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // 初回ログイン時
      if (user && account) {
        if (account.provider === "credentials") {
          return {
            ...token,
            accessToken: user.accessToken,
            refreshToken: user.refreshToken,
            accessTokenExpires: Date.now() + 60 * 60 * 1000, // 1 hour
            user: user,
          }
        } else {
          // ソーシャルログインの場合
          try {
            const response = await fetch(`${API_BASE_URL}/auth/social/login/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                provider: account.provider,
                access_token: account.access_token,
              }),
            })

            if (response.ok) {
              const data = await response.json()
              return {
                ...token,
                accessToken: data.access,
                refreshToken: data.refresh,
                accessTokenExpires: Date.now() + 60 * 60 * 1000, // 1 hour
                user: data.user,
              }
            }
          } catch (error) {
            console.error('Social auth error:', error)
          }
        }
      }

      // アクセストークンの有効期限チェック
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token
      }

      // リフレッシュトークンを使用してアクセストークンを更新
      return await refreshAccessToken(token)
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.user = token.user
      session.error = token.error
      
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  events: {
    async signOut({ token }) {
      // JWTトークンをブラックリストに追加
      if (token?.refreshToken) {
        try {
          await fetch(`${API_BASE_URL}/auth/jwt/logout/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token.accessToken}`,
            },
            body: JSON.stringify({
              refresh_token: token.refreshToken,
            }),
          })
        } catch (error) {
          console.error('Logout error:', error)
        }
      }
    },
  },
}

async function refreshAccessToken(token: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/jwt/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh: token.refreshToken,
      }),
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.access,
      accessTokenExpires: Date.now() + 60 * 60 * 1000, // 1 hour
      refreshToken: refreshedTokens.refresh ?? token.refreshToken,
      user: refreshedTokens.user ?? token.user,
    }
  } catch (error) {
    console.error('Error refreshing access token:', error)

    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}