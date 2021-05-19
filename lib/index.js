"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

var XSLX = require("xlsx");
var fileSaver = require("file-saver");

function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e : { default: e };
}

var XSLX__default = /*#__PURE__*/ _interopDefaultLegacy(XSLX);

/**
 * 把json内容转换为excel (xlsx) 进行下载
 * @param { string } filename sheet的文件名
 * @param { Data[] } datas 元数据
 */
function export2Excel(filename, datas) {
  const wb = XSLX__default["default"].utils.book_new();
  datas.forEach(({ columns, data, sheet_name }) => {
    const { header, body } = getHeaderAndBody(columns, data);
    const ws = XSLX__default["default"].utils.json_to_sheet(body, { header });
    sheet_name
      ? XSLX__default["default"].utils.book_append_sheet(wb, ws, sheet_name)
      : XSLX__default["default"].utils.book_append_sheet(wb, ws);
  });
  const file = XSLX__default["default"].write(wb, {
    bookType: "xlsx",
    type: "binary",
    bookSST: false,
  });
  const blob = new Blob([s2ab(file)], { type: "application/octet-stream" });
  fileSaver.saveAs(blob, filename);
  /**
   * 把字符串转为 ArrayBuffer
   * @param s { string }
   * @return {ArrayBuffer}
   */
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; i += 1) {
      // eslint-disable-next-line no-bitwise
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  }
}
/**
 * 转换columns和data为header和body的数据结构
 * @param columns { ExcelColumn[] } columns,列配置
 * @param data data,元数据
 */
function getHeaderAndBody(columns, data) {
  const body = getBody();
  const header = getHeader();
  return { body, header };
  function getHeader() {
    return columns.map((item) => item.title);
  }
  function getBody() {
    return data.map((item) => {
      return columns
        .map((y) => {
          const key = y.title;
          const value = item[y.key];
          return { [key]: value };
        })
        .reduce((acc, cur) => {
          return Object.assign(Object.assign({}, acc), cur);
        }, {});
    });
  }
}

exports.export2Excel = export2Excel;
