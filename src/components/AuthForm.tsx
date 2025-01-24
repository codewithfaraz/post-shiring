import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { motion } from "framer-motion";
import AuthControllrs from "../../controllers/authControllers";

const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers and underscores"
    )
    .optional(),
});

type AuthFormData = z.infer<typeof authSchema>;

interface AuthFormProps {
  onClose: () => void;
}

export default function AuthForm({ onClose }: AuthFormProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (data: AuthFormData) => {
    setIsLoading(true);
    try {
      if (isLogin) {
        // Handle login logic here when implemented
        toast.error("Login functionality not implemented yet");
      } else {
        const response = await AuthControllrs.handleSignUp(data);
        console.log(response);
        if (response.status === 201 && response.data) {
          dispatch(setUser(response.data));
          toast.success("Account created successfully!");
          onClose();
          navigate("/home");
        } else {
          toast.error(response.message || "Something went wrong");
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update button component to show loading state
  const submitButtonContent = isLoading ? (
    <div className="flex items-center justify-center">
      <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2" />
      {isLogin ? "Signing In..." : "Signing Up..."}
    </div>
  ) : isLogin ? (
    "Sign In"
  ) : (
    "Sign Up"
  );

  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="p-8 max-w-md mx-auto"
    >
      <h2
        className="text-3xl font-bold mb-6 text-center bg-gradient-to-r 
                     from-blue-600 to-purple-600 bg-clip-text text-transparent"
      >
        {isLogin ? "Welcome Back" : "Create Account"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {!isLogin && (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 text-left">
                Name
              </label>
              <input
                {...register("name")}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 
                         focus:ring-blue-500 focus:border-transparent transition-all"
                type="text"
                placeholder="Enter your name"
              />
              {errors.name && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm text-left"
                >
                  {errors.name.message}
                </motion.p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 text-left">
                Username
              </label>
              <input
                {...register("username")}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 
                         focus:ring-blue-500 focus:border-transparent transition-all"
                type="text"
                placeholder="Choose a username"
              />
              {errors.username && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm text-left"
                >
                  {errors.username.message}
                </motion.p>
              )}
            </div>
          </>
        )}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 text-left">
            Email
          </label>
          <input
            {...register("email")}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 
                     focus:ring-blue-500 focus:border-transparent transition-all"
            type="email"
            placeholder="Enter your email"
          />
          {errors.email && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm text-left"
            >
              {errors.email.message}
            </motion.p>
          )}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 text-left">
            Password
          </label>
          <input
            {...register("password")}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 
                     focus:ring-blue-500 focus:border-transparent transition-all"
            type="password"
            placeholder="Enter your password"
          />
          {errors.password && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm text-left"
            >
              {errors.password.message}
            </motion.p>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 
                   text-white py-3 rounded-lg font-medium shadow-lg 
                   hover:shadow-xl transition-all duration-200
                   disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {submitButtonContent}
        </motion.button>
        <p className="text-center text-sm text-gray-600 mt-4">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </form>
    </motion.div>
  );
}
