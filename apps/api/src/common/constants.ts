// Jwt 시크릿을 환경 변수에서 가져와서 단일 출처로 사용하기 위해서
// 운영에서는 dev-secret .... 을 .env에서 바꿔서 사용
export const jwtConstants = {
  secret: process.env.JWT_SECRET ?? '',
};
