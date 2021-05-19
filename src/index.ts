import XSLX from "xlsx";
import { saveAs } from "file-saver";

type ExcelColumn = { title: string; key: string };

type Data = { columns: ExcelColumn[]; data: any; sheet_name?: string };

/**
 * 把json内容转换为excel (xlsx) 进行下载
 * @param { string } filename sheet的文件名
 * @param { Data[] } datas 元数据
 */
export function export2Excel(filename: string, datas: Data[]) {
  const wb = XSLX.utils.book_new();
  datas.forEach(({ columns, data, sheet_name }) => {
    const { header, body } = getHeaderAndBody(columns, data);
    const ws = XSLX.utils.json_to_sheet(body, { header });
    sheet_name
      ? XSLX.utils.book_append_sheet(wb, ws, sheet_name)
      : XSLX.utils.book_append_sheet(wb, ws);
  });

  const file = XSLX.write(wb, {
    bookType: "xlsx",
    type: "binary",
    bookSST: false,
  });
  const blob = new Blob([s2ab(file)], { type: "application/octet-stream" });
  saveAs(blob, filename);

  /**
   * 把字符串转为 ArrayBuffer
   * @param s { string }
   * @return {ArrayBuffer}
   */
  function s2ab(s: string): ArrayBuffer {
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
 * @return { header:any, body:any }
 */
function getHeaderAndBody(
  columns: ExcelColumn[],
  data: any[]
): { body: any; header: any } {
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
          return { ...acc, ...cur };
        }, {});
    });
  }
}
