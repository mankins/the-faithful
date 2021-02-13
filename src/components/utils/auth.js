const baseProducts = [
  'video:t2jYTAKc71QbCfyTlau3GJfErwcJLmnLQS8xHWclWvE', // trailer 2021-02-11
  'video:*:trailer',
  // 'video:*:preview'
];

const handleLoginAction = () => {
  if (window.location.href.indexOf('redir') !== -1) {
    let qp = new URL(document.location).searchParams;
    let redir = qp.get('redir');
    if (redir && redir.indexOf('/') === 0) {
      window.location.href = redir;
      return;
    }
  }
  window.location.href = '/?logged=1'; // TODO(mankins) look for next cookie, redir
};

export { handleLoginAction, baseProducts };
