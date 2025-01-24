import supabase from "../utilities/supabase";

type auth = {
  username: string;
  email: string;
  name: string;
  password: string;
};

type ResponseType = {
  status: number;
  message: string;
  data?: any;
  error?: string;
};

class AuthControllers {
  static async handleSignUp(data: auth): Promise<ResponseType> {
    try {
      // Check if user exists with same email
      const { data: emailExists } = await supabase
        .from("users")
        .select("email")
        .eq("email", data.email)
        .single();

      if (emailExists) {
        return {
          status: 409,
          message: "User with this email already exists",
          error: "Email already taken",
        };
      }

      // Check if username is taken
      const { data: usernameExists } = await supabase
        .from("users")
        .select("username")
        .eq("username", data.username)
        .single();

      if (usernameExists) {
        return {
          status: 409,
          message: "Username is already taken",
          error: "Username already taken",
        };
      }

      // Create auth user
      const { data: authUser, error: signUpError } = await supabase.auth.signUp(
        {
          email: data.email,
          password: data.password,
        }
      );

      if (signUpError || !authUser.user) {
        return {
          status: 400,
          message: "Failed to create account",
          error: signUpError?.message || "Sign up failed",
        };
      }

      // Store user data in users table
      const { data: newUser, error: userError } = await supabase
        .from("users")
        .insert([
          {
            id: authUser.user.id,
            email: data.email,
            username: data.username,
            name: data.name,
          },
        ])
        .select()
        .single();

      if (userError || !newUser) {
        // Attempt to clean up auth user if profile creation fails
        await supabase.auth.admin.deleteUser(authUser.user.id);
        return {
          status: 500,
          message: "Failed to create user profile",
          error: "Internal server error",
        };
      }

      return {
        status: 201,
        message: "Account created successfully",
        data: newUser,
      };
    } catch (error) {
      console.error("Signup error:", error);
      return {
        status: 500,
        message: "Internal server error",
        error: "Something went wrong",
      };
    }
  }
}

export default AuthControllers;
