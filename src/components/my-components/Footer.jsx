const Footer = () => {
   return (
      <footer className='bg-gray-800 text-white py-6'>
         <div className='max-w-8xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center'>
            <p className='text-sm'>© 2025 Study Sphere. All rights reserved.</p>
            <div className='flex space-x-4 mt-4 sm:mt-0'>
               <a href='#' className='text-sm text-gray-300 hover:text-white'>
                  Privacy Policy
               </a>
               <a href='#' className='text-sm text-gray-300 hover:text-white'>
                  Terms of Service
               </a>
               <a href='#' className='text-sm text-gray-300 hover:text-white'>
                  Contact Us
               </a>
            </div>
         </div>
      </footer>
   );
};

export default Footer;
