import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { AlertCircle, Loader2, ArrowLeft, Leaf, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const benefits = [
  { title: "Get 10% Welcome Bonus", subtitle: "on your first order" },
  { title: "Exclusive Offers", subtitle: "member-only deals" },
  { title: "Loyalty Rewards", subtitle: "earn points with every purchase" },
];

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
            Join Our Community of Healthy Eaters
          </h1>
          <p className="text-xl text-primary-foreground/75 leading-relaxed">
            Get access to fresh organic products, exclusive deals, and a
            personalized shopping experience.
          </p>

          <div className="space-y-4 pt-6">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-primary-foreground">{benefit.title}</p>
                  <p className="text-sm text-primary-foreground/70">{benefit.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-primary-foreground/70">Already have an account?</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-primary-foreground font-semibold mt-2 hover:gap-3 transition-all"
          >
            <ArrowLeft className="h-4 w-4" /> Sign In
          </Link>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 bg-card flex flex-col justify-center px-6 sm:px-12 py-12 overflow-y-auto">
        <div className="max-w-md w-full mx-auto">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="text-xl font-serif">FreshMarket</span>
          </Link>

          <div className="space-y-2 mb-8">
            <h2 className="text-4xl">Create Account</h2>
            <p className="text-muted-foreground">Join us and get 10% off on your first order</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {(error || formError) && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 flex gap-3">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error || formError}</p>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">Full Name</label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                className="h-11 rounded-lg"
              />
            </div>

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
                onChange={(e) => handlePasswordChange(e.target.value)}
                disabled={isLoading}
                className="h-11 rounded-lg"
              />
              {password && (
                <div className="flex gap-2 mt-2">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        passwordStrength === 1
                          ? "w-1/4 bg-destructive"
                          : passwordStrength === 2
                            ? "w-1/2 bg-accent"
                            : passwordStrength === 3
                              ? "w-3/4 bg-chart-3"
                              : passwordStrength === 4
                                ? "w-full bg-primary"
                                : "w-0"
                      }`}
                    />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {passwordStrength === 1 && "Weak"}
                    {passwordStrength === 2 && "Fair"}
                    {passwordStrength === 3 && "Good"}
                    {passwordStrength === 4 && "Strong"}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium">Confirm Password</label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className="h-11 rounded-lg"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-border text-primary focus:ring-ring" defaultChecked />
              <span className="text-sm text-muted-foreground">
                I agree to the Terms of Service and Privacy Policy
              </span>
            </label>

            <Button type="submit" className="w-full h-11 rounded-lg" disabled={isLoading}>
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
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">Already have an account?</span>
              </div>
            </div>

            <Button type="button" variant="outline" className="w-full h-11 rounded-lg" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-8">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
