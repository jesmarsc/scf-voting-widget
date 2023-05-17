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

export const downloadTxt = (csv: string, name?: string) => {
  const blob = new Blob([csv]);
  const blobUrl = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.href = blobUrl;
  anchor.download = name || 'proof.txt';

  document.body.append(anchor);
  anchor.click();
  anchor.remove();
};

export const usdStringToNumber = (amount: string) =>
  parseFloat(amount.replace(/,/g, ''));

export const numberToUsdString = (amount: number) => {
  return Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};
