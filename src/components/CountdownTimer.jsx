import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = new Date(endTime) - now;

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  const formatTime = (value) => String(value).padStart(2, '0');

  return (
    <div className="flex items-center gap-1">
      <span className="bg-black text-white px-2 py-1 rounded text-xs font-mono">
        {formatTime(timeLeft.days)}
      </span>
      <span className="text-black font-bold">:</span>
      <span className="bg-black text-white px-2 py-1 rounded text-xs font-mono">
        {formatTime(timeLeft.hours)}
      </span>
      <span className="text-black font-bold">:</span>
      <span className="bg-black text-white px-2 py-1 rounded text-xs font-mono">
        {formatTime(timeLeft.minutes)}
      </span>
      <span className="text-black font-bold">:</span>
      <span className="bg-black text-white px-2 py-1 rounded text-xs font-mono">
        {formatTime(timeLeft.seconds)}
      </span>
    </div>
  );
};

export default CountdownTimer;