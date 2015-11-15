function insertCSS( code ) {
  var style = document.createElement('style');
  style.type = 'text/css';

  if (style.styleSheet) {
    // IE
    style.styleSheet.cssText = code;
  } else {
    // Other browsers
    style.innerHTML = code;
  }

  document.getElementsByTagName("head")[0].appendChild( style );
}