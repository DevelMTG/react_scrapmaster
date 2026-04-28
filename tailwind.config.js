/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // src 내부의 모든 리액트 파일
  ],
  theme: {
    extend: {
      // 기본적으로 전체 적용할 스타일이 있다면 여기에 작성한다.
      // borderRadius: {
      //   DEFAULT: '0px', // 기본 모든 요소를 각지게 설정
      // }

    },
  },
  plugins: [],
}

