// Fetch interceptor to capture auth token
(function() {
  console.log('[FetchInterceptor] Installing...');
  
  let authToken = null;
  const originalFetch = window.fetch;
  
  window.fetch = function(...args) {
    const [url, options] = args;
    
    // トークンを取得
    if (options && options.headers) {
      const headers = options.headers;
      if (headers.authorization || headers.Authorization) {
        authToken = headers.authorization || headers.Authorization;
        console.log('[FetchInterceptor] ✅ Auth token captured');
      }
    }
    
    return originalFetch.apply(this, args);
  };
  
  // トークン取得リクエストをリッスン
  window.addEventListener('message', function(event) {
    if (event.source !== window) return;
    if (event.data.type !== 'GET_AUTH_TOKEN') return;
    
    console.log('[FetchInterceptor] Token requested, sending:', authToken ? 'YES' : 'NO');
    window.postMessage({
      type: 'AUTH_TOKEN',
      token: authToken
    }, '*');
  });
  
  console.log('[FetchInterceptor] ✅ Installed');
})();
