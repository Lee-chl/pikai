"use client";

import { RatingItemType } from "../../types/ratingType";
import { Constants } from "../../common/constants";
import Image from "next/image";

interface RatingItemProps {
  ratingItem: RatingItemType;
  isSelected?: boolean;
  onSelect?: (id: number, isChecked: boolean) => void;
  setComDel?: (id: number) => void;
}

export default function RatingItem({
  ratingItem,
  isSelected,
  onSelect,
  setComDel,
}: RatingItemProps) {
  const color_main_image = ratingItem.detail_color.products.color_main_image;
  const color_name = ratingItem.detail_color.color_name;
  const imageURL = `${Constants.image_url}/${color_main_image}`;
  const name = ratingItem.detail_color.products.name;
  const { id, star_rating } = ratingItem;

  return (
    <div>
      <div>
        <Image
          src={imageURL}
          width={200}
          height={200}
          alt={`${name}-${color_name} 의 사진입니다.`}
        />
      </div>
      <div>{name}</div>
      <div>{color_name}</div>
    </div>
  );
}
