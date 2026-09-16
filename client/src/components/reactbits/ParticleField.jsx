import { useEffect, useRef } from "react";

const randomBetween = (min, max) => min + Math.random() * (max - min + 1);

function ParticleField({
  className = "",
  quantity = 80,
  ease = 40,
  color = "#818cf8",
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const ctxRef = useRef(null);
  const circlesRef = useRef([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const sizeRef = useRef({ w: 0, h: 0 });
  const dprRef = useRef(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;

    const init = () => {
      const { offsetWidth: w, offsetHeight: h } = container;
      sizeRef.current = { w, h };
      dprRef.current = window.devicePixelRatio || 1;
      canvas.width = w * dprRef.current;
      canvas.height = h * dprRef.current;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dprRef.current, 0, 0, dprRef.current, 0, 0);

      circlesRef.current = Array.from({ length: quantity }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        translationX: 0,
        translationY: 0,
        size: randomBetween(1, 2.6),
        opacity: randomBetween(0.08, 0.4),
        vx: randomBetween(-0.25, 0.25),
        vy: randomBetween(-0.25, 0.25),
      }));
    };

    let raf;
    const animate = () => {
      const { w, h } = sizeRef.current;
      if (!w || !h) return;
      ctx.clearRect(0, 0, w, h);

      const { x: mx, y: my } = mouseRef.current;
      const cut = 160;

      circlesRef.current.forEach((circle) => {
        circle.x += circle.vx;
        circle.y += circle.vy;

        if (circle.x < -12) circle.x = w + 12;
        if (circle.x > w + 12) circle.x = -12;
        if (circle.y < -12) circle.y = h + 12;
        if (circle.y > h + 12) circle.y = -12;

        const rawDx = mx - circle.x;
        const rawDy = my - circle.y;
        const dist = Math.sqrt(rawDx * rawDx + rawDy * rawDy);
        if (dist < cut) {
          const pull = ((cut - dist) / cut) * 0.7;
          circle.translationX += (rawDx * pull - circle.translationX) / ease;
          circle.translationY += (rawDy * pull - circle.translationY) / ease;
        } else {
          circle.translationX += (0 - circle.translationX) / ease;
          circle.translationY += (0 - circle.translationY) / ease;
        }

        ctx.beginPath();
        ctx.arc(
          circle.x + circle.translationX,
          circle.y + circle.translationY,
          circle.size,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = color;
        ctx.globalAlpha = circle.opacity;
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(animate);
    };

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const onMouseLeave = () => {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };

    init();
    raf = requestAnimationFrame(animate);
    window.addEventListener("resize", init);
    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", init);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [quantity, color, ease]);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}

export default ParticleField;