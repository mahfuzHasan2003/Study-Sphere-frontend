import Lottie from "lottie-react";
import authenticationAnimation from "@/assets/authentication-animation.json";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import SocialLogin from "@/shared/SocialLogin";
import ReCAPTCHA from "react-google-recaptcha";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import DataLoader from "@/shared/DataLoader";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const { authLoading, signInWithEmail, setAuthLoading, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [isAdminPopoverOpen, setIsAdminPopoverOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const redirectTo = state?.userFrom || "/";
    signInWithEmail(data.email, data.password)
      .then(() => {
        toast({
          variant: "success",
          description: `Login Success!`,
        });
        navigate(redirectTo);
        setAuthLoading(false);
      })
      .catch((err) => {
        toast({
          variant: "error",
          description: `Login failed: ${err.message}`,
        });
        setAuthLoading(false);
      });
  };

  if (user && user.email) return <Navigate to={state?.userFrom || "/"} />;
  else
    return (
      <div className="max-w-8xl mx-auto flex items-center justify-between *:flex-1 mt-10">
        <div className="max-w-xl mx-auto border p-5 rounded-md">
          <h2 className="text-3xl font-bold mb-5">Sign In </h2>
          <Popover
            open={isAdminPopoverOpen}
            onOpenChange={setIsAdminPopoverOpen}
          >
            <PopoverTrigger asChild>
              <p className="text-center">
                <span className="text-red-500 font-bold cursor-pointer">
                  👉 Sign in as{" "}
                  <span className="text-blue-500 underline">ADMIN</span> 👈
                </span>
              </p>
            </PopoverTrigger>
            <PopoverContent side="top">
              <p className="text-center text-red-500">Click to copy</p>
              <p
                className="cursor-copy"
                onClick={() => {
                  window.navigator.clipboard.writeText(
                    "admin1@studysphere.com"
                  );
                  toast({
                    variant: "success",
                    description: "email copied to clipboard",
                  });
                  setIsAdminPopoverOpen(false);
                }}
              >
                email: admin1@studysphere.com
              </p>
              <p
                className="cursor-copy"
                onClick={() => {
                  window.navigator.clipboard.writeText("AAbb11");
                  toast({
                    variant: "success",
                    description: "password copied to clipboard",
                  });
                  setIsAdminPopoverOpen(false);
                }}
              >
                password: AAbb11
              </p>
            </PopoverContent>
          </Popover>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {/* Email */}
            <div>
              <Label>
                Email<span className="text-red-500">*</span>
              </Label>
              <Input
                type="email"
                placeholder="mahfuz@domain.com"
                {...register("email", {
                  required: "please enter your email",
                })}
              />
              {errors.email && (
                <span className="text-red-500 text-xs">
                  {errors.email.message}
                </span>
              )}
            </div>
            {/*  password */}
            <div>
              <Label>
                Password<span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="type your password here"
                  className="pr-10"
                  {...register("password", {
                    required: "please enter your password",
                  })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <span className="text-red-500 text-xs">
                  {errors.password.message}
                </span>
              )}
            </div>
            {/* Captcha */}
            <div className="scale-75 origin-left">
              <ReCAPTCHA
                sitekey={import.meta.env.VITE_captchaSiteKey}
                onChange={(val) => setCaptchaValue(val)}
              />
            </div>
            <Button className="block" disabled={!captchaValue || authLoading}>
              {authLoading ? <DataLoader text="processing.." /> : "Sign In"}
            </Button>
          </form>
          <SocialLogin state={{ ...state }} />
          <p className="text-center">
            Don&apos;t have an account?{" "}
            <Link
              to="/auth/signup"
              className="hover:font-semibold underline text-blue-500"
              state={{ ...state }}
            >
              Sign Up
            </Link>
          </p>
        </div>
        <div className="hidden lg:block">
          <Lottie animationData={authenticationAnimation} loop={true} />
        </div>
      </div>
    );
};

export default SignIn;
