export const downloadCsv = (csv: string, name?: string) => {
  const blob = new Blob([csv]);
  const blobUrl = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.href = blobUrl;
  anchor.download = name || 'export.csv';

  document.body.append(anchor);
  anchor.click();
  anchor.remove();
};
