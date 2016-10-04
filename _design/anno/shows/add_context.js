function(doc, req) {


  // JSON-LD
  var rv = doc;
  rv['@context'] = "http://www.w3.org/ns/anno.jsonld";
  return {
    headers: {
      'Allow': 'GET, HEAD, OPTIONS, PUT, DELETE',
      'Content-Type': 'application/ld+json;profile="http://www.w3.org/ns/anno.jsonld"',
      'Link': '<http://www.w3.org/ns/ldp#Resource>; rel="type"'
    },
    body: JSON.stringify(rv, null, 2)
  };
}
