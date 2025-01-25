import { useNavigate, useParams } from "react-router-dom";
import { isAfter, isBefore, parseISO, startOfDay } from "date-fns";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFetchForGet } from "@/hooks/useFetchForGet";
import { convertToHoursAndMinutes } from "@/utilities/convertToHoursAndMinutes";
import { Skeleton } from "@/components/ui/skeleton";
import GetUserWithRole from "@/shared/GetUserWithRole";
import useAuth from "@/hooks/useAuth";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { formatInTimeZone } from "date-fns-tz";

const SessionDetails = () => {
   const { id } = useParams();
   const user = GetUserWithRole();
   const { authLoading } = useAuth();
   const axiosPublic = useAxiosPublic();
   const navigate = useNavigate();
   const [bookNowBtnText, setBookNowBtnText] = useState("Book Now");
   const { data: session = {}, isLoading: sessionLoading } = useFetchForGet(
      ["SessionDetails", id],
      `/get-session-details/${id}`
   );
   const { data: reviews = [], refetch: refetchReviews } = useFetchForGet(
      ["StudentReviews", id],
      `/get-reviews/${id}`
   );
   const { data: tutorAvailableSessionsCount = {} } = useFetchForGet(
      ["tutorAvailableSessionsCount", id],
      `/approved-sessions-count?email=${session?.tutorEmail}`,
      { enabled: !!session?.tutorEmail }
   );
   const { data: isAlreadyBookedSession = {} } = useFetchForGet(
      ["isAlreadyBookedSession", id, user?.userEmail],
      `/already-booked-session?id=${id}&user=${user?.userEmail}`,
      { enabled: !!id && !!user?.userEmail }
   );
   const {
      data: isAlreadySubmittedReview = {},
      refetch: refetchAlreadySubmitted,
   } = useFetchForGet(
      ["isAlreadySubmittedReview", id, user?.userEmail],
      `/already-submitted-review?id=${id}&user=${user?.userEmail}`,
      { enabled: !!id && !!user?.userEmail }
   );
   const { data: averageRating } = useFetchForGet(
      ["averageRating", id, reviews],
      `/get-average-review/${id}`
   );

   const currentDate = startOfDay(new Date());
   const startDate = startOfDay(parseISO(session?.registrationStartDate || ""));
   const endDate = startOfDay(parseISO(session?.registrationEndDate || ""));
   const isRegistrationOpen =
      isAfter(currentDate, startDate) && isBefore(currentDate, endDate);
   const isUpcoming = isAfter(
      parseISO(session?.registrationStartDate || ""),
      currentDate
   );

   const showReview =
      isAlreadyBookedSession &&
      isAlreadyBookedSession?.paymentStatus === "paid" &&
      !isAlreadySubmittedReview;
   useEffect(() => {
      if (isAlreadyBookedSession) {
         setBookNowBtnText("Already Booked");
      } else if (isRegistrationOpen || isUpcoming) {
         setBookNowBtnText("Book Now");
      } else {
         setBookNowBtnText("Registration Closed");
      }
   }, [isAlreadyBookedSession, isRegistrationOpen, isUpcoming]);

   const handleSessionBooking = async () => {
      const bookedData = {
         sessionId: session?._id,
         sessionTitle: session?.sessionTitle,
         sessionBannerImage: session?.sessionBannerImage,
         studentName: user?.userName,
         studentEmail: user?.userEmail,
         studentPhotoURL: user?.userPhotoURL,
         paymentStatus: session?.registrationFee !== 0 ? "incomplete" : "paid",
      };
      const { data: result } = await axiosPublic.post(
         "/all-booked-sessions",
         bookedData
      );
      if (result.success) {
         toast({
            variant: "success",
            description: `${result.message}`,
         });
         navigate("/dashboard/booked-sessions");
      } else {
         toast({
            variant: "error",
            description: `Error: ${result.message}`,
         });
      }
   };
   const {
      register,
      handleSubmit,
      control,
      reset,
      formState: { errors },
   } = useForm({
      mode: "onBlur",
      defaultValues: {
         review: "",
         rating: 0,
      },
   });
   const onSubmit = async (data) => {
      const reviewData = {
         ...data,
         sessionId: session?._id,
         studentName: user?.userName,
         studentEmail: user?.userEmail,
         studentPhotoURL: user?.userPhotoURL,
      };
      const { data: result } = await axiosPublic.post(
         "/add-review",
         reviewData
      );
      if (result.success) {
         refetchAlreadySubmitted();
         refetchReviews();
         reset();
         toast({
            variant: "success",
            description: `${result.message}`,
         });
      } else {
         toast({
            variant: "error",
            description: `Error: ${result.message}`,
         });
      }
   };

   const SessionDetailsSkeleton = () => (
      <div className='max-w-8xl mx-auto mt-10'>
         <h1 className='text-3xl font-bold mb-8'>
            <Skeleton className='w-48 h-8' />
         </h1>
         <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='md:col-span-2'>
               <Skeleton className='w-full h-64 mb-4' />
               <Skeleton className='w-3/4 h-8 mb-4' />
               <div className='flex items-center mb-4'>
                  <Skeleton className='w-16 h-4 mr-2' />
                  <Skeleton className='w-24 h-4' />
               </div>
               <Skeleton className='w-full h-4 mb-6' />
               <div className='grid grid-cols-2 gap-4 mb-6'>
                  {[...Array(6)].map((_, index) => (
                     <div key={index}>
                        <Skeleton className='w-2/3 h-4 mb-2' />
                        <Skeleton className='w-1/2 h-4' />
                     </div>
                  ))}
               </div>
               <Skeleton className='w-32 h-10 mb-4' />
            </div>

            {/* Tutor Profile */}
            <div>
               <Card>
                  <CardContent className='p-6 flex items-center'>
                     <Skeleton className='w-16 h-16 rounded-full mr-4' />
                     <div>
                        <Skeleton className='w-32 h-5 mb-2' />
                        <Skeleton className='w-24 h-4' />
                     </div>
                  </CardContent>
               </Card>
            </div>
         </div>

         {/* Review Section */}
         <div className='mt-12'>
            <h2 className='text-2xl font-bold mb-4'>
               <Skeleton className='w-24 h-6' />
            </h2>
            {[...Array(3)].map((_, index) => (
               <Card key={index} className='mb-4'>
                  <CardContent className='p-4'>
                     <div className='flex items-center justify-between mb-2'>
                        <Skeleton className='w-32 h-5' />
                        <Skeleton className='w-16 h-4' />
                     </div>
                     <Skeleton className='w-full h-4' />
                  </CardContent>
               </Card>
            ))}
         </div>
      </div>
   );
   return sessionLoading || authLoading ? (
      <SessionDetailsSkeleton />
   ) : (
      <div className='max-w-8xl mx-auto mt-10 space-y-12 px-4'>
         <h2 className='text-xl md:text-2xl lg:text-3xl font-bold mb-8 border-l-8 border-primary pl-3'>
            Session Details
         </h2>
         <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='md:col-span-2'>
               <img
                  src={
                     session.sessionBannerImage ||
                     "https://forum.apoglabs.com/uploads/db1788/original/2X/5/5b0cb2c6ae8868f08c47434948039be215c639a9.png"
                  }
                  alt={session?.sessionTitle}
                  loading='lazy'
                  className='w-full h-64 object-cover rounded-lg mb-4'
               />
               <h1 className='text-3xl font-bold mb-4'>
                  {session.sessionTitle}
               </h1>
               {averageRating ? (
                  <div className='flex items-center mb-4'>
                     <Rating
                        value={averageRating.averageRating}
                        readOnly
                        style={{ maxWidth: 100 }}
                     />
                     <span className='ml-2 text-sm text-muted-foreground'>
                        {averageRating.averageRating} Average Rating
                     </span>
                  </div>
               ) : null}
               <p className='text-muted-foreground mb-6'>
                  {session.sessionDescription}
               </p>
               <div className='grid grid-cols-2 gap-4 mb-6'>
                  <div>
                     <h3 className='font-semibold'>Registration Start Date</h3>
                     <p>
                        {formatInTimeZone(
                           session?.registrationStartDate || "",
                           "UTC",
                           "dd MMM yyyy"
                        )}
                     </p>
                  </div>
                  <div>
                     <h3 className='font-semibold'>Registration End Date</h3>
                     <p>
                        {formatInTimeZone(
                           session?.registrationEndDate || "",
                           "UTC",
                           "dd MMM yyyy"
                        )}
                     </p>
                  </div>
                  <div>
                     <h3 className='font-semibold'>Class Start Date</h3>
                     <p>
                        {formatInTimeZone(
                           session?.classStartDate || "",
                           "UTC",
                           "dd MMM yyyy"
                        )}
                     </p>
                  </div>
                  <div>
                     <h3 className='font-semibold'>Class End Date</h3>
                     <p>
                        {formatInTimeZone(
                           session?.classEndDate || "",
                           "UTC",
                           "dd MMM yyyy"
                        )}
                     </p>
                  </div>
                  <div>
                     <h3 className='font-semibold'>Session Duration</h3>
                     <p>{convertToHoursAndMinutes(session.sessionDuration)}</p>
                  </div>
                  <div>
                     <h3 className='font-semibold'>Registration Fee</h3>
                     <p>
                        {session.registrationFee === 0
                           ? "FREE"
                           : `$${session.registrationFee}`}
                     </p>
                  </div>
               </div>
               <Button
                  onClick={handleSessionBooking}
                  disabled={
                     !isRegistrationOpen ||
                     isUpcoming ||
                     sessionLoading ||
                     user?.userRole === "tutor" ||
                     user?.userRole === "admin" ||
                     authLoading ||
                     isAlreadyBookedSession
                  }>
                  {bookNowBtnText}
               </Button>
            </div>

            {/* Tutor Profile */}
            <div>
               <Card>
                  <CardContent className='p-6 flex items-center'>
                     <img
                        src={
                           session.tutorProfileImage ||
                           "https://img.freepik.com/premium-vector/user-icons-includes-user-icons-people-icons-symbols-premiumquality-graphic-design-elements_981536-526.jpg?semt=ais_hybrid"
                        }
                        alt={session.tutorName}
                        className='w-16 h-16 rounded-full mr-4 aspect-square object-cover object-center'
                     />
                     <div>
                        <h2 className='text-xl font-semibold'>
                           {session.tutorName}
                        </h2>
                        <p className='text-sm text-muted-foreground'>
                           {tutorAvailableSessionsCount?.count || 0} session(s)
                           available
                        </p>
                     </div>
                  </CardContent>
               </Card>
            </div>
         </div>

         {/* add review */}
         {showReview ? (
            <>
               <Separator />
               <Card className='max-w-md mx-auto'>
                  <CardHeader>
                     <CardTitle>Add Your Review</CardTitle>
                     <CardDescription>
                        How was the session? Let's share your opinion!!
                     </CardDescription>
                  </CardHeader>
                  <CardContent>
                     <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Rating Input */}
                        <div className='mb-3'>
                           <div id='rating_label'>
                              Rating<span className='text-red-500'>*</span>
                           </div>
                           <Controller
                              control={control}
                              name='rating'
                              rules={{
                                 validate: (rating) => rating > 0,
                              }}
                              render={({
                                 field: { onChange, onBlur, value },
                              }) => (
                                 <Rating
                                    value={value}
                                    isRequired
                                    onChange={onChange}
                                    style={{ maxWidth: 200 }}
                                    visibleLabelId='rating_label'
                                    onBlur={onBlur}
                                 />
                              )}
                           />
                           {errors.rating && (
                              <p className='text-red-500 text-sm mt-1'>
                                 Rating is required.
                              </p>
                           )}
                        </div>
                        {/* Review Input */}
                        <div className='mb-4'>
                           <label className='block font-medium text-sm mb-2'>
                              Your Review<span className='text-red-500'>*</span>
                           </label>
                           <Textarea
                              {...register("review", { required: true })}
                              placeholder='Write your review here...'
                           />
                           {errors.review && (
                              <p className='text-red-500 text-sm mt-1'>
                                 Review is required
                              </p>
                           )}
                        </div>
                        {/* Submit Button */}
                        <Button type='submit' className='w-full'>
                           Submit Review
                        </Button>
                     </form>
                  </CardContent>
               </Card>
               <Separator />
            </>
         ) : null}

         {/* Reviews Section */}
         {/*  TODO: add column to parent*/}
         {reviews && reviews.length > 0 ? (
            <div>
               <h2 className='text-2xl font-bold mb-4'>Reviews</h2>
               {reviews.map((review) => (
                  <Card key={review?._id} className='mb-4 max-w-md rounded-md'>
                     <CardContent className='p-4 space-y-2'>
                        <div className='flex gap-3 items-center'>
                           <img
                              src={review?.studentPhotoURL}
                              alt={review?.studentName}
                              referrerPolicy='no-referrer'
                              className='max-w-14 aspect-square object-cover object-center rounded-sm'
                           />
                           <div>
                              <h3 className='font-semibold'>
                                 {review?.studentName}
                              </h3>
                              <Rating
                                 value={review?.rating}
                                 readOnly
                                 style={{ maxWidth: 100 }}
                              />
                           </div>
                        </div>
                        <Separator />
                        <p className='text-muted-foreground'>
                           {review?.review}
                        </p>
                     </CardContent>
                  </Card>
               ))}
            </div>
         ) : null}
      </div>
   );
};

export default SessionDetails;
