import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const HomeSlider = () => {
  const slideInfos = [
    {
      id: 1,
      title: "Learn Anytime, Anywhere",
      description:
        "Join live study sessions with expert tutors and take control of your learning—anytime, anywhere.",
      image:
        "https://i.pinimg.com/736x/5d/d1/71/5dd1716b60f38882e9ee953a60934d56.jpg",
    },
    {
      id: 2,
      title: "Master New Skills with Expert Guidance",
      description:
        "Gain in-depth knowledge from top educators and level up your skills with personalized study sessions.",
      image:
        "https://i.pinimg.com/736x/8a/7c/c9/8a7cc9c6415fc3d92a02479256f25ba4.jpg",
    },
    {
      id: 3,
      title: "Your Learning, Your Way",
      description:
        "Flexible study options designed to fit your schedule. Learn at your pace with expert-led courses.",
      image:
        "https://i.pinimg.com/736x/e4/43/46/e44346215865ddaf3d3400f057281b7f.jpg",
    },
    {
      id: 4,
      title: "Empowering Students, One Session at a Time",
      description:
        "Connect with dedicated tutors and get the support you need to excel in your studies.",
      image:
        "https://i.pinimg.com/736x/0c/82/09/0c8209bfbaeb6dabf6b82299c0b501a5.jpg",
    },
    {
      id: 5,
      title: "Interactive Learning for a Brighter Future",
      description:
        "Engage with tutors, ask questions, and enhance your learning experience with interactive lessons.",
      image:
        "https://i.pinimg.com/736x/05/77/7c/05777c3d57033d87220fc416fc7a1448.jpg",
    },
    {
      id: 6,
      title: "The Smarter Way to Study",
      description:
        "From live classes to on-demand resources—everything you need to succeed in one place.",
      image:
        "https://i.pinimg.com/736x/89/ef/3f/89ef3f9b0f64041bc9ab05fd2b766876.jpg",
    },
  ];

  const [progress, setProgress] = useState(0);

  const swiperRef = useRef(null);
  useGSAP(() => {
    if (!swiperRef.current) return;
    const swiper = swiperRef.current;
    swiper.on("slideChangeTransitionStart", () => {
      const incomingSlide = `.swiper-slide:nth-child(${
        swiper.activeIndex + swiper.params.slidesPerView
      })`;
      gsap.fromTo(
        incomingSlide,
        { opacity: 0, x: 100, scale: 0.5 },
        { opacity: 1, x: 0, scale: 1, duration: 0.6, ease: "power2.out" }
      );
      gsap.fromTo(
        `${incomingSlide} .slide-item`,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.2,
          ease: "power2.out",
          stagger: 0.2,
        }
      );
    });
  }, []);

  return (
    <section className="py-8 lg:py-12 max-w-8xl mx-auto px-5 xl:px-0">
      <Swiper
        allowTouchMove={false}
        modules={[Autoplay]}
        autoplay={{ delay: 5000 }}
        loop
        breakpoints={{
          375: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          1024: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
        }}
        className="rounded-md relative"
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={({ realIndex, slides }) =>
          setProgress(((realIndex + 1) / slides.length) * 100)
        }
      >
        {slideInfos.map(({ id, description, image, title }) => (
          <SwiperSlide key={id}>
            <div
              className="min-h-72 flex flex-col items-center justify-center bg-cover rounded-md relative after:absolute after:inset-0 after:bg-secondary/60 z-10 after:-z-10 p-5 text-center"
              style={{ backgroundImage: `url(${image})` }}
            >
              <h2 className="slide-item text-xl lg:text-2xl font-bold uppercase">
                {title}
              </h2>
              <p className="slide-item mt-2">{description}</p>
            </div>
          </SwiperSlide>
        ))}

        {/* navigation buttons */}
        <div className="absolute top-5 right-5 z-20 space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <ArrowLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => swiperRef.current?.slideNext()}
          >
            <ArrowRight />
          </Button>
        </div>

        {/* progress indicator */}
        <div className="absolute right-0 bg-secondary top-0 bottom-0 w-1.5 z-20">
          <div
            className="bg-destructive transition-all"
            style={{ height: `${progress}%` }}
          ></div>
        </div>
      </Swiper>
    </section>
  );
};

export default HomeSlider;
