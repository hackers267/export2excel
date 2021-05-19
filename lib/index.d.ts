declare type ExcelColumn = {
    title: string;
    key: string;
};
declare type Data = {
    columns: ExcelColumn[];
    data: any;
    sheet_name?: string;
};
/**
 * 把json内容转换为excel (xlsx) 进行下载
 * @param { string } filename sheet的文件名
 * @param { Data[] } datas 元数据
 */
export declare function export2Excel(filename: string, datas: Data[]): void;
export {};
