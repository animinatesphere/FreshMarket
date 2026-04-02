import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { AlertCircle, Loader2, ArrowRight, Leaf } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuth();
  // isLoading is ONLY true when the login form is actively submitting
  const navigate = useNavigate();
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!email || !password) {
      setFormError("Please fill in all fields");
      return;
    }

    try {
      const user = await login(email, password);
      console.log("LOGIN SUCCESS! User role:", user?.role);
      
      if (user && user.role === "admin") {
        console.log("Redirecting to /admin...");
        navigate("/admin");
      } else {
        console.log("Redirecting to / (Home)...");
        navigate("/");
      }
    } catch (err) {
      setFormError(
        "Invalid email or password. Try admin@freshmarket.com / admin123",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Left Side - Brand & Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-600 to-orange-700 relative overflow-hidden flex-col justify-between p-12">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500 rounded-full blur-3xl opacity-20"></div>

        {/* Logo/Brand */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 text-white">
            <Leaf className="h-8 w-8" />
            <span className="text-2xl font-bold">FreshMarket</span>
          </Link>
        </div>

        {/* Main Content */}
        <div className="relative z-10 space-y-6">
          <h1 className="text-5xl font-bold text-white leading-tight">
            Welcome Back to Fresh Organic Living
          </h1>
          <p className="text-xl text-orange-100 leading-relaxed">
            Sign in to access your personalized shopping experience, track
            orders, and discover fresh organic products from local farms.
          </p>

          {/* Features List */}
          <div className="space-y-4 pt-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-white">
                  100% Organic Products
                </p>
                <p className="text-sm text-orange-100">
                  from verified local farms
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-white">Fast Delivery</p>
                <p className="text-sm text-orange-100">
                  fresh to your doorstep
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-white">Secure Shopping</p>
                <p className="text-sm text-orange-100">
                  protected transactions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="relative z-10">
          <p className="text-orange-100">New to FreshMarket?</p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 text-white font-semibold mt-2 hover:gap-3 transition-all"
          >
            Create an account <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center px-6 sm:px-12 py-12">
        <div className="max-w-md w-full mx-auto">
          {/* Mobile Logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <Leaf className="h-6 w-6 text-orange-600" />
            <span className="text-xl font-bold text-gray-900">FreshMarket</span>
          </Link>

          <div className="space-y-2 mb-8">
            <h2 className="text-4xl font-bold text-gray-900">Sign In</h2>
            <p className="text-gray-600">
              Welcome back! Please enter your details.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {(error || formError) && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error || formError}</p>
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="h-11 rounded-lg border-gray-300 focus:border-orange-600 focus:ring-orange-600"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="h-11 rounded-lg border-gray-300 focus:border-orange-600 focus:ring-orange-600"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-600"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                to="#"
                className="text-sm font-medium text-orange-600 hover:text-orange-700"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Don't have an account?
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-11 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
              asChild
            >
              <Link to="/signup">Create Account</Link>
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-5 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-xs font-bold text-blue-900 mb-3 uppercase tracking-wide">
              Demo Credentials
            </p>
            <div className="space-y-2 text-xs text-blue-800">
              <p>
                <span className="font-semibold">Admin:</span>{" "}
                admin@freshmarket.com
              </p>
              <p>
                <span className="font-semibold">Password:</span> admin123
              </p>
            </div>
          </div>

          {/* Footer Text */}
          <p className="text-xs text-gray-500 text-center mt-8">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
