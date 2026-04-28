## tailwindcss 설치 

1. npm install -D tailwindcss@3 postcss autoprefixer
 1) Dev 환경에서 만 필요하기에 -D 옵션을 줌 
2. npx tailwindcss init -p
 1) tailwindcss에 필요한 기본 설정파일 자동 생성을 위한 명령어
3. npm install -D prettier prettier-plugin-tailwindcss
 1) 복잡하게 뒤섞인 클래스 명을 권장하는 표준 순서에 따라 자동으로 정렬해 줍니다
4. VS Code 설정
 1) 확장 플로그인 설치: Tailwind CSS IntelliSense
  가. 클래스명 자동 완성, 오타 방지, 미리보기를 제공합니다. (필수)
 2) tailwindcss 문법을 *.css 파일에 작성해도 오류가 발생하지 않도록 설정 추가 
  가. ctrl + shift + p 
  나. 검색: Preferences: Open User Settings (JSON)
  다. 기존 설정들이 있다면 쉼표(,)로 구분해서 추가하세요
     "files.associations": {
       "*.css": "tailwindcss"
     }
 3) prettier 적용을 위한 확장 설치 
  가. Prettier - Code formatter 설치 
  나. Ctrl + , (설정 오픈) → Default Formatter를 검색 → Prettier - Code formatter로 선택
  다. (추가 팁) Format On Save를 검색해서 체크해두면, 파일을 저장할 때마다 자동으로 Tailwind 클래스들이 촤르륵 정렬됩니다.