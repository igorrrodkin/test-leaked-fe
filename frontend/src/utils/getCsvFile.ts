const download = (data: any, fileName: string) => {
  // Creating a Blob for having a csv file format
  // and passing the data with type
  const blob = new Blob([data], { type: 'text/csv' });

  // Creating an object for downloading url
  const url = window.URL.createObjectURL(blob);

  // Creating an anchor(a) tag of HTML
  const a = document.createElement('a');

  // Passing the blob downloading url
  a.setAttribute('href', url);

  // Setting the anchor tag attribute for downloading
  // and passing the download file name
  a.setAttribute('download', `${fileName}.csv`);

  // Performing a download with click
  a.click();
};

const csvMaker = (data: Object[]) => {
  // Empty array for storing the values
  const csvRows = [];

  // Headers is basically a keys of an
  // object which is id, name, and
  // profession
  const headers = Object.keys(data[0]);

  // As for making csv format, headers
  // must be separated by comma and
  // pushing it into array
  csvRows.push(headers.join(','));

  // Pushing Object values into array
  // with comma separation
  data.forEach((item) => {
    const rowValues = Object.values(item).join(',');
    csvRows.push(rowValues);
  });

  // Returning the array joining with new line
  return csvRows.join('\n');
};

const getCsvFile = async (data: Object[], fileName: string) => {
  const csvData = csvMaker(data);
  download(csvData, fileName);
};

export default getCsvFile;
