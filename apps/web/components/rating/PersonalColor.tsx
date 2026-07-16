"use client";

import { useState } from "react";
import { personalColorEnum } from "@repo/common";
import { Constants } from "../../common/constants";
import { UserInfoType } from "../../types/userType";

interface PersonalColorProps {
  userInfo: UserInfoType;
}

export default function PersonalColor({ userInfo }: PersonalColorProps) {
  const [userTone, SetUserTone] = useState<personalColorEnum | null>(
    userInfo.personal_color || null,
  );

  const [changeTone, setChangeTone] = useState<personalColorEnum | null>(null);

  const [isEditing, SetIsEditing] = useState(false);

  const personalColorList = Object.values(personalColorEnum);

  const handleColorUpdate = async (
    personalColor: personalColorEnum | null,
    id: number,
  ) => {
    if (!personalColor || personalColor === userTone) {
      alert("바꿀 퍼스널 컬러를 선택해주세요");
      return;
    }

    try {
      const response = await fetch(`${Constants.front_url}/user/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personal_color: personalColor,
        }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      SetUserTone(personalColor);
      SetIsEditing(false);
      alert("저장이 성공적으로 완료되었습니다.");
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeTone = (personalColor: personalColorEnum) => {
    setChangeTone(personalColor);
  };

  const handleChangeEditing = () => {
    if (isEditing) {
      setChangeTone(userTone);
    }
    SetIsEditing(!isEditing);
  };

  return (
    <div>
      <h5>나의 퍼스널 컬러</h5>
      <h5>본인이 고른 톤 : {userTone}</h5>
      {isEditing ? (
        <div>
          <button onClick={() => handleColorUpdate(changeTone, userInfo.id)}>
            저장
          </button>
          <button onClick={handleChangeEditing}>취소</button>
          {personalColorList.map((color) => (
            <button key={color} onClick={() => handleChangeTone(color)}>
              {color}
            </button>
          ))}
        </div>
      ) : (
        <button onClick={handleChangeEditing}>퍼스널 컬러 수정</button>
      )}
    </div>
  );
}
