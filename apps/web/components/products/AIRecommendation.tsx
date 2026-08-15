"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import AIRecommendPopup from "./aiRecommendpopup";
import type { RecommendationResponseType } from "@/types/recommendationType";
import styles from "./AIRecommendation.module.css";

interface AIRecommendationProps {
  // 상품 상세 페이지에서 현재 선택된 색상의 ID를 전달받습니다.
  // 옵션을 선택하지 않았거나 AI 분석이 불가능한 상태이면 null입니다.
  detailColorId: number | null;
}

export default function AIRecommendation({
  detailColorId,
}: AIRecommendationProps) {
  // 로그인하지 않은 사용자를 로그인 페이지로 이동시키기 위해 사용합니다.
  const router = useRouter();

  // AI 추천 결과를 저장합니다.
  const [recommendation, setRecommendation] =
    useState<RecommendationResponseType | null>(null);

  // AI 추천 팝업을 열고 닫는 상태입니다.
  const [isOpen, setIsOpen] = useState(false);

  // true이면 현재 AI 분석 API를 기다리고 있는 상태입니다.
  const [isAiLoading, setIsAiLoading] = useState(false);

  // AI 분석 중 오류가 발생한 경우 메시지를 저장합니다.
  const [aiError, setAiError] = useState<string | null>(null);

  // 사용자가 다른 색상 옵션으로 변경하면
  // 이전 색상의 AI 분석 결과를 초기화합니다.
  useEffect(() => {
    setRecommendation(null);
    setAiError(null);
    setIsOpen(false);
  }, [detailColorId]);

  // AI 색상 추천 API를 호출하는 함수입니다.
  const fetchRecommendation = async (
    selectedDetailColorId: number,
  ): Promise<RecommendationResponseType> => {
    // 로그인할 때 쿠키에 저장된 JWT 토큰을 가져옵니다.
    const token = Cookies.get("accessToken");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACK_URL}/recommendations/color`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

          // 추천 API는 로그인한 사용자 정보가 필요하므로
          // JWT 토큰을 함께 전달합니다.
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          detailColorId: selectedDetailColorId,
        }),
      },
    );

    if (!response.ok) {
      throw new Error("AI 추천 API 호출에 실패했습니다.");
    }

    const data = await response.json();

    // 백엔드 응답 형식이 달라질 가능성을 고려해
    // 실제 AI 추천 결과 데이터를 가져옵니다.
    const recommendationData =
      data.aiResult ?? data.data ?? data.recommendation ?? data;

    // AI가 반환한 추천 점수를 숫자로 변환합니다.
    const score = Number(
      recommendationData.answer ??
        recommendationData.score ??
        recommendationData.recommendationScore ??
        recommendationData.recommendation_score ??
        0,
    );

    // 추천 점수 1~6점에 따라 사용자에게 보여줄 설명입니다.
    const getScoreMessage = (scoreValue: number): string => {
      switch (scoreValue) {
        case 6:
          return `이 제품은 고객님이 가지고 있는 색과 육안으로는 거의 구분하기 힘들 정도로 비슷한 제품으로 보입니다!

기존템이 인생템이셨으면 찰떡이실 것 같습니다!

만약 새로운 변화를 주시고 싶으시다면 다른 색을 추천드립니다 ☺️`;

        case 5:
          return `기존에 쓰시던 색과 매우 흡사해서 현재 사용하시는 컬러가 만족스러우셨다면 아주 실패 없는 선택이 될 거예요!`;

        case 4:
        case 3:
          return `기존 컬러와 비슷한 무드이긴 하지만 미세한 차이가 있어서

평소 즐겨 쓰시던 느낌에서 약간의 변화를 주고 싶으실 때 적합할 것 같아요.`;

        case 2:
        case 1:
          return `고객님, 이 컬러는 기존 사용하시던 색상과 차이가 커서 완전히 새로운 분위기를 원하실 때 선택하시는 걸 추천드려요!`;

        default:
          return "추천 결과를 확인해 주세요.";
      }
    };

    // 숫자로 변환할 수 없는 값이 들어오면 0점으로 처리합니다.
    const safeScore = Number.isNaN(score) ? 0 : score;

    // 기존 AIRecommendPopup에서 사용하는 형태로 결과를 정리합니다.
    const result: RecommendationResponseType = {
      score: safeScore,
      messageType: recommendationData.messageType ?? "",
      title: recommendationData.title ?? "추천 결과",
      message: getScoreMessage(safeScore),
      recommend: recommendationData.recommend ?? false,
    };

    return result;
  };

  // 사용자가 "AI 색상 추천 분석" 버튼을 눌렀을 때 실행됩니다.
  const handleAnalyze = async () => {
    // 이미 분석 중이면 중복 요청하지 않습니다.
    if (isAiLoading) {
      return;
    }

    // 분석할 색상 옵션이 없으면 실행하지 않습니다.
    if (detailColorId === null) {
      alert("AI 분석을 위해 색상 옵션을 1개 선택해 주세요.");
      return;
    }

    // AI 추천 API는 로그인 사용자를 기준으로 분석하기 때문에
    // 로그인하지 않았다면 로그인 페이지로 이동합니다.
    const token = Cookies.get("accessToken");

    if (!token) {
      router.push("/user/login");
      return;
    }

    // 이전 분석 결과를 초기화합니다.
    setRecommendation(null);
    setAiError(null);

    // API 응답을 기다리는 동안 기존 로딩 팝업을 보여줍니다.
    setIsAiLoading(true);
    setIsOpen(true);

    try {
      const result = await fetchRecommendation(detailColorId);

      // API 응답이 오면 추천 결과를 팝업에 저장합니다.
      setRecommendation(result);
    } catch (error) {
      // 분석에 실패하면 팝업 안에 오류 메시지를 보여줍니다.
      setAiError(
        error instanceof Error
          ? error.message
          : "AI 추천 결과를 불러오지 못했습니다.",
      );
    } finally {
      // 성공 또는 실패와 관계없이 로딩 상태를 종료합니다.
      setIsAiLoading(false);
    }
  };

  return (
    <>
      {/* AI 분석 결과 및 분석 중 로딩을 보여주는 기존 팝업입니다. */}
      <AIRecommendPopup
        open={isOpen}
        title={recommendation?.title ?? "추천 결과"}
        message={recommendation?.message ?? ""}
        score={recommendation?.score ?? 0}
        isAiLoading={isAiLoading}
        aiError={aiError}
        onClose={() => {
          setIsOpen(false);
          setAiError(null);
        }}
      />

      <div className={styles.aiRecommendArea}>
        {/* 
        색상 옵션이 정확히 1개 선택되었을 때 AI 분석 버튼이 활성화됩니다.
        분석 중에는 API 중복 호출을 막기 위해 비활성화합니다.
      */}
        <button
          type="button"
          onClick={handleAnalyze}
          disabled={detailColorId === null || isAiLoading}
          className={styles.aiRecommendButton}
        >
          {isAiLoading ? "AI 분석 중..." : "AI 색상 추천 분석"}
        </button>
      </div>
    </>
  );
}
