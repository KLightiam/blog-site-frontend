// "Photo: Adam Jones on Flickr · CC BY 2.0", with links where the credit has them.
// Some licences (CC BY) require this credit wherever the photo appears in full.
export default function PhotoCredit({ file, className = '' }) {
  if (!file?.credit && !file?.license) return null;
  const link = 'underline decoration-line underline-offset-2 hover:text-ink hover:decoration-current';
  return (
    <p className={`text-sm text-muted ${className}`}>
      {file.credit && (
        <>
          Photo:{' '}
          {file.creditUrl ? (
            <a href={file.creditUrl} target="_blank" rel="noopener noreferrer" className={link}>
              {file.credit}
            </a>
          ) : (
            file.credit
          )}
        </>
      )}
      {file.credit && file.license && <span aria-hidden="true"> · </span>}
      {file.license &&
        (file.licenseUrl ? (
          <a href={file.licenseUrl} target="_blank" rel="noopener noreferrer license" className={link}>
            {file.license}
          </a>
        ) : (
          file.license
        ))}
    </p>
  );
}
