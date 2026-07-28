"use client";

import { Constants } from "@/common/constants";
import { personalColorEnum } from "@repo/common";
import { useState } from "react";
import styles from "./SignUpform.module.css";
import { Address, useKakaoPostcodePopup } from "react-daum-postcode";

export default function SignUpForm() {
  const scriptUrl =
    "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [tone, setTone] = useState<personalColorEnum | null>(null);

  const open = useKakaoPostcodePopup(scriptUrl);

  const personalColorList = Object.values(personalColorEnum);

  const handleComplete = (data: Address) => {
    setAddress(`[${data.zonecode}] ${data.address}`);
  };

  const handleClick = () => {
    open({
      onComplete: handleComplete,
    });
  };

  const handleSubmit = async () => {
    if (address === "" || detailAddress === "") {
      alert("주소를 입력해주세요.");
      return;
    }

    if (tone === null) {
      alert("퍼스널 컬러를 선택해주세요.");
      return;
    }

    const addressData = `${address} ${detailAddress}`;
    const response = await fetch(`${Constants.back_url}/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        name,
        phone,
        address: addressData,
        tone,
      }),
    });
  };

  return (
    <div>
      <h3>이메일(아이디)</h3>
      <label htmlFor="email">이메일(아이디)</label>
      <input
        type="email"
        id="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <h3>비밀번호</h3>
      <label htmlFor="password">비밀번호</label>
      <input
        required
        type="password"
        id="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <h3>이름</h3>
      <label htmlFor="name">이름</label>
      <input
        required
        type="text"
        id="name"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <h3>전화번호</h3>
      <label htmlFor="phone">전화번호</label>
      <input
        required
        type="text"
        id="phone"
        name="phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <h3>주소</h3>
      <label htmlFor="address">주소</label>
      <input
        required
        id="address"
        name="address"
        readOnly
        value={address}
        placeholder="주소"
      />
      <button type="button" onClick={handleClick}>
        주소 찾기
      </button>
      <h3>상세주소</h3>
      <label htmlFor="addressDetail">상세주소</label>
      <input
        required
        type="text"
        id="addressDetail"
        name="addressDetail"
        value={detailAddress}
        onChange={(e) => setDetailAddress(e.target.value)}
        placeholder="상세주소를 입력해주세요"
      />
      <h3>퍼스널 컬러</h3>
      <div className={styles.colorOptionsGrid}>
        {personalColorList.map((color) => (
          <button
            key={color}
            onClick={() => setTone(color)}
            className={`${styles.colorItemBtn}  ${tone === color ? styles.activeTone : ""}`}
          >
            {color}
          </button>
        ))}
        <p>
          퍼스널 컬러를 모르신다면 아래 문구를 참조해 웜톤 쿨톤을
          선택해주세요.(필수)
        </p>
        <p>A4 용지(생화이트)를 턱 밑에 댔을 때, 시선이 어디로 가나요?</p>
        <p>
          A) 옷이 너무 하얘서 옷만 보이고, 내 얼굴은 상대적으로 누렇게 둥둥
          뜨거나 기운 없어 보인다.= 웜톤
        </p>
        <p>
          B) 이목구비가 또렷해 보이고, 안색이 맑아지며, 옷과 얼굴이 자연스럽게
          어우러진다. = 쿨톤
        </p>
        <input type="checkbox" required /> 웜톤
        <input type="checkbox" required /> 쿨톤
      </div>
      <div className={styles.checkboxContainer}>
        <input type="checkbox" required />
        <label htmlFor="terms">정보 수집 동의</label>
      </div>
      <button type="submit" onClick={(e) => e.preventDefault()}>
        회원가입
      </button>
      <p>계정이 이미 있으신가요?? </p>
      <p>로그인</p>
    </div>
  );
}
