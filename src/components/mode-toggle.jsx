import { useTheme } from "@/components/theme-provider";
import "@/components/mode-toggle.css";

export const ModeToggle = () => {
   const { theme, setTheme } = useTheme();
   const handleThemeChange = (event) => {
      setTheme(event.target.checked ? "light" : "dark");
   };
   return (
      <label htmlFor='switch' className='switch'>
         <input
            id='switch'
            type='checkbox'
            onChange={handleThemeChange}
            checked={theme === "light"}
         />
         <span className='slider'></span>
         <span className='decoration'></span>
      </label>
   );
};
