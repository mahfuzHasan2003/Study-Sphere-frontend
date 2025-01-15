import Lottie from "lottie-react";
import authenticationAnimation from "@/assets/authentication-animation.json";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import SocialLogin from "@/shared/SocialLogin";
import ReCAPTCHA from "react-google-recaptcha";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import DataLoader from "@/shared/DataLoader";
import useAxiosPublic from "@/hooks/useAxiosPublic";

const SignUp = () => {
   const axiosPublic = useAxiosPublic();
   const [showPassword, setShowPassword] = useState(false);
   const {
      register,
      handleSubmit,
      setValue,
      watch,
      clearErrors,
      formState: { errors },
   } = useForm({
      defaultValues: {
         role: null,
      },
   });
   const { toast } = useToast();
   const navigate = useNavigate();
   const roleValue = watch("role");
   useEffect(() => {
      if (roleValue) {
         clearErrors("role");
      }
   }, [roleValue, clearErrors]);

   const { signUpWithEmail, updateUserProfile, authLoading, setAuthLoading } =
      useAuth();
   const [captchaValue, setCaptchaValue] = useState(null);

   const onSubmit = async (data) => {
      // sign up
      await signUpWithEmail(data.email, data.password)
         .then(() => {
            // uploading image to imagebb server
            const imageData = { image: data.profileImage[0] };
            const res = axios.post(
               `https://api.imgbb.com/1/upload?key=${
                  import.meta.env.VITE_imagebbAPI
               }`,
               imageData,
               { headers: { "content-type": "multipart/form-data" } }
            );
            // ipdate user profile
            updateUserProfile({
               displayName: data.name,
               photoURL: res.data.data.display_url,
            });
            toast({
               variant: "success",
               description: `Account Create Success!`,
            });
            navigate("/");
            setAuthLoading(false);

            // add user data to database
            axiosPublic.post("/post-user", {
               userName: data.name,
               userEmail: data.email,
               userPhotoURL: res.data.data.display_url,
               userRole: data.role,
            });
         })
         .catch((err) => {
            toast({
               variant: "error",
               description: `Sign up failed : ${err.message}`,
            });
            setAuthLoading(false);
         });
   };

   return (
      <div className='max-w-8xl mx-auto flex items-center justify-between *:flex-1 mt-10'>
         <div className='max-w-xl mx-auto border p-5 rounded-md'>
            <h2 className='text-3xl font-bold mb-5'>Create an account </h2>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-3'>
               {/* Role */}
               <div className=''>
                  <div className='flex gap-5 items-center'>
                     <p>What is your role?</p>
                     <RadioGroup
                        onValueChange={(value) => setValue("role", value)}
                        className='flex gap-5'>
                        <div className='flex items-center gap-2'>
                           <RadioGroupItem
                              value='student'
                              id='student'
                              {...register("role", {
                                 required: "Role selection is required",
                              })}
                           />
                           <Label htmlFor='student'>Student</Label>
                        </div>
                        <div className='flex items-center gap-2'>
                           <RadioGroupItem
                              value='tutor'
                              id='tutor'
                              {...register("role", {
                                 required: "Role selection is required",
                              })}
                           />
                           <Label htmlFor='tutor'>Tutor</Label>
                        </div>
                     </RadioGroup>
                  </div>
                  {errors.role && (
                     <span className='text-red-500 text-xs'>
                        {errors.role.message}
                     </span>
                  )}
               </div>
               {/* Name */}
               <div>
                  <Label>Full Name</Label>
                  <Input
                     type='text'
                     placeholder='Mahfuz Hasan'
                     {...register("name", {
                        required: "Full Name is required",
                        minLength: {
                           value: 3,
                           message:
                              "Full Name must be at least 3 characters long",
                        },
                     })}
                  />
                  {errors.name && (
                     <span className='text-red-500 text-xs'>
                        {errors.name.message}
                     </span>
                  )}
               </div>
               {/* Photo */}
               <div>
                  <Label>Profile Image</Label>
                  <Input
                     type='file'
                     {...register("profileImage", {
                        required: "Profile Photo is required",
                        validate: (fileList) => {
                           if (fileList[0] && fileList[0].size > 300 * 1024) {
                              return "File size must be less than 300KB.";
                           }
                           return true;
                        },
                     })}
                  />
                  {errors.profileImage && (
                     <span className='text-red-500 text-xs'>
                        {errors.profileImage.message}
                     </span>
                  )}
               </div>
               {/* Email */}
               <div>
                  <Label>Email</Label>
                  <Input
                     type='email'
                     placeholder='mahfuz@domain.com'
                     {...register("email", {
                        required: "Email is required",
                        pattern: {
                           value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                           message: "Please enter a valid email address",
                        },
                     })}
                  />
                  {errors.email && (
                     <span className='text-red-500 text-xs'>
                        {errors.email.message}
                     </span>
                  )}
               </div>
               {/*  password */}
               <div>
                  <Label>Password</Label>
                  <div className='relative'>
                     <Input
                        type={showPassword ? "text" : "password"}
                        placeholder='Type a strong password'
                        className='pr-10'
                        {...register("password", {
                           required: "Password is required",
                           pattern: {
                              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
                              message:
                                 " Password must be at least 6 characters long, including one uppercase letter, one lowercase letter, and one number",
                           },
                        })}
                     />
                     <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        onClick={() => setShowPassword((prev) => !prev)}
                        className='absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full'
                        aria-label={
                           showPassword ? "Hide password" : "Show password"
                        }>
                        {showPassword ? (
                           <EyeOff className='w-4 h-4' />
                        ) : (
                           <Eye className='w-4 h-4' />
                        )}
                     </Button>
                  </div>
                  {errors.password && (
                     <span className='text-red-500 text-xs'>
                        {errors.password.message}
                     </span>
                  )}
               </div>
               {/* Captcha */}
               <div className='scale-75 origin-left'>
                  <ReCAPTCHA
                     sitekey={import.meta.env.VITE_captchaSiteKey}
                     onChange={(val) => setCaptchaValue(val)}
                  />
               </div>
               <Button
                  className='block'
                  disabled={!captchaValue || authLoading}>
                  {authLoading ? <DataLoader /> : "Sign Up"}
               </Button>
            </form>
            <SocialLogin />
            <p className='text-center'>
               Already have an account?&nbsp;
               <Link
                  to='/auth/signin'
                  className='hover:font-semibold underline text-blue-500'>
                  Sign In
               </Link>
            </p>
         </div>
         <div className='hidden lg:block'>
            <Lottie animationData={authenticationAnimation} loop={true} />
         </div>
      </div>
   );
};

export default SignUp;
