const data_table = document.querySelector('.data-table');
const btn_export_to_csv = document.getElementById('btnExportToCsv');

class TableCSVExporter {
  constructor(table, include_headers = true) {
    this.table = table;
    this.rows = Array.from(table.querySelectorAll('tr'));

    if (!include_headers && this.rows[0].querySelectorAll('th').length) {
      this.rows.shift();
    }
    console.log(this._find_longest_row_length());
  }

  convert_to_csv() {
    const lines = [];
    const num_cols = this._find_longest_row_length();

    for (const row of this.rows) {
      let line = '';

      for (let i = 0; i < num_cols; i++) {
        if (row.children[i] !== undefined) {
          line += TableCSVExporter.parse_cell(row.children[i]);
        }

        line += i !== num_cols - 1 ? ',' : '';
      }
      lines.push(line);
    }
    return lines.join('\n');
  }

  _find_longest_row_length() {
    return this.rows.reduce(
      (l, row) => (row.childElementCount > l ? row.childElementCount : l),
      0
    );
  }

  static parse_cell(table_cell) {
    let parsed_value = table_cell.textContent;

    //Replace all double quotes with two double quotes
    parsed_value = parsed_value.replace(/"/g, `""`);

    // if value contains comman new-line or double-quote, enclose in double quotes
    parsed_value = /[",\n]/.test(parsed_value)
      ? `"${parsed_value}"`
      : parsed_value;

    return parsed_value;
  }
}

console.log(new TableCSVExporter(data_table, false).convert_to_csv());

btn_export_to_csv.addEventListener('click', () => {
  const exporter = new TableCSVExporter(data_table);
  const csv_output = exporter.convert_to_csv();
  const csv_blod = new Blob([csv_output], { type: 'text/csv' });
  const blob_url = URL.createObjectURL(csv_blod);
  const anchor_element = document.createElement('a');
  anchor_element.href = blob_url;
  anchor_element.download = 'table-export.csv';
  anchor_element.click();

  setTimeout(() => URL.revokeObjectURL(blob_url), 500);

  console.log(blob_url);
});
