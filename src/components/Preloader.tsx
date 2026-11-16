// GROWTIX PRELOADER — DO NOT MODIFY OTHER FILES
import { useEffect, useRef, useState } from "react";

interface Props {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  // Anti-gravity particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: {
      x: number; y: number; vx: number; vy: number;
      size: number; alpha: number; color: string;
    }[] = [];

    const colors = [
      "rgba(99,102,241,", "rgba(139,92,246,",
      "rgba(168,85,247,", "rgba(124,58,237,",
      "rgba(196,181,253,"
    ];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight + window.innerHeight,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -(Math.random() * 1.2 + 0.4),
        size: Math.random() * 4 + 1,
        alpha: Math.random() * 0.6 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.0015;
        if (p.y < -20 || p.alpha <= 0) {
          p.y = canvas.height + 20;
          p.x = Math.random() * canvas.width;
          p.alpha = Math.random() * 0.6 + 0.2;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Progress bar
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 4 + 1;
      if (current >= 100) {
        current = 100;
        setProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(onComplete, 600);
        }, 400);
      } else {
        setProgress(Math.floor(current));
      }
    }, 60);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "hsl(220, 20%, 97%)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        transition: "opacity 0.6s ease",
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? "none" : "all",
      }}
    >
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />

      {/* Logo */}
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", marginBottom: "2.5rem" }}>
        <div style={{
          width: 72, height: 72, borderRadius: 20,
          background: "linear-gradient(135deg, hsl(225,60%,62%), hsl(270,40%,72%))",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 1rem", fontSize: 32, fontWeight: 800, color: "#fff",
          fontFamily: "'Space Grotesk', sans-serif",
          boxShadow: "0 20px 60px rgba(99,102,241,0.35)",
          animation: "gtxFloat 3s ease-in-out infinite",
        }}>
          G
        </div>
        <div style={{
          fontSize: 28, fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif",
          background: "linear-gradient(135deg, hsl(225,60%,62%), hsl(270,40%,72%))",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          letterSpacing: "-0.5px",
        }}>
          Growtix
        </div>
        <div style={{
          fontSize: 12, color: "hsl(220,10%,56%)", marginTop: 4,
          letterSpacing: "2px", textTransform: "uppercase",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
          Growth Platform
        </div>
      </div>

      {/* Progress */}
      <div style={{ position: "relative", zIndex: 2, width: 200, textAlign: "center" }}>
        <div style={{
          width: "100%", height: 4, borderRadius: 999,
          background: "hsl(220,14%,90%)", overflow: "hidden",
        }}>
          <div style={{
            height: "100%", borderRadius: 999,
            background: "linear-gradient(90deg, hsl(225,60%,62%), hsl(270,40%,72%))",
            width: `${progress}%`, transition: "width 0.1s linear",
          }} />
        </div>
        <div style={{
          fontSize: 12, color: "hsl(220,10%,56%)", marginTop: 10,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
          {progress}%
        </div>
      </div>

      <style>{`
        @keyframes gtxFloat {
          0%,100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
      `}</style>
    </div>
  );
}