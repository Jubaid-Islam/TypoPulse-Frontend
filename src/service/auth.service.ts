import { client } from "./graphql/client";
import { LOGIN, LOGOUT, REGISTER } from "./graphql/mutations";
import { GET_ME } from "./graphql/queries";
import { User, RegisterInput, LoginInput } from "@/types";

export const authService = {
  // register new user
  async register(input: RegisterInput): Promise< User | null > {
    const { data } = await client.mutate<{ register: { user: User } }>
    
    ({
      mutation: REGISTER,
      variables: { input },
    });

    return data?.register?.user ?? null;
  },

  // login user
  async login(input: LoginInput): Promise< User | null > {
    const { data } = await client.mutate<{ login: { user: User } }>
    
    ({
      mutation: LOGIN,
      variables: { input },
    });

    return data?.login?.user ?? null;
  },

  // logout user
  async logout(): Promise<void> {
    await client.mutate({
      mutation: LOGOUT,
    });
    await client.resetStore();
  },

  // get current user
  async getCurrentUser(): Promise< User | null > {
    const { data } = await client.query<{ me: User | null }>
    
    ({
      query: GET_ME,
      fetchPolicy: "network-only",
    });

    return data?.me ?? null;
  },
};
