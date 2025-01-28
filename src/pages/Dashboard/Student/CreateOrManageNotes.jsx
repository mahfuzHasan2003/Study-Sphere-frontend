import { useState } from "react";
import {
   Card,
   CardContent,
   CardFooter,
   CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit2, Trash2, Eye } from "lucide-react";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useFetchForGet } from "@/hooks/useFetchForGet";
import useAuth from "@/hooks/useAuth";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { Helmet } from "react-helmet";

export default function CreateOrManageNotes() {
   const { user } = useAuth();
   const axiosSecure = useAxiosSecure();

   const {
      isLoading,
      data: studentNotes = [],
      refetch,
   } = useFetchForGet(
      "secure",
      ["student_notes"],
      `/student-notes/${user?.email}`,
      {
         enabled: !!user?.email,
      }
   );

   const [newNote, setNewNote] = useState({
      title: "",
      description: "",
   });

   const [editingNote, setEditingNote] = useState(null);
   const [viewingNote, setViewingNote] = useState(null);
   const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
   const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

   // create new note
   const handleCreateNote = async (e) => {
      e.preventDefault();
      if (!newNote.title || !newNote.description) return;
      try {
         await axiosSecure.post("/student-notes", {
            title: newNote.title,
            date: new Date().toISOString(),
            description: newNote.description,
            email: user?.email,
         });
         setNewNote({ title: "", description: "" });
         setIsCreateDialogOpen(false);
         refetch();
      } catch (error) {
         console.error("Error creating note", error);
      }
   };

   // delete a note
   const handleDelete = async (id) => {
      try {
         await axiosSecure.delete(`delete-note/${id}`);
         refetch();
      } catch (error) {
         console.error("Error deleting note", error);
      }
   };

   // edit a note
   const handleEdit = (id) => {
      const noteToEdit = studentNotes.find((note) => note._id === id);
      setEditingNote(noteToEdit);
      setIsEditDialogOpen(true);
   };
   const handleSaveEdit = async (e) => {
      e.preventDefault();
      if (!editingNote.title || !editingNote.description) return;
      try {
         await axiosSecure.patch(
            `/update-note/${editingNote._id}`,
            editingNote
         );
         setEditingNote(null);
         setIsEditDialogOpen(false);
         refetch();
      } catch (error) {
         console.error("Error updating note", error);
      }
   };

   const handleView = (id) => {
      const noteToView = studentNotes.find((note) => note._id === id);
      setViewingNote(noteToView);
      setIsViewDialogOpen(true);
   };

   return (
      <div className=''>
         <Helmet>
            <title> Create & manage Notes | Dashboard - Study Sphere </title>
         </Helmet>
         <h2 className='text-xl md:text-2xl lg:text-3xl font-bold mb-8 border-l-8 border-primary pl-3'>
            Create and manage your notes
         </h2>
         <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6'>
            {/* Create New Note */}
            <Dialog
               open={isCreateDialogOpen}
               onOpenChange={setIsCreateDialogOpen}>
               <DialogTrigger asChild>
                  <Card className='border-2 border-dashed border-muted hover:border-muted-foreground transition-colors cursor-pointer'>
                     <CardContent className='flex flex-col items-center justify-center h-[200px]'>
                        <PlusCircle className='h-12 w-12 text-muted-foreground' />
                        <p className='mt-4 text-lg font-medium text-muted-foreground'>
                           Create New Note
                        </p>
                     </CardContent>
                  </Card>
               </DialogTrigger>
               <DialogContent>
                  <DialogHeader>
                     <DialogTitle>Create New Note</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateNote} className='space-y-4'>
                     <div className='space-y-2'>
                        <Label htmlFor='title'>Title</Label>
                        <Input
                           id='title'
                           value={newNote.title}
                           onChange={(e) =>
                              setNewNote({ ...newNote, title: e.target.value })
                           }
                           placeholder='Enter note title'
                           required
                        />
                     </div>
                     <div className='space-y-2'>
                        <Label htmlFor='description'>Description</Label>
                        <Textarea
                           id='description'
                           value={newNote.description}
                           onChange={(e) =>
                              setNewNote({
                                 ...newNote,
                                 description: e.target.value,
                              })
                           }
                           placeholder='Enter note description'
                           required
                        />
                     </div>
                     <Button type='submit' className='w-full'>
                        Create Note
                     </Button>
                  </form>
               </DialogContent>
            </Dialog>

            {/* showing student Notes */}
            {/* skeleton when data in loading state */}
            {(isLoading || !user) &&
               Array(4)
                  .fill()
                  .map((_, index) => (
                     <Card key={index} className='relative'>
                        <CardHeader className='pb-2'>
                           <div className='absolute top-3 right-3 flex gap-2'>
                              <Skeleton className='h-8 w-8 rounded-full' />
                              <Skeleton className='h-8 w-8 rounded-full' />
                              <Skeleton className='h-8 w-8 rounded-full' />
                           </div>
                        </CardHeader>
                        <CardContent className='pt-8'>
                           <Skeleton className='h-6 w-3/4 mb-2' />
                           <Skeleton className='h-4 w-full mb-1' />
                           <Skeleton className='h-4 w-full mb-1' />
                           <Skeleton className='h-4 w-2/3' />
                        </CardContent>
                        <CardFooter>
                           <Skeleton className='h-4 w-1/3' />
                        </CardFooter>
                     </Card>
                  ))}
            {/* show notes after fetching */}
            {!isLoading &&
               studentNotes.map((note) => (
                  <Card key={note._id} className='relative'>
                     <CardHeader className='pb-2'>
                        <div className='absolute top-3 right-3 flex gap-2'>
                           {/* view button and dialog */}
                           <Dialog
                              open={isViewDialogOpen}
                              onOpenChange={setIsViewDialogOpen}>
                              <DialogTrigger asChild>
                                 <Button
                                    variant='ghost'
                                    size='icon'
                                    onClick={() => handleView(note._id)}>
                                    <Eye className='h-4 w-4' />
                                 </Button>
                              </DialogTrigger>
                              <DialogContent>
                                 <DialogHeader>
                                    <DialogTitle>
                                       {viewingNote?.title}
                                    </DialogTitle>
                                 </DialogHeader>
                                 <div className='mt-4'>
                                    <p className='text-sm text-muted-foreground'>
                                       {viewingNote?.description}
                                    </p>
                                    <p className='text-sm text-muted-foreground mt-4'>
                                       {viewingNote?.date}
                                    </p>
                                 </div>
                              </DialogContent>
                           </Dialog>

                           {/* edit button and dialog */}
                           <Dialog
                              open={isEditDialogOpen}
                              onOpenChange={setIsEditDialogOpen}>
                              <DialogTrigger asChild>
                                 <Button
                                    variant='ghost'
                                    size='icon'
                                    onClick={() => handleEdit(note._id)}>
                                    <Edit2 className='h-4 w-4' />
                                 </Button>
                              </DialogTrigger>
                              <DialogContent>
                                 <DialogHeader>
                                    <DialogTitle>Edit Note</DialogTitle>
                                 </DialogHeader>
                                 <form
                                    onSubmit={handleSaveEdit}
                                    className='space-y-4'>
                                    <div className='space-y-2'>
                                       <Label htmlFor='edit-title'>Title</Label>
                                       <Input
                                          id='edit-title'
                                          value={editingNote?.title || ""}
                                          onChange={(e) =>
                                             setEditingNote({
                                                ...editingNote,
                                                title: e.target.value,
                                             })
                                          }
                                          placeholder='Enter note title'
                                          required
                                       />
                                    </div>
                                    <div className='space-y-2'>
                                       <Label htmlFor='edit-description'>
                                          Description
                                       </Label>
                                       <Textarea
                                          id='edit-description'
                                          value={editingNote?.description || ""}
                                          onChange={(e) =>
                                             setEditingNote({
                                                ...editingNote,
                                                description: e.target.value,
                                             })
                                          }
                                          placeholder='Enter note description'
                                          required
                                       />
                                    </div>
                                    <Button type='submit' className='w-full'>
                                       Save Changes
                                    </Button>
                                 </form>
                              </DialogContent>
                           </Dialog>

                           <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => handleDelete(note._id)}>
                              <Trash2 className='h-4 w-4' />
                           </Button>
                        </div>
                     </CardHeader>
                     <CardContent className='pt-8'>
                        <h3 className='font-medium text-lg'>{note.title}</h3>
                        <p className='text-sm text-muted-foreground mt-2'>
                           {note.description}
                        </p>
                     </CardContent>
                     <CardFooter>
                        <p className='text-sm text-muted-foreground'>
                           {format(note.date, "dd MMM, yyyy")}
                        </p>
                     </CardFooter>
                  </Card>
               ))}
         </div>
      </div>
   );
}
