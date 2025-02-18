import { useFetchForGet } from "@/hooks/useFetchForGet";
import TutorCard from "./TutorCard";
import Marquee from "react-fast-marquee";
import { useEffect, useState } from "react";
import Color from "color";
import { Link } from "react-router-dom";

const TutorSection = () => {
  const [themeBG, setThemeBG] = useState("255, 255, 255");
  useEffect(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    const primaryBGColorHSL = rootStyles
      .getPropertyValue("--background")
      .trim();
    const primaryBGColorRGB = Color(`hsl(${primaryBGColorHSL})`).rgb().string();
    setThemeBG(primaryBGColorRGB);
  }, []);
  const { data: tutors = [] } = useFetchForGet(
    "public",
    ["topTutors"],
    "/top-tutors"
  );

  return (
    <section className="py-12 max-w-8xl mx-auto px-5 xl:px-0">
      <h2 className="text-3xl font-bold text-center">
        🤝Meet Our Expert Tutors
      </h2>
      <p className="text-muted-foreground text-center mt-2">
        Explore our team of skilled tutors, each dedicated to helping you
        achieve your goals. Learn, grow, and succeed with personalized guidance
        from the best in the field!
      </p>
      <div className="mt-5">
        <Marquee
          gradient={true}
          gradientColor={themeBG}
          pauseOnHover={true}
          speed={20}
        >
          {tutors.map((tutor) => (
            <Link to={`tutor/${tutor?.userEmail}/sessions`} key={tutor?._id}>
              <TutorCard tutor={tutor} className="mx-2" />
            </Link>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default TutorSection;
