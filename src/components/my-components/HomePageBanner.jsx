import { Button } from "@/components/ui/button";
import ShineBorder from "@/components/ui/shine-border";
import { Link } from "react-router-dom";

const HomePageBanner = () => {
  return (
    <section className="relative bg-cover bg-center h-72 lg:h-96 min-h-fit lg:py-10 my-8 lg:my-12 flex items-center justify-center text-center bg-[url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')]">
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      <ShineBorder color="#fff">
        <div className="lg:backdrop-blur-sm bg-destructive/10 px-12 py-12 rounded-md">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Collaborate and Learn with Ease
          </h1>
          <p className="mt-4 md:text-lg text-gray-300">
            Streamline your study sessions, connect with tutors, and access
            valuable resources all in one place.
          </p>
          <Link to="all-sessions">
            <Button
              className="mt-6 bg-yellow-600 hover:bg-yellow-500"
              size="lg"
            >
              Browse Sessions
            </Button>
          </Link>
        </div>
      </ShineBorder>
    </section>
  );
};

export default HomePageBanner;
