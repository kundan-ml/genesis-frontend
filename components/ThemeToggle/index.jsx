import { useTheme } from 'next-themes';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme(); // Get current theme and method to change it

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="p-3 bg-gray-800 text-white rounded-full shadow-lg transition-all duration-300"
      >
        {theme === 'light' ? (
          <FaMoon className="text-gray-300" />
        ) : (
          <FaSun className="text-yellow-500" />
        )}
      </button>
    </div>
  );
};

export default ThemeToggle;


// import { useTheme } from 'next-themes';
// import { FaSun, FaMoon } from 'react-icons/fa';
// import { useState, useEffect } from 'react';

// const ThemeToggle = () => {
//   const { theme, setTheme } = useTheme();
//   const [position, setPosition] = useState({ x: 20, y: 20 });
//   const [dragging, setDragging] = useState(false);
//   const [offset, setOffset] = useState({ x: 0, y: 0 });
//   const [isClick, setIsClick] = useState(true);

//   useEffect(() => {
//     const savedPosition = JSON.parse(localStorage.getItem('togglePosition'));
//     if (savedPosition) {
//       setPosition(savedPosition);
//     }
//   }, []);

//   const handleMouseDown = (e) => {
//     setDragging(true);
//     setIsClick(true);
//     setOffset({
//       x: e.clientX - position.x,
//       y: e.clientY - position.y,
//     });
//   };

//   const handleMouseMove = (e) => {
//     if (dragging) {
//       setIsClick(false);
//       const newPos = {
//         x: e.clientX - offset.x,
//         y: e.clientY - offset.y,
//       };
//       setPosition(newPos);
//     }
//   };

//   const handleMouseUp = () => {
//     if (dragging) {
//       setDragging(false);
//       localStorage.setItem('togglePosition', JSON.stringify(position));
//     }
//   };

//   useEffect(() => {
//     if (dragging) {
//       window.addEventListener('mousemove', handleMouseMove);
//       window.addEventListener('mouseup', handleMouseUp);
//     } else {
//       window.removeEventListener('mousemove', handleMouseMove);
//       window.removeEventListener('mouseup', handleMouseUp);
//     }
//     return () => {
//       window.removeEventListener('mousemove', handleMouseMove);
//       window.removeEventListener('mouseup', handleMouseUp);
//     };
//   }, [dragging]);

//   return (
//     <div
//       className="fixed z-50 cursor-grab active:cursor-grabbing"
//       style={{
//         left: `${position.x}px`,
//         top: `${position.y}px`,
//         transition: dragging ? 'none' : 'transform 0.2s ease-out',
//       }}
//       onMouseDown={handleMouseDown}
//       onMouseUp={() => {
//         if (isClick) {
//           setTheme(theme === 'dark' ? 'light' : 'dark'); // Only toggle if it's a click
//         }
//       }}
//     >
//       <button className="p-3 bg-gray-800 text-white rounded-full shadow-lg transition-all duration-300">
//         {theme === 'light' ? <FaMoon className="text-gray-300" /> : <FaSun className="text-yellow-500" />}
//       </button>
//     </div>
//   );
// };

// export default ThemeToggle;
