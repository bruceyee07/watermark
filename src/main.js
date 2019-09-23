const defaultFontFamily = '"lucida grande", "lucida sans unicode", lucida, helvetica,         "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif';

/**
*
* @param fn {Function}   实际要执行的函数
* @param delay {Number}  执行间隔，单位是毫秒（ms）
*
* @return {Function}     返回一个“节流”函数
*/

function throttle(fn, threshhold) {

  // 记录上次执行的时间
  var last

  // 定时器
  var timer

  // 默认间隔为 250ms
  threshhold || (threshhold = 250)

  // 返回的函数，每过 threshhold 毫秒就执行一次 fn 函数
  return function () {

    // 保存函数调用时的上下文和参数，传递给 fn
    var context = this
    var args = arguments

    var now = +new Date()

    // 如果距离上次执行 fn 函数的时间小于 threshhold，那么就放弃
    // 执行 fn，并重新计时
    if (last && now < last + threshhold) {
      clearTimeout(timer)

      // 保证在当前时间区间结束后，再执行一次 fn
      timer = setTimeout(function () {
        last = now
        fn.apply(context, args)
      }, threshhold)

      // 在时间区间的最开始和到达指定间隔的时候执行一次 fn
    } else {
      last = now
      fn.apply(context, args)
    }
  }
}

function getPixelRatio () {
  return window.devicePixelRatio;
};

export default class WaterMark {
  constructor(options = {}) {
    this.container = options.container || document.body;
    this.width = options.width || 200;
    this.height = options.height || 120;
    this.content = options.content || '内部信息，请勿外传';
    this.fontSize = options.fontSize || '14px';
    this.fontFamily = options.fontFamily || defaultFontFamily;
    this.fillStyle = options.fillStyle || 'rgba(112, 113, 114, 0.1)';
    this.textAlign = options.textAlign || 'center';
    this.textBaseline = options.textBaseline || 'middle';
    this.strokeStyle = options.strokeStyle || '';
    this.position = options.position || 'absolute';
    this.zIndex = options.zIndex || 9999;
    this.rotate = options.rotate || -15;
    this.throttleTime = options.throttleTime || 300;
    this.watch = options.watch || true;

    this.scrollWidth = '';
    this.scrollHeight = '';
    this.wm = null;
    this.base64Url = '';
    this.mutationObserver = null;
    this.reset = throttle(this.reset.bind(this), this.throttleTime);

    this.init();

    window.addEventListener('resize', this.reset, false);
  }

  init() {
    this.drawCanvas();
    this.wm = document.createElement('div');

    this.setContainerSize();

    const style = this.getStyle();
    this.wm.setAttribute('style', style);
    this.container.insertBefore(this.wm, this.container.firstChild)

    this.handleObserver();
  }

  drawCanvas() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const ratio = getPixelRatio();

    canvas.id = 'canvas';
    canvas.setAttribute('width', this.width);
    canvas.setAttribute('height', this.height);

    canvas.style.width = canvas.width + 'px';
    canvas.style.height = canvas.height + 'px';

    canvas.width = canvas.width * ratio;
    canvas.height = canvas.height * ratio;

    ctx.scale(ratio, ratio);

    ctx.textAlign = this.textAlign;
    ctx.textBaseline = this.textBaseline;
    ctx.font = `${this.fontSize} ${this.fontFamily}`;
    ctx.fillStyle = this.fillStyle;
    ctx.rotate(this.rotate / 180 * Math.PI);
    
    const x = parseFloat(this.width) / 2;
    const y = parseFloat(this.height) / 2;
    const maxWidth = parseFloat(this.width);

    ctx.fillText(this.content, x, y, maxWidth);

    if (this.strokeStyle) {
      ctx.strokeStyle = this.strokeStyle;
      ctx.strokeText(this.content, x, y, maxWidth);
    }
    
    this.base64Url = canvas.toDataURL();
  }

  getStyle() {
    return `
      position: ${this.position};
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: ${this.zIndex};
      width: ${this.scrollWidth}px;
      height: ${this.scrollHeight}px;
      background-repeat: repeat;
      pointer-events: none;
      background-size: ${this.width}px ${this.height}px;
      background-image:url('${this.base64Url}');
    `;
  }

  setContainerSize() {
    const { scrollWidth, scrollHeight } = this.container;

    this.scrollWidth = scrollWidth;
    this.scrollHeight = scrollHeight;
  }

  handleObserver() {
    const MutationObserver = window.MutationObserver || window.WebkitMutationObserver;

    if (MutationObserver) {
      const mutationCallback = (mutationsList) => {
        for (let mutation of mutationsList) {
          let type = mutation.type;
          switch (type) {
            case "childList":
              this.reset();
              break;
            case "attributes":
              this.reset();
              break;
            case "subtree":
              this.reset();
              break;
            default:
              break;
          }
        }
      };

      this.mutationObserver = new MutationObserver(mutationCallback);

      const config = {
        attributes: true,
        childList: true,
        subtree: true
      };

      this.mutationObserver.observe(this.container, config);
    }
  }

  reset() {
    this.mutationObserver.disconnect();
    this.mutationObserver = null;
    
    if (this.wm instanceof Element) {
      this.container.removeChild(this.wm);
      this.wm = null;
    }
    
    this.init();
  }
}