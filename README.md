# 🚀 Create Chad App

> The opinionated full-stack template for developers who want to ship fast

A production-ready Next.js template with authentication, database, and type-safe APIs pre-configured. Stop spending time on boilerplate and start building your features.

## ✨ What's Included

- **Next.js 14** with App Router and TypeScript
- **Tailwind CSS** for styling
- **Keycloak Authentication** via NextAuth.js
- **PostgreSQL** with Drizzle ORM
- **tRPC** for type-safe APIs
- **React Query** for data fetching
- **Zod** for runtime validation
- Production-ready folder structure

## 🎯 Philosophy

This template is built for developers who:
- Want to start coding features immediately
- Prefer type safety over flexibility
- Need authentication and database from day one
- Don't want to research "best practices" for the 100th time

## 🚀 Quick Start

### 1. Use this template
```bash
# Clone the repository
git clone https://github.com/yourusername/create-chad-app.git my-app
cd my-app

# Install dependencies
npm install
```

### 2. Set up your environment
Create `.env.local` in the root directory:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Keycloak Configuration
KEYCLOAK_CLIENT_ID=your-keycloak-client-id
KEYCLOAK_CLIENT_SECRET=your-keycloak-client-secret
KEYCLOAK_ISSUER=https://your-keycloak-server.com/realms/your-realm

# Database Configuration
DATABASE_URL=postgre://postgres[:password]@localhost:5432/[database]
```

### 3. Set up your database
```bash
# Generate migration files
npm run db:generate

# Run migrations
npm run db:migrate

# Or for development (pushes schema directly)
npm run db:push
```

### 4. Configure Keycloak
In your Keycloak admin console:
1. Create a new client
2. Set **Access Type** to `Confidential` or `Public`
3. Enable **Standard Flow**
4. Add redirect URI: `http://localhost:3000/api/auth/callback/keycloak`
5. Add web origin: `http://localhost:3000`

### 5. Start developing
```bash
npm run dev
```

Visit `http://localhost:3000` and sign in!

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth.js
│   │   └── trpc/          # tRPC endpoints
│   ├── dashboard/         # Protected pages
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── providers/         # Context providers
│   └── ui/               # Reusable UI components
├── lib/                   # Utilities
├── server/               # Server-side code
│   ├── api/              # tRPC routers
│   └── db/               # Database schema & connection
├── types/                # TypeScript type definitions
└── utils/                # Client-side utilities
```

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:generate     # Generate migration files
npm run db:migrate      # Run migrations
npm run db:push         # Push schema to database (development)
npm run db:studio       # Open Drizzle Studio

# Code Quality
npm run lint            # Run ESLint
npm run type-check      # Run TypeScript compiler
```

## 🔧 Key Features

### Type-Safe APIs with tRPC
```typescript
// Define your API
export const userRouter = createTRPCRouter({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.select().from(users).where(eq(users.id, ctx.session.dbUserId));
  }),
});

// Use in your components with full type safety
const { data: profile } = api.user.getProfile.useQuery();
```

### Database Schema with Drizzle
```typescript
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow(),
});
```

### Protected Routes
```typescript
// Automatic user creation on sign-in
// Database user ID available in session
const { data: session } = useSession();
console.log(session?.dbUserId); // Your database user ID
```

## 📚 How to Build Features

### 1. Add a new database table
```typescript
// src/server/db/schema.ts
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});
```

### 2. Create tRPC routes
```typescript
// src/server/api/routers/posts.ts
export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ title: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(posts).values({
        ...input,
        userId: ctx.session.dbUserId,
      });
    }),
});
```

### 3. Use in your components
```typescript
const createPost = api.post.create.useMutation();
const handleSubmit = (data) => {
  createPost.mutate(data);
};
```

## 🔐 Authentication Flow

1. User clicks "Sign In with Keycloak"
2. NextAuth.js redirects to Keycloak
3. User authenticates with Keycloak
4. On successful auth, user record is created in your database
5. Session includes both Keycloak token and database user ID
6. Use `protectedProcedure` in tRPC for authenticated routes

## 🚀 Deployment

### Database
- [Neon](https://neon.tech/) - Serverless PostgreSQL
- [PlanetScale](https://planetscale.com/) - MySQL with branching
- [Railway](https://railway.app/) - PostgreSQL with simple deployment

### Application
- [Vercel](https://vercel.com/) - Zero-config deployment
- [Netlify](https://netlify.com/) - JAMstack platform
- [Railway](https://railway.app/) - Full-stack deployment

### Environment Variables
Make sure to set all environment variables in your deployment platform.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [T3 Stack](https://create.t3.gg/) for inspiration
- [Next.js](https://nextjs.org/) team for the amazing framework
- [tRPC](https://trpc.io/) for type-safe APIs
- [Drizzle](https://orm.drizzle.team/) for the excellent ORM

---

**Built with ❤️ for developers who want to ship fast**

[Report Bug](https://github.com/AlexChadwickP/create-chad-app/issues) | [Request Feature](https://github.com/AlexChadwickP/create-chad-app/issues)