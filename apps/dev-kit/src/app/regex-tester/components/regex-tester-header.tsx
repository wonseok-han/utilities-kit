/**
 * Regex Tester 헤더 컴포넌트
 *
 * 서버에서 렌더링되는 정적 콘텐츠로,
 * SEO 최적화를 위해 서버 컴포넌트로 구현합니다.
 */
export function RegexTesterHeader() {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-white mb-2">Regex Tester</h1>
      <p className="text-gray-400">
        <strong>정규식(Regular Expression)</strong>은 문자열에서 원하는 패턴을
        찾거나 변환할 때 사용하는 특수한 문법입니다.
        <br />
        아래 예시와 팁을 참고해서 직접 패턴을 입력해보세요!
      </p>
      <ul className="text-xs text-blue-300 mt-2 list-disc list-inside">
        <li>
          <b>이메일 찾기:</b>{' '}
          <code>{'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'}</code>{' '}
          (플래그: <b>gm</b>)
        </li>
        <li>
          <b>한글만 있는 줄 찾기:</b> <code>{'^[가-힣]+$'}</code> (플래그:{' '}
          <b>gm</b>)
        </li>
        <li>
          <b>모든 영문 단어 찾기:</b> <code>{'\b[a-zA-Z]+\\b'}</code> (플래그:{' '}
          <b>g</b>)
        </li>
        <li>
          <b>Tip:</b> 여러 줄 검사엔 <b>m</b>, 여러 개 찾기엔 <b>g</b>, 대소문자
          무시엔 <b>i</b> 플래그를 사용하세요.
        </li>
        <li>
          <b>문자열이 여러 줄인데 매치가 안 되면?</b> 플래그에 <b>m</b>을
          추가해보세요!
        </li>
        <li>
          <b>여러 개를 찾고 싶은데 하나만 나오면?</b> 플래그에 <b>g</b>를
          추가해보세요!
        </li>
        <li>
          <b>샘플 버튼</b>을 눌러 바로 결과를 확인할 수 있습니다.
        </li>
      </ul>
      <div className="mt-4 flex items-center gap-3 p-4 bg-gray-800/90 border border-gray-600 rounded-lg shadow">
        <span className="text-2xl">💡</span>
        <span className="text-sm text-gray-200">
          <strong>정규식이 처음이라면?</strong>{' '}
          <a
            className="underline text-blue-400 hover:text-blue-300 font-semibold"
            href="https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Regular_Expressions"
            rel="noopener noreferrer"
            target="_blank"
          >
            정규식 가이드(MDN)
          </a>
          에서 더 많은 예시와 설명을 볼 수 있습니다.
        </span>
      </div>
    </div>
  );
}
