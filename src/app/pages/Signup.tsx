import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { AlertCircle, Loader2, ArrowLeft, Leaf } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { signup, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    // Calculate password strength
    let strength = 0;
    if (value.length >= 8) strength++;
    if (/[A-Z]/.test(value)) strength++;
    if (/[0-9]/.test(value)) strength++;
    if (/[^A-Za-z0-9]/.test(value)) strength++;
    setPasswordStrength(strength);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!name || !email || !password || !confirmPassword) {
      setFormError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setFormError("Password must be at least 6 characters");
      return;
    }

    try {
      await signup(name, email, password);
      navigate("/");
    } catch (err) {
      // Error is already set in the auth context
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Left Side - Brand & Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-emerald-700 relative overflow-hidden flex-col justify-between p-12">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl opacity-20"></div>

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
            Join Our Community of Healthy Eaters
          </h1>
          <p className="text-xl text-green-100 leading-relaxed">
            Get access to fresh organic products, exclusive deals, and a
            personalized shopping experience.
          </p>

          {/* Benefits List */}
          <div className="space-y-4 pt-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
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
                  Get 10% Welcome Bonus
                </p>
                <p className="text-sm text-green-100">on your first order</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
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
                <p className="font-semibold text-white">Exclusive Offers</p>
                <p className="text-sm text-green-100">member-only deals</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
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
                <p className="font-semibold text-white">Loyalty Rewards</p>
                <p className="text-sm text-green-100">
                  earn points with every purchase
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="relative z-10">
          <p className="text-green-100">Already have an account?</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-white font-semibold mt-2 hover:gap-3 transition-all"
          >
            <ArrowLeft className="h-4 w-4" /> Sign In
          </Link>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center px-6 sm:px-12 py-12 overflow-y-auto">
        <div className="max-w-md w-full mx-auto">
          {/* Mobile Logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <Leaf className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold text-gray-900">FreshMarket</span>
          </Link>

          <div className="space-y-2 mb-8">
            <h2 className="text-4xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-600">
              Join us and get 10% off on your first order
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
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                className="h-11 rounded-lg border-gray-300 focus:border-green-600 focus:ring-green-600"
              />
            </div>

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
                className="h-11 rounded-lg border-gray-300 focus:border-green-600 focus:ring-green-600"
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
                onChange={(e) => handlePasswordChange(e.target.value)}
                disabled={isLoading}
                className="h-11 rounded-lg border-gray-300 focus:border-green-600 focus:ring-green-600"
              />
              {password && (
                <div className="flex gap-2 mt-2">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        passwordStrength === 1
                          ? "w-1/4 bg-red-500"
                          : passwordStrength === 2
                            ? "w-1/2 bg-yellow-500"
                            : passwordStrength === 3
                              ? "w-3/4 bg-blue-500"
                              : passwordStrength === 4
                                ? "w-full bg-green-500"
                                : "w-0"
                      }`}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-gray-600">
                    {passwordStrength === 1 && "Weak"}
                    {passwordStrength === 2 && "Fair"}
                    {passwordStrength === 3 && "Good"}
                    {passwordStrength === 4 && "Strong"}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className="h-11 rounded-lg border-gray-300 focus:border-green-600 focus:ring-green-600"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-green-600 focus:ring-green-600"
                defaultChecked
              />
              <span className="text-sm text-gray-600">
                I agree to the Terms of Service and Privacy Policy
              </span>
            </label>

            <Button
              type="submit"
              className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-11 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
              asChild
            >
              <Link to="/login">Sign In</Link>
            </Button>
          </form>

          {/* Footer Text */}
          <p className="text-xs text-gray-500 text-center mt-8">
            By creating an account, you agree to our Terms of Service and
            Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
