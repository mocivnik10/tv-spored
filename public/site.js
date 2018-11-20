navigator.serviceWorker && navigator.serviceWorker.register('serviceworker.js').then(function(registration) {
  console.log('Excellent, registered with scope: ', registration.scope);
});