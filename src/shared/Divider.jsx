export const Divider = ({ text }) => {
   return (
      <div className='relative flex items-center my-5'>
         <div className='flex-grow border-t border-input' />
         {text && <span className='mx-4 text-sm text-inherit'>{text}</span>}
         <div className='flex-grow border-t border-input' />
      </div>
   );
};
