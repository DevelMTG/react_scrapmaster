## FlexBox 내 부모 객체가 자식 객체에 의해 원치 않게 width길이가 확대될 경우

1. width: 100% 를 줬는데 이상하게 꼭 몇 px 씩 차이가 나서 스크롤이 화면에 가려진다거나 할 경우

1) 부모에 width: 0; min-width: 100%; 를 적용해보자
2) ScrapListRightSidebar.tsx의 #right-top-body 를 참고하자

## 자식 객체의 width만큼 부모 객체가 커지기를 바란다면?

1. width: max-content; min-width: 100%; 를 줘보자
