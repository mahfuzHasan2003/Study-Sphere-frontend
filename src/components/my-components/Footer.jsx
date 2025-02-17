const Footer = () => {
  return (
    <footer className="bg-secondary py-6 mt-10">
      <div className="max-w-8xl mx-auto px-5 xl:px-0 flex flex-col sm:flex-row justify-between items-center">
        <p className="text-sm">© 2025 Study Sphere. All rights reserved.</p>
        <div className="flex space-x-4 mt-4 sm:mt-0">
          <a
            href="#"
            className="text-sm opacity-70 hover:opacity-100 hover:underline"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-sm opacity-70 hover:opacity-100 hover:underline"
          >
            Terms of Service
          </a>
          <a
            href="https://www.linkedin.com/in/mahfuzhasan2003/"
            className="text-sm opacity-70 hover:opacity-100 hover:underline"
            target="_blank"
          >
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
