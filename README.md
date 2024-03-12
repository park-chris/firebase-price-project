# 전통시장 - Firebase Functions
**서울에 있는 전통 시장들의 정보를 제공하는 서비스에 필요한 API**

전통시장 앱은 서울에 있는 전통시장의 소개, 생필품 가격, 위치, 리뷰를 제공해주는 서비스입니다. 사용자들은 각 시장의 가격 정보를 실시간으로 확인하고, 시장의 위치와 접근 방법을 쉽게 찾아볼 수 있습니다. 또한, 다른 이용자들의 리뷰를 통해 각 시장의 분위기와 매력을 느껴볼 수 있습니다. 

<br><br>


# ✨사용 기술 
`Firebase Authentication`, `Firebase Firestore`, `Firebase Functions`, `Firebase Storage`, `Schedule functions` , `TypeScript`

<br><br>

# 💡예약 함수 

- **scheduledUpdateTask** :
    - 용도 : 시장 생필품 가격 업데이트 함수
    - 작업 일정 : 매주 일요일 오전 10시에 실행되는 작업 스케쥴링
    - 작업 내용 : 서울 열린데이터 광장에서 제공하는 시장 생필품 항목의 새로운 데이터 업데이트

- **scheduledUpdateNewsTask** :
    - 용도 : 물가 소식 업데이트 함수
    - 작업 일정 : 매주 일요일 오후 2시에 실행되는 작업 스케쥴링
    - 작업 내용 : 서울 열린데이터 광장에서 제공하는 물가 소식 항목의 새로운 데이터 업데이트


<br><br>

# 📱API 함수 
|Method|URI|Description|
|----|----|----|
|GET|/getHomeList|홈 화면의 목록 조회|
|GET|/getSearch/{keyword}|검색 결과 조회|
|POST|/getKakaoCustomAuth|카카오 인증 후 JWT 생성 및 반환|



