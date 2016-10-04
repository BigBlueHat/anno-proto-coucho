function(doc, req) {


  // JSON-LD
  var rv = doc;
  rv['@context'] = "http://www.w3.org/ns/anno.jsonld";
  return {
    headers: {
      'Allow': 'GET, HEAD, OPTIONS, PUT, DELETE',
      'Content-Type': 'application/ld+json;profile=
    },
    body: JSON.stringify(rv, null, 2)
  };
}
