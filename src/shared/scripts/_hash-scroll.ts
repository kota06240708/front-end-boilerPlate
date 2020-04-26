import smoothscroll from './_smooth-scroll';
import { offsetTop } from './_offset';
import { makeArray } from './_make-array';

/**
 * hashスクロールを追加
 * @param {string} name クリックイベントを発火させるクラス名
 * @param {number} height 引く高さ
 */

const hashScroll: (name: string, height?: number) => void = (
  name: string,
  height = 0
) => {
  const $$targets = document.querySelectorAll<HTMLElement>(`.${name}`);

  // DOMが一つもない場合何もしない
  if ($$targets.length === 0) return;

  makeArray($$targets).forEach((r: HTMLElement) => {
    r.addEventListener('click', (e: Event) => {
      e.preventDefault();
      const href = e.currentTarget.getAttribute('href');
      const target = document.querySelector(href);

      smoothscroll(offsetTop(target) - height);
    });
  });
};

export default hashScroll;
