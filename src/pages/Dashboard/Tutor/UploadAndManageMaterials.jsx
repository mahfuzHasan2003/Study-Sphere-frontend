import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MoreVertical,
  Upload,
  Copy,
  ExternalLink,
  Trash2,
  Edit,
} from "lucide-react";
import { uploadToImageBB } from "@/utilities/uploadToImageBB";
import { useFetchForGet } from "@/hooks/useFetchForGet";
import useAuth from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { groupMaterialsBySessionId } from "@/utilities/groupMaterialsBySessionId";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import DataLoader from "@/shared/DataLoader";
import { Helmet } from "react-helmet";

function Modal({ isOpen, onClose, title, children }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{children}</DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
export default function UploadAndManageMaterials() {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedMaterilId, setSelectedMaterilId] = useState(null);
  const [groupedMaterials, setGroupedMaterials] = useState([]);
  const navigate = useNavigate();
  const [materialUploadLoading, setMaterilUploadLoading] = useState(false);

  // getting approved sessions
  const { data: approvedSessions = [] } = useFetchForGet(
    "secure",
    ["approvedTutorSessions"],
    `/tutor-study-sessions?email=${user?.email}&status=approved`,
    { enabled: !!user?.email }
  );
  // getting material of selected tutor
  const { data: tutorMaterials = [], refetch: refetchMaterials } =
    useFetchForGet(
      "secure",
      ["tutorMaterials"],
      `/get-tutor-materials/${user?.email}`,
      { enabled: !!user?.email }
    );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
    clearErrors,
  } = useForm();
  const materialFor = watch("materialFor");
  useEffect(() => {
    if (materialFor) {
      clearErrors("materialFor");
    }
    if (!isUploadDialogOpen) {
      reset();
      setValue("materialFor", null);
    }
    setGroupedMaterials(groupMaterialsBySessionId(tutorMaterials));
  }, [
    clearErrors,
    isUploadDialogOpen,
    materialFor,
    reset,
    setValue,
    tutorMaterials,
  ]);

  // adding new material
  const onSubmit = async (data) => {
    setMaterilUploadLoading(true);
    const materialCoverImage = await uploadToImageBB(
      data?.materialCoverImage[0]
    );
    const { data: result } = await axiosSecure.post("/upload-a-new-material", {
      sessionId: data?.materialFor,
      tutorEmail: user?.email,
      materialTitle: data?.materialTitle,
      materialCoverImage,
      materialDriveLink: data?.materialDriveLink,
    });
    setIsUploadDialogOpen(false);
    if (result.success) {
      refetchMaterials();
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
    setMaterilUploadLoading(false);
  };

  // delete a material
  const handleDeleteMaterial = async () => {
    const { data: result } = await axiosSecure.delete(
      `/delete-material/${selectedMaterilId}`
    );
    if (result.success) {
      refetchMaterials();
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
    setSelectedSession(null);
  };

  // copy link
  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link);
    toast({
      description: "Link copied to clipboard",
    });
  };

  return (
    <div className="container mx-auto p-4">
      <Helmet>
        <title> Upload & manage materials | Dashboard - Study Sphere </title>
      </Helmet>
      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 border-l-8 border-primary pl-3">
        Manage materials
      </h2>
      <p className="text-muted-foreground mb-8">
        Upload materials for your approved sessions and manage them in one
        place.
      </p>

      {approvedSessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Static upload card */}
          <Dialog
            open={isUploadDialogOpen}
            onOpenChange={setIsUploadDialogOpen}
          >
            <DialogTrigger asChild>
              <Card className="border-2 border-dashed border-muted hover:border-muted-foreground transition-colors cursor-pointer">
                <CardContent className="flex flex-col items-center justify-center h-[200px]">
                  <Upload className="h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-lg font-medium text-muted-foreground">
                    Upload a new material
                  </p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Material</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4"
                  noValidate
                >
                  <div>
                    <Label htmlFor="session">
                      Session<span className="text-red-500"> *</span>
                    </Label>
                    <Select
                      {...register("materialFor", {
                        required: "Session selection is required.",
                      })}
                      onValueChange={(value) => setValue("materialFor", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a session" />
                      </SelectTrigger>
                      <SelectContent>
                        {approvedSessions?.map((session) => (
                          <SelectItem key={session?._id} value={session?._id}>
                            {session?.sessionTitle}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {!materialFor && (
                      <p className="text-red-500 text-sm mt-1">
                        Session is required.
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="title">
                      Title<span className="text-red-500"> *</span>
                    </Label>
                    <Input
                      id="title"
                      {...register("materialTitle", {
                        required: "Material Title is required.",
                      })}
                      placeholder="Enter material title"
                    />
                    {errors.materialTitle && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.materialTitle.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="image">
                      Image<span className="text-red-500"> *</span>
                    </Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      {...register("materialCoverImage", {
                        required: "Image as material cover is required.",
                      })}
                    />
                    {errors.materialCoverImage && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.materialCoverImage.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="link">
                      Link (Google Drive)
                      <span className="text-red-500"> *</span>
                    </Label>
                    <Input
                      id="link"
                      placeholder="Enter material link"
                      {...register("materialDriveLink", {
                        required: "Link is required.",
                        pattern: {
                          value:
                            /^(https?:\/\/)?(www\.)?drive\.google\.com\/.+$/,
                          message: "Invalid Google Drive link.",
                        },
                      })}
                    />
                    {errors.materialDriveLink && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.materialDriveLink.message}
                      </p>
                    )}
                  </div>
                  <div className="text-end">
                    <Button type="submit" disabled={materialUploadLoading}>
                      {materialUploadLoading ? (
                        <DataLoader text="Uploading.." />
                      ) : (
                        "Upload"
                      )}
                    </Button>
                  </div>
                </form>
              </DialogDescription>
            </DialogContent>
          </Dialog>

          {/* Dynamic material cards */}
          {groupedMaterials?.map((matWithDetails) => (
            <Card key={matWithDetails?.sessionId}>
              <CardHeader>
                <CardTitle>{matWithDetails?.sessionTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{matWithDetails?.materials?.length} material(s) uploaded</p>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => {
                    setSelectedSession(matWithDetails);
                  }}
                >
                  View Materials
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-red-500 mt-10">
          Please add a session first and wait for admin verification to upload
          materials. Thank you!! 😊
        </p>
      )}

      {/* Modal for viewing session materials */}
      {selectedSession && (
        <Modal
          isOpen={!!selectedSession}
          onClose={() => setSelectedSession(null)}
          title={`Materials for ${selectedSession?.sessionTitle}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
            {selectedSession?.materials?.map((material) => (
              <Card key={material._id} className="rounded-md">
                <CardHeader className="px-4 pb-0 pt-4">
                  <CardTitle className="flex justify-between items-center gap-2">
                    <span>{material?.materialTitle}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <MoreVertical className="h-4 w-8 cursor-pointer" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            handleCopyLink(material?.materialDriveLink)
                          }
                        >
                          <Copy className="mr-2 h-4 w-4" /> Copy Link
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            window.open(material?.materialDriveLink, "_blank")
                          }
                        >
                          <ExternalLink className="mr-2 h-4 w-4" /> Open
                          Material
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            navigate(
                              `/dashboard/update-material/${material._id}`
                            );
                            setSelectedSession(null);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Update Material
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedMaterilId(material._id);
                            setIsConfirmDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4 text-red-500" />{" "}
                          <span className="text-red-500">Delete Material</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {/* delete confirmation dialog */}
                    <Dialog
                      className="z-50"
                      open={isConfirmDeleteDialogOpen}
                      onOpenChange={setIsConfirmDeleteDialogOpen}
                    >
                      <DialogContent>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete this material? This
                          action cannot be undone.
                        </DialogDescription>
                        <DialogFooter>
                          <Button
                            variant="secondary"
                            onClick={() => setIsConfirmDeleteDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => {
                              handleDeleteMaterial();
                              setIsConfirmDeleteDialogOpen(false);
                              setSelectedMaterilId(null);
                            }}
                          >
                            Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <img
                    loading="lazy"
                    src={material.materialCoverImage || "/placeholder.svg"}
                    alt={material.sessionTitle}
                    className="w-full max-h-24 object-cover"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
