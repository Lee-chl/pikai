"use client";

import { Constants } from "@/common/constants";
import { personalColorEnum } from "@repo/common";
import { ChangeEvent, useState } from "react";
import styles from "./SignUpform.module.css";
import { Address, useKakaoPostcodePopup } from "react-daum-postcode";

export default function SignUpForm() {
  const scriptUrl =
    "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [tone, setTone] = useState<personalColorEnum | null>(null);

  const open = useKakaoPostcodePopup(scriptUrl);

  const personalColorList = Object.values(personalColorEnum);

  const handleSetAddress = (data: Address) => {
    setAddress(`[${data.zonecode}] ${data.address}`);
  };

  const handleAddressClick = () => {
    open({
      onComplete: handleSetAddress,
    });
  };
  const validationEmail = (value: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!value) {
      setEmailError("이메일을 입력해주세요");
    } else if (!emailRegex.test(value)) {
      setEmailError("올바른 이메일 형식이 아닙니다.");
    } else {
      setEmailError("");
    }
  };

  const handleEmailClick = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setEmail(value);
    validationEmail(value);
  };

  const handleSubmit = async () => {
    // 이메일 체크 + error 메세지 체크 하기
    // 비번도 6자 이상 아님 에러 발생하게
    // 전화번호는 번호아님 오류나게
    if (address === "" || detailAddress === "") {
      alert("주소를 입력해주세요.");
      return;
    }

    if (tone === null) {
      alert("퍼스널 컬러를 선택해주세요.");
      return;
    }

    const addressData = `${address} ${detailAddress}`;
    try {
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
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.h3}>회원가입</h3>
      <div className={styles.inputGroup}>
        <label className={styles.sectionTitle} htmlFor="email">
          이메일(아이디) <span className={styles.requiredStar}>*</span>
        </label>
        <input
          className={styles.input}
          type="email"
          id="email"
          name="email"
          value={email}
          placeholder="example@email.com"
          onChange={handleEmailClick}
          required
        />
        {emailError && <p className={styles.errorMessage}>{emailError}</p>}
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.sectionTitle} htmlFor="password">
          비밀번호 <span className={styles.requiredStar}>*</span>
        </label>
        <input
          className={styles.input}
          required
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.sectionTitle} htmlFor="name">
          이름 <span className={styles.requiredStar}>*</span>
        </label>
        <input
          className={styles.input}
          required
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.sectionTitle} htmlFor="phone">
          전화번호 <span className={styles.requiredStar}>*</span>
        </label>
        <input
          className={styles.input}
          required
          type="tel"
          id="phone"
          name="phone"
          placeholder="01012345678"
          maxLength={11}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.sectionTitle} htmlFor="address">
          주소 <span className={styles.requiredStar}>*</span>
        </label>
        <div className={styles.addressGroup}>
          <input
            required
            id="address"
            name="address"
            readOnly
            value={address}
            placeholder="주소 찾기를 눌러주세요"
            className={`${styles.input} ${styles.readOnlyInput}`}
          />
          <button
            type="button"
            onClick={handleAddressClick}
            className={styles.addressBtn}
          >
            주소 찾기
          </button>
        </div>
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.sectionTitle} htmlFor="addressDetail">
          상세주소 <span className={styles.requiredStar}>*</span>
        </label>
        <input
          required
          className={styles.input}
          type="text"
          id="addressDetail"
          name="addressDetail"
          value={detailAddress}
          onChange={(e) => setDetailAddress(e.target.value)}
          placeholder="상세주소를 입력해주세요"
        />
      </div>
      <div className={styles.colorSection}>
        <h3 className={styles.sectionTitle}>
          퍼스널 컬러 <span className={styles.requiredStar}>*</span>
        </h3>
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
        </div>
        <div className={styles.guideBox}>
          <p className={styles.guideTitle}>
            내 톤을 모르시나요? 아래 설명을 읽고 웜톤/쿨톤을 선택해 주세요.
            (필수)
          </p>
          <p>A4 용지(생화이트)를 턱 밑에 댔을 때, 시선이 어디로 가나요?</p>
          <p>
            <strong>A)</strong> 옷이 너무 하얘서 옷만 보이고, 내 얼굴은
            상대적으로 누렇게 둥둥 뜨거나 기운 없어 보인다. ➡ WARM
          </p>
          <p>
            <strong>B)</strong> 이목구비가 또렷해 보이고, 안색이 맑아지며, 옷과
            얼굴이 자연스럽게 어우러진다. ➡ COOL
          </p>
        </div>
      </div>
      <div className={styles.checkboxContainer}>
        <input type="checkbox" required />
        <label htmlFor="terms">
          정보 수집 동의 <span className={styles.requiredStar}>*</span>
        </label>
      </div>
      <button
        className={`${styles.btn} ${styles.btnSave}`}
        type="submit"
        onClick={(e) => e.preventDefault()}
      >
        회원가입
      </button>
      <div className={styles.footerText}>
        <p>계정이 이미 있으신가요?? </p>
        <p className={styles.loginLink}>로그인</p>
      </div>
    </div>
  );
}
