; (function (global) {
  "use strict"
  let textRollMasks = document.querySelectorAll('*[text-roll-mask]');
  let textRollInterval;
  let rollMaskMaxWidth;
  let rollMaskMaxHeight;


  function rollingText() {
    // 获取到滚动文字的外层元素
    textRollMasks = document.querySelectorAll('*[text-roll-mask]');

    // 遍历所有应用到文字轮播的元素外层
    [...textRollMasks].forEach((rollMask) => {
      // 如果没有子元素，不处理
      if (!rollMask.children.length) return;

      // 默认将所有子元素变为块 Block
      [...rollMask.children].forEach((child) => {
        child.style.cssText = `
          display: block;
      `;
      })

      // 文字的长短可能不同，这里获取所有孩子中最大的长度和高度，防止溢出换行或者显示不完全
      rollMaskMaxWidth = getMaxLength([...rollMask.children].map((child) => child.offsetWidth))
      rollMaskMaxHeight = getMaxLength([...rollMask.children].map((child) => child.offsetHeight))

      // 将获取的最大高度长度应用于包裹元素
      rollMask.style.cssText = `
        width: ${rollMaskMaxWidth}px;
        height: ${rollMaskMaxHeight}px;
        position: relative;
        overflow: hidden;
      `;
      // 为孩子设置样式，设置它们的初始化位置，位于原来位置的-100%的高度的位置
      [...rollMask.children].forEach((child) => {
        child.style.cssText += `
          box-sizing: border-box;
          position: absolute;
          white-space: nowrap;
          top: -${rollMaskMaxHeight}px;
      `;
      })
      // 获取拥有 data-show 属性的元素
      let show = rollMask.querySelector('*[data-show]')
      // 如果没有，则默认为展示第一个元素
      if (!show) {
        show = rollMask.children[0];
        show.setAttribute('data-show', '')
      }
    })

    textRollInterval = setInterval(textRollTransfer, 3000);
  }


  /* 动画
      动画设置
        使用CSS的transform transition来设置过度动画
        一共有两种位移过渡动画，回到原位（top -100%），不需要过渡
        1. 从容器下往容器内的文字移动 
          使用 data-show 属性标识入场的子元素， 
          CSS中设置拥有data-show的元素向上移动100%
            transform : translateY(100%);
            transition: .5s transform ease-in-out;
        2. 从容器中往容器上的移动
          使用 data-up 属性标识入场的子元素， 
          CSS中设置拥有data-show的元素向上移动100%
            transform : translateY(200%);
            transition: .5s transform ease-in-out;
      动画播放
        动画播放的思路就是以循环游标的形式设置data-show 与 data-up
        即每个滚动下移一次
  */


  function textRollTransfer() {
    if (!textRollMasks.length) return;
    [...textRollMasks].forEach((rollMask) => {
      // 获取入场的元素
      const show = rollMask.querySelector('*[data-show]')
      // 获取下一个入场的元素，
      // 如果nextElementSibling没有了（next为最后一个元素），则选择第一个
      const next = show.nextElementSibling || rollMask.querySelector('*:first-child');
      // 获取 向上出场的元素
      const up = rollMask.querySelector('*[data-up]');

      // 将出场的元素归位到最底部
      if (up) {
        up.removeAttribute('data-up');
      }

      // 先将已经入场的元素出场
      show.removeAttribute('data-show');
      show.setAttribute('data-up', '');
      // 将准备入场的元素入场
      next.setAttribute('data-show', '')
    })
  }

  function getMaxLength(numberArray) {
    return Math.max(...numberArray)
  }

  function debounce(fn, wait) {
    var timer = null;
    return function () {
      if (timer !== null) {
        clearTimeout(timer);
      }
      timer = setTimeout(fn, wait);
    }
  }


  function rollText() {
    [...textRollMasks].forEach((rollMask) => {
      rollMask.style.cssText = ''
    })
    clearInterval(textRollInterval)
    textRollInterval = null
    rollingText()
  }

  // 对响应式重新计算宽度
  window.addEventListener("resize", debounce(rollText, 300));

  rollText()

})(window)

