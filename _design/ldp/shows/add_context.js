function(doc, req) {
  var rv = doc;
  rv['@context'] = this.contexts.web_annotation;
  return {
    json: rv
  };
}
