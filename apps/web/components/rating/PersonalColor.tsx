"use client";

import { useState } from "react";
import { personalColorEnum } from "../../common/enum";
import { Constants } from "../../common/constants";

export default function PersonalColor(tone: personalColorEnum) {
  const [userTone, SetUserTone] = useState<personalColorEnum>(tone || "");
  const [isShow, SetIsShow] = useState(false);

  const personalColorList = Object.values(PersonalColor);

  const handleColorUpdate = async (color: personalColorEnum) => {
    try {
      const response = await fetch(`${Constants.front_url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error(error);
    }
    SetUserTone(color);
  };

  const handleToggle = () => {
    SetIsShow(!isShow);
  };

  return (
    <div>
      <h5>나의 퍼스널 컬러</h5>
      <h5>본인이 고른 톤 : ${userTone}</h5>
      <button onClick={handleToggle}>수정</button>
      {isShow && (
        <div>
          {personalColorList.map((color) => (
            <button key={color}>{color}</button>
          ))}
        </div>
      )}
    </div>
  );
}
