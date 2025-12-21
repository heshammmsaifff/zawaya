"use client";

import React, { useEffect, useState } from "react";

const Loop1 = ({
  texts = ["مطابخ", "غرف ملابس", "مطابخ", "غرف ملابس"],
  speed = 10,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full overflow-hidden bg-[#e3b43c] py-4" dir="ltr">
      <div className="relative flex">
        <div
          className="flex animate-marquee whitespace-nowrap"
          style={{ animationDuration: `${speed}s` }}
        >
          {[...texts, ...texts].map((text, i) => (
            <span
              key={i}
              className="text-black text-xl font-bold mx-8 whitespace-nowrap"
              dir="rtl"
            >
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loop1;
