export default class TableProbabilities {

  constructor(){
    this.headers = [];
    this.data = [];
    this.columnWidths = [];
    this.horizontalLine = '';
    this.table = '';

  }
  setHeaders(headers){
    this.headers = headers;
  }
  setData(data){
    this.data = data;
  }

  getData(){
    return this.data;
  }

  setColumnWidths(){
    this.columnWidths = this.headers.map((header, index) => {
      const column = this.data.map(row => row[index]);
      const columnWidth = Math.max(header.length, ...column.map(value => value?.toString().length));
      return columnWidth;
    });
  }
  setHorizontalLine(){
    this.horizontalLine = this.columnWidths.map(width => '-'.repeat(width + 2)).join('+');
  }
  setFormatRow(row){
    return `| ${row.map((cell, i) => cell.toString().padEnd(this.columnWidths[i])).join(" | ")} |`;
  }
  buildTable(){
    this.table += this.horizontalLine + '\n';
    this.table += this.setFormatRow(this.headers) + '\n';
    this.table += this.horizontalLine + '\n';
    this.data.forEach(row => {
      this.table += this.setFormatRow(row) + '\n';
    });
    this.table += this.horizontalLine + '\n';

  }
  showTable(){
    console.log(this.table);
  }

}