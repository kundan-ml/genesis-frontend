// import React, { useEffect } from 'react';

// const AIBackground = () => {
//   useEffect(() => {
//     const canvas = document.getElementById('bg-canvas');
//     const ctx = canvas.getContext('2d');

//     let particlesArray = [];
//     const colors = ['#ff6ec4', '#7873f5', '#00FFC6', '#ff5e6e', '#41f4a2', '#00ff8c'];

//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;

//     window.addEventListener('resize', () => {
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;
//       init();
//     });

//     function Particle(x, y, directionX, directionY, size, color) {
//       this.x = x;
//       this.y = y;
//       this.directionX = directionX;
//       this.directionY = directionY;
//       this.size = size;
//       this.color = color;
//       this.opacity = Math.random();

//       this.draw = function () {
//         ctx.beginPath();
//         ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
//         ctx.fillStyle = `rgba(${parseInt(this.color.slice(1, 3), 16)}, 
//                               ${parseInt(this.color.slice(3, 5), 16)}, 
//                               ${parseInt(this.color.slice(5, 7), 16)}, ${this.opacity})`;
//         ctx.fill();
//       };

//       this.update = function () {
//         if (this.x + this.size > canvas.width || this.x - this.size < 0) {
//           this.directionX = -this.directionX;
//         }
//         if (this.y + this.size > canvas.height || this.y - this.size < 0) {
//           this.directionY = -this.directionY;
//         }
//         this.x += this.directionX;
//         this.y += this.directionY;

//         this.draw();
//       };
//     }

//     function init() {
//       particlesArray = [];
//       const numberOfParticles = (canvas.width * canvas.height) / 8000;
//       for (let i = 0; i < numberOfParticles; i++) {
//         const size = Math.random() * 10 + 1; // Larger particles
//         const x = Math.random() * (innerWidth - size * 2);
//         const y = Math.random() * (innerHeight - size * 2);
//         const directionX = (Math.random() * 0.6) - 0.3; // Faster movement
//         const directionY = (Math.random() * 0.6) - 0.3; // Faster movement
//         const color = colors[Math.floor(Math.random() * colors.length)];

//         particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
//       }
//     }

//     function animate() {
//       requestAnimationFrame(animate);
//       ctx.clearRect(0, 0, innerWidth, innerHeight);

//       particlesArray.forEach(particle => particle.update());
//     }

//     init();
//     animate();
//   }, []);

//   return (
//     <div style={styles.container}>
//       <canvas id="bg-canvas" style={styles.canvas}></canvas>
//       <div style={styles.overlay}></div>
//       <div style={styles.content}>
//         <h1 style={styles.title}>AI & ML Innovations</h1>
//         <p style={styles.subtitle}>Revolutionizing the Future with Artificial Intelligence</p>
//         <div style={styles.circle}></div>
//         <div style={styles.glowingLines}></div>
//         <div style={styles.sparkles}></div>
//         <div style={styles.floatingShapes}></div> {/* Add floating shapes */}
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     position: 'relative',
//     width: '100%',
//     height: '100vh',
//     background: 'radial-gradient(circle at center, #000000 0%, #1b1b1b 100%)',
//     overflow: 'hidden',
//   },
//   canvas: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     width: '100%',
//     height: '100%',
//     zIndex: 1,
//   },
//   overlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     width: '100%',
//     height: '100%',
//     background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.3))',
//     zIndex: 2,
//   },
//   content: {
//     position: 'relative',
//     zIndex: 3,
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//     textAlign: 'center',
//     height: '100%',
//     animation: 'fadeIn 2s ease-in-out forwards',
//   },
//   title: {
//     fontSize: '4rem',
//     fontWeight: 'bold',
//     background: 'linear-gradient(90deg, #ff6ec4, #7873f5)',
//     WebkitBackgroundClip: 'text',
//     color: 'transparent',
//     textShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
//     marginBottom: '0.5rem',
//     animation: 'slideIn 1.5s ease-in-out forwards',
//   },
//   subtitle: {
//     fontSize: '1.8rem',
//     color: '#fff',
//     textShadow: '0 0 15px rgba(255, 255, 255, 0.3)',
//     marginTop: '1rem',
//   },
//   circle: {
//     width: '150px',
//     height: '150px',
//     borderRadius: '50%',
//     border: '3px solid transparent',
//     borderImage: 'linear-gradient(45deg, #ff6ec4, #7873f5) 1',
//     animation: 'spin 10s linear infinite',
//     marginTop: '3rem',
//     boxShadow: '0 0 30px rgba(255, 255, 255, 0.5)',
//   },
//   glowingLines: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     width: '500px',
//     height: '2px',
//     background: 'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 100%)',
//     transform: 'translate(-50%, -50%) rotate(45deg)',
//     animation: 'glow 3s ease-in-out infinite alternate',
//     zIndex: 4,
//   },
//   sparkles: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     width: '100%',
//     height: '100%',
//     background: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%23FF6EC4\' width=\'15\' height=\'15\'><circle cx=\'12\' cy=\'12\' r=\'1\'/></svg>")',
//     backgroundRepeat: 'no-repeat',
//     backgroundSize: '15px 15px',
//     opacity: 0.5,
//     pointerEvents: 'none',
//     animation: 'sparkle 1.5s ease-in-out infinite',
//     zIndex: 5,
//   },
//   floatingShapes: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     width: '300px',
//     height: '300px',
//     background: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\' fill=\'%23FF6EC4\'><circle cx=\'50\' cy=\'50\' r=\'20\'/></svg>")',
//     backgroundSize: '100px 100px',
//     opacity: 0.3,
//     pointerEvents: 'none',
//     animation: 'float 5s ease-in-out infinite',
//     zIndex: 4,
//     transform: 'translate(-50%, -50%)',
//   },
// };

// export default AIBackground;





import React from 'react'
import { motion } from 'framer-motion'

const AIBackground = () => {
  return (
    <section>
      <motion.div
            initial={{ scale: 1.2, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className=" w-[100%] h-[100vh] inset-0 opacity-10 overflow-hidden"
          >
            <video
              className="w-full h-full object-cover"
              src="/Video/network.mp4" // Replace with your video URL
              autoPlay
              loop
              muted
              playsInline
            />
          </motion.div>
    </section>
  )
}

export default AIBackground