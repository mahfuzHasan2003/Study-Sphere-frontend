import useAuth from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { ModeToggle } from "../mode-toggle";
import UserAvatar from "@/shared/UserAvatar";
import { useToast } from "@/hooks/use-toast";

const NavBar = () => {
  const { user, signOutUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  return (
    <div className="py-3 px-5 fixed top-0 z-10 backdrop-blur-lg w-full bg-background/40">
      <div className="flex items-center justify-between max-w-8xl mx-auto">
        <Link to="/">
          <h4 className="text-xl md:text-2xl font-semibold">StudySphere</h4>
        </Link>
        <div className="hidden md:inline-flex items-center gap-3">
          <span>Dark</span>
          <ModeToggle />
          <span>Light</span>
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link to="dashboard">
                <Button>Dashboard</Button>
              </Link>
              <Button
                variant="destructive"
                onClick={() => {
                  signOutUser()
                    .then(() => {
                      toast({
                        variant: "success",
                        description: `Logout Success!`,
                      });
                      navigate("/");
                    })
                    .catch((err) =>
                      toast({
                        variant: "error",
                        description: `Logout Failed : ${err.message}`,
                      })
                    );
                }}
                className="hidden md:inline-flex"
              >
                Log Out
              </Button>
              <UserAvatar
                userName={user.displayName}
                imageURL={user.photoURL}
              />
            </>
          ) : (
            <div>
              <Link to="/auth/signin">
                <Button>Sign In</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
