import { useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";

function generateCode(length = 6) {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";

  let result = "";

  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
}

function Captcha({ onCodeChange }) {
  const canvasRef = useRef(null);
  const [code, setCode] = useState("");

  const drawCaptcha = (text) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // darker background to reduce visibility
    ctx.fillStyle = "#d1d5db";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // background noise dots
    for (let i = 0; i < 60; i++) {
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        1.2,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    // curved distortion lines
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = "rgba(0,0,0,0.3)";
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.moveTo(0, Math.random() * canvas.height);

      ctx.bezierCurveTo(
        canvas.width / 3,
        Math.random() * canvas.height,
        (canvas.width / 3) * 2,
        Math.random() * canvas.height,
        canvas.width,
        Math.random() * canvas.height
      );

      ctx.stroke();
    }

    // thinner characters
    ctx.font = "20px monospace";
    ctx.textBaseline = "middle";

    for (let i = 0; i < text.length; i++) {
      const x = 20 + i * 22;
      const y = canvas.height / 2;

      const angle = (Math.random() * 30 - 15) * (Math.PI / 180);

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      ctx.fillStyle = "#374151";

      ctx.shadowColor = "rgba(0,0,0,0.2)";
      ctx.shadowBlur = 1;

      ctx.fillText(text[i], 0, 0);

      ctx.restore();
    }
  };

  const refresh = () => {
    const newCode = generateCode();
    setCode(newCode);
    onCodeChange(newCode);
    drawCaptcha(newCode);
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <>
      <div className="captcha-wrapper">
        <canvas
          ref={canvasRef}
          width="160"
          height="50"
          className="captcha-canvas"
        ></canvas>

        <button
          type="button"
          className="captcha-refresh"
          onClick={refresh}
        >
          <RefreshCw size={20} />
        </button>
      </div>

      <style>{`

      .captcha-wrapper{
        display:flex;
        align-items:center;
        gap:12px;
      }

      .captcha-canvas{
        border-radius:12px;
        border:1px solid #cfd8df;
      }

      .captcha-refresh{
        width:40px;
        height:40px;
        border-radius:10px;
        border:1px solid #cbd5e1;
        background:#ffffff;
        display:flex;
        align-items:center;
        justify-content:center;
        cursor:pointer;
        transition:0.25s;
        box-shadow:0 2px 6px rgba(0,0,0,0.15);
      }

      .captcha-refresh svg{
        color:#374151;
      }

      .captcha-refresh:hover{
        background:#6366f1;
        border-color:#6366f1;
      }

      .captcha-refresh:hover svg{
        color:white;
      }

      `}</style>
    </>
  );
}

export default Captcha;