const XLSX = require("xlsx");

function readExcel(filePath, sheetName) {

    const workbook = XLSX.readFile(filePath);

    const worksheet = workbook.Sheets[sheetName];

    const data = XLSX.utils.sheet_to_json(worksheet);

    return data;
}
module.exports = { readExcel };
