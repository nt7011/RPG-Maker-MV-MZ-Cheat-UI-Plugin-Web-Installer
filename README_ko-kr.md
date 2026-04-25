# RPG-Maker-MV-MZ-Cheat-UI-Plugin Web Installer

브라우저에서 [RPG-Maker-MV-MZ-Cheat-UI-Plugin](https://github.com/paramonos/RPG-Maker-MV-MZ-Cheat-UI-Plugin)을 쉽게 설치할 수 있습니다.

이 프로젝트는 원본 RPG Maker MV/MZ Cheat UI를 브라우저 기반 설치기로 패키징합니다. 선택한 게임 폴더를 검사하고, 포함된 치트 payload를 게임 폴더에 복사한 뒤 `plugins.js`에 `CheatBridge` 항목을 추가합니다.

## 원본 프로젝트

- 원본 저장소: https://github.com/paramonos/RPG-Maker-MV-MZ-Cheat-UI-Plugin
- 이 fork는 설치된 플러그인이 인터넷에서 코드, 스타일시트, 폰트, 안내문을 불러오지 않도록 치트 UI payload를 로컬에 포함합니다.
- English README: [README.md](README.md)

## 설치

Chrome 또는 Edge 같은 Chromium 기반 브라우저를 사용하세요. 폴더 접근 기능은 HTTPS 또는 `localhost`에서만 동작합니다.

1. 배포된 설치기 페이지를 엽니다.
2. `Game.exe`가 들어 있는 게임 폴더를 선택합니다.
3. 감지된 `js/plugins` 또는 `www/js/plugins` 구조를 확인합니다.
4. `Install`을 누릅니다.
5. 게임을 실행하고 `Ctrl + C`를 눌러 치트 창을 엽니다.

설치기는 게임의 플러그인 디렉터리에 `CheatBridge.js`를 쓰고, 그 옆에 `cheat-engine` 런타임을 복사한 뒤 `plugins.js`에 플러그인 항목을 추가합니다. `plugins.js`를 변경하기 전 백업을 만들며, 비어 있는 `package.json`의 `name` 필드를 수정해야 하는 경우에도 백업을 만듭니다.

로컬 개발용 실행:

```sh
python3 dev-server.py
```

그 다음 `http://127.0.0.1:4173/`을 여세요.

## UI 샘플

<p float="left">
  <img src="https://user-images.githubusercontent.com/99193603/153754676-cee2b96e-c03a-491f-b71c-3c57d6dcc474.JPG" width="500"/>
  <img src="https://user-images.githubusercontent.com/99193603/153754683-4e7a09a5-2d31-436d-8546-7a5d658eb282.JPG" width="500"/>
  <img src="https://user-images.githubusercontent.com/99193603/153754687-732648c8-3483-42bb-9634-dd22d674dfed.JPG" width="500"/>
  <img src="https://user-images.githubusercontent.com/99193603/153754692-38e04218-7726-4827-a45b-95485de51a3c.JPG" width="500"/>
  <img src="https://user-images.githubusercontent.com/99193603/153754696-0cbc76f9-99fa-47a7-a0d0-6510a2f76e01.JPG" width="500"/>
</p>

## 기능

- GUI 기반 RPG Maker MV/MZ 치트 툴.
- RPG Maker MV와 MZ 게임 모두 지원.
- 스탯, 돈, 스피드, 아이템, 변수, 스위치 등 편집.
- 게임 속도 가속. x0.1부터 x10까지 지원.
- 벽뚫, 캐릭터 무적 지원.
- 랜덤 인카운트 비활성화.
- 전투 승리, 패배, 도망, 취소 강제 실행.
- 변경 가능한 단축키 지원.
- 아이템, 스위치, 변수 등 게임 데이터 검색.
- 위치 저장과 불러오기, 특정 맵 순간이동.
- 개발자 도구 지원.

## 사용 방법

- 기본 단축키 `Ctrl + C`로 치트 창을 열고 닫습니다.
- `Shortcuts` 탭에서 단축키를 바꿀 수 있습니다.
- 치트 창은 게임 창의 우측 상단에 나타납니다.
- 치트 창은 대기 중에는 반투명합니다. 잘 보이지 않으면 마우스를 치트 창 위에 올리세요.

<img src="https://user-images.githubusercontent.com/99193603/153754676-cee2b96e-c03a-491f-b71c-3c57d6dcc474.JPG" width="400"/>

## 치트 설정 재사용

단축키, 이동 속도, 게임 속도 등 치트 설정을 다른 게임에도 적용하려면 이미 설정한 게임의 `www/cheat-settings` 폴더를 대상 게임에 복사하세요.

## 문제 해결

### 게임이 실행되지 않는 경우

일부 오래된 RPG Maker MV 게임은 오래된 NW.js 런타임을 포함합니다. 설치기에는 이런 경우를 위한 NW.js 업데이트 안내와 다운로드 링크가 포함되어 있습니다.

NW.js를 업데이트한 뒤 게임 자체가 정상 동작하지 않는다면, 치트 플러그인으로는 해당 게임을 호환되게 만들 수 없습니다.

### 업데이트 후 오류가 발생하는 경우

이전 치트 빌드에서 생성된 설정 파일이 문제일 수 있습니다. 게임의 `www/cheat-settings` 폴더를 삭제한 뒤 다시 실행해 보세요.
