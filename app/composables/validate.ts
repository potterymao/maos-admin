/** 是否為陣列 */
export function isArray<T>(arg: T) {
  return Array.isArray ? Array.isArray(arg) : Object.prototype.toString.call(arg) === "[object Array]";
}

/** 是否為字數字 */
export const isNumber = (val: unknown): val is number => {
  return is(val, "Number");
};

/** 是否為字符串 */
export function isString(str: unknown) {
  return typeof str === "string" || str instanceof String;
}

/** 是否為外部連結 */
export function isExternal(path: string) {
  const reg = /^(https?:|mailto:|tel:)/;
  return reg.test(path);
}

// 驗證陣列中是否有值
export const isValidKey = (key: string | number | symbol, object: object): key is keyof typeof object => {
  return key in object;
};

export const is = (val: unknown, type: string) => {
  return toString.call(val) === `[object ${type}]`;
};

export const isNumberOnly = (event: any) => {
  // el.addEventListener("input", (e) => {
  //   // 移除非數字字符
  //   e.target.value = e.target.value.replace(/[^\d]/g, "");
  // });

  // // 阻止貼非數字内容
  // el.addEventListener("paste", (e) => {
  //   const pasteData = e.clipboardData.getData("text/plain");
  //   if (!/^\d+$/.test(pasteData)) {
  //     e.preventDefault();
  //   }
  // });

  // // 阻止輸入非數字
  // el.addEventListener("keydown", (e) => {
  const allowedKeys = [
    8, // Backspace
    9, // Tab
    13, // Enter
    37, // Arrow Left
    38, // Arrow Up
    39, // Arrow Right
    40, // Arrow Down
    46, // Delete
  ];

  if (allowedKeys.includes(event.keyCode) || (event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)) {
    return true;
  }
  event.preventDefault();
  return false;

  // 允許數字鍵（0-9）和小鍵盤數字（0-9）
  // const isNumber = (event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105);

  // if (!isNumber && !allowedKeys.includes(event.keyCode)) {
  //   event.preventDefault();
  // }
  // });
};
