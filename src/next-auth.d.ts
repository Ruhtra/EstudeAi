declare module "next-auth" {
  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  // interface User {
  // id?: string | undefined;
  // email?: string | null | undefined;
  // role: UserRole;
  // }
  /**
   * The shape of the account object returned in the OAuth providers' `account` callback,
   * Usually contains information about the provider being used, like OAuth tokens (`access_token`, etc).
   */
  // interface Account {}

  /**
   * Returned by `useSession`, `auth`, contains information about the active session.
   */
  interface Session {
    user: {
      id: string;
      email: string;
      role: UserRole;
    } & DefaultSession["user"];
  }
}

// The `JWT` interface can be found in the `next-auth/jwt` submodule

/* eslint-disable @typescript-eslint/no-unused-vars */
import { JWT } from "next-auth/jwt";
/* eslint-enable @typescript-eslint/no-unused-vars */

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    id: string;
    email: string;
    role: UserRole;
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    // Add your additional properties here:
    role: UserRole;
  }
}
