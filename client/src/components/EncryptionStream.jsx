import { useEffect, useRef } from "react";

function EncryptionStream() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = 300;

    const characters = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ🔐🔓🔗⚡";
    const fontSize = 14;
    const columns = width / fontSize;
    const drops = [];

    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    function draw() {
      ctx.fillStyle = "rgba(10, 11, 16, 0.05)";
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < drops.length; i++) {
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Interaction: Change color near mouse
        const dx = x - mouse.current.x;
        const dy = y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          ctx.fillStyle = "#fff";
          ctx.font = (fontSize + 4) + "px Outfit";
        } else {
          ctx.fillStyle = "#00f2fe";
          ctx.font = fontSize + "px Outfit";
        }

        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, x, y);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    const interval = setInterval(draw, 33);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      const newColumns = width / fontSize;
      if (newColumns > drops.length) {
        for (let i = drops.length; i < newColumns; i++) drops[i] = 1;
      }
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="encryption-stream-container">
      <div className="stream-overlay">
        <h2>Global Security Heartbeat</h2>
        <p>Your privacy is secured by a living network of decentralized nodes.</p>
      </div>
      <canvas ref={canvasRef} className="encryption-canvas" />
    </div>

  );
}

export default EncryptionStream;

