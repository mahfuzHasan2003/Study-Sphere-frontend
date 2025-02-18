import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import useAuth from "@/hooks/useAuth";
import DatePickerField from "@/shared/DatePickerField";
import { uploadToImageBB } from "@/utilities/uploadToImageBB";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import DataLoader from "@/shared/DataLoader";
import { Helmet } from "react-helmet";

const CreateStudySession = () => {
  const [sessionUploading, setSessionUploading] = useState(false);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    clearErrors,
    setError,
  } = useForm();
  const [imagePreview, setImagePreview] = useState(null);
  const registrationStartDate = watch("registrationStartDate");
  const registrationEndDate = watch("registrationEndDate");
  const classStartDate = watch("classStartDate");

  const onSubmit = async (data) => {
    setSessionUploading(true);
    const {
      sessionTitle,
      sessionDescription,
      sessionDuration,
      registrationStartDate,
      registrationEndDate,
      classStartDate,
      classEndDate,
    } = data;

    // upload the image to imagebb
    const sessionBannerImage = await uploadToImageBB(data.sessionImage[0]);

    // post data to database
    const { data: result } = await axiosSecure.post("/add-study-session", {
      sessionTitle,
      sessionDescription,
      sessionDuration,
      registrationStartDate,
      registrationEndDate,
      classStartDate,
      classEndDate,
      sessionBannerImage,
      tutorName: user?.displayName,
      tutorProfileImage: user?.photoURL,
      tutorEmail: user?.email,
      registrationFee: 0,
      status: "pending",
    });

    if (result.success) {
      toast({
        variant: "success",
        description: `${result.message}`,
      });
      navigate("/dashboard/tutor-sessions");
    } else {
      toast({
        variant: "error",
        description: `Error: ${result.message}`,
      });
    }
    setSessionUploading(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      clearErrors("sessionImage");
    } else {
      setImagePreview(null);
      setError("sessionImage", {
        type: "manual",
        message: "Session image is required",
      });
    }
  };

  return (
    <div>
      <Helmet>
        <title> Add Session | Dashboard - Study Sphere </title>
      </Helmet>
      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 border-l-8 border-primary pl-3">
        Create session
      </h2>
      <p className="text-muted-foreground mb-8">
        Create study session, set schedules, and provide necessary materials to
        ensure a seamless learning experience for students.
      </p>
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardDescription>
            Fill in the details to create a new tutoring session.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-wrap gap-6 *:min-w-60">
              <div>
                <Label>Tutor Name</Label>
                <Input
                  type="text"
                  value={user?.displayName}
                  disabled
                  className="w-full"
                />
              </div>
              <div>
                <Label>Tutor Email</Label>
                <Input
                  type="email"
                  value={user?.email}
                  disabled
                  className="w-full"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="sessionTitle">
                Session Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="sessionTitle"
                {...register("sessionTitle", {
                  required: "Session title is required",
                  minLength: {
                    value: 10,
                    message:
                      "Session title must be at least 10 characters long",
                  },
                })}
                className="w-full"
              />
              {errors.sessionTitle && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.sessionTitle.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="sessionDescription">
                Session Description
                <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="sessionDescription"
                {...register("sessionDescription", {
                  required: "Session description is required",
                  minLength: {
                    value: 50,
                    message: "Description is too short",
                  },
                })}
                className="w-full  min-h-[150px] resize-y"
              />
              {errors.sessionDescription && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.sessionDescription.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="sessionImage">
                Session Image <span className="text-red-500">*</span>
              </Label>
              <Input
                id="sessionImage"
                type="file"
                accept="image/*"
                {...register("sessionImage", {
                  required: "Session image is required",
                  validate: {
                    lessThan10MB: (files) =>
                      files[0]?.size < 10000000 || "Max 10MB",
                    acceptedFormats: (files) =>
                      ["image/jpeg", "image/png", "image/gif"].includes(
                        files[0]?.type
                      ) || "Only PNG, JPEG and GIF",
                  },
                })}
                onChange={handleImageChange}
                className="w-full"
              />
              {errors.sessionImage && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.sessionImage.message}
                </p>
              )}
              {imagePreview && (
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  className="mt-2 max-w-xs"
                />
              )}
            </div>

            <div className="flex flex-wrap gap-6 *:min-w-60">
              <DatePickerField
                name="registrationStartDate"
                label="Registration Start Date"
                control={control}
                errors={errors}
              />
              <DatePickerField
                name="registrationEndDate"
                label="Registration End Date"
                control={control}
                errors={errors}
                minDate={registrationStartDate}
              />
              <DatePickerField
                name="classStartDate"
                label="Class Start Date"
                control={control}
                errors={errors}
                minDate={registrationEndDate}
              />
              <DatePickerField
                name="classEndDate"
                label="Class End Date"
                control={control}
                errors={errors}
                minDate={classStartDate}
              />
              <div>
                <Label htmlFor="sessionDuration">
                  Session Duration (minutes){" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="sessionDuration"
                  type="number"
                  {...register("sessionDuration", {
                    required: "Session duration is required",
                    min: {
                      value: 30,
                      message: "Duration must be at least 30 minutes",
                    },
                  })}
                  className="w-full"
                />
                {errors.sessionDuration && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.sessionDuration.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="registrationFee">Registration Fee</Label>
                <Input
                  id="registrationFee"
                  type="number"
                  value="0"
                  disabled
                  className="w-full"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={sessionUploading}
            >
              {sessionUploading ? (
                <DataLoader text="Uploading session..." />
              ) : (
                "Create Session"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateStudySession;
