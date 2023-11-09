export default (data: Blob) => {
  const iframe = document.createElement('iframe');
  iframe.src = URL.createObjectURL(data);
  iframe.style.display = 'none';
  document.body.appendChild(iframe);

  const removeIframe = () => {
    document.body.removeChild(iframe);
  };

  window.addEventListener('afterprint', removeIframe);

  iframe.addEventListener('load', () => {
    iframe.contentWindow!.print();
  });

  window.removeEventListener('afterprint', removeIframe);
};
