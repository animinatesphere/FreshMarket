import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { AlertCircle, Loader2, ArrowRight, Leaf, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const features = [
  { title: "100% Organic Products", subtitle: "from verified local farms" },
  { title: "Fast Delivery", subtitle: "fresh to your doorstep" },
  { title: "Secure Shopping", subtitle: "protected transactions" },
];

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuth();
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
      navigate(user && user.role === "admin" ? "/admin" : "/");
    } catch (err) {
      setFormError("Invalid email or password. Try admin@freshmarket.com / admin123");
    }
  };

  return (
    <div className="min-h-screen bg-[#14201a] flex">
      {/* Left Side - Brand & Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-foreground rounded-full blur-3xl opacity-10" />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 text-primary-foreground">
            <Leaf className="h-8 w-8" />
            <span className="text-2xl font-serif">FreshMarket</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-5xl text-primary-foreground leading-tight">
            Welcome Back to Fresh Organic Living
          </h1>
          <p className="text-xl text-primary-foreground/75 leading-relaxed">
            Sign in to access your personalized shopping experience, track
            orders, and discover fresh organic products from local farms.
          </p>

          <div className="space-y-4 pt-6">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-primary-foreground">{feature.title}</p>
                  <p className="text-sm text-primary-foreground/70">{feature.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-primary-foreground/70">New to FreshMarket?</p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 text-primary-foreground font-semibold mt-2 hover:gap-3 transition-all"
          >
            Create an account <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 bg-card flex flex-col justify-center px-6 sm:px-12 py-12">
        <div className="max-w-md w-full mx-auto">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="text-xl font-serif">FreshMarket</span>
          </Link>

          <div className="space-y-2 mb-8">
            <h2 className="text-4xl">Sign In</h2>
            <p className="text-muted-foreground">Welcome back! Please enter your details.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {(error || formError) && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 flex gap-3">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error || formError}</p>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">Email Address</label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="h-11 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">Password</label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="h-11 rounded-lg"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-border text-primary focus:ring-ring" />
                <span className="text-sm text-muted-foreground">Remember me</span>
              </label>
              <Link to="#" className="text-sm font-medium text-accent hover:text-accent/80">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full h-11 rounded-lg" disabled={isLoading}>
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
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">Don't have an account?</span>
              </div>
            </div>

            <Button type="button" variant="outline" className="w-full h-11 rounded-lg" asChild>
              <Link to="/signup">Create Account</Link>
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-5 bg-secondary rounded-xl border border-border">
            <p className="text-xs font-bold text-secondary-foreground mb-3 uppercase tracking-wide">
              Demo Admin Credentials
            </p>
            <div className="space-y-2 text-xs text-secondary-foreground/80">
              <p><span className="font-semibold">Admin:</span> admin@freshmarket.com</p>
              <p><span className="font-semibold">Password:</span> admin123</p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-8">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
